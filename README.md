# Pomodear

A cozy Pomodoro timer with advanced daily note and writing editors, music playback, ambient sounds, and quotes.

Built with Nuxt 4, Nuxt UI 4, and Tailwind CSS 4. Live at [pomodear.pages.dev](https://pomodear.pages.dev).

## Features

- **Pomodoro Timer** — Focus, break, and long break cycles with an animated SVG ring
- **Music Player** — Background playlist with playback controls
- **Ambient Sounds** — Layered ambient channels (rain, fireplace, forest, ocean) with independent volume
- **Task Tracking** — Create, complete, and manage tasks during sessions
- **Daily Note** — Persistent note editor with plan & write modes and debounced auto-save
- **Daily Quotes** — Rotating motivational quotes seeded by date
- **Draggable Panels** — All side panels detach and reposition via drag
- **Glass-morphism UI** — Frosted-glass aesthetic with warm brown/amber palette

## Setup

```bash
bun install
```

## Development

```bash
bun run dev
```

Runs at `http://localhost:3000`.

## Production

```bash
bun run build
bun run preview
```

## Linting & Type Checking

```bash
bun run lint
bun run typecheck
```

## Deploy to Cloudflare Pages

```bash
bun run build && bunx wrangler --cwd dist pages deploy --project-name pomodear
```

## Tech Stack

- [Nuxt 4](https://nuxt.com) (SSR disabled — client-only SPA)
- [Nuxt UI 4](https://ui.nuxt.com)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev) via Iconify
- Fonts: Fraunces, Plus Jakarta Sans, Space Mono

## License

[MIT](LICENSE)
