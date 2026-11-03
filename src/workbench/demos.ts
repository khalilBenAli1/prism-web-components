import { html } from 'lit';
import type { PrismDialog, PrismStatus } from '../components';
export interface DemoState {
  active: string;
  variant: string;
  disabled: boolean;
  loading: boolean;
  checked: boolean;
  error: boolean;
  progress: number;
}
export interface DemoActions {
  announce: (message: string) => void;
  showDialog: () => void;
  onCheckedChange: (value: boolean) => void;
}
export function renderDemo(state: DemoState, actions: DemoActions) {
  const { active, variant, disabled, loading, checked, error, progress } = state;
  const { announce, showDialog, onCheckedChange } = actions;
  switch (active) {
    case 'button':
      return html`<div class="specimen-label">YOUR NEXT GREAT IDEA STARTS HERE</div>
        <div class="button-demo">
          <prism-button
            .variant=${variant}
            ?disabled=${disabled}
            ?loading=${loading}
            @click=${() => {
              if (!disabled && !loading)
                announce('Project created — this is a local component demo.');
            }}
            >Create project <span aria-hidden="true">↗</span></prism-button
          ><prism-button
            variant="secondary"
            ?disabled=${disabled}
            @click=${() => announce('Draft saved in this demo session.')}
            >Save draft</prism-button
          >
        </div>
        <div class="specimen-note">
          <span class="tiny-dot"></span> A good next step, clearly defined.
        </div>`;
    case 'text-field':
      return html`<div class="field-demo">
        <prism-text-field
          label="Project name"
          placeholder="A bright idea"
          hint="Make it something memorable."
          .error=${error ? 'Please give your project a name.' : ''}
          ?disabled=${disabled}
          ?required=${checked}
        ></prism-text-field>
      </div>`;
    case 'textarea':
      return html`<div class="field-demo">
        <prism-textarea
          label="A little about your project"
          placeholder="What are you making?"
          hint="A sentence or two is perfect."
          .error=${error ? 'Add a brief description to continue.' : ''}
          ?disabled=${disabled}
        ></prism-textarea>
      </div>`;
    case 'checkbox':
      return html`<div class="field-demo">
        <p class="demo-title">Start with a head start.</p>
        <prism-checkbox
          label="Include starter files"
          hint="A clean canvas, with the essentials ready."
          .checked=${checked}
          ?disabled=${disabled}
          @prism-change=${(e: CustomEvent<{ checked: boolean }>) => {
            onCheckedChange(e.detail.checked);
          }}
        ></prism-checkbox
        ><prism-checkbox label="Enable project templates" disabled></prism-checkbox>
      </div>`;
    case 'switch':
      return html`<div class="field-demo">
        <p class="demo-title">Stay in the loop.</p>
        <prism-switch
          label="Email notifications"
          hint="Only the updates that matter."
          .checked=${checked}
          ?disabled=${disabled}
          @prism-change=${(e: CustomEvent<{ checked: boolean }>) => {
            onCheckedChange(e.detail.checked);
          }}
        ></prism-switch>
        <div class="local-state">Notifications are ${checked ? 'on' : 'off'} in this demo.</div>
      </div>`;
    case 'select':
      return html`<div class="field-demo">
        <prism-select
          label="Project visibility"
          value="team"
          hint="You can always change this later."
          .error=${error ? 'Choose who can see your project.' : ''}
          ?disabled=${disabled}
          ><option value="team">Team members</option>
          <option value="private">Only me</option>
          <option value="public">Anyone with a link</option></prism-select
        >
      </div>`;
    case 'tabs':
      return html`<div class="wide-demo">
        <prism-tabs labels="Overview,Activity,Settings" label="Project sections"
          ><div slot="panel-0">
            <prism-badge tone="accent">In progress</prism-badge>
            <h3>A space for your best work.</h3>
            <p>Bring the details together. Your next idea has a home.</p>
          </div>
          <div slot="panel-1">
            <h3>A fresh beginning.</h3>
            <p>You created this project today. Your activity will appear here.</p>
          </div>
          <div slot="panel-2">
            <h3>Make it yours.</h3>
            <prism-switch label="Project notifications" checked></prism-switch></div
        ></prism-tabs>
      </div>`;
    case 'dialog':
      return html`<div class="center-demo">
          <div class="dialog-icon" aria-hidden="true">⊞</div>
          <h3>A fresh space for an idea.</h3>
          <p>One focused moment to get started.</p>
          <prism-button @click=${showDialog}
            >Create a project <span aria-hidden="true">↗</span></prism-button
          >
        </div>
        <prism-dialog id="demo-dialog" label="A new beginning"
          ><p class="dialog-copy">
            Give your project a name. This example stays in your browser session.
          </p>
          <prism-text-field label="Project name" placeholder="A bright idea"></prism-text-field
          ><prism-button
            slot="footer"
            @click=${() => {
              document.querySelector<PrismDialog>('#demo-dialog')?.hide();
              announce('Project created in this demo session.');
            }}
            >Create project</prism-button
          ></prism-dialog
        >`;
    case 'accordion':
      return html`<div class="wide-demo">
        <prism-accordion label="What comes with Prism?" ?open=${checked}
          >Twelve purposeful components, typed APIs, a considered token system, and the code to make
          it yours.</prism-accordion
        ><prism-accordion label="Can I use it without a framework?"
          >Yes. Import the package in a module script, then use ordinary custom elements in
          HTML.</prism-accordion
        ><prism-accordion label="Is this a production design system?"
          >This is an original portfolio study. Read the documented limits and evaluate it in your
          own environment.</prism-accordion
        >
      </div>`;
    case 'badge':
      return html`<div class="badge-demo">
        <prism-badge>Draft</prism-badge><prism-badge tone="accent">In progress</prism-badge
        ><prism-badge tone="success">Published</prism-badge
        ><prism-badge tone="warning">Needs review</prism-badge>
      </div>`;
    case 'progress':
      return html`<div class="field-demo">
        <div class="upload-icon" aria-hidden="true">↑</div>
        <prism-progress
          label="Uploading project assets"
          .value=${progress}
          ?indeterminate=${loading}
        ></prism-progress>
        <p class="specimen-note">
          ${loading ? 'Getting everything ready…' : 'A little closer to something good.'}
        </p>
      </div>`;
    case 'status':
      return html`<div class="wide-demo">
        <prism-status
          id="status-demo"
          message="Your changes have been saved."
          .tone=${error ? 'error' : 'success'}
          dismissible
        ></prism-status>
        <div class="status-actions">
          <prism-button
            variant="secondary"
            @click=${() => {
              const status = document.querySelector<PrismStatus>('#status-demo');
              if (status) status.message = 'Your changes have been saved again.';
            }}
            >Save changes</prism-button
          >
        </div>
      </div>`;
    default:
      return html``;
  }
}
