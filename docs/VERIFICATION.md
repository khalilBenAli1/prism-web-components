# Verification

Actual checks, 3 November 2026. No Lighthouse score, accessibility certification or live-client claim is made.

- Lint and Prettier formatting; strict TypeScript for library, workbench, HTML consumer, browser tests and configurations.
- Domain tests: progress bounds/NaN/infinity/invalid maximum and tab wrap/Home/End/ignored keys.
- External package consumer: public package exports, generated declarations, typed constructors and CSS import resolve and bundle from a temporary independent app.
- 30 passing browser tests in Chromium and WebKit: successful and invalid HTML settings forms, native FormData, Enter submission, reset defaults, disabled fieldsets, typed event detail, safe text, modal Tab/Shift+Tab/Escape and exact focus restoration, arrow-key tabs, checkbox/switch keyboard activation, native disclosure, polite live status, bounded progress, themes/tokens/API/search, reflow 390/768/1440 and reduced motion.
- Axe scans cover all 12 default specimens, the dark status page and HTML example; additional dark button variant and long-label tests cover the control states. No violations were found in the passing runs. Manual screenshot review covers desktop/mobile workbench, dark mode, tokens and HTML settings.
- Visual verdict against the chosen written brief: 93/100; see VISUAL_REVIEW.md. This is a design judgment, not a benchmark or certification.

`npm run check` repeats lint, formatting, types, domain tests, both production builds, external consumption, payload budgets and both browser engines. CI installs Chromium/WebKit with their OS dependencies and uses immutable official Actions. Deployment requires passing checks on main.

## Payload budgets

`npm run budget` measures actual emitted files after every production build and fails if combined docs/example JS exceeds150,000 bytes, combined CSS exceeds40,000 bytes, or the external-Lit library exceeds30,000 bytes. Gzip sizes are measured with Node zlib, not estimated. Final measured values are in README.md. There are no remote font requests or runtime images. Two self-hosted WOFF2 fonts have an 80 kB combined budget. Curated screenshots are documentation-only and are not loaded by the demo.

## Known gaps

No broad assistive-technology/device matrix, Firefox, iOS VoiceOver, RTL, localization, OS forced-colors, nested modal or nested-shadow form audit. No persistence or real submission. Field labels must be supplied. Status is a simple persistent polite notice, not a queue. All constraints are visible in each component's API/keyboard documentation and architecture notes.

The final typography pass uses exactly Geist Variable and Geist Mono Variable, loaded from two local Latin WOFF2 assets (52,528 bytes combined). Both loaded successfully in the actual production preview; all 30 browser checks remained green after the change.
