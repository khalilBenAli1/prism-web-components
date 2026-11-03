import { LitElement, html, css } from 'lit';
import { shared } from './styles';
export class PrismBadge extends LitElement {
  static properties = { tone: { reflect: true } };
  tone: 'neutral' | 'success' | 'warning' | 'accent' = 'neutral';
  static styles = [
    shared,
    css`
      :host {
        display: inline-flex;
        font-size: 12px;
        font-weight: 600;
        padding: 3px 9px;
        border-radius: 5px;
        background: var(--prism-subtle, #efedf4);
        color: var(--prism-text, #23212b);
      }
      :host([tone='success']) {
        background: var(--prism-success-bg, #e7f4ed);
        color: var(--prism-success, #23603e);
      }
      :host([tone='warning']) {
        background: var(--prism-warning-bg, #fff1d1);
        color: var(--prism-warning, #7b4b00);
      }
      :host([tone='accent']) {
        background: var(--prism-accent-soft, #eee8ff);
        color: var(--prism-accent, #6941d9);
      }
    `,
  ];
  render() {
    return html`<span part="label"><slot></slot></span>`;
  }
}
export class PrismProgress extends LitElement {
  static properties = {
    value: { type: Number },
    max: { type: Number },
    label: {},
    indeterminate: { type: Boolean },
  };
  value = 40;
  max = 100;
  label = 'Progress';
  indeterminate = false;
  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 13px;
      }
      progress {
        appearance: none;
        width: 100%;
        height: 8px;
        display: block;
        border: 0;
        border-radius: 8px;
        overflow: hidden;
        background: var(--prism-subtle, #efedf4);
        accent-color: var(--prism-accent, #6941d9);
      }
      progress::-webkit-progress-bar {
        background: var(--prism-subtle, #efedf4);
        border-radius: 8px;
      }
      progress::-webkit-progress-value {
        background: var(--prism-accent, #6941d9);
        border-radius: 8px;
      }
      progress::-moz-progress-bar {
        background: var(--prism-accent, #6941d9);
        border-radius: 8px;
      }
    `,
  ];
  render() {
    const max = Number.isFinite(this.max) && this.max > 0 ? this.max : 100;
    const value = Number.isFinite(this.value) ? Math.max(0, Math.min(this.value, max)) : 0;
    return html`<div class="label">
        <span id="label">${this.label}</span
        ><span>${this.indeterminate ? 'In progress' : `${Math.round((value / max) * 100)}%`}</span>
      </div>
      ${this.indeterminate ? html`<progress part="track" aria-labelledby="label" max=${max}></progress>` : html`<progress part="track" aria-labelledby="label" max=${max} value=${value}></progress>`}`;
  }
}
export class PrismStatus extends LitElement {
  static properties = { message: {}, tone: {}, dismissible: { type: Boolean } };
  message = '';
  tone: 'info' | 'success' | 'error' = 'success';
  dismissible = false;
  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .notice {
        display: flex;
        align-items: center;
        gap: 12px;
        background: var(--prism-success-bg, #e7f4ed);
        border: 1px solid var(--prism-border, #d8d5e0);
        padding: 12px 16px;
        border-radius: var(--prism-radius, 8px);
      }
      .error {
        background: var(--prism-danger-bg, #fff0f2);
      }
      .info {
        background: var(--prism-accent-soft, #eee8ff);
      }
      .mark {
        font-size: 18px;
      }
      button {
        margin-left: auto;
        color: inherit;
        background: none;
        border: 0;
        min-height: 32px;
        min-width: 32px;
        font-size: 20px;
      }
      :host([hidden]) {
        display: none;
      }
    `,
  ];
  render() {
    return html`<div role="status" aria-live="polite" aria-atomic="true">
      ${
        this.message
          ? html`<div part="container" class=${`notice ${this.tone}`}>
              <span class="mark" aria-hidden="true"
                >${this.tone === 'success' ? '✓' : this.tone === 'error' ? '!' : 'i'}</span
              ><span>${this.message}</span>${
                this.dismissible
                  ? html`<button
                      aria-label="Dismiss notification"
                      @click=${() => {
                        this.message = '';
                        this.dispatchEvent(
                          new CustomEvent('prism-dismiss', { bubbles: true, composed: true }),
                        );
                      }}
                    >
                      ×
                    </button>`
                  : ''
              }
            </div>`
          : ''
      }
    </div>`;
  }
}
