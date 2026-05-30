# noji

A calm, monochrome JLPT N5–N4 vocabulary trainer for Korean speakers. Built with Expo SDK 56, native SwiftUI components, and a local-first spaced-repetition engine — no account, no network, no ads.

## Highlights

- **Fully native iOS feel** — screens are composed from real SwiftUI primitives via `@expo/ui` (`Form`, `Section`, `Picker`, `Stepper`, `Toggle`) and `NativeTabs`, with large-title navigation and native search.
- **Local-first** — all 200 curated words and every byte of review state live in on-device SQLite (`expo-sqlite`). The app works offline and starts instantly.
- **Transparent spaced repetition** — a small, deterministic SM-2-style scheduler (`다시 / 어려움 / 알겠어 / 완벽해`) with live next-interval previews on each button.
- **Animated onboarding** — five Reanimated illustrations that explain the study loop before the first session.
- **Daily reminders** — opt-in local notifications scheduled with the current due count.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Expo SDK 56, React Native 0.85, React 19 |
| Routing | Expo Router (typed routes) + `NativeTabs` |
| Native UI | `@expo/ui` (SwiftUI), `expo-symbols`, `expo-glass-effect` |
| Storage | `expo-sqlite` (WAL, versioned migrations + seed) |
| Animation | `react-native-reanimated` v4 |
| Language | TypeScript (strict), React Compiler enabled |

## Architecture

```
src/
├── app/                 # Expo Router file-based routes (thin screen mounts)
│   └── (tabs)/          # NativeTabs: (home) · browse · saved · settings
├── features/            # One folder per feature: screen + hooks + sub-components
│   ├── today/  browse/  saved/  session/  settings/  onboarding/
├── components/          # Shared presentational components
├── repositories/        # SQL access layer (vocab / review / settings)
├── srs/                 # Spaced-repetition scheduler (pure, testable)
├── services/            # Side-effectful integrations (notifications)
├── db/                  # Schema, migrations, SQLite provider
├── data/                # Seed dataset + domain types
└── theme/               # Design tokens (color, spacing, typography)
```

The layering is one-directional: `app → features → repositories → db`, with `srs` and `theme` as dependency-free leaves. UI never touches SQL directly; every query lives in a repository.

## Getting started

```bash
bun install
bun run ios        # native build (required — uses SwiftUI components)
```

> SwiftUI primitives from `@expo/ui` do not render in Expo Go or on web; use a development build (`expo run:ios`).

```bash
bun run typecheck  # tsc --noEmit
bun run lint
```

## Data & licensing

- **Application code** is released under the MIT License (see [`LICENSE`](./LICENSE)).
- **Bundled vocabulary dataset** derives dictionary fields from **JMdict / KANJIDIC2** by the Electronic Dictionary Research and Development Group (EDRDG), licensed under **CC BY-SA 4.0**. Korean meanings, example sentences, translations, and learning order are original to this project.

The Japan Foundation does not publish an official JLPT vocabulary list. noji provides JLPT-oriented study content and is **not** an official JLPT resource. Full attribution is shown in the app under **설정 → 출처 및 라이선스**.
