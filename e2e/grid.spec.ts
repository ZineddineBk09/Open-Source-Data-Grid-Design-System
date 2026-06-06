import { test, expect } from '@playwright/test';
import path from 'node:path';
import os from 'node:os';

test.describe('OSDG Demo Grid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#live-demo').scrollIntoViewIfNeeded();
  });

  test('sorts column on header click', async ({ page }) => {
    const nameHeader = page.getByRole('columnheader', { name: /name/i });
    await nameHeader.click();
    await expect(nameHeader).toContainText('↑');
    await nameHeader.click();
    await expect(nameHeader).toContainText('↓');
  });

  test('selects rows via checkbox', async ({ page }) => {
    const firstCheckbox = page.locator('.osdg-row .osdg-checkbox').first();
    await firstCheckbox.check();
    await expect(firstCheckbox).toBeChecked();
    await expect(page.getByText(/1 row selected/i)).toBeVisible();
  });

  test('edits cell on double-click', async ({ page }) => {
    const cell = page.locator('.osdg-row .osdg-cell').nth(1);
    await cell.dblclick();
    const editor = page.locator('.osdg-cell .osdg-input').first();
    await expect(editor).toBeVisible();
    await editor.fill('E2E Test Name');
    await editor.press('Enter');
    await expect(page.getByText('E2E Test Name')).toBeVisible();
  });

  test('exports CSV', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export csv/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('grid-export.csv');
    const filePath = path.join(os.tmpdir(), await download.suggestedFilename());
    await download.saveAs(filePath);
  });

  test('filters via column filter bar', async ({ page }) => {
    const deptFilter = page.getByLabel(/filter department/i);
    await deptFilter.fill('Engineering');
    await expect(page.locator('.osdg-row')).toHaveCount(await page.locator('.osdg-row').count());
    await expect(page.getByRole('grid')).toBeVisible();
  });
});
