import { css } from 'lit';
export const shared = css`
  :host {
    font-family: var(--prism-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
    color: var(--prism-text, #23212b);
    font-size: 14px;
    line-height: 1.5;
    box-sizing: border-box;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  button,
  input,
  select,
  textarea {
    font: inherit;
  }
  :focus-visible {
    outline: 3px solid var(--prism-focus, #6c4ee3);
    outline-offset: 3px;
  }
  button {
    cursor: pointer;
  }
  button:disabled,
  input:disabled,
  select:disabled,
  textarea:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;
export const fieldStyles = css`
  :host {
    display: block;
  }
  label {
    display: grid;
    gap: 8px;
    font-weight: 600;
  }
  input,
  textarea,
  select {
    width: 100%;
    min-height: 44px;
    color: inherit;
    background: var(--prism-surface, #fff);
    border: 1px solid var(--prism-border, #d8d5e0);
    border-radius: var(--prism-radius, 8px);
    padding: 10px 12px;
    font-weight: 400;
  }
  textarea {
    min-height: 110px;
    resize: vertical;
  }
  [aria-invalid='true'] {
    border-color: var(--prism-danger, #b42336);
  }
  small {
    display: block;
    margin-top: 7px;
    color: var(--prism-muted, #686371);
    font-size: 12px;
  }
  .error {
    color: var(--prism-danger, #b42336);
  }
`;
