import { test, expect } from '@playwright/test';

test('verify sj photocard with red outline', async ({ page }) => {
  await page.goto('http://localhost:8083/SJ');
  await page.fill('#title', 'Test Title with Red Outline');
  await page.fill('#imageUrl', 'https://backoffice.bangladeshguardian.com/media/imgAll/2026February/English/mim-20260219190316-1771573722.jpg');
  await page.click('button:has-text("Generate Preview")');

  // Wait for success toast or preview image
  await page.waitForSelector('img[alt="Photocard Preview"]', { timeout: 15000 });

  await page.screenshot({ path: 'sj_verify_red.png' });
  console.log('Screenshot saved to sj_verify_red.png');
});
