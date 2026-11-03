import { LitElement, html, css } from 'lit';
import { shared } from './styles';
export class PrismButton extends LitElement {
  static properties = {
    variant: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    type: {},
  };
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
  disabled = false;
  loading = false;
  type: 'button' | 'submit' | 'reset' = 'button';
  static styles = [
    shared,
    css`
      :host {
        display: inline-block;
      }
      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 44px;
        padding: 10px 18px;
        border: 1px solid transparent;
        border-radius: var(--prism-radius, 8px);
        background: var(--prism-accent, #6941d9);
        color: var(--prism-on-accent, #fff);
        font-weight: 600;
        transition: filter var(--prism-motion, 150ms);
      }
      button:hover:not(:disabled) {
        filter: brightness(0.92);
      }
      .secondary {
        color: var(--prism-text, #23212b);
        border-color: var(--prism-border, #d8d5e0);
        background: var(--prism-surface, white);
      }
      .ghost {
        background: transparent;
        color: var(--prism-text, #23212b);
      }
      .danger {
        background: var(--prism-danger, #b42336);
        color: var(--prism-on-danger, white);
      }
      .spinner {
        height: 14px;
        width: 14px;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ];
  focus(options?: FocusOptions) {
    this.renderRoot.querySelector('button')?.focus(options);
  }
  private activate() {
    if (this.disabled || this.loading) return;
    this.focus();
    const form = this.closest('form');
    if (this.type === 'submit') form?.requestSubmit();
    if (this.type === 'reset') form?.reset();
  }
  render() {
    return html`<button
      part="control"
      class=${this.variant}
      ?disabled=${this.disabled || this.loading}
      aria-busy=${this.loading}
      @click=${this.activate}
    >
      ${this.loading ? html`<span class="spinner" aria-hidden="true"></span>` : ''}<slot></slot>
    </button>`;
  }
}
