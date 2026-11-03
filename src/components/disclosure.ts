import { LitElement, html, css, type PropertyValues } from 'lit';
import { shared } from './styles';
import { tabDestination } from '../domain/interaction';
import { activeElement, focusableElements } from './focus';
export class PrismTabs extends LitElement {
  static properties = { labels: {}, selected: { type: Number, reflect: true }, label: {} };
  labels = 'Overview,Details,Activity';
  selected = 0;
  label = 'Sections';
  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      [role='tablist'] {
        display: flex;
        border-bottom: 1px solid var(--prism-border, #d8d5e0);
        gap: 20px;
        overflow-x: auto;
      }
      button {
        flex-shrink: 0;
        min-height: 46px;
        border: 0;
        border-bottom: 2px solid transparent;
        background: none;
        color: var(--prism-muted, #686371);
        padding: 8px 2px;
        font-weight: 500;
      }
      [aria-selected='true'] {
        color: var(--prism-accent, #6941d9);
        border-color: currentColor;
      }
      [role='tabpanel'] {
        padding-top: 20px;
      }
      [hidden] {
        display: none;
      }
    `,
  ];
  private get names() {
    return this.labels
      .split(',')
      .map((label) => label.trim())
      .filter(Boolean);
  }
  private select(index: number, focus = false) {
    this.selected = index;
    this.dispatchEvent(
      new CustomEvent<{ selected: number }>('prism-change', {
        detail: { selected: index },
        bubbles: true,
        composed: true,
      }),
    );
    if (focus)
      void this.updateComplete.then(() =>
        this.renderRoot.querySelectorAll<HTMLButtonElement>('[role=tab]')[index]?.focus(),
      );
  }
  private key(event: KeyboardEvent) {
    const count = this.names.length;
    const next = tabDestination(event.key, this.selected, count);
    if (next !== null) {
      event.preventDefault();
      this.select(next, true);
    }
  }
  willUpdate() {
    if (this.selected < 0 || this.selected >= this.names.length) this.selected = 0;
  }
  render() {
    return html`<div role="tablist" aria-label=${this.label} @keydown=${this.key}>
        ${this.names.map((name, index) => html`<button part="tab" role="tab" id=${`tab-${index}`} aria-controls=${`panel-${index}`} aria-selected=${this.selected === index} tabindex=${this.selected === index ? 0 : -1} @click=${() => this.select(index)}>${name}</button>`)}
      </div>
      ${this.names.map((_, index) => html`<div part="panel" role="tabpanel" id=${`panel-${index}`} aria-labelledby=${`tab-${index}`} ?hidden=${this.selected !== index} tabindex="0"><slot name=${`panel-${index}`}></slot></div>`)}`;
  }
}
export class PrismDialog extends LitElement {
  static properties = { label: {}, open: { type: Boolean, reflect: true } };
  label = 'Dialog';
  open = false;
  private previousFocus: HTMLElement | null = null;
  static styles = [
    shared,
    css`
      dialog {
        color: inherit;
        background: var(--prism-surface, #fff);
        border: 1px solid var(--prism-border, #d8d5e0);
        border-radius: calc(var(--prism-radius, 8px) * 2);
        padding: 28px;
        max-width: min(480px, calc(100vw - 40px));
        width: 100%;
        box-shadow: 0 24px 100px #17102230;
      }
      dialog::backdrop {
        background: #18132270;
        backdrop-filter: blur(4px);
      }
      h2 {
        font-size: 22px;
        line-height: 1.25;
        margin: 0 35px 20px 0;
      }
      .close {
        position: absolute;
        right: 16px;
        top: 12px;
        border: 0;
        background: transparent;
        color: inherit;
        min-height: 44px;
        min-width: 44px;
        font-size: 24px;
      }
      footer {
        margin-top: 24px;
      }
    `,
  ];
  private get dialog() {
    return this.renderRoot.querySelector('dialog');
  }
  show() {
    this.open = true;
  }
  hide() {
    this.open = false;
  }
  updated(changed: PropertyValues) {
    if (changed.has('open')) {
      if (this.open && !this.dialog?.open) {
        const active = activeElement();
        this.previousFocus = active instanceof HTMLElement ? active : null;
        this.dialog?.showModal();
      } else if (!this.open && this.dialog?.open) this.dialog.close();
    }
  }
  private containFocus(event: KeyboardEvent) {
    if (event.key !== 'Tab' || !this.dialog) return;
    const controls = focusableElements(this.dialog);
    const first = controls[0];
    const last = controls.at(-1);
    const active = activeElement();
    if (event.shiftKey && active === first && last) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last && first) {
      event.preventDefault();
      first.focus();
    }
  }
  private closed() {
    this.open = false;
    this.previousFocus?.focus();
    this.dispatchEvent(new CustomEvent('prism-close', { bubbles: true, composed: true }));
  }
  render() {
    return html`<dialog
      part="panel"
      aria-labelledby="title"
      @keydown=${this.containFocus}
      @close=${this.closed}
      @cancel=${() => {
        this.open = false;
      }}
    >
      <h2 id="title">${this.label}</h2>
      <button class="close" aria-label="Close dialog" @click=${this.hide}>×</button><slot></slot>
      <footer><slot name="footer"></slot></footer>
    </dialog>`;
  }
}
export class PrismAccordion extends LitElement {
  static properties = { label: {}, open: { type: Boolean, reflect: true } };
  label = 'More information';
  open = false;
  static styles = [
    shared,
    css`
      :host {
        display: block;
        border-bottom: 1px solid var(--prism-border, #d8d5e0);
      }
      summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        list-style: none;
        cursor: pointer;
        font-weight: 600;
        padding: 18px 0;
        min-height: 48px;
      }
      summary::-webkit-details-marker {
        display: none;
      }
      summary::after {
        content: '+';
        font-size: 22px;
        font-weight: 400;
      }
      details[open] summary::after {
        content: '−';
      }
      .content {
        padding: 0 0 20px;
        color: var(--prism-muted, #686371);
      }
    `,
  ];
  render() {
    return html`<details
      part="container"
      .open=${this.open}
      @toggle=${(e: Event) => {
        this.open = (e.target as HTMLDetailsElement).open;
        this.dispatchEvent(
          new CustomEvent('prism-toggle', {
            detail: { open: this.open },
            bubbles: true,
            composed: true,
          }),
        );
      }}
    >
      <summary part="summary">${this.label}</summary>
      <div class="content" part="content"><slot></slot></div>
    </details>`;
  }
}
