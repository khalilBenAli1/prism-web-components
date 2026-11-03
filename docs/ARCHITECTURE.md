# Prism architecture

Prism is an original portfolio study created on 3 November 2026. It has two outputs: an ES-module library with declarations in `package/`, and a static documentation site in `dist/`. Nothing is published to npm. GitHub Pages serves the site at `/prism-web-components/`; hash navigation handles direct component links without depending on server fallback. A deliberate 404 handles unknown file paths.

## Boundaries and data flow

- `src/components/`: focused Lit elements, native controls and scoped CSS. `fields.ts` shares form association rather than duplicating validity, value and reset behavior. `focus.ts` walks the composed tree to wrap modal Tab navigation through assigned slots and open shadow roots. No global layout selectors escape a shadow root.
- `src/domain/interaction.ts`: pure, DOM-independent progress bounds and tab destination rules. Domain tests cover invalid numbers, wrap and boundary navigation.
- `src/catalog.ts`: typed documentation fixture data, independent of rendering.
- `src/workbench/demos.ts`: focused specimen views consume a typed state snapshot and action callbacks. Components do not own the documentation router or theme.
- `src/main.ts`: client-only page composition and small local UI state (selected component, docs tab, theme and inspector settings). Counts and filtered lists derive from the catalog. CSS tokens derive from theme/accent/radius. No store, duplicate derived totals or persistence layer is needed for this ephemeral workbench.
- `examples/`: separate plain HTML consumer imports the package by its public name, resolving package exports to the built artifact, rather than importing implementation source. Its settings values and feedback live only in memory. It submits no requests and stores no contact data.
- `scripts/consumer-smoke.mjs`: creates an external temporary consumer, resolves the package-name exports, typechecks declarations and bundles both library and CSS with Vite. The temporary directory is removed. Browser journeys also exercise the built-package HTML example.

## Native behavior and API choices

Controls use native input/textarea/select/checkbox/button semantics inside open shadow roots. `ElementInternals` makes fields successful controls in the nearest standard HTML form, including validity, disabled fieldsets, FormData and reset. Value properties are live; initial value/checked attributes define reset defaults. Checked is deliberately not reflected, which preserves that default. `name` reflects so native form entry names are correct. `prism-input`, `prism-change`, `prism-toggle`, `prism-close` and `prism-dismiss` bubble and are composed; declarations expose their event details. Native `click`, `input` and `change` retain their platform behavior.

Tabs contain all tab/panel ARIA relationships in the same shadow root. Dialog uses native `showModal`, background inertness and Escape. Composed-tree Tab wrapping adds consistent containment; the actual nested focus target is remembered and restored. Prism buttons explicitly focus on activation for consistent invoker restoration in WebKit. A dialog does not dismiss on backdrop click. Status uses a mounted polite live region, never an automatic timeout or focus steal.

Only the opt-in `tokens.css` affects the consumer document, defining custom properties on the root/theme selector. Component `part` names provide intentional styling hooks. Layout spacing tokens are provided for the consumer; not every space is configurable inside every component.

## Support boundaries

Modern browsers with Custom Elements, Shadow DOM, ElementInternals and native dialog are required. Chromium and WebKit are tested. Firefox, legacy browsers, forced-colors OS modes, screen-reader combinations, RTL and localization need further evaluation. No certification is implied. Forms across an additional outer shadow boundary, nested modal dialogs, dynamically edited option text, multi-select, asynchronous comboboxes and file inputs are outside this small library's scope. Replace an option element to update its text. A label property is required; external HTML labels do not cross shadow boundaries. Submit/reset buttons locate an ancestor form in their document tree.

The docs aim for WCAG 2.2 AA and show both state and text for feedback. Automated axe checks are evidence for scanned states, not proof for every assistive technology. No server-side renderer is provided; component registration is browser-only. There is no runtime storage, backend, account, telemetry or external font request.

## Tooling decisions

Lit 3.3.3 and Vite 8.3.5 were verified against their official documentation and npm metadata at execution time. Node 22.23.1 / npm 10.9.8 are exact baselines. TypeScript 6.0.3 is retained because current typescript-eslint 8.72.1 declares support below 6.1 while latest TypeScript is 7.0.2. Lockfile installation and immutable official GitHub Actions make the pipeline reproducible. Local port 4191 is intentional: WebKit blocks 4190 as a reserved Sieve protocol port.

Official references: [Lit](https://lit.dev/docs/), [Shadow DOM](https://lit.dev/docs/components/shadow-dom/), [Vite](https://vite.dev/guide/), [WCAG2.2](https://www.w3.org/WAI/WCAG22/quickref/), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
