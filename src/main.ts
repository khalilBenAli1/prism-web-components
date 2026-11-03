import { html, render } from 'lit';
import './components';
import type { PrismDialog } from './components';
import { components } from './catalog';
import { renderDemo } from './workbench/demos';
import './tokens.css';
import './fonts.css';
import './style.css';
let active = location.hash.slice(1) || 'button';
let view = 'preview';
let query = '';
let mobileMenu = false;
let narrow = false;
let disabled = false;
let loading = false;
let checked = true;
let error = false;
let variant = 'primary';
let progress = 64;
let radius = 8;
let accent = 'violet';
let theme = 'light';
let feedback = '';
let copied = false;
const colors: Record<string, [string, string]> = {
  violet: ['#6941d9', '#c6b3ff'],
  blue: ['#215cc5', '#a8c7ff'],
  green: ['#146952', '#97dcc2'],
};
const app = document.querySelector<HTMLDivElement>('#app')!;
const glyphs: Record<string, string> = {
  button: '↗',
  'text-field': 'T',
  textarea: '≡',
  checkbox: '☑',
  switch: '◒',
  select: '⌄',
  tabs: '⊟',
  dialog: '▣',
  accordion: '⊞',
  badge: '◇',
  progress: '◔',
  status: '▤',
};
function go(id: string) {
  active = id;
  view = 'preview';
  mobileMenu = false;
  feedback = '';
  reset();
  location.hash = id;
  draw();
}
function reset() {
  disabled = false;
  loading = false;
  checked = true;
  error = false;
  variant = 'primary';
  progress = 64;
}
function applyTheme() {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.setProperty('--prism-radius', `${radius}px`);
  document.documentElement.style.setProperty(
    '--prism-accent',
    colors[accent][theme === 'dark' ? 1 : 0],
  );
  document.documentElement.style.setProperty(
    '--prism-focus',
    colors[accent][theme === 'dark' ? 1 : 0],
  );
}
function announce(message: string) {
  feedback = message;
  draw();
}
async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    copied = true;
    draw();
    window.setTimeout(() => {
      copied = false;
      draw();
    }, 1800);
  } catch {
    announce('Clipboard unavailable. Select and copy the code below.');
  }
}
function showDialog() {
  document.querySelector<PrismDialog>('#demo-dialog')?.show();
}
function toggle(label: string, value: boolean, set: (value: boolean) => void) {
  return html`<label class="inspector-toggle"
    ><span>${label}</span
    ><input
      type="checkbox"
      role="switch"
      .checked=${value}
      @change=${(e: Event) => {
        set((e.target as HTMLInputElement).checked);
        draw();
      }}
  /></label>`;
}
function inspector() {
  return html`<aside class="inspector">
    <div class="inspector-title"><span>Playground</span><span class="sliders">☷</span></div>
    <p class="inspector-intro">A little room to experiment.</p>
    ${
      active === 'button'
        ? html`<label class="control-label"
            >Variant<select
              .value=${variant}
              @change=${(e: Event) => {
                variant = (e.target as HTMLSelectElement).value;
                draw();
              }}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="ghost">Ghost</option>
              <option value="danger">Danger</option>
            </select></label
          >`
        : ''
    }${['button', 'text-field', 'textarea', 'select', 'checkbox', 'switch'].includes(active) ? toggle('Disabled', disabled, (v) => (disabled = v)) : ''}${['button', 'progress'].includes(active) ? toggle(active === 'progress' ? 'Indeterminate' : 'Loading', loading, (v) => (loading = v)) : ''}${['text-field', 'textarea', 'select', 'status'].includes(active) ? toggle('Error state', error, (v) => (error = v)) : ''}${['checkbox', 'switch', 'accordion', 'text-field'].includes(active) ? toggle(active === 'accordion' ? 'Expanded' : active === 'text-field' ? 'Required' : 'Checked', checked, (v) => (checked = v)) : ''}${
      active === 'progress'
        ? html`<label class="control-label"
            >Completion <span>${progress}%</span
            ><input
              type="range"
              min="0"
              max="100"
              .value=${String(progress)}
              @input=${(e: Event) => {
                progress = Number((e.target as HTMLInputElement).value);
                draw();
              }}
          /></label>`
        : ''
    }
    <div class="inspector-divider"></div>
    <div class="control-label">
      Corner radius <span>${radius}px</span
      ><input
        aria-label="Corner radius"
        type="range"
        min="0"
        max="20"
        .value=${String(radius)}
        @input=${(e: Event) => {
          radius = Number((e.target as HTMLInputElement).value);
          applyTheme();
          draw();
        }}
      />
    </div>
    <div class="control-label">Accent color</div>
    <div class="accent-options">
      ${Object.entries(colors).map(
        ([name, color]) =>
          html`<button
            style=${`--swatch:${color[0]}`}
            class=${accent === name ? 'chosen' : ''}
            aria-label=${`${name} accent`}
            aria-pressed=${accent === name}
            @click=${() => {
              accent = name;
              applyTheme();
              draw();
            }}
          ></button>`,
      )}
    </div>
    <button
      class="reset-button"
      @click=${() => {
        reset();
        radius = 8;
        accent = 'violet';
        applyTheme();
        draw();
      }}
    >
      ↺ Reset playground
    </button>
    <div class="inspector-tip">
      <span aria-hidden="true">⌘</span>
      <p>Real components.<br />Go ahead, interact.</p>
    </div>
  </aside>`;
}
function tokens() {
  return html`<div class="section-kicker">FOUNDATIONS / 01</div>
    <h1>Small details.<br />One clear language.</h1>
    <p class="intro">
      A considered set of variables connects every component. Change a token and see the whole
      system move together.
    </p>
    <section class="token-panel">
      <div class="section-heading">
        <h2>Color with purpose.</h2>
        <span>Semantic, theme-aware tokens</span>
      </div>
      <div class="palette">
        ${[
          ['Accent', '--prism-accent'],
          ['Surface', '--prism-surface'],
          ['Text', '--prism-text'],
          ['Subtle', '--prism-subtle'],
          ['Success', '--prism-success-bg'],
          ['Warning', '--prism-warning-bg'],
        ].map(
          ([name, token]) =>
            html`<div>
              <div class="color-sample" style=${`background:var(${token})`}></div>
              <strong>${name}</strong><code>${token}</code>
            </div>`,
        )}
      </div>
      <div class="token-controls">
        <label
          >Corner radius <strong>${radius}px</strong
          ><input
            aria-label="Token radius"
            type="range"
            min="0"
            max="20"
            .value=${String(radius)}
            @input=${(e: Event) => {
              radius = Number((e.target as HTMLInputElement).value);
              applyTheme();
              draw();
            }}
        /></label>
        <div>
          <span>Accent family</span>
          <div class="accent-options">
            ${Object.entries(colors).map(
              ([name, color]) =>
                html`<button
                  style=${`--swatch:${color[0]}`}
                  aria-label=${`${name} accent`}
                  aria-pressed=${accent === name}
                  class=${accent === name ? 'chosen' : ''}
                  @click=${() => {
                    accent = name;
                    applyTheme();
                    draw();
                  }}
                ></button>`,
            )}
          </div>
        </div>
        <button
          class="text-button"
          @click=${() => {
            radius = 8;
            accent = 'violet';
            applyTheme();
            draw();
          }}
        >
          Reset tokens ↺
        </button>
      </div>
    </section>
    <section class="token-example">
      <div>
        <span class="eyebrow">CONNECTED BY DESIGN</span>
        <h2>Your tokens.<br />Every component.</h2>
        <p>
          Scoped styles stay inside each shadow root. Custom properties carry your decisions
          through.
        </p>
        <button
          class="text-button"
          @click=${() => copy(`:root {\n  --prism-accent: ${colors[accent][theme === 'dark' ? 1 : 0]};\n  --prism-radius: ${radius}px;\n}`)}
        >
          ${copied ? 'Copied ✓' : 'Copy CSS tokens ↗'}
        </button>
      </div>
      <div class="token-example-controls">
        <prism-badge tone="accent">Workspace settings</prism-badge
        ><prism-text-field label="Workspace name" value="Studio North"></prism-text-field
        ><prism-switch label="Weekly project digest" checked></prism-switch
        ><prism-button @click=${() => announce('Preview settings saved in this session.')}
          >Save changes ↗</prism-button
        >
      </div>
    </section>
    <section class="type-space">
      <div>
        <h2>Type that gets out of the way.</h2>
        <p class="type-large">Clarity comes naturally.</p>
        <code>Geist · 14 / 16 / 24 / 48</code>
      </div>
      <div>
        <h2>A rhythm to build on.</h2>
        <div class="spacing-bars">
          ${[4, 8, 12, 16, 24, 32].map((n) => html`<div><i style=${`width:${n * 3}px`}></i><code>${n}px</code></div>`)}
        </div>
      </div>
    </section>
    <p class="limit-note">
      Focus: 3px ring + 3px offset · motion: 150ms, 0ms with reduced motion · space tokens: 4–32px.
      Layout spacing belongs to the consumer.
    </p>`;
}
function guide() {
  return html`<span class="section-kicker">A GOOD PLACE TO START</span>
    <h1>Just add HTML.</h1>
    <p class="intro">
      A small library, built on the web platform. No framework required. Take a look around, then
      make something of your own.
    </p>
    <div class="guide-grid">
      <section>
        <span class="step-number">01</span>
        <h2>Build the local package.</h2>
        <p>
          Clone this repository and run the package build. This portfolio package is intentionally
          not published to npm.
        </p>
        <pre>
npm ci
npm run build:package</pre>
      </section>
      <section>
        <span class="step-number">02</span>
        <h2>Import and compose.</h2>
        <p>
          Your bundler resolves the package export. Import tokens once, then use the custom elements
          in ordinary HTML.
        </p>
        <pre>
import '@khalilbenali/prism-web-components';
import '@khalilbenali/prism-web-components/tokens.css';</pre>
      </section>
    </div>
    <a class="example-callout" href="./examples/index.html"
      ><div>
        <span class="eyebrow">THE WHOLE PICTURE</span>
        <h2>A real HTML settings form.</h2>
        <p>
          Required validation, native FormData, reset, a modal and live feedback — consuming the
          built package.
        </p>
      </div>
      <span class="callout-arrow">↗</span></a
    >
    <section class="guide-notes">
      <h2>Thoughtful foundations. Honest boundaries.</h2>
      <p>
        Shadow DOM scopes component styles. CSS custom properties and parts offer intentional ways
        in. Typed events are composed and bubble. Form controls use ElementInternals and need a
        modern browser.
      </p>
      <p>
        Keyboard and automated accessibility checks target WCAG 2.2 AA. This is not certification.
        There has been no broad screen reader, legacy browser, localization, right-to-left, or
        nested-shadow form integration audit. See each component’s keyboard notes and the repository
        documentation.
      </p>
      <a
        href="https://github.com/khalilBenAli1/prism-web-components"
        target="_blank"
        rel="noreferrer"
        >Read the source and limitations ↗</a
      >
    </section>`;
}
function draw() {
  applyTheme();
  const doc = components.find((c) => c.id === active);
  if (!doc && !['tokens', 'start'].includes(active)) active = 'button';
  const current = components.find((c) => c.id === active) ?? components[0];
  document.title = `${active === 'tokens' ? 'Design tokens' : active === 'start' ? 'Get started' : current.name} — Prism`;
  render(
    html`<a class="skip-link" href="#main-content">Skip to content</a>
      <header class="topbar">
        <a class="brand" href="#button" @click=${() => go('button')} aria-label="Prism home"
          ><svg width="29" height="29" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16 2 31 28H1Z" fill="currentColor" />
            <path d="M16 2v26h15Z" fill="#b59af8" />
            <path d="M16 2 9 28h7Z" fill="#8b67ed" /></svg
          ><span>prism</span><span class="version">v0.1</span></a
        ><span class="topbar-caption">Thoughtfully built. Naturally web.</span>
        <div class="top-actions">
          <button
            class="theme-button"
            aria-label=${theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            @click=${() => {
              theme = theme === 'light' ? 'dark' : 'light';
              draw();
            }}
          >
            <span aria-hidden="true">${theme === 'light' ? '☾' : '☀'}</span
            ><span class="theme-word">${theme === 'light' ? 'Light' : 'Dark'}</span></button
          ><a
            class="github-link"
            href="https://github.com/khalilBenAli1/prism-web-components"
            aria-label="Prism source on GitHub"
            >GitHub <span aria-hidden="true">↗</span></a
          ><button
            class="menu-button"
            aria-label="Toggle component navigation"
            aria-expanded=${mobileMenu}
            @click=${() => {
              mobileMenu = !mobileMenu;
              draw();
            }}
          >
            ☰
          </button>
        </div>
      </header>
      <div class="shell">
        <nav class=${`sidebar ${mobileMenu ? 'is-open' : ''}`} aria-label="Component navigation">
          <label class="search"
            ><span aria-hidden="true">⌕</span
            ><input
              type="search"
              placeholder="Find a component…"
              aria-label="Find a component"
              .value=${query}
              @input=${(e: Event) => {
                query = (e.target as HTMLInputElement).value;
                draw();
              }}
            /><span class="search-key">12</span></label
          >
          <div class="nav-section-label">FOUNDATIONS</div>
          <a
            class=${`nav-item ${active === 'start' ? 'active' : ''}`}
            href="#start"
            @click=${() => go('start')}
            ><span aria-hidden="true">↗</span> Get started</a
          ><a
            class=${`nav-item ${active === 'tokens' ? 'active' : ''}`}
            href="#tokens"
            @click=${() => go('tokens')}
            ><span aria-hidden="true">◈</span> Design tokens <i class="new-dot"></i
          ></a>
          <div class="nav-section-label components-label">COMPONENTS <span>12</span></div>
          ${['Actions', 'Forms', 'Navigation', 'Overlays', 'Disclosure', 'Feedback'].map(
            (group) => {
              const matches = components.filter(
                (c) => c.group === group && c.name.toLowerCase().includes(query.toLowerCase()),
              );
              return matches.length
                ? html`<div class="nav-group">${group}</div>
                    ${matches.map((c) => html`<a class=${`nav-item ${active === c.id ? 'active' : ''}`} href=${`#${c.id}`} @click=${() => go(c.id)}><span class="nav-icon" aria-hidden="true">${glyphs[c.id]}</span>${c.name}${active === c.id ? html`<span class="active-dot"></span>` : ''}</a>`)}`
                : '';
            },
          )}${
            !components.some((c) => c.name.toLowerCase().includes(query.toLowerCase()))
              ? html`<p class="no-results">
                  No components found.<button
                    @click=${() => {
                      query = '';
                      draw();
                    }}
                  >
                    Clear search
                  </button>
                </p>`
              : ''
          }<a class="sidebar-bottom" href="./examples/index.html"
            ><span class="example-icon">⌘</span>
            <div><strong>See it come together</strong><span>Open the HTML example ↗</span></div></a
          >
          <div class="sidebar-foot">Made for the modern web <span>↗</span></div>
        </nav>
        ${
          mobileMenu
            ? html`<button
                class="nav-scrim"
                aria-label="Close component navigation"
                @click=${() => {
                  mobileMenu = false;
                  draw();
                }}
              ></button>`
            : ''
        }
        <main id="main-content" tabindex="-1">
          <div class="breadcrumb">
            Prism
            <span>/</span>
            ${active === 'tokens' || active === 'start' ? 'Foundations' : 'Components'}
            <span>/</span>
            <strong
              >${active === 'tokens' ? 'Design tokens' : active === 'start' ? 'Get started' : current.name}</strong
            >
          </div>
          ${
            active === 'tokens'
              ? tokens()
              : active === 'start'
                ? guide()
                : html`<div class="component-heading">
                      <div>
                        <div class="section-kicker">
                          ${current.group.toUpperCase()} /
                          ${String(components.indexOf(current) + 1).padStart(2, '0')}
                        </div>
                        <h1>${current.name}<span class="heading-dot">.</span></h1>
                      </div>
                      <prism-badge tone="success"
                        ><span class="badge-dot"></span> Stable API · demo</prism-badge
                      >
                    </div>
                    <p class="intro">${current.description}</p>
                    <div class="doc-tabs" role="tablist" aria-label="Documentation views">
                      ${[
                        ['preview', 'Preview'],
                        ['api', 'API reference'],
                        ['accessibility', 'Accessibility'],
                      ].map(
                        ([id, label]) =>
                          html`<button
                            role="tab"
                            id=${`docs-${id}`}
                            aria-selected=${view === id}
                            aria-controls="docs-panel"
                            tabindex=${view === id ? 0 : -1}
                            @keydown=${(e: KeyboardEvent) => {
                              const ids = ['preview', 'api', 'accessibility'];
                              const i = ids.indexOf(view);
                              const n =
                                e.key === 'ArrowRight'
                                  ? (i + 1) % 3
                                  : e.key === 'ArrowLeft'
                                    ? (i + 2) % 3
                                    : e.key === 'Home'
                                      ? 0
                                      : e.key === 'End'
                                        ? 2
                                        : -1;
                              if (n >= 0) {
                                e.preventDefault();
                                view = ids[n];
                                draw();
                                document.querySelector<HTMLButtonElement>(`#docs-${view}`)?.focus();
                              }
                            }}
                            @click=${() => {
                              view = id;
                              draw();
                            }}
                          >
                            ${id === 'preview' ? html`<span aria-hidden="true">◫</span>` : ''}${label}
                          </button>`,
                      )}
                    </div>
                    <div
                      id="docs-panel"
                      role="tabpanel"
                      aria-labelledby=${`docs-${view}`}
                      tabindex="0"
                    >
                      ${
                        view === 'preview'
                          ? html`<div class="workbench">
                                <section class="canvas-wrap" aria-label="Live component preview">
                                  <div class="canvas-top">
                                    <span><span class="live-dot"></span> LIVE PREVIEW</span>
                                    <div class="canvas-tools">
                                      <button
                                        aria-label="Full width preview"
                                        aria-pressed=${!narrow}
                                        @click=${() => {
                                          narrow = false;
                                          draw();
                                        }}
                                      >
                                        ▱</button
                                      ><button
                                        aria-label="Compact preview"
                                        aria-pressed=${narrow}
                                        @click=${() => {
                                          narrow = true;
                                          draw();
                                        }}
                                      >
                                        ▯</button
                                      ><span class="canvas-separator"></span><span>100%</span>
                                    </div>
                                  </div>
                                  <div class=${`canvas ${narrow ? 'compact' : ''}`}>
                                    <div class="canvas-demo">
                                      ${renderDemo(
                                        {
                                          active,
                                          variant,
                                          disabled,
                                          loading,
                                          checked,
                                          error,
                                          progress,
                                        },
                                        {
                                          announce,
                                          showDialog,
                                          onCheckedChange: (value) => {
                                            checked = value;
                                            draw();
                                          },
                                        },
                                      )}
                                    </div>
                                    <span class="canvas-bottom">&lt;prism-${active}&gt;</span>
                                  </div>
                                </section>
                                ${inspector()}
                              </div>
                              <div class="code-panel">
                                <div class="code-heading">
                                  <span
                                    ><span class="code-dot"></span> Usage
                                    <span class="code-language">HTML</span></span
                                  ><button @click=${() => copy(current.snippet)}>
                                    ${copied ? 'Copied ✓' : 'Copy code ⧉'}
                                  </button>
                                </div>
                                <pre><code>${current.snippet}</code></pre>
                              </div>
                              <section class="under-preview">
                                <div>
                                  <span class="under-icon">◎</span>
                                  <h2>Native at heart.</h2>
                                  <p>
                                    Familiar platform behavior.<br />A considered layer of design.
                                  </p>
                                </div>
                                <div>
                                  <span class="under-icon">◈</span>
                                  <h2>Yours to shape.</h2>
                                  <p>
                                    Tokens and shadow parts.<br />One language, your expression.
                                  </p>
                                </div>
                                <a href="./examples/index.html"
                                  >Try it in a real form <span>↗</span></a
                                >
                              </section>`
                          : view === 'api'
                            ? html`<section class="api-section">
                                <h2>A small, explicit contract.</h2>
                                <div class="table-scroll">
                                  <table>
                                    <thead>
                                      <tr>
                                        <th>Property / attribute</th>
                                        <th>Type</th>
                                        <th>Default</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      ${current.properties.map(
                                        (p) =>
                                          html`<tr>
                                            ${p.map((value) => html`<td><code>${value}</code></td>`)}
                                          </tr>`,
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                                <h3>Slots & styling</h3>
                                <p>${current.slots}</p>
                                <h3>Events</h3>
                                <p>${current.events}</p>
                                <p class="limit-note">
                                  Boolean attributes use presence (disabled="false" is still
                                  disabled). Use properties for live values. CSS variables inherit
                                  through shadow roots; import tokens.css once.
                                </p>
                              </section>`
                            : html`<section class="accessibility-section">
                                <div class="a11y-mark" aria-hidden="true">◎</div>
                                <h2>Predictable by design.</h2>
                                <p>${current.keyboard}</p>
                                <h3>Built and checked with care.</h3>
                                <p>
                                  Visible focus, native semantics, reduced motion and both light and
                                  dark themes. Automated axe checks and Chromium/WebKit keyboard
                                  tests support a WCAG 2.2 AA target.
                                </p>
                                <p class="limit-note">
                                  No accessibility certification is claimed. Screen reader,
                                  localization, high contrast OS modes and older browsers need
                                  further evaluation for your product.
                                </p>
                                <a href="https://www.w3.org/WAI/WCAG22/quickref/"
                                  >Explore the WCAG guidance ↗</a
                                >
                              </section>`
                      }
                    </div>`
          }
          <div class="feedback" aria-live="polite">${feedback}</div>
          <footer class="page-footer">
            <span>Small components. Thoughtful possibilities.</span
            ><span>Prism · Original portfolio study · 2026</span>
          </footer>
        </main>
      </div>`,
    app,
  );
}
window.addEventListener('hashchange', () => {
  const id = location.hash.slice(1);
  if (id !== 'main-content' && id !== active) go(id);
});
draw();
