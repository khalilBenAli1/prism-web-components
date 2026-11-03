import { LitElement, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { shared, fieldStyles } from './styles';
export interface PrismValueDetail {
  value: string;
}
export interface PrismCheckedDetail {
  checked: boolean;
  value: string;
}
export abstract class PrismField extends LitElement {
  static formAssociated = true;
  static properties = {
    label: {},
    name: { reflect: true },
    value: {},
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    error: {},
    hint: {},
    placeholder: {},
    type: {},
    autocomplete: {},
    rows: { type: Number },
  };
  label = '';
  name = '';
  value = '';
  disabled = false;
  required = false;
  error = '';
  hint = '';
  placeholder = '';
  type = 'text';
  autocomplete = 'off';
  rows = 4;
  protected internals = this.attachInternals();
  private fieldsetDisabled = false;
  protected get isDisabled() {
    return this.disabled || this.fieldsetDisabled;
  }
  static styles = [shared, fieldStyles];
  protected get control() {
    return this.renderRoot.querySelector<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >('input,textarea,select');
  }
  updated() {
    this.sync();
  }
  protected sync() {
    const control = this.control;
    this.internals.setFormValue(this.isDisabled ? null : this.value);
    if (!control) return;
    if (this.error) this.internals.setValidity({ customError: true }, this.error, control);
    else this.internals.setValidity(control.validity, control.validationMessage, control);
  }
  protected input(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    this.sync();
    this.dispatchEvent(
      new CustomEvent<PrismValueDetail>('prism-input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }
  protected change() {
    this.dispatchEvent(
      new CustomEvent<PrismValueDetail>('prism-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }
  protected enter(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.localName === 'prism-text-field') {
      event.preventDefault();
      this.internals.form?.requestSubmit();
    }
  }
  formResetCallback() {
    this.value = this.getAttribute('value') ?? '';
    this.error = '';
  }
  formDisabledCallback(disabled: boolean) {
    this.fieldsetDisabled = disabled;
    this.requestUpdate();
  }
  formStateRestoreCallback(state: string | File | FormData | null) {
    if (typeof state === 'string') this.value = state;
  }
  checkValidity() {
    this.sync();
    return this.internals.checkValidity();
  }
  reportValidity() {
    this.sync();
    return this.internals.reportValidity();
  }
  focus(options?: FocusOptions) {
    this.control?.focus(options);
  }
  protected help() {
    return html`${this.error ? html`<small id="help" class="error">${this.error}</small>` : html`<small id="help">${this.hint}</small>`}`;
  }
}
export class PrismTextField extends PrismField {
  render() {
    return html`<label
        >${this.label}${this.required ? ' *' : ''}<input
          part="control"
          .type=${this.type}
          .value=${this.value}
          ?disabled=${this.isDisabled}
          ?required=${this.required}
          placeholder=${this.placeholder}
          autocomplete=${this.autocomplete}
          aria-invalid=${Boolean(this.error)}
          aria-describedby="help"
          @input=${this.input}
          @change=${this.change}
          @keydown=${this.enter} /></label
      >${this.help()}`;
  }
}
export class PrismTextarea extends PrismField {
  render() {
    return html`<label
        >${this.label}${this.required ? ' *' : ''}<textarea
          part="control"
          .value=${this.value}
          rows=${this.rows}
          ?disabled=${this.isDisabled}
          ?required=${this.required}
          placeholder=${this.placeholder}
          aria-invalid=${Boolean(this.error)}
          aria-describedby="help"
          @input=${this.input}
          @change=${this.change}
        ></textarea></label
      >${this.help()}`;
  }
}
export class PrismSelect extends PrismField {
  private options: { value: string; label: string; disabled: boolean }[] = [];
  private readOptions() {
    this.options = Array.from(this.querySelectorAll('option')).map((o) => ({
      value: o.value,
      label: o.text,
      disabled: o.disabled,
    }));
    this.requestUpdate();
  }
  render() {
    return html`<label
        >${this.label}${this.required ? ' *' : ''}<select
          part="control"
          .value=${this.value}
          ?disabled=${this.isDisabled}
          ?required=${this.required}
          aria-invalid=${Boolean(this.error)}
          aria-describedby="help"
          @input=${this.input}
          @change=${this.change}
        >
          ${this.options.map((o) => html`<option value=${o.value} ?selected=${o.value === this.value} ?disabled=${o.disabled}>${o.label}</option>`)}
        </select></label
      ><slot hidden @slotchange=${this.readOptions}></slot>${this.help()}`;
  }
}
export class PrismCheckbox extends LitElement {
  static formAssociated = true;
  static properties = {
    label: {},
    name: { reflect: true },
    value: {},
    checked: { type: Boolean },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    hint: {},
  };
  label = '';
  name = '';
  value = 'on';
  checked = false;
  disabled = false;
  required = false;
  hint = '';
  protected internals = this.attachInternals();
  private fieldsetDisabled = false;
  protected get isDisabled() {
    return this.disabled || this.fieldsetDisabled;
  }
  static styles = [shared, fieldStyles];
  updated() {
    this.internals.setFormValue(this.checked && !this.isDisabled ? this.value : null);
    const control = this.renderRoot.querySelector('input');
    if (control) this.internals.setValidity(control.validity, control.validationMessage, control);
  }
  protected toggle(event: Event) {
    this.checked = (event.target as HTMLInputElement).checked;
    this.dispatchEvent(
      new CustomEvent<PrismCheckedDetail>('prism-change', {
        detail: { checked: this.checked, value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }
  formResetCallback() {
    this.checked = this.hasAttribute('checked');
  }
  formDisabledCallback(disabled: boolean) {
    this.fieldsetDisabled = disabled;
    this.requestUpdate();
  }
  formStateRestoreCallback(state: string | File | FormData | null) {
    this.checked = state === this.value;
  }
  focus(options?: FocusOptions) {
    this.renderRoot.querySelector('input')?.focus(options);
  }
  protected get switchRole() {
    return undefined as string | undefined;
  }
  render() {
    return html`<style>
        label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
          cursor: pointer;
        }
        input {
          width: 18px;
          min-height: 18px;
          margin: 0;
          accent-color: var(--prism-accent, #6941d9);
        }
        :host([disabled]) label {
          cursor: not-allowed;
        }
        :host(prism-switch) input {
          appearance: none;
          position: relative;
          width: 38px;
          height: 23px;
          min-height: 23px;
          border: 0;
          border-radius: 20px;
          background: var(--prism-border, #d8d5e0);
          padding: 0;
          flex-shrink: 0;
        }
        :host(prism-switch) input::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 1px 3px #0003;
          transition: transform var(--prism-motion, 150ms);
        }
        :host(prism-switch) input:checked {
          background: var(--prism-accent, #6941d9);
        }
        :host(prism-switch) input:checked::after {
          transform: translateX(15px);
        }
        label {
          min-height: 44px;
        }</style
      ><label
        ><input
          part="control"
          type="checkbox"
          role=${ifDefined(this.switchRole)}
          .checked=${this.checked}
          ?disabled=${this.isDisabled}
          ?required=${this.required}
          aria-describedby="help"
          @change=${this.toggle}
        />${this.label}</label
      ><small id="help">${this.hint}</small>`;
  }
}
export class PrismSwitch extends PrismCheckbox {
  protected get switchRole() {
    return 'switch';
  }
}
