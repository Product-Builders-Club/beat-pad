import Link from "next/link"

function Waveform({ bars }: { bars: { h: number; color: string }[] }) {
  return (
    <div className="flex items-end gap-[3px]">
      {bars.map((bar, i) => (
        <div
          key={i}
          className="w-1 rounded-[1px]"
          style={{ height: bar.h, backgroundColor: bar.color }}
        />
      ))}
    </div>
  )
}

const red = "#C0392B"
const gold = "#D4A017"
const green = "#2E7D32"

export default function Page() {
  return (
    <div
      className="flex min-h-svh flex-col"
      style={{ backgroundColor: "#EDE6DA" }}
    >
      {/* Nav */}
      <nav className="flex w-full items-center justify-between px-10 py-7 lg:px-20">
        <div className="flex items-baseline gap-3">
          <span
            className="font-[family-name:var(--font-heading)] text-[28px] leading-none"
            style={{ color: "#2C1E10" }}
          >
            BeatPad
          </span>
          <span
            className="font-[family-name:var(--font-ibm-mono)] text-[10px] uppercase tracking-[2px]"
            style={{ color: "#8B7355" }}
          >
            Drum Machine
          </span>
        </div>
        <div className="flex items-center gap-10">
          <a
            href="#features"
            className="hidden font-[family-name:var(--font-ibm-mono)] text-xs uppercase tracking-[1.5px] sm:block"
            style={{ color: "#5C4A35" }}
          >
            Features
          </a>
          <a
            href="#sounds"
            className="hidden font-[family-name:var(--font-ibm-mono)] text-xs uppercase tracking-[1.5px] sm:block"
            style={{ color: "#5C4A35" }}
          >
            Sounds
          </a>
          <Link
            href="/beat"
            className="rounded-lg px-6 py-2.5 font-[family-name:var(--font-ibm-mono)] text-xs uppercase tracking-[1.5px] transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#3D2B1A", color: "#EDE6DA" }}
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center gap-6 px-10 pt-16 pb-4 lg:px-20 lg:pt-24">
        <h1
          className="max-w-[900px] text-center font-[family-name:var(--font-heading)] text-5xl leading-[1] tracking-tight sm:text-7xl lg:text-[88px]"
          style={{ color: "#2C1E10" }}
        >
          Music tools that move you
        </h1>
        <p
          className="max-w-[520px] text-center font-[family-name:var(--font-ibm-mono)] text-sm leading-[1.8] sm:text-[15px]"
          style={{ color: "#8B7355" }}
        >
          A tactile drum machine built for feel, not features. Tap into warm
          analog sounds and create beats that breathe.
        </p>
      </section>

      {/* CTA Buttons */}
      <div className="flex items-center justify-center gap-4 px-10 pt-4 pb-16">
        <Link
          href="/beat"
          className="rounded-[10px] px-9 py-4 font-[family-name:var(--font-ibm-mono)] text-[13px] uppercase tracking-[1.5px] transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#3D2B1A", color: "#EDE6DA" }}
        >
          Start Making Beats
        </Link>
        <a
          href="#sounds"
          className="rounded-[10px] border-[1.5px] px-9 py-4 font-[family-name:var(--font-ibm-mono)] text-[13px] uppercase tracking-[1.5px] transition-opacity hover:opacity-80"
          style={{ borderColor: "#3D2B1A", color: "#3D2B1A" }}
        >
          Listen to Demos
        </a>
      </div>

      {/* Phone Mockup */}
      <div className="flex justify-center px-10 pb-5">
        <div
          className="flex w-[320px] flex-col gap-0 rounded-[32px] p-4"
          style={{
            backgroundColor: "#3D2B1A",
            boxShadow:
              "0 40px 80px rgba(44,30,16,0.25), 0 8px 24px rgba(44,30,16,0.15)",
          }}
        >
          {/* Notch */}
          <div className="flex justify-center pb-3 pt-2">
            <div
              className="h-1.5 w-20 rounded-full"
              style={{ backgroundColor: "#5C4A35" }}
            />
          </div>
          {/* Screen */}
          <div
            className="flex flex-col gap-4 rounded-[20px] p-5"
            style={{ backgroundColor: "#C9B99A" }}
          >
            {/* App header */}
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span
                  className="font-[family-name:var(--font-heading)] text-lg leading-none"
                  style={{ color: "#2C1E10" }}
                >
                  BeatPad
                </span>
                <span
                  className="font-[family-name:var(--font-ibm-mono)] text-[7px] uppercase tracking-[1.5px]"
                  style={{ color: "#8B7355" }}
                >
                  Drum Machine
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: "#C0392B" }}
                />
                <span
                  className="font-[family-name:var(--font-ibm-mono)] text-[7px] uppercase tracking-[1px]"
                  style={{ color: "#8B7355" }}
                >
                  Active
                </span>
              </div>
            </div>
            {/* Pad grid */}
            <div
              className="flex flex-col gap-2.5 rounded-[14px] p-3"
              style={{ backgroundColor: "#5C4A35" }}
            >
              {[
                ["Kick", "Snare"],
                ["Hi-Hat", "Clap"],
              ].map((row, ri) => (
                <div key={ri} className="flex gap-2.5">
                  {row.map((name) => (
                    <div
                      key={name}
                      className="flex flex-1 flex-col items-center gap-1.5 rounded-[10px] px-3 py-4"
                      style={{ backgroundColor: "#DDD2BF" }}
                    >
                      <span
                        className="font-[family-name:var(--font-ibm-mono)] text-[9px] uppercase tracking-[1px]"
                        style={{ color: "#3D2B1A" }}
                      >
                        {name}
                      </span>
                      <Waveform
                        bars={[
                          { h: 10, color: red },
                          { h: 16, color: gold },
                          { h: 12, color: red },
                          { h: 18, color: gold },
                          { h: 8, color: green },
                        ]}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section
        id="features"
        className="flex flex-col items-center gap-4 px-10 pt-24 pb-10 lg:px-20"
      >
        <span
          className="font-[family-name:var(--font-ibm-mono)] text-[11px] uppercase tracking-[3px]"
          style={{ color: "#C0392B" }}
        >
          Why BeatPad
        </span>
        <h2
          className="text-center font-[family-name:var(--font-heading)] text-4xl leading-[1.15] tracking-tight sm:text-5xl"
          style={{ color: "#2C1E10" }}
        >
          Built for hands,
          <br />
          not menus
        </h2>
        <p
          className="max-w-[460px] text-center font-[family-name:var(--font-ibm-mono)] text-[13px] leading-[1.8]"
          style={{ color: "#8B7355" }}
        >
          Every detail designed so you stay in the flow. No settings to dig
          through — just play.
        </p>
      </section>

      {/* Feature Cards */}
      <div className="grid gap-6 px-10 sm:grid-cols-3 lg:px-20">
        {[
          {
            icon: "\u{1F39B}\uFE0F",
            title: "Tactile Pads",
            desc: "Velocity-sensitive pads that respond to your touch. Each hit feels real, not digital.",
          },
          {
            icon: "\u{1F39A}\uFE0F",
            title: "Warm Sounds",
            desc: "Analog-modeled drum samples with natural warmth. No cold, sterile clicks here.",
          },
          {
            icon: "\u26A1",
            title: "Zero Latency",
            desc: "Web Audio API tuned for instant response. Your rhythm, perfectly preserved.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="flex flex-col gap-5 rounded-[20px] p-8 sm:p-10"
            style={{ backgroundColor: "#3D2B1A" }}
          >
            <div
              className="flex size-12 items-center justify-center rounded-xl text-[22px]"
              style={{ backgroundColor: "#5C4A35" }}
            >
              {f.icon}
            </div>
            <h3
              className="font-[family-name:var(--font-heading)] text-2xl leading-[1.2]"
              style={{ color: "#EDE6DA" }}
            >
              {f.title}
            </h3>
            <p
              className="font-[family-name:var(--font-ibm-mono)] text-xs leading-[1.8]"
              style={{ color: "#A89880" }}
            >
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Sound Library Section */}
      <section
        id="sounds"
        className="flex flex-col items-center gap-4 px-10 pt-24 pb-10 lg:px-20"
      >
        <span
          className="font-[family-name:var(--font-ibm-mono)] text-[11px] uppercase tracking-[3px]"
          style={{ color: "#C0392B" }}
        >
          Sound Library
        </span>
        <h2
          className="text-center font-[family-name:var(--font-heading)] text-4xl leading-[1.15] tracking-tight sm:text-5xl"
          style={{ color: "#2C1E10" }}
        >
          Every sound, curated
        </h2>
        <p
          className="max-w-[460px] text-center font-[family-name:var(--font-ibm-mono)] text-[13px] leading-[1.8]"
          style={{ color: "#8B7355" }}
        >
          Hand-picked samples from vintage machines and live recordings. Load,
          layer, and play.
        </p>
      </section>

      {/* Sound Kit Cards */}
      <div className="grid gap-5 px-10 sm:grid-cols-3 lg:px-20">
        {[
          {
            name: "808 Classic",
            badge: "Free",
            badgeColor: green,
            tags: ["Kick", "Snare", "Clap", "+5"],
            bars: [
              { h: 20, color: red },
              { h: 28, color: gold },
              { h: 14, color: green },
              { h: 24, color: red },
              { h: 32, color: gold },
              { h: 18, color: red },
              { h: 26, color: green },
              { h: 10, color: gold },
            ],
          },
          {
            name: "Lo-Fi Vinyl",
            badge: "New",
            badgeColor: gold,
            tags: ["Thump", "Rim", "Shaker", "+4"],
            bars: [
              { h: 16, color: gold },
              { h: 24, color: red },
              { h: 30, color: gold },
              { h: 12, color: green },
              { h: 22, color: red },
              { h: 28, color: gold },
              { h: 18, color: green },
              { h: 32, color: red },
            ],
          },
          {
            name: "Tape Hiss",
            badge: "Free",
            badgeColor: green,
            tags: ["Boom", "Snap", "Hat", "+6"],
            bars: [
              { h: 28, color: green },
              { h: 14, color: gold },
              { h: 22, color: red },
              { h: 32, color: gold },
              { h: 18, color: red },
              { h: 26, color: green },
              { h: 10, color: gold },
              { h: 20, color: red },
            ],
          },
        ].map((kit) => (
          <div
            key={kit.name}
            className="flex flex-col gap-4 rounded-2xl border p-7 sm:p-8"
            style={{
              backgroundColor: "#DDD2BF",
              borderColor: "rgba(60,43,26,0.08)",
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="font-[family-name:var(--font-heading)] text-xl"
                style={{ color: "#2C1E10" }}
              >
                {kit.name}
              </span>
              <div className="flex items-center gap-1">
                <div
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: kit.badgeColor }}
                />
                <span
                  className="font-[family-name:var(--font-ibm-mono)] text-[9px] uppercase tracking-[1px]"
                  style={{ color: "#8B7355" }}
                >
                  {kit.badge}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {kit.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md px-2.5 py-1 font-[family-name:var(--font-ibm-mono)] text-[9px] uppercase tracking-[1px]"
                  style={{ backgroundColor: "#C9B99A", color: "#5C4A35" }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <Waveform bars={kit.bars} />
          </div>
        ))}
      </div>

      {/* Stats Bar */}
      <section
        className="mt-24 flex flex-wrap justify-center gap-16 px-10 py-24 sm:gap-20 lg:px-20"
        style={{ backgroundColor: "#3D2B1A" }}
      >
        {[
          { value: "24", label: "Sound Kits" },
          { value: "200+", label: "Samples" },
          { value: "<5ms", label: "Latency" },
          { value: "Free", label: "Forever" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1.5">
            <span
              className="font-[family-name:var(--font-heading)] text-4xl sm:text-[56px]"
              style={{ color: "#EDE6DA" }}
            >
              {stat.value}
            </span>
            <span
              className="font-[family-name:var(--font-ibm-mono)] text-[11px] uppercase tracking-[2px]"
              style={{ color: "#A89880" }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </section>

      {/* Final CTA */}
      <section className="flex flex-col items-center gap-6 px-10 pt-24 pb-4 lg:px-20">
        <h2
          className="max-w-[700px] text-center font-[family-name:var(--font-heading)] text-4xl leading-[1.1] tracking-tight sm:text-[56px]"
          style={{ color: "#2C1E10" }}
        >
          Ready to feel the beat?
        </h2>
        <p
          className="max-w-[420px] text-center font-[family-name:var(--font-ibm-mono)] text-sm leading-[1.8]"
          style={{ color: "#8B7355" }}
        >
          No download. No signup. Just open your browser and start making music.
        </p>
      </section>

      <div className="flex justify-center px-10 pt-4 pb-24">
        <Link
          href="/beat"
          className="rounded-xl px-12 py-[18px] font-[family-name:var(--font-ibm-mono)] text-sm font-semibold uppercase tracking-[2px] transition-opacity hover:opacity-80"
          style={{
            backgroundColor: "#D4A017",
            color: "#2C1E10",
            boxShadow: "0 4px 16px rgba(212,160,23,0.3)",
          }}
        >
          Launch BeatPad
        </Link>
      </div>

      {/* Footer */}
      <footer
        className="flex flex-col items-center justify-between gap-6 border-t px-10 py-8 sm:flex-row lg:px-20"
        style={{ borderColor: "rgba(60,43,26,0.12)" }}
      >
        <div className="flex items-baseline gap-2.5">
          <span
            className="font-[family-name:var(--font-heading)] text-lg"
            style={{ color: "#2C1E10" }}
          >
            BeatPad
          </span>
          <span
            className="font-[family-name:var(--font-ibm-mono)] text-[9px] uppercase tracking-[1.5px]"
            style={{ color: "#8B7355" }}
          >
            Drum Machine
          </span>
        </div>
        <div className="flex items-center gap-8">
          <span
            className="font-[family-name:var(--font-ibm-mono)] text-[11px]"
            style={{ color: "#8B7355" }}
          >
            Privacy
          </span>
          <span
            className="font-[family-name:var(--font-ibm-mono)] text-[11px]"
            style={{ color: "#8B7355" }}
          >
            Terms
          </span>
          <span
            className="font-[family-name:var(--font-ibm-mono)] text-[11px]"
            style={{ color: "#8B7355" }}
          >
            GitHub
          </span>
        </div>
        <span
          className="font-[family-name:var(--font-ibm-mono)] text-[11px]"
          style={{ color: "#A89880" }}
        >
          Made with warmth, 2026
        </span>
      </footer>
    </div>
  )
}
