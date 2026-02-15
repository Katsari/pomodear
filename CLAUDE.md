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

### Visual Design

- **Glass-morphism**: `.glass` (24px blur, semi-transparent bg), `.glass-nav`, `.glass-bar` defined in `main.css`
- **Color system**: CSS custom properties in `:root` (`--bg-*`, `--accent-*`, `--text-*`, `--border-subtle`). Tailwind theme extends primary palette (warm brown/amber).
- **Fonts**: Fraunces (display/timer), Plus Jakarta Sans (UI), Space Mono (data) via `@nuxtjs/google-fonts`
- **Icons**: Lucide icon set via `@iconify-json/lucide`, used as `i-lucide-*` with Nuxt UI's `<UIcon>`. `@iconify-json/simple-icons` is installed but currently unused.
- **Images**: `@nuxt/image` provides `<NuxtImg>` for background images.
- **Rich text**: DailyNotePanel uses Nuxt UI's `<UEditor>` backed by Tiptap with `@tiptap/extension-task-list` and `@tiptap/extension-task-item`.
- **Timer ring**: SVG circle with `stroke-dashoffset` animation and a subtle pulsing animation.

### Audio Architecture

Audio files in `public/audio/`:
- `music/` — Background tracks (playlist defined in `useAudio`)
- `ambient/` — Looping ambient sounds (rain, fireplace, forest, ocean)
- `sfx/` — Timer completion bell

Music and ambient are independent channels mixed through a master volume control. Ambient sounds auto-play/pause based on their individual volume slider values.

### SSR

Disabled (`ssr: false`). Client-only guards (`import.meta.client`) protect browser API usage in composables (localStorage, Audio, requestAnimationFrame).

### Deployment

SPA build outputs to `.output/public/`, suited for static hosts (deployed to Cloudflare Pages at `pomodear.pages.dev`).

## Known Limitations

- **SPA crawlability**: No SSR — search engines rely on meta tags, JSON-LD, and pre-rendered `/` route
- **Audio autoplay**: Browsers block autoplay until user interaction; music/ambient require a click to start
- **Persistence**: localStorage only — no sync across devices, data lost on clear
- **Mobile**: No responsive layout — designed for desktop viewports
