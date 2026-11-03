export interface ComponentDoc {
  id: string;
  name: string;
  group: string;
  description: string;
  snippet: string;
  properties: [string, string, string][];
  slots: string;
  events: string;
  keyboard: string;
}
export const components: ComponentDoc[] = [
  {
    id: 'button',
    name: 'Button',
    group: 'Actions',
    description:
      'A small invitation to take the next step. Clear hierarchy, considered states, and a familiar native foundation.',
    snippet: '<prism-button variant="primary">Create project</prism-button>',
    properties: [
      ['variant', 'primary | secondary | ghost | danger', 'primary'],
      ['disabled', 'boolean', 'false'],
      ['loading', 'boolean', 'false'],
      ['type', 'button | submit | reset', 'button'],
    ],
    slots: 'Default: button label, including decorative icons. Part: control.',
    events:
      'Native click bubbles across the shadow boundary. Loading and disabled suppress activation.',
    keyboard:
      'Tab to focus. Space or Enter activates. A loading button is disabled. Submit/reset discovers the nearest ancestor form in the same document tree.',
  },
  {
    id: 'text-field',
    name: 'Text field',
    group: 'Forms',
    description:
      'Give every detail a place. A native input with a clear label, helpful context, and space for an honest error.',
    snippet:
      '<prism-text-field label="Project name" name="project" placeholder="A bright idea" required></prism-text-field>',
    properties: [
      ['label / hint / error', 'string', 'empty'],
      ['value / name / placeholder', 'string', 'empty'],
      ['type / autocomplete', 'native input string', 'text / off'],
      ['required / disabled', 'boolean', 'false'],
    ],
    slots: 'No slots. Part: control. label is required for an accessible name.',
    events:
      'prism-input {value: string}; prism-change {value: string}. Both bubble and are composed.',
    keyboard:
      'Native input editing. Enter requests form submission. Native required/type validity participates in the parent form through ElementInternals. Set an error to add custom validity.',
  },
  {
    id: 'textarea',
    name: 'Textarea',
    group: 'Forms',
    description:
      'Make room for a little more. A resizable writing surface that stays comfortable for a sentence or a story.',
    snippet:
      '<prism-textarea label="Project description" name="description" hint="A sentence or two is perfect." rows="4"></prism-textarea>',
    properties: [
      ['label / hint / error', 'string', 'empty'],
      ['value / name / placeholder', 'string', 'empty'],
      ['rows', 'number', '4'],
      ['required / disabled', 'boolean', 'false'],
    ],
    slots: 'No slots. Part: control.',
    events: 'prism-input {value: string}; prism-change {value: string}.',
    keyboard:
      'Native multiline editing. Enter inserts a new line. Required validity, reset, and disabled fieldsets participate in HTML forms.',
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    group: 'Forms',
    description:
      'An explicit yes, on your terms. Independent choices with a generous clickable label and native form behavior.',
    snippet:
      '<prism-checkbox label="Include starter files" name="starter" value="yes" checked></prism-checkbox>',
    properties: [
      ['label / hint / name', 'string', 'empty'],
      ['checked / disabled / required', 'boolean', 'false'],
      ['value', 'string', 'on'],
    ],
    slots: 'No slots. Part: control. The visible label names the native checkbox.',
    events:
      'prism-change {checked: boolean, value: string}. An unchecked or disabled control is omitted from FormData.',
    keyboard:
      'Space toggles the focused checkbox. Required means checked. Form reset restores the checked attribute.',
  },
  {
    id: 'switch',
    name: 'Switch',
    group: 'Forms',
    description:
      'A clear change of state. A compact on/off control for settings that take effect as soon as they change.',
    snippet:
      '<prism-switch label="Email notifications" name="notifications" checked></prism-switch>',
    properties: [
      ['label / hint / name', 'string', 'empty'],
      ['checked / disabled / required', 'boolean', 'false'],
      ['value', 'string', 'on'],
    ],
    slots: 'No slots. Part: control. Uses a native checkbox with role=switch.',
    events: 'prism-change {checked: boolean, value: string}. The demo applies changes locally.',
    keyboard:
      'Space toggles. The label stays the same in both states. Native checkbox form association and reset are preserved.',
  },
  {
    id: 'select',
    name: 'Select',
    group: 'Forms',
    description:
      'The right choice, without the noise. Familiar native selection for compact lists, including the platform’s own picker.',
    snippet:
      '<prism-select label="Visibility" name="visibility" value="team">\n  <option value="team">Team members</option>\n  <option value="private">Only me</option>\n</prism-select>',
    properties: [
      ['label / hint / error', 'string', 'empty'],
      ['value / name', 'string', 'empty'],
      ['required / disabled', 'boolean', 'false'],
    ],
    slots:
      'Default: direct option elements (value, text, disabled). Part: control. Options are read on slot changes; option text mutation requires replacing the option.',
    events: 'prism-input {value: string}; prism-change {value: string}.',
    keyboard:
      'Native select keyboard behavior, including arrow keys and type-ahead, follows the browser and operating system. No custom listbox or multi-select.',
  },
  {
    id: 'tabs',
    name: 'Tabs',
    group: 'Navigation',
    description:
      'Related views, one clear focus. An automatically activated tab set with a predictable path for keyboard users.',
    snippet:
      '<prism-tabs labels="Overview,Activity" label="Project views">\n  <p slot="panel-0">Your project at a glance.</p>\n  <p slot="panel-1">You created this project today.</p>\n</prism-tabs>',
    properties: [
      ['labels', 'comma-separated string', 'Overview,Details,Activity'],
      ['selected', 'number (zero-based)', '0'],
      ['label', 'string', 'Sections'],
    ],
    slots:
      'panel-0, panel-1, … match labels. Parts: tab, panel. Each panel receives its own tab relationship within the shadow root.',
    events: 'prism-change {selected: number}. Invalid selection is clamped to the first tab.',
    keyboard:
      'Tab enters the selected tab. Left/Right arrows wrap and automatically activate. Home/End select first/last. Tab moves to the active panel. Horizontal orientation only; panels must not nest forms.',
  },
  {
    id: 'dialog',
    name: 'Dialog',
    group: 'Overlays',
    description:
      'A moment of focus. A native modal that brings the task forward, keeps focus close, and returns you to where you were.',
    snippet:
      '<prism-dialog label="Create a project">\n  <p>A fresh space for your next idea.</p>\n  <prism-button slot="footer">Create project</prism-button>\n</prism-dialog>\n<!-- Call dialog.show() / dialog.hide() -->',
    properties: [
      ['label', 'string', 'Dialog'],
      ['open', 'boolean', 'false'],
      ['show() / hide()', 'methods', '—'],
    ],
    slots:
      'Default: dialog content. footer: actions. Part: panel. A native close button is always present.',
    events:
      'prism-close fires after close, including Escape, and restores the previous focused element.',
    keyboard:
      'Native showModal provides focus containment and background inertness. Escape closes. Opening focuses the first focusable control. Closing restores nested shadow focus. Backdrop clicks do not dismiss. No nested modal or iOS VoiceOver certification.',
  },
  {
    id: 'accordion',
    name: 'Accordion',
    group: 'Disclosure',
    description:
      'More detail, when it matters. A native disclosure keeps a page scannable without putting useful information out of reach.',
    snippet:
      '<prism-accordion label="What is included?">\n  Twelve components, typed APIs, and a token system.\n</prism-accordion>',
    properties: [
      ['label', 'string', 'More information'],
      ['open', 'boolean', 'false'],
    ],
    slots: 'Default: expandable content. Parts: container, summary, content.',
    events:
      'prism-toggle {open: boolean}. Native details toggle events can coalesce rapid state updates.',
    keyboard:
      'Enter or Space on the summary toggles the native details element. Focus remains on the summary. Multiple disclosures may remain open.',
  },
  {
    id: 'badge',
    name: 'Badge',
    group: 'Feedback',
    description:
      'A little context at a glance. Small, expressive labels for status and categories, with meaning carried by words as well as color.',
    snippet: '<prism-badge tone="success">Published</prism-badge>',
    properties: [['tone', 'neutral | success | warning | accent', 'neutral']],
    slots: 'Default: short descriptive text. Part: label.',
    events: 'No events; badges are informational, not interactive.',
    keyboard:
      'Not focusable. Use explicit text to convey status. Badges do not announce updates; use Status for live feedback.',
  },
  {
    id: 'progress',
    name: 'Progress',
    group: 'Feedback',
    description:
      'Make waiting understandable. An accessible native progress indicator with a visible label and a useful sense of completion.',
    snippet: '<prism-progress label="Uploading assets" value="64" max="100"></prism-progress>',
    properties: [
      ['value / max', 'number', '40 / 100'],
      ['label', 'string', 'Progress'],
      ['indeterminate', 'boolean', 'false'],
    ],
    slots: 'No slots. Part: track. Value is bounded to [0,max]; invalid max falls back to 100.',
    events:
      'No events. Consumers update the value property. Indeterminate removes the native value attribute.',
    keyboard:
      'Not interactive or focusable. Native progress semantics expose value and label. Completion announcements should be sent separately through Status.',
  },
  {
    id: 'status',
    name: 'Status',
    group: 'Feedback',
    description:
      'Feedback that finds the right moment. A persistent, polite live region for saved changes, helpful updates, and recoverable errors.',
    snippet:
      '<prism-status message="Your changes have been saved." tone="success" dismissible></prism-status>',
    properties: [
      ['message', 'string', 'empty'],
      ['tone', 'success | info | error', 'success'],
      ['dismissible', 'boolean', 'false'],
    ],
    slots:
      'No slots. Part: container. An empty, polite live region remains mounted before a message is added.',
    events: 'prism-dismiss after the optional dismiss button clears the message.',
    keyboard:
      'Optional dismiss button uses normal button keys. No auto-dismiss, focus stealing, assertive alerts or notification queue. Put urgent errors beside the affected field.',
  },
];
