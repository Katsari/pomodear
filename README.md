# Pomodear

Your cozy corner for deep work.

A customizable productivity workspace with a Pomodoro timer, ambient sounds, music, task tracking, and a daily note editor. Built with Nuxt 4, Nuxt UI 4, and Tailwind CSS 4. Live at [pomodear.pages.dev](https://pomodear.pages.dev).

## Why Pomodear?

Most Pomodoro apps are either too cluttered or too minimal. Pomodear takes a different approach - every panel is draggable and hideable, so you build your own workspace with only what you need. Full focus mode? Hide everything. Want ambient rain and a task list? Drag just those in. Your desk, your rules.

![Pomodear screenshot](https://raw.githubusercontent.com/Katsari/pomodear/main/public/images/pomodear.png)

## Features

- **Pomodoro Timer**: Focus, break, and long break cycles with an animated SVG ring
- **Music Player**: Background playlist with playback controls
- **Ambient Sounds**: Mix rain, fireplace, forest, and ocean sounds with independent volume controls
- **Task Tracking**: Create, complete, and manage tasks during sessions
- **Daily Note**: Rich text editor with plan and write modes and auto-save
- **Daily Quotes**: A fresh motivational quote each day
- **Draggable Panels**: All side panels detach and reposition by dragging
- **Glass-morphism UI**: Frosted-glass aesthetic with warm brown/amber palette

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
