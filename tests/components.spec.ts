import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function component(page: Page, id: string) {
  await page.goto(`#${id}`);
  await expect(page.locator(`.canvas prism-${id}`).first()).toBeAttached();
}
test('button variants, disabled/loading suppression and functional feedback', async ({ page }) => {
  await component(page, 'button');
  const create = page.getByRole('button', { name: 'Create project' });
  await create.click();
  await expect(page.getByText('Project created — this is a local component demo.')).toBeVisible();
  await page.getByRole('switch', { name: 'Disabled', exact: true }).check();
  await expect(create).toBeDisabled();
  await page.getByRole('switch', { name: 'Disabled', exact: true }).uncheck();
  await page.getByRole('switch', { name: 'Loading', exact: true }).check();
  await expect(create).toBeDisabled();
  await expect(create).toHaveAttribute('aria-busy', 'true');
  await page.getByRole('button', { name: 'Reset playground' }).click();
  await expect(create).toBeEnabled();
  await page.getByLabel('Variant').selectOption('danger');
  await expect(page.locator('prism-button').first()).toHaveAttribute('variant', 'danger');
});
test('form association, required validity, events, reset and safe text', async ({ page }) => {
  await page.goto('examples/index.html');
  await page.getByLabel('Workspace name').fill('');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.locator('#result')).not.toContainText('Settings saved');
  expect(
    await page.locator('#settings').evaluate((el) => (el as HTMLFormElement).checkValidity()),
  ).toBe(false);
  await page.getByLabel('Workspace name').fill('<studio>');
  await page.getByLabel('Default visibility').selectOption('private');
  await page.getByLabel('About this workspace').fill('A demo workspace');
  await page.getByRole('switch', { name: 'Weekly project digest' }).uncheck();
  await page.getByRole('button', { name: 'Review values' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const text = await page.locator('#form-values').textContent();
  const data = JSON.parse(text!);
  expect(data).toEqual({
    workspace: '<studio>',
    visibility: 'private',
    description: 'A demo workspace',
    starter: 'on',
  });
  await page.getByRole('button', { name: 'Looks good' }).click();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('status')).toContainText('Settings saved for <studio>');
  await page.getByRole('button', { name: 'Reset form' }).click();
  await expect(page.getByLabel('Workspace name')).toHaveValue('Studio North');
  await expect(page.getByRole('switch', { name: 'Weekly project digest' })).toBeChecked();
  await page.getByLabel('Workspace name').fill('Keyboard studio');
  await page.getByLabel('Workspace name').press('Enter');
  await expect(page.getByRole('status')).toContainText('Keyboard studio');
});
test('dialog traps focus, closes with Escape and restores exact trigger focus', async ({
  page,
}) => {
  await component(page, 'dialog');
  const trigger = page.getByRole('button', { name: 'Create a project' });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close dialog' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(
    page.locator('#demo-dialog').getByRole('button', { name: 'Create project', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Close dialog' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await page.locator('#demo-dialog').getByLabel('Project name').fill('New idea');
  await page
    .locator('#demo-dialog')
    .getByRole('button', { name: 'Create project', exact: true })
    .click();
  await expect(trigger).toBeFocused();
});
test('tabs automatically activate, wrap and maintain one tab stop', async ({ page }) => {
  await component(page, 'tabs');
  const tabs = page.locator('prism-tabs');
  await tabs.getByRole('tab', { name: 'Overview' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.getByRole('tab', { name: 'Activity' })).toBeFocused();
  await expect(tabs.getByRole('tab', { name: 'Activity' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(tabs.getByText('A fresh beginning.')).toBeVisible();
  await page.keyboard.press('End');
  await expect(tabs.getByRole('tab', { name: 'Settings' })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.getByRole('tab', { name: 'Overview' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(tabs.getByRole('tab', { name: 'Settings' })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(tabs.getByRole('tab', { name: 'Overview' })).toBeFocused();
  expect(
    await tabs
      .getByRole('tab')
      .evaluateAll(
        (elements) => elements.filter((el) => el.getAttribute('tabindex') === '0').length,
      ),
  ).toBe(1);
});
test('checkbox, switch, native disclosure and status announce meaningful changes', async ({
  page,
}) => {
  await component(page, 'checkbox');
  const checkbox = page.getByRole('checkbox', { name: 'Include starter files' });
  await checkbox.focus();
  await page.keyboard.press('Space');
  await expect(checkbox).not.toBeChecked();
  await component(page, 'switch');
  const sw = page.getByRole('switch', { name: 'Email notifications' });
  await sw.focus();
  await page.keyboard.press('Space');
  await expect(sw).not.toBeChecked();
  await expect(page.getByText('Notifications are off in this demo.')).toBeVisible();
  await component(page, 'accordion');
  const summary = page.getByText('Can I use it without a framework?');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Yes. Import the package')).toBeVisible();
  await component(page, 'status');
  await page.getByRole('button', { name: 'Dismiss notification' }).click();
  await expect(page.getByRole('status')).toBeEmpty();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('status')).toContainText('saved again');
  await expect(page.getByRole('status')).toHaveAttribute('aria-live', 'polite');
});
test('events, disabled fieldsets, error validity and progress boundaries', async ({ page }) => {
  await page.goto('examples/index.html');
  const input = page.locator('prism-text-field');
  await input.evaluate((el) => {
    el.addEventListener('prism-input', (event) => {
      el.setAttribute('data-event', JSON.stringify((event as CustomEvent).detail));
    });
  });
  await page.getByLabel('Workspace name').fill('Event studio');
  await expect(input).toHaveAttribute('data-event', '{"value":"Event studio"}');
  await input.evaluate((el) => {
    el.error = 'Reserved name';
  });
  await expect.poll(() => input.evaluate((el) => el.checkValidity())).toBe(false);
  await expect(page.getByText('Reserved name')).toBeVisible();
  await input.evaluate((el) => {
    el.error = '';
  });
  await expect.poll(() => input.evaluate((el) => el.checkValidity())).toBe(true);
  await page.locator('#settings').evaluate((form) => {
    const fieldset = document.createElement('fieldset');
    fieldset.disabled = true;
    form.prepend(fieldset);
    fieldset.append(form.querySelector('prism-text-field')!);
  });
  await expect(page.getByLabel('Workspace name')).toBeDisabled();
  expect(
    await page
      .locator('#settings')
      .evaluate((el) => new FormData(el as HTMLFormElement).has('workspace')),
  ).toBe(false);
  await component(page, 'progress');
  const meter = page.getByRole('progressbar');
  await page.locator('prism-progress').evaluate((el) => {
    el.value = 250;
  });
  await expect(meter).toHaveAttribute('value', '100');
  await page.locator('prism-progress').evaluate((el) => {
    el.max = 0;
    el.value = -50;
  });
  await expect(meter).toHaveAttribute('value', '0');
  await expect(meter).toHaveAttribute('max', '100');
  await page.getByRole('switch', { name: 'Indeterminate' }).check();
  await expect(meter).not.toHaveAttribute('value');
});
test('theme and token controls shape the preview, API navigation and search work', async ({
  page,
}) => {
  await page.goto('');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'blue accent' }).click();
  await expect(page.locator('html')).toHaveAttribute('style', /--prism-accent: #a8c7ff/);
  await page.getByRole('tab', { name: 'API reference' }).click();
  await expect(page.getByRole('table')).toContainText('primary | secondary');
  await page.getByRole('tab', { name: 'Accessibility', exact: true }).click();
  await expect(page.getByText('Space or Enter activates.', { exact: false })).toBeVisible();
  await page.getByRole('link', { name: 'Design tokens' }).click();
  await expect(
    page.getByRole('heading', { name: 'Small details. One clear language.' }),
  ).toBeVisible();
  await page.getByLabel('Token radius').fill('18');
  await expect(page.locator('html')).toHaveAttribute('style', /--prism-radius: 18px/);
  await page.getByRole('button', { name: 'Reset tokens' }).click();
  await expect(page.locator('html')).toHaveAttribute('style', /--prism-radius: 8px/);
  await page.getByRole('searchbox').fill('zzzz');
  await expect(page.getByText('No components found.')).toBeVisible();
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.getByRole('link', { name: 'Button', exact: true })).toBeVisible();
});
for (const width of [390, 768, 1440])
  test(`reflow ${width}px and reduced motion`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    if (width === 390) {
      await page.getByRole('button', { name: 'Toggle component navigation' }).click();
      await page.getByRole('link', { name: 'Dialog', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Dialog.' })).toBeVisible();
      await page.getByRole('button', { name: 'Create a project' }).click();
      await page.keyboard.press('Escape');
    }
    await page.goto('examples/index.html');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  });
test('all twelve component screens, dark theme and HTML consumer pass axe', async ({ page }) => {
  for (const id of [
    'button',
    'text-field',
    'textarea',
    'checkbox',
    'switch',
    'select',
    'tabs',
    'dialog',
    'accordion',
    'badge',
    'progress',
    'status',
  ]) {
    await component(page, id);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations, JSON.stringify(result.violations)).toEqual([]);
  }
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.goto('examples/index.html');
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
});
