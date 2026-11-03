import { PrismButton } from './button';
import { PrismTextField, PrismTextarea, PrismCheckbox, PrismSwitch, PrismSelect } from './fields';
import { PrismTabs, PrismDialog, PrismAccordion } from './disclosure';
import { PrismBadge, PrismProgress, PrismStatus } from './feedback';
export {
  PrismButton,
  PrismTextField,
  PrismTextarea,
  PrismCheckbox,
  PrismSwitch,
  PrismSelect,
  PrismTabs,
  PrismDialog,
  PrismAccordion,
  PrismBadge,
  PrismProgress,
  PrismStatus,
};
export type { PrismValueDetail, PrismCheckedDetail } from './fields';
const elements = {
  'prism-button': PrismButton,
  'prism-text-field': PrismTextField,
  'prism-textarea': PrismTextarea,
  'prism-checkbox': PrismCheckbox,
  'prism-switch': PrismSwitch,
  'prism-select': PrismSelect,
  'prism-tabs': PrismTabs,
  'prism-dialog': PrismDialog,
  'prism-accordion': PrismAccordion,
  'prism-badge': PrismBadge,
  'prism-progress': PrismProgress,
  'prism-status': PrismStatus,
};
for (const [name, element] of Object.entries(elements)) {
  if (!customElements.get(name)) customElements.define(name, element);
}
declare global {
  interface HTMLElementTagNameMap {
    'prism-button': PrismButton;
    'prism-text-field': PrismTextField;
    'prism-textarea': PrismTextarea;
    'prism-checkbox': PrismCheckbox;
    'prism-switch': PrismSwitch;
    'prism-select': PrismSelect;
    'prism-tabs': PrismTabs;
    'prism-dialog': PrismDialog;
    'prism-accordion': PrismAccordion;
    'prism-badge': PrismBadge;
    'prism-progress': PrismProgress;
    'prism-status': PrismStatus;
  }
}
