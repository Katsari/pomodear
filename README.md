# Pomodear

A customizable productivity workspace with a Pomodoro timer, ambient sounds, music, task tracking, and a daily note editor. Built with Nuxt 4, Nuxt UI 4, and Tailwind CSS 4. Live at [pomodear.pages.dev](https://pomodear.pages.dev).

## Why Pomodear?

Most Pomodoro apps are either too cluttered or too minimal. Pomodear lets you drag and hide panels, so your workspace can change depending on what you're doing and what actually helps you focus. Some days I want a totally clean timer, other days I want a task list and rain sounds in the background, and sometimes I just want to write in fullscreen.

![Pomodear screenshot](https://raw.githubusercontent.com/Katsari/pomodear/main/public/images/pomodear.png)

## Features

- **Pomodoro Timer**: focus, break, and long break cycles with animations
- **Music Player**: background playlist with play/pause and skip controls
- **Ambient Sounds**: mix rain, fireplace, forest, and ocean sounds with independent volume controls
- **Task Tracking**: create, complete, and manage tasks during sessions
- **Daily Note**: rich text editor with plan and write modes, fullscreen support, and auto-save
- **Daily Quotes**: a different quote each day from philosophers, scientists and writers
- **Draggable Panels**: drag panels anywhere on screen or hide them completely
- **Glass-morphism UI**: frosted-glass aesthetic with warm brown/amber palette

## Getting Started

```bash
bun install          # Install dependencies
bun run dev          # Dev server at http://localhost:3000
bun run build        # Production build
bun run preview      # Preview production build
bun run lint         # ESLint
bun run typecheck    # vue-tsc type checking
```

### Deploy to Cloudflare Pages

```bash
bun run build && bunx wrangler --cwd dist pages deploy --project-name pomodear
```

## Tech Stack

- [Nuxt 4](https://nuxt.com) (client-only SPA)
- [Nuxt UI 4](https://ui.nuxt.com)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev) via Iconify
- Fonts: Fraunces, Plus Jakarta Sans, Space Mono

## Roadmap

- Unsplash integration for dynamic backgrounds
- Explore music streaming integration (Spotify embed or similar)
- More built-in ambient sounds
- Better quotes (yes, some of the current ones are a bit generic)

Suggestions welcome! Feel free to [open an issue](https://github.com/Katsari/pomodear/issues).

## License

[MIT](LICENSE)
