"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { PadButton } from "@/components/pad-button"

const PAD_IDS = ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2"] as const

const KEY_TO_PAD: Record<string, string> = {
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
  audioBuffer: AudioBuffer
}

export default function BeatPage() {
  const [pads, setPads] = useState<Record<string, PadSound | null>>(() =>
    Object.fromEntries(PAD_IDS.map((id) => [id, null]))
  )
  const audioCtxRef = useRef<AudioContext | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const activePadRef = useRef<string | null>(null)

  function getAudioContext() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }

  const playSound = useCallback((audioBuffer: AudioBuffer) => {
    const ctx = getAudioContext()
    const source = ctx.createBufferSource()
    source.buffer = audioBuffer
    source.connect(ctx.destination)
    source.start(0)
  }, [])

  const handlePadTap = useCallback(
    (id: string) => {
      const pad = pads[id]
      if (pad) {
        playSound(pad.audioBuffer)
      } else {
        activePadRef.current = id
        fileInputRef.current?.click()
      }
    },
    [pads, playSound]
  )

  const handleReplace = useCallback((id: string) => {
    activePadRef.current = id
    fileInputRef.current?.click()
  }, [])

  const handleClear = useCallback((id: string) => {
    setPads((prev) => ({ ...prev, [id]: null }))
  }, [])

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      const padId = activePadRef.current
      if (!file || !padId) return

      const ctx = getAudioContext()
      const arrayBuffer = await file.arrayBuffer()
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer)

      const name = file.name.replace(/\.[^.]+$/, "")
      setPads((prev) => ({ ...prev, [padId]: { name, audioBuffer } }))

      activePadRef.current = null
      e.target.value = ""
    },
    []
  )

  const [keyActivePads, setKeyActivePads] = useState<Set<string>>(new Set())

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.repeat) return
      const padId = KEY_TO_PAD[e.key.toLowerCase()]
      if (!padId) return
      const pad = pads[padId]
      if (pad) {
        playSound(pad.audioBuffer)
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
