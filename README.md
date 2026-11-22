# SnappFlow — Real-Time Bilingual Mobility Super-App

> **Live Demo (Vercel):** `[Add your deployed Vercel URL here — e.g. https://snappflow-elahe.vercel.app]`

[![Next.js](https://img.shields.io/badge/Next.js-15_App_Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-60fps-EC4899?style=flat-square)](https://www.framer.dev/)

**SnappFlow** is a production-grade portfolio super-app inspired by **Snapp**, engineered by **[Elahe Abdali](https://github.com/elaheabdali)** to demonstrate senior front-end architecture, CS fundamentals, real-time state synchronization, accessibility, and web security.

## Key Engineering Highlights

- **Graph Routing & CS Fundamentals:** Weighted shortest-path calculation using **Dijkstra's Algorithm** (`O((V + E) log V)`) with dynamic traffic edge weights and real-time coordinate interpolation (`src/lib/routing.ts`).
- **Real-Time WebSocket Telemetry:** Simulated WebSocket client (`src/lib/ws-simulator.ts`) streaming live driver assignment, 60fps GPS coordinates, and ETA countdowns.
- **Hybrid State Architecture:** **Zustand** for low-latency UI/trip telemetry + **TanStack Query** for dynamic surge pricing cache & BNPL credit mutations + **React Hook Form + Zod** for multi-step validated onboarding.
- **Bilingual RTL/LTR Engine:** First-class **Persian (`fa` - RTL)** and **English (`en` - LTR)** support with automatic `<html dir="rtl|ltr">` flipping, paired `Vazirmatn` + `Plus Jakarta Sans` fonts, and locale-aware Toman/USD formatting.
- **Senior Motion Design:** `framer-motion` `layoutId` shared-element tabs, SVG `pathLength` route drawing, GPU-composited transforms, and `prefers-reduced-motion` compliance.
- **OWASP Security & WCAG Accessibility:** Pre-configured `Content-Security-Policy`, `X-Frame-Options: DENY`, `Referrer-Policy`, keyboard navigation, `Escape` focus handling, and bilingual ARIA labels.
- **Testing & Quality:** Unit & integration tests with **Vitest + React Testing Library** and E2E critical flow tests with **Playwright**.

## Project Structure

```text
src/
├── app/                # Next.js App Router (layout, Server Component entry, globals.css)
├── components/         # Reusable accessible UI primitives & AppProviders
├── features/           # Domain modules (header, super-app, map, trip, bnpl, architecture)
├── hooks/              # Custom hooks (useLocale, useLiveTripSocket)
├── lib/                # Dijkstra routing, WebSocket simulator, mock API, formatters
├── messages/           # Bilingual dictionaries (fa.ts, en.ts)
├── store/              # Zustand global store
└── types/              # Strict TypeScript definitions
```

## Local Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

- `npm run typecheck` — Strict TypeScript verification (`tsc --noEmit`)
- `npm run lint` — Next.js ESLint check
- `npm run test` — Run Vitest + React Testing Library unit/integration tests
- `npm run test:e2e` — Run Playwright E2E tests
- `npm run build` — Production build verification
