# BeatPad

A browser-based beat pad. Load your own samples, tap pads or use keyboard shortcuts, and make beats with zero latency -- no download, no signup required.

## Features

- **8 interactive drum pads** in a 4x2 grid with animated visual feedback
- **Custom sample loading** -- drag in any `.mp3`, `.wav`, or browser-supported audio file
- **Keyboard shortcuts** -- keys `5`, `6`, `T`, `Y`, `G`, `H`, `B`, `N` trigger pads for rapid finger drumming
- **Web Audio API** -- native browser audio with <5ms latency, no external audio libraries
- **Waveform visualization** -- each loaded pad displays a unique waveform preview
- **Pad management** -- right-click or long-press to replace or clear sounds
- **Dark mode** -- press `D` to toggle light/dark theme

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (base-luma style, @base-ui/react primitives)
- [Phosphor Icons](https://phosphoricons.com/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [pnpm](https://pnpm.io/) package manager

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 9 (install with `npm install -g pnpm` if needed)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Product-Builders-Club/beat-pad.git
cd beat-pad

# Install dependencies
pnpm install

# Start the dev server (uses Turbopack)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page. Click **"Start Making Beats"** to launch the drum machine at `/beat`.

## Scripts

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `pnpm dev`       | Start dev server with Turbopack              |
| `pnpm build`     | Create a production build                    |
| `pnpm start`     | Serve the production build                   |
| `pnpm lint`      | Run ESLint (core-web-vitals + TypeScript)    |
| `pnpm typecheck` | Run TypeScript type checking (`tsc --noEmit`)|
| `pnpm format`    | Format `.ts`/`.tsx` files with Prettier      |

## Testing

This project does not currently include a test suite. To verify things are working:

1. **Build check** -- run `pnpm build` and confirm it completes without errors
2. **Type check** -- run `pnpm typecheck` to catch type errors
3. **Lint** -- run `pnpm lint` to catch code quality issues
4. **Manual testing** -- open the app and verify:
   - Landing page loads at `/`
   - Drum machine loads at `/beat`
   - Tapping an empty pad opens the file picker
   - Loading an audio file shows a waveform and green LED indicator
   - Tapping a loaded pad plays the sound immediately
   - Keyboard shortcuts (`5`, `6`, `T`, `Y`, `G`, `H`, `B`, `N`) trigger the correct pads
   - Right-click or long-press a pad to see Replace/Clear options
   - Press `D` to toggle dark mode

## Project Structure

```
app/
  page.tsx            # Landing page
  beat/page.tsx       # Drum machine app
  layout.tsx          # Root layout (fonts, theme provider)
  globals.css         # Tailwind v4 config, design tokens, animations
components/
  pad-button.tsx      # Drum pad component with waveform + context menu
  theme-provider.tsx  # Dark/light mode provider
  ui/                 # shadcn/ui components
hooks/                # Custom React hooks
lib/
  utils.ts            # cn() class merge utility
```

## Adding UI Components

This project uses shadcn/ui. To add a new component:

```bash
npx shadcn@latest add <component-name>
```

Components are placed in `components/ui/`.

## License

MIT
