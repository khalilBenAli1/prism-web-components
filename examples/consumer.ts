// Deliberately consumes the output artifact, never src/components.
import '@khalilbenali/prism-web-components';
import '@khalilbenali/prism-web-components/tokens.css';
const form = document.querySelector<HTMLFormElement>('#settings')!;
const result = document.querySelector('prism-status')!;
const dialog = document.querySelector('prism-dialog')!;
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  result.message = `Settings saved for ${String(data.get('workspace'))}. Local demo only.`;
});
form.addEventListener('reset', () => {
  result.message = 'Form restored to its initial values.';
});
document.querySelector('#review')!.addEventListener('click', () => {
  document.querySelector('#form-values')!.textContent = JSON.stringify(
    Object.fromEntries(new FormData(form)),
    null,
    2,
  );
  dialog.show();
});
document.querySelector('#close-review')!.addEventListener('click', () => dialog.hide());
document.querySelector<HTMLButtonElement>('#theme')!.addEventListener('click', (event) => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  (event.currentTarget as HTMLButtonElement).textContent = dark ? 'Light theme' : 'Dark theme';
});
