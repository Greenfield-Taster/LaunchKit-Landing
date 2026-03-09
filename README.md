# LaunchKit Landing

Modern one-page landing template with CLI wizard, auto-generated color palette, i18n support, and scroll animations.

## Quick Start

```bash
npx @greenfield-taster/launchkit-landing
```

The CLI wizard will ask:
1. **Project name** — your new project folder
2. **Brand color** — hex color for auto-generated palette (default: `#6C3CE0`)
3. **Languages** — `uk`, `en`, or `uk+en` (default: `uk+en`)

Then start developing:

```bash
cd your-project
npm run dev
```

## Features

- 🎨 Auto-generated color palette from a single hex color
- 🌐 Built-in i18n (Ukrainian + English)
- ✨ Scroll animations with Framer Motion
- 🖥 Fully responsive (mobile → desktop)
- 🔮 Glassmorphism UI elements
- 🌈 Dynamic glow background effects
- 📦 One command to scaffold a new project

## Sections

- **Header** — fixed, transparent → glassmorphism on scroll, burger menu on mobile
- **Hero** — full-screen with animated entrance
- **About** — company info with stats
- **Features** — bento grid layout
- **Partners** — infinite marquee
- **Portfolio** — bento grid with hover overlays
- **Contact** — info cards + social links
- **Footer** — navigation + socials + copyright

## Tech Stack

- React 19
- Vite
- SCSS
- Framer Motion
- Lucide React

## Project Structure

```
src/
  components/     # Section components (Header, Hero, About, etc.)
  contexts/       # Language context (i18n)
  data/           # Site configuration
  locales/        # Translation files (uk.json, en.json)
  styles/         # SCSS (variables, reset, main)
cli/
  create.js       # CLI wizard
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run create` | Run CLI wizard locally |

## License

MIT
