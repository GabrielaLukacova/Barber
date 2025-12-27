import { test, expect } from '@playwright/test';

async function gotoFirstWorking(page: any, paths: string[]) {
  for (const p of paths) {
    const resp = await page.goto(p, { waitUntil: 'domcontentloaded' }).catch(() => null);
    if (resp && resp.ok()) return p;
  }
  throw new Error(`None of the routes worked: ${paths.join(', ')}`);
}

test('homepage loads', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('body')).toBeVisible();
});

test('services page (one of common routes) loads', async ({ page }) => {
  await gotoFirstWorking(page, ['/services', '/service', '/#services']);
  await expect(page.locator('body')).toBeVisible();
});

test('admin login (one of common routes) loads', async ({ page }) => {
  await gotoFirstWorking(page, ['/admin/login', '/login', '/admin']);
  await expect(page.locator('body')).toBeVisible();
});
