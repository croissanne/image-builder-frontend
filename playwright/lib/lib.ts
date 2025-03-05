import { expect, type test, type Page, type FrameLocator } from '@playwright/test';

export const configure = (t: test) => {
  if (process.env.BASE_URL) {
    t.use({ baseURL: process.env.BASE_URL });
  }
}

export const ibFrame = (page: Page): FrameLocator => {
  return page.locator('iframe[name="cockpit1\\:localhost\\/cockpit-image-builder"]').contentFrame();
}

export const login = async (
  page: Page
) => {
  if (!process.env.USER || !process.env.PASSWORD) {
    throw new Error('user or password not set in environment');
  }

  const user = process.env.USER;
  const password = process.env.PASSWORD;

  if (isHosted(page)) {
    return loginConsole(page, user, password);
  }
  return loginCockpit(page, user, password);
}

export const isHosted = (page: Page): bool => {
  return page.url().includes('redhat.com');
}

const loginCockpit = async (
  page: Page,
  user: string,
  password: string
) => {
  await page.goto('/cockpit-image-builder');

  await page.getByRole('textbox', { name: 'User name' }).fill(user);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);

  // cockpit-image-builder needs superuser
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('button', { name: 'Limited access' }).click();
  await page.getByText('Close').click();
  await page.getByRole('button', { name: 'Administrative access' });
};

const loginConsole = async (
  page: Page,
  user: string,
  password: string
) => {
  await page.getByRole('textbox', { name: 'Red Hat login or email' }).fill(user);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('heading', { name: 'All images' });
}
