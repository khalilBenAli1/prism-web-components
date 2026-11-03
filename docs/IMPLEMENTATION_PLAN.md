# Prism implementation plan — 3 November 2026

An original, fictional component system; no existing screenshot reference is supplied for Prism.

1. Foundation: strict Lit/TypeScript, pinned toolchain, independent public repo, reproducible CI.
2. Component slice: twelve native-backed shadow components, explicit events and styling contracts.
3. Workbench: white paper, precise black type, saturated violet, coral/lime secondary accents; desktop sidebar, quiet top bar, an oversized component heading, dotted live canvas and an inspector. Mobile stacks inspector below preview. System sans + monospace only. No photography or external font requests.
4. Validate: built package HTML example, required forms, disabled/loading/error, keyboard tabs and dialog focus, progress/status; Chromium and WebKit, axe, 390/768/1440 reflow, theme/reduced motion.
5. Release: measured payload, honest docs/limits, screenshots and visual verdict >=90, feature PR with green CI, merge and GitHub Pages verification.

Acceptance: every visible control works; 12 component pages with API/keyboard guidance; token changes affect live examples and can reset/copy; native form values/validation work through ElementInternals; modal restores focus; tabs support arrows/Home/End; HTML example imports the built package; no horizontal page overflow; no backend, npm publication or remote fonts.
