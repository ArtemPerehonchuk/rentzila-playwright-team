import { defineConfig } from '@playwright/test';
import chromeProject from './projects.config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 5 : 0,
  workers: process.env.CI ? 5 : undefined,
  reporter: [
    ['html']
  ],
  timeout: 120000,
  expect: {
    timeout: 30000 
  },
  use: {
    baseURL: process.env.HOMEPAGE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    permissions: ['clipboard-read', 'clipboard-write'],
  },
  projects: chromeProject,
});
