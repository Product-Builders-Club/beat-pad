"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { PadButton } from "@/components/pad-button"

const PAD_IDS = ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2"] as const
type PadId = (typeof PAD_IDS)[number]
const LEGACY_PAD_STORAGE_KEY = "beat-pad:pads"
const PAD_DB_NAME = "beat-pad-db"
const PAD_STORE_NAME = "pad-sounds"

function createPadRecord<T>(getValue: (padId: PadId) => T): Record<PadId, T> {
  return Object.fromEntries(PAD_IDS.map((id) => [id, getValue(id)])) as Record<
    PadId,
    T
  >
}

const KEY_TO_PAD: Record<string, PadId> = {
  "5": "A1",
  "6": "A2",
  t: "B1",
  y: "B2",
  g: "C1",
  h: "C2",
  b: "D1",
  n: "D2",
}

type PadSound = {
  name: string
  audioFile: Blob
  audioBuffer: AudioBuffer
}

type StoredPadSound = {
  id: PadId
  name: string
  audioFile: Blob
}

type LegacyStoredPadSound = {
  name: string
  sourceDataUrl: string
}

function openPadDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(PAD_DB_NAME, 1)

    request.onupgradeneeded = () => {
      const db = request.result

      if (!db.objectStoreNames.contains(PAD_STORE_NAME)) {
        db.createObjectStore(PAD_STORE_NAME, { keyPath: "id" })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => {
      reject(request.error ?? new Error("Failed to open pad database."))
    }
  })
}

function loadPadRecords() {
  return new Promise<Record<PadId, StoredPadSound | null>>((resolve, reject) => {
    openPadDatabase()
      .then((db) => {
        const transaction = db.transaction(PAD_STORE_NAME, "readonly")
        const store = transaction.objectStore(PAD_STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => {
          const storedPads = createPadRecord(() => null as StoredPadSound | null)

          for (const record of request.result as StoredPadSound[]) {
            storedPads[record.id] = record
          }

          resolve(storedPads)
          db.close()
        }

        request.onerror = () => {
          reject(request.error ?? new Error("Failed to load saved pads."))
          db.close()
        }
      })
      .catch(reject)
  })
}

function savePadRecords(pads: Record<PadId, PadSound | null>) {
  return new Promise<void>((resolve, reject) => {
    openPadDatabase()
      .then((db) => {
        const transaction = db.transaction(PAD_STORE_NAME, "readwrite")
        const store = transaction.objectStore(PAD_STORE_NAME)

        for (const padId of PAD_IDS) {
          const pad = pads[padId]

          if (pad) {
            store.put({
              id: padId,
              name: pad.name,
              audioFile: pad.audioFile,
            } satisfies StoredPadSound)
          } else {
            store.delete(padId)
          }
        }

        transaction.oncomplete = () => {
          db.close()
          resolve()
        }

        transaction.onerror = () => {
          db.close()
          reject(
            transaction.error ?? new Error("Failed to save pads to IndexedDB.")
          )
        }
      })
      .catch(reject)
  })
}

async function loadLegacyPadRecords() {
  const storedPadsRaw = window.localStorage.getItem(LEGACY_PAD_STORAGE_KEY)
  if (!storedPadsRaw) return null

  try {
    const storedPads = JSON.parse(storedPadsRaw) as Record<
      PadId,
      LegacyStoredPadSound | null
    >

    const migratedPads = await Promise.all(
      PAD_IDS.map(async (padId) => {
        const storedPad = storedPads[padId]
        if (!storedPad) return [padId, null] as const

        const response = await fetch(storedPad.sourceDataUrl)
        const audioFile = await response.blob()

        return [
          padId,
          {
            id: padId,
            name: storedPad.name,
            audioFile,
          },
        ] as const
      })
    )

    return Object.fromEntries(migratedPads) as Record<PadId, StoredPadSound | null>
  } catch (error) {
    console.error("Failed to migrate pads from localStorage.", error)
    return null
  }
}

export default function BeatPage() {
  const [pads, setPads] = useState<Record<PadId, PadSound | null>>(() =>
    createPadRecord(() => null)
  )
  const [storageReady, setStorageReady] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const activePadRef = useRef<PadId | null>(null)
  const activeSourcesRef = useRef<Record<PadId, AudioBufferSourceNode | null>>(
    createPadRecord(() => null)
  )

  const ensureAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    return audioCtxRef.current
  }, [])

  const getAudioContext = useCallback(() => {
    const ctx = ensureAudioContext()
    if (ctx.state === "suspended") {
      void ctx.resume()
    }
    return ctx
  }, [ensureAudioContext])

  const stopPadPlayback = useCallback((padId: PadId) => {
    const source = activeSourcesRef.current[padId]
    if (!source) return

    activeSourcesRef.current[padId] = null

    try {
      source.stop()
    } catch {
      // Ignore invalid-state errors when a source has already ended.
    }
  }, [])

  const playSound = useCallback(
    (padId: PadId, audioBuffer: AudioBuffer) => {
      const ctx = getAudioContext()
      stopPadPlayback(padId)

      const source = ctx.createBufferSource()
      source.buffer = audioBuffer
      source.connect(ctx.destination)
      source.onended = () => {
        if (activeSourcesRef.current[padId] === source) {
          activeSourcesRef.current[padId] = null
        }
        source.disconnect()
      }

      activeSourcesRef.current[padId] = source
      source.start(0)
    },
    [getAudioContext, stopPadPlayback]
  )

  const handlePadTap = useCallback(
    (id: PadId) => {
      const pad = pads[id]
      if (pad) {
        playSound(id, pad.audioBuffer)
      } else {
        activePadRef.current = id
        fileInputRef.current?.click()
      }
    },
    [pads, playSound]
  )

  const handleReplace = useCallback((id: PadId) => {
    stopPadPlayback(id)
    activePadRef.current = id
    fileInputRef.current?.click()
  }, [stopPadPlayback])

  const handleClear = useCallback((id: PadId) => {
    stopPadPlayback(id)
    setPads((prev) => ({ ...prev, [id]: null }))
  }, [stopPadPlayback])

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      const padId = activePadRef.current
      if (!file || !padId) return

      const ctx = getAudioContext()
      const arrayBuffer = await file.arrayBuffer()
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer)

      const name = file.name.replace(/\.[^.]+$/, "")
      stopPadPlayback(padId)
      setPads((prev) => ({
        ...prev,
        [padId]: { name, audioFile: file, audioBuffer },
      }))

      activePadRef.current = null
      e.target.value = ""
    },
    [getAudioContext, stopPadPlayback]
  )

  const [keyActivePads, setKeyActivePads] = useState<Set<PadId>>(new Set())

  useEffect(() => {
    let cancelled = false

    async function loadStoredPads() {
      try {
        let storedPads = await loadPadRecords()

        if (!PAD_IDS.some((padId) => storedPads[padId])) {
          const legacyPads = await loadLegacyPadRecords()

          if (legacyPads) {
            storedPads = legacyPads

            const migratedPads = await Promise.all(
              PAD_IDS.map(async (padId) => {
                const storedPad = legacyPads[padId]
                if (!storedPad) return [padId, null] as const

                const arrayBuffer = await storedPad.audioFile.arrayBuffer()
                const audioBuffer = await ensureAudioContext().decodeAudioData(
                  arrayBuffer
                )

                return [
                  padId,
                  {
                    name: storedPad.name,
                    audioFile: storedPad.audioFile,
                    audioBuffer,
                  },
                ] as const
              })
            )

            await savePadRecords(
              Object.fromEntries(migratedPads) as Record<PadId, PadSound | null>
            )
          }
        }

        const ctx = ensureAudioContext()
        const nextPads = await Promise.all(
          PAD_IDS.map(async (padId) => {
            const storedPad = storedPads[padId]
            if (!storedPad) return [padId, null] as const

            try {
              const arrayBuffer = await storedPad.audioFile.arrayBuffer()
              const audioBuffer = await ctx.decodeAudioData(arrayBuffer)

              return [
                padId,
                {
                  name: storedPad.name,
                  audioFile: storedPad.audioFile,
                  audioBuffer,
                },
              ] as const
            } catch {
              return [padId, null] as const
            }
          })
        )

        if (!cancelled) {
          setPads(Object.fromEntries(nextPads) as Record<PadId, PadSound | null>)
        }
      } catch (error) {
        console.error("Failed to restore pads from IndexedDB.", error)
      } finally {
        window.localStorage.removeItem(LEGACY_PAD_STORAGE_KEY)

        if (!cancelled) {
          setStorageReady(true)
        }
      }
    }

    void loadStoredPads()

    return () => {
      cancelled = true
    }
  }, [ensureAudioContext])

  useEffect(() => {
    if (!storageReady) return

    void savePadRecords(pads).catch((error) => {
      console.error("Failed to persist pads to IndexedDB.", error)
    })
  }, [pads, storageReady])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.repeat) return
      const padId = KEY_TO_PAD[e.key.toLowerCase()]
      if (!padId) return
      const pad = pads[padId]
      if (pad) {
        playSound(padId, pad.audioBuffer)
        setKeyActivePads((prev) => new Set(prev).add(padId))
        setTimeout(() => {
          setKeyActivePads((prev) => {
            const next = new Set(prev)
            next.delete(padId)
            return next
          })
        }, 150)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [pads, playSound])

  useEffect(() => {
    const activeSources = activeSourcesRef.current

    return () => {
      for (const padId of PAD_IDS) {
        const source = activeSources[padId]
        if (!source) continue

        activeSources[padId] = null

        try {
          source.stop()
        } catch {
          // Ignore invalid-state errors during teardown.
        }
      }
    }
  }, [])

  const loadedCount = Object.values(pads).filter(Boolean).length

  return (
    <div
      className="flex h-svh items-center justify-center"
      style={{ backgroundColor: "#F0E4D4" }}
    >
      <div className="flex h-full w-full max-w-[390px] flex-col">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-7 pt-10">
          <div className="flex flex-col gap-0.5">
            <h1
              className="font-[family-name:var(--font-heading)] text-2xl leading-none"
              style={{ color: "#3D2B1F" }}
            >
              BeatPad
            </h1>
            <span
              className="font-[family-name:var(--font-ibm-mono)] text-[9px] tracking-[2px]"
              style={{ color: "#A08A70" }}
            >
              DRUM MACHINE
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="size-2 rounded-full"
              style={{
                backgroundColor: loadedCount > 0 ? "#C45C4A" : "#5C4A3A",
                boxShadow:
                  loadedCount > 0 ? "0 0 6px rgba(196,92,74,0.5)" : "none",
              }}
            />
            <span
              className="font-[family-name:var(--font-ibm-mono)] text-[9px] tracking-[1px]"
              style={{ color: "#A08A70" }}
            >
              {loadedCount > 0 ? "ACTIVE" : "READY"}
            </span>
          </div>
        </div>

        {/* Bezel + Pad Grid */}
        <div className="min-h-0 flex-1 px-5 pt-5 pb-6">
          <div
            className="flex h-full flex-col gap-3 rounded-[20px] p-4"
            style={{
              backgroundColor: "#3D2B1F",
              boxShadow:
                "inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="flex min-h-0 flex-1 gap-3">
                {[0, 1].map((col) => {
                  const id = PAD_IDS[row * 2 + col]
                  return (
                    <PadButton
                      key={id}
                      id={id}
                      soundName={pads[id]?.name ?? null}
                      isKeyActive={keyActivePads.has(id)}
                      onTap={() => handlePadTap(id)}
                      onReplace={() => handleReplace(id)}
                      onClear={() => handleClear(id)}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}
