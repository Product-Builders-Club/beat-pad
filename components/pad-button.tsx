"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

const WAVEFORM_COLORS = ["#C45C4A", "#C68B3E"] as const

function getWaveformBars(id: string) {
  const seed = id.charCodeAt(0) + id.charCodeAt(1)
  const color = WAVEFORM_COLORS[seed % 2]
  const heights = Array.from({ length: 8 }, (_, i) => {
    const h = ((seed * (i + 3) * 7 + i * 13) % 18) + 4
    return h
  })
  return { color, heights }
}

type PadButtonProps = {
  id: string
  soundName: string | null
  isKeyActive?: boolean
  onTap: () => void
  onReplace: () => void
  onClear: () => void
}

export function PadButton({ id, soundName, isKeyActive, onTap, onReplace, onClear }: PadButtonProps) {
  const [tapping, setTapping] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const loaded = soundName !== null

  const handleTap = useCallback(() => {
    if (menuOpen) return
    onTap()
    if (loaded) {
      setTapping(true)
      setTimeout(() => setTapping(false), 150)
    }
  }, [onTap, loaded, menuOpen])

  const openMenu = useCallback(() => {
    if (loaded) setMenuOpen(true)
  }, [loaded])

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (!loaded) return
      e.preventDefault()
      openMenu()
    },
    [loaded, openMenu]
  )

  const handlePointerDown = useCallback(() => {
    if (!loaded) return
    longPressTimer.current = setTimeout(openMenu, 500)
  }, [loaded, openMenu])

  const handlePointerUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("pointerdown", handleClickOutside)
    return () => document.removeEventListener("pointerdown", handleClickOutside)
  }, [menuOpen])

  const waveform = getWaveformBars(id)

  return (
    <div ref={containerRef} className="relative flex min-h-0 flex-1">
      <button
        type="button"
        onClick={handleTap}
        onContextMenu={handleContextMenu}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-1.5",
          "select-none outline-none",
        )}
      >
        {/* LED + Label */}
        <div className="flex shrink-0 items-center gap-1 px-1">
          <div
            className="size-[5px] rounded-full"
            style={{
              backgroundColor: loaded ? "#6BBF59" : "#5C4A3A",
              boxShadow: loaded ? "0 0 4px rgba(107,191,89,0.5)" : "none",
            }}
          />
          <span
            className="font-[family-name:var(--font-ibm-mono)] text-[8px] tracking-[1px]"
            style={{ color: loaded ? "#A08A70" : "#5C4A3A" }}
          >
            {id}
          </span>
        </div>

        {/* Pad surface */}
        <div
          className={cn(
            "flex min-h-0 w-full flex-1 flex-col items-center justify-center rounded-xl",
            "transition-transform duration-75",
            (tapping || isKeyActive) && "animate-pad-tap",
          )}
          style={
            loaded
              ? {
                  background: "linear-gradient(180deg, #E8DBC8, #D6C4AC)",
                  boxShadow: menuOpen
                    ? "inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -3px 0 #B8A48C, 0 2px 4px rgba(0,0,0,0.3), 0 0 0 2px #C68B3E"
                    : "inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -3px 0 #B8A48C, 0 2px 4px rgba(0,0,0,0.3)",
                }
              : {
                  background: "linear-gradient(180deg, #4A382C, #3D2B1F)",
                  boxShadow:
                    "inset 0 2px 0 rgba(255,255,255,0.04), inset 0 -2px 0 rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.2)",
                  border: "1px dashed #5C4A3A",
                }
          }
        >
          {loaded ? (
            <>
              <span
                className="font-[family-name:var(--font-ibm-mono)] text-[11px] font-semibold tracking-[0.5px]"
                style={{ color: "#3D2B1F" }}
              >
                {soundName.length > 8
                  ? soundName.slice(0, 8).toUpperCase()
                  : soundName.toUpperCase()}
              </span>
              <div className="mt-1.5 flex items-end gap-[2px]">
                {waveform.heights.map((h, i) => (
                  <div
                    key={i}
                    className="w-[3px] rounded-[1px]"
                    style={{
                      height: `${h}px`,
                      backgroundColor: waveform.color,
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 6v12M6 12h12"
                  stroke="#6B5848"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span
                className="mt-1 font-[family-name:var(--font-ibm-mono)] text-[9px] tracking-[0.5px]"
                style={{ color: "#6B5848" }}
              >
                TAP TO ADD
              </span>
            </>
          )}
        </div>
      </button>

      {/* Context menu */}
      {menuOpen && (
        <div
          className="absolute left-0 top-full z-10 mt-1 w-[180px] overflow-hidden rounded-xl"
          style={{
            backgroundColor: "#2A1E15",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          <button
            type="button"
            className="flex w-full items-center gap-2.5 px-3.5 py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            onClick={() => {
              setMenuOpen(false)
              onReplace()
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3.5H9.5C10.0523 3.5 10.5 3.94772 10.5 4.5V9M5 3.5L7 1.5M5 3.5L7 5.5" stroke="#C68B3E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="3" y="5.5" width="7.5" height="7" rx="1" stroke="#C68B3E" strokeWidth="1.2"/>
            </svg>
            <span
              className="font-[family-name:var(--font-ibm-mono)] text-xs tracking-[0.3px]"
              style={{ color: "#E8DBC8" }}
            >
              Replace sound
            </span>
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2.5 px-3.5 py-3"
            onClick={() => {
              setMenuOpen(false)
              onClear()
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5h10M5.5 6v4M8.5 6v4M3 3.5l.5 8.5a1 1 0 001 1h5a1 1 0 001-1l.5-8.5M5 3.5V2a1 1 0 011-1h2a1 1 0 011 1v1.5" stroke="#C45C4A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span
              className="font-[family-name:var(--font-ibm-mono)] text-xs tracking-[0.3px]"
              style={{ color: "#C45C4A" }}
            >
              Clear sound
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
