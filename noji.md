# Noji Product Brief

## Identity

Noji is a monochrome minimalist JLPT vocabulary study app.

Noji is not a general Japanese learning app. Noji is not a gamified social learning product. Noji is not a clone of 26s. It uses 26s as a reference for product focus: fast vocabulary memorization, short daily sessions, and exam-oriented decks.

The product should feel quiet, precise, and utilitarian. The primary user is a solo learner who wants to study consistently without visual noise, excessive motivation copy, or complex setup.

## Reference Product: 26s

26s appears to be an image-based high-speed memorization app with exam-specific vocabulary decks. Public materials describe these core ideas:

- Fast memorization through visual association.
- Short micro-learning sessions.
- Flashcards and spaced repetition.
- Exam-specific vocabulary packs such as JLPT, TOPIK, GRE, TOEFL, DELE, DELF, and TELC.
- Free download with in-app purchases or subscriptions.
- No ads.

Noji should learn from the workflow, not the visual style. Noji should not depend on AI-generated images as its core value. User reviews of 26s show that AI images can be memorable but can also be inaccurate, expensive to produce, and harmful to trust when they misrepresent vocabulary.

## PM Analysis Of 26s

26s appears successful because it combines a painful job, a clear promise, and a scalable content model.

The painful job:

- Learners hate vocabulary memorization.
- Exam learners have deadlines.
- Many learners do not want to build Anki decks, spreadsheets, or custom study systems.
- A polished ready-made deck feels more valuable than a flexible but empty tool.

The clear promise:

- "Memorize faster" is easier to understand than "learn Japanese better."
- The product sells relief from study friction, not just content.
- The 26-second framing creates a memorable product myth.
- Image cards provide an immediate "aha" moment during onboarding.

The scalable content model:

- The same memorization engine can support TOEIC, JLPT, TOPIK, GRE, TOEFL, and other exams.
- New exam decks create new landing pages and acquisition channels.
- The app can monetize by bundle, lifetime access, or subscription.
- The value perception increases with deck size and breadth.

The likely growth loop:

- Exam keyword landing pages capture high-intent users.
- Store screenshots show the result quickly: beautiful cards, fast study, review buttons.
- Free install lowers acquisition friction.
- Paywall monetizes users after they see enough curated content.
- Frequent app updates keep store listings fresh.

The likely retention loop:

- Daily study queue.
- Spaced repetition due cards.
- Progress visibility.
- Reminders.
- Low session length.

The likely trust risks:

- AI-generated images can misrepresent words.
- Overly broad exam coverage can make content quality uneven.
- High price increases user expectations.
- Users compare it directly with Anki because both solve flashcard review.
- If the app claims AI scheduling or exam authority without transparent proof, trust can erode.

Noji should treat 26s as a validated signal that exam vocabulary memorization has demand. Noji should not attempt to beat 26s on deck breadth, visual spectacle, paid acquisition, AI image volume, or aggressive conversion.

## Competitive Strategy

Noji should not compete head-to-head with 26s.

Do not compete on:

- Number of exams.
- Number of decks.
- AI-generated imagery.
- High-energy marketing copy.
- Large paid content bundles.
- Claims of extreme memorization speed.
- Broad "all exams" positioning.

Compete on:

- Narrow JLPT focus.
- Trustworthy vocabulary data.
- Calm monochrome interface.
- Low cognitive load.
- Local-first personal study.
- Transparent scheduling.
- Beginner-to-bridge progression from N5 to N3.
- Useful behavior without a subscription-first product shape.

Noji's wedge is not "better 26s." Noji's wedge is:

> A precise, quiet, personal JLPT N5-N3 vocabulary system for learners who want less noise and more trust.

This means Noji can be smaller and still valuable. The product should be judged by whether it becomes a daily tool for one serious learner, not by whether it looks bigger than 26s.

## Product Positioning

Noji's promise:

> Learn JLPT vocabulary with a calm, accurate, minimal daily system.

Noji optimizes for:

- Accuracy over spectacle.
- Daily repeatability over one-time novelty.
- Low-friction review over feature density.
- Clear progress over motivational decoration.
- Monochrome visual discipline over colorful gamification.

## Initial Scope

The MVP covers JLPT N5, N4, and N3.

N2 and N1 are explicitly out of scope for the MVP. They may be added later after the study model, content pipeline, and review experience are proven.

This scope is intentional:

- N5-N4 are suitable for beginner-friendly vocabulary memorization.
- N3 is a useful bridge level and makes the product feel meaningfully useful.
- N2-N1 require more nuanced examples, abstract vocabulary, formal written language, synonym distinctions, and higher content review cost.

The target learner is not an advanced N1 learner. The target learner is a beginner or lower-intermediate learner who wants to build a reliable vocabulary base before grammar, reading, and listening become overwhelming.

N5-N3 should be treated as the product's strategic boundary, not as a limitation to apologize for. A focused N5-N3 app can be more coherent than a shallow N5-N1 app.

Recommended MVP quality order:

- N5 should feel complete and trustworthy.
- N4 should feel usable and close to complete.
- N3 may start as a smaller curated core deck, but the app architecture must support expanding it.

Do not expose empty N2 or N1 surfaces in the MVP. If future support is mentioned, keep it quiet and non-promotional.

## MVP User Goals

The MVP should let a user:

- Select a target JLPT level: N5, N4, or N3.
- Study a small set of new words each day.
- Review due words using spaced repetition.
- Mark a word as known, difficult, or forgotten.
- Search learned and available words.
- See level-specific progress.
- Continue studying without account creation if possible.
- Use the app as a private personal tool.

## MVP Features

Required:

- Level selection for N5, N4, and N3.
- Vocabulary card view.
- Daily new-word queue.
- Review queue.
- Basic spaced repetition scheduling.
- Local progress storage.
- Search.
- Favorite or saved words.
- Minimal quiz mode.
- Light and dark appearance that remains monochrome.

Preferred but not required for the first usable build:

- Example sentences.
- Kana reading display.
- Kanji information.
- Study streaks.
- Daily reminders.
- Export or backup.
- Importable vocabulary data pipeline.

Out of scope for MVP:

- N2 and N1 decks.
- Listening practice.
- Full mock exams.
- Official JLPT past questions.
- Speaking or writing evaluation.
- Social features.
- Leaderboards.
- Achievements.
- AI tutor chat.
- AI image generation.
- User-generated public decks.
- Subscription system.
- Cloud sync.

MVP product quality should be measured by study loop reliability, not feature count.

Minimum acceptable study loop:

- Open app.
- See today's work.
- Study new cards.
- Review due cards.
- Rate memory.
- Persist progress.
- Return tomorrow and continue without confusion.

If a feature does not strengthen this loop, defer it.

## Content Model

Each vocabulary item should support at least:

- `id`: stable unique identifier.
- `level`: `N5`, `N4`, or `N3`.
- `term`: Japanese word or expression.
- `reading`: kana reading.
- `meaningKo`: Korean meaning.
- `partOfSpeech`: broad part-of-speech label when known.
- `tags`: optional searchable metadata.

Recommended additional fields:

- `meaningEn`: English meaning for future localization or internal QA.
- `kanji`: kanji components or related characters.
- `exampleJa`: Japanese example sentence.
- `exampleKo`: Korean translation of the example.
- `source`: data source or review source.
- `status`: draft, reviewed, verified.

The app should treat vocabulary level assignment as a curated estimate unless the data source explicitly provides a licensed, authoritative level. Avoid claiming that a deck is an official JLPT word list.

Content quality is a core differentiator. A smaller reviewed deck is better than a large unreliable deck.

Content priority:

- Correct term and reading.
- Clear Korean meaning.
- JLPT level estimate.
- Part of speech when useful.
- Example sentence only when it can be reviewed or generated safely.
- Kanji detail only when it improves understanding.

Noji should avoid filling every card with weak AI-generated detail. Sparse accurate cards are acceptable. Dense unreliable cards are not.

## Data And Copyright Constraints

Do not copy official JLPT exam questions into the app unless there is explicit permission or a compatible license.

Do not present scraped or unlicensed commercial textbook content as app content.

Prefer legally usable sources, original content, or manually curated data with source tracking.

Official JLPT pages may be used as structural references for level definitions, scoring sections, and test format, but not as a source for copying protected test items.

Use language such as:

- "JLPT N5 vocabulary practice"
- "N3-oriented vocabulary"
- "Curated for JLPT study"

Avoid language such as:

- "Official JLPT vocabulary list"
- "Guaranteed JLPT words"
- "Real JLPT past questions"

## Learning Model

Use a simple spaced repetition model first. The MVP does not need a complex machine-learning scheduler.

A practical first model:

- New word starts as unseen.
- User answers with one of: Again, Hard, Good, Easy.
- Again schedules the word soon.
- Hard schedules the word later the same day or next day.
- Good increases the interval.
- Easy increases the interval more aggressively.

The scheduler should be deterministic, transparent, and easy to adjust.

Do not describe the scheduler as AI unless it actually uses AI.

The learning model should support the emotional promise of Noji: the user always knows what to do next.

Avoid forcing users through every lower-level card if they already know it. Include a lightweight "already know" path so N4 or N3 learners can clear obvious cards quickly.

For N3, prefer context-aware review over pure isolated recall when feasible. N3 is where vocabulary starts to depend more on usage and sentence context.

## UX Principles

Noji should be fast to open and immediately useful.

The first screen should be the study experience or a compact dashboard that leads directly into study. Do not build a marketing landing page inside the app.

Use restrained text. Avoid long explanations in the UI.

Prefer:

- Short labels.
- Clear progress numbers.
- Minimal cards.
- Strong typography hierarchy.
- Stable spacing.
- Native-feeling controls.

Avoid:

- Bright color palettes.
- Decorative gradients.
- Confetti.
- Cartoon mascots.
- Long motivational copy.
- Nested cards.
- Overly rounded bubbly UI.
- Complex gamification.

The app should not shame missed days. Missed days should create a clear recovery path, not a punishment state.

The product should avoid engagement dark patterns. Noji is a tool the user can trust, not a dopamine trap.

## Visual Direction

The visual system is monochrome minimalism.

Allowed palette:

- Near black.
- Off black.
- White.
- Off white.
- Neutral gray scale.
- One restrained accent only when functionally necessary.

The UI should still have enough contrast and state distinction. Monochrome does not mean low contrast.

Cards and panels should use subtle borders, spacing, and typography rather than color decoration.

Icons should be simple and functional. If the project uses an icon library, prefer library icons over custom SVGs.

## Product Tone

Noji should sound calm and direct.

Good UI copy:

- "Study"
- "Review"
- "New words"
- "Due today"
- "Known"
- "Hard"
- "Again"
- "Level"

Bad UI copy:

- "Crush your Japanese dreams now!"
- "Unlock your hidden anime power!"
- "AI magic memory booster!"
- "Become fluent instantly!"

Avoid direct competitive copy such as:

- "Better than 26s"
- "Cheaper than Anki"
- "No AI nonsense"
- "The only JLPT app you need"

Noji should define itself by its own discipline, not by attacking other tools.

## Technical Baseline

The current project uses Expo SDK 56.

Important project facts:

- Expo: `~56.0.4`
- React: `19.2.3`
- React Native: `0.85.3`
- Expo Router: `~56.2.6`
- TypeScript: `~6.0.3`

Before writing Expo code, read the exact versioned docs at:

https://docs.expo.dev/versions/v56.0.0/

SDK 56-specific caution:

- Do not import `@react-navigation/*` directly in app code. Use the Expo Router entry points where applicable.
- Prefer Expo SDK packages installed with `npx expo install`.
- Treat Expo Go as a convenience, not the production development baseline.

## Implementation Bias

Build the smallest coherent app that can be used daily.

When choosing between a polished narrow feature and a broad unfinished feature, choose the polished narrow feature.

When unsure, prefer local-first behavior. Authentication and cloud sync can come later.

Do not create business-model infrastructure until the core study loop is useful.

Do not add N2 or N1 until N5-N3 content and review flow are reliable.

Noji should remain founder-usable. The first real user is the maker. If a feature would not help the maker study N5-N3 consistently, it is probably premature.

Prioritize features in this order:

- Study loop.
- Data correctness.
- Progress persistence.
- Search and recovery.
- Monochrome visual polish.
- Content expansion.
- Reminders.
- Monetization.
- Cloud features.

## Business Model Bias

Noji does not need a business model in the MVP.

If monetization is added later, prefer models that preserve trust.

Preferred monetization:

- Free trial access to a meaningful subset of N5.
- One-time lifetime purchase: `$12.99`.
- Lifetime unlock should cover N5, N4, N3, full review, search, progress, and core study tools.

Secondary monetization ideas, only if they preserve trust:

- One-time purchase.
- Optional supporter purchase.
- Paid advanced decks after the free core app proves value.

Avoid subscriptions. A subscription-first shape will make Noji look like a weaker 26s instead of a focused personal study tool.

The pricing promise should be simple:

> One purchase. Study at your pace.

Acceptable paywall language:

- "Lifetime access for N5-N3."
- "No subscription."
- "One-time purchase."

Avoid paywall language:

- "Limited-time offer."
- "Last chance."
- "Unlock your full potential today."
- "AI-powered mastery plan."

No ads.

No sale countdowns.

No manipulative paywall after onboarding.

Do not monetize before the N5 experience is trustworthy. Users may tolerate N4 or N3 growing over time, but the paid product must not feel empty at the beginner level.

## Success Criteria For MVP

The MVP is successful when:

- A user can open the app and study N5-N3 vocabulary without reading instructions.
- Review state persists across app restarts.
- The study loop can be completed in a few minutes.
- The visual design is recognizably monochrome and minimal.
- The content model can be expanded without rewriting the app.
- The app does not make unsupported claims about official JLPT content or AI personalization.
