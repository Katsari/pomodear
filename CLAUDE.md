# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pomodear is a cozy Pomodoro timer SPA with music playback, ambient sounds, task tracking, advanced daily note editor, and quotes. Built with Nuxt 4 + Nuxt UI 4 + Tailwind CSS 4.

## Commands

```bash
bun run dev          # Dev server at http://localhost:3000
bun run build        # Production build
bun run lint         # ESLint (stylistic: no comma dangle, 1tbs braces)
bun run typecheck    # vue-tsc type checking

# Deploy to Cloudflare Pages
bun run build && bunx wrangler --cwd dist pages deploy --project-name pomodear
```

Package manager is **bun**. No test framework is configured.

## Key Files

| Path | Purpose |
|------|---------|
| `app/pages/index.vue` | Main 3-column layout |
| `app/app.vue` | Root component, SEO meta |
| `app/assets/css/main.css` | Glass-morphism, CSS custom properties |
| `app/composables/useTimer.ts` | Pomodoro state machine |
| `app/composables/useAudio.ts` | Music + ambient + SFX |
| `app/composables/useDailyNote.ts` | Tiptap rich-text daily note |
| `app/composables/useSettings.ts` | User preferences |
| `app/types/index.ts` | Shared TypeScript types |
| `app/utils/quotes.ts` | Quote collection |
| `nuxt.config.ts` | Nuxt/Vite/ESLint config |
| `designs/design.pen` | Design assets (Pencil MCP) |

## Architecture

Design assets live in `designs/*.pen`. The Nuxt app is at the repo root (`app/`, `public/`, `nuxt.config.ts`, etc.).

### Components

- **TimerArea** / **TimerRing** / **TimerControls** — Timer display and interaction
- **MusicPanel** / **NowPlaying** / **VolumeSlider** / **AmbientSounds** — Audio UI
- **TasksPanel** / **TaskItem** — Task CRUD list
- **DailyNotePanel** — Tiptap rich-text editor with Plan/Write tabs and date navigation
- **QuotePanel** — Daily motivational quote
- **NavBar** — Top bar with username greeting and settings trigger
- **ActionBar** — Floating panel toggle buttons (draggable)
- **SettingsModal** — Timer durations, username, background selection
- **PanelHeader** — Reusable panel title bar
- **DraggableWrapper** — Wraps panels to enable detachable drag via `useDraggable`; drag handle uses `.cursor-grab`

### Composable Singletons

All composables use a **module-level singleton pattern** — reactive state is declared outside the function as private `_prefixed` variables, initialized once. This ensures shared state across all components without Pinia. Each composable lazily initializes on first call:

- **`useTimer`** — Pomodoro state machine (focus → break → longBreak cycle). Uses `setInterval` for ticking. Calls `useAudio().playBell()` on completion.
- **`useAudio`** — Music player + ambient sounds + bell SFX. Creates `HTMLAudioElement` instances client-side (`import.meta.client` guard). Manages master volume, independent music volume, and individual ambient channels.
- **`useSettings`** — Timer durations, username, background selection. All backed by `useLocalStorage`.
- **`useTasks`** — CRUD for task list with `crypto.randomUUID()` IDs.
- **`usePanels`** — Toggle visibility of the 4 panels (music, tasks, dailyNote, quote).
- **`useDailyNote`** — Tiptap rich-text daily note with Plan/Write tabs, date navigation, and debounced (500ms) persistence.
- **`useQuote`** — Daily quote rotation using date-seeded index.
- **`useLocalStorage`** — Generic reactive localStorage wrapper with JSON serialization. All keys prefixed `pomodear-`.
- **`useDraggable`** — Pointer-event-based drag that detaches elements to `position: fixed` on first drag.

### Layout Structure

`index.vue` is a 3-column layout:
- **Left**: MusicPanel (player + ambient sounds + volume)
- **Center (flex)**: TimerArea (ring + controls, absolutely positioned at ~35% left)
- **Right**: TasksPanel, DailyNotePanel, QuotePanel stacked vertically

All side panels are wrapped in `DraggableWrapper` for detachable drag. Panels use Vue `<Transition>` with slide-left/slide-right animations. The `ActionBar` (panel toggles) is also draggable.

### Audio Architecture

Audio files in `public/audio/`:
- `music/` — Background tracks (playlist defined in `useAudio`)
- `ambient/` — Looping ambient sounds (rain, fireplace, forest, ocean)
- `sfx/` — Timer completion bell

Music and ambient are independent channels mixed through a master volume control. Ambient sounds auto-play/pause based on their individual volume slider values.

### SSR

Disabled (`ssr: false`). Client-only guards (`import.meta.client`) protect browser API usage in composables (localStorage, Audio, requestAnimationFrame).

### Deployment

SPA build outputs to `dist/`, suited for static hosts (deployed to Cloudflare Pages at `pomodear.pages.dev`).

## Known Limitations

- **SPA crawlability**: No SSR — search engines rely on meta tags, JSON-LD, and pre-rendered `/` route
- **Audio autoplay**: Browsers block autoplay until user interaction; music/ambient require a click to start
- **Persistence**: localStorage only — no sync across devices, data lost on clear

## Design Context

### Users
Broad audience: anyone who wants a cozy, ambient timer for focused work. Could be developers, students, writers, or creatives. They come to Pomodear when they want to settle into a productive session with warmth and atmosphere, not clinical productivity pressure.

### Brand Personality
**Cozy, warm, gentle.** Like a fireplace in a study: comforting, unhurried, and inviting. The interface should feel like a space you want to inhabit, not a tool you tolerate.

### Aesthetic Direction
- **Visual tone**: Dark, warm, atmospheric. Rich amber/brown palette with soft glows and glass-morphism surfaces. Illustrated backgrounds create a sense of place.
- **References**: Lofi Girl (cozy anime aesthetic, warm palette, ambient mood) blended with Linear/Raycast (polished dark UI craft, smooth animations, attention to detail).
- **Anti-references**: Harsh neon productivity apps, sterile corporate dashboards, overly gamified interfaces with badges/streaks. Nothing that creates anxiety or urgency.
- **Theme**: Dark mode only. Warm-toned throughout.

### Typography
- **Display/Timer**: Fraunces (serif, elegant warmth)
- **UI text**: Plus Jakarta Sans (clean, friendly)
- **Data/Editor**: Space Mono (readable monospace)

### Color System
- **Base**: `#1A1916` (deep warm black)
- **Surfaces**: Glass-morphism tiers with semi-transparent warm browns
- **Primary accent**: `#E08228` (warm amber, used for active states and progress)
- **Secondary accents**: `#7C9070` (muted sage green, checkboxes/success), `#7EADD4` (soft blue, glows/highlights)
- **Text hierarchy**: `#F0EFEC` (primary) > `#C0BFBC` (secondary) > `#B0AEA9` (muted) > `#9E9D9A` (dim) > `#6B6B6B` (dimmer)

### Design Principles
1. **Warmth over efficiency**: Every surface, color, and animation should feel inviting. Prefer soft glows over sharp highlights, rounded corners over hard edges, gradual transitions over snappy ones.
2. **Atmosphere is a feature**: The backgrounds, glass effects, ambient sounds, and subtle animations all contribute to a sense of place. Treat environmental design with the same care as functional UI.
3. **Quiet craft**: Inspired by Linear/Raycast's attention to detail. Interactions should feel polished and intentional without being flashy. Micro-animations serve mood, not spectacle.
4. **Gentle focus**: The app should encourage concentration without pressure. No aggressive timers, no guilt-inducing metrics. Progress feels like a warm glow, not a scoreboard.
5. **Layered transparency**: Glass-morphism is the core surface language. Panels float over illustrated backgrounds, creating depth through blur and opacity rather than drop shadows or elevation.