import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { env } from './config/env';

/**
 * Les critères d'acceptance Gherkin (features/) sont transformés en tests
 * Playwright par playwright-bdd (commande `bddgen`).
 */
const bddTestDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['steps/**/*.ts', 'fixtures/index.ts'],
  outputDir: '.features-gen',
});

export default defineConfig({
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Les applications de démo publiques sont parfois lentes : 2 relances en CI,
  // et les tests relancés avec succès sont signalés « flaky » dans le rapport.
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    ['json', { outputFile: 'reports/json/results.json' }],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  // Bouchon de l'API démarré par Playwright pour le projet api-offline (docs: test-webserver).
  webServer: {
    command: `node mock-server/booking-api.mjs ${env.mockPort}`,
    url: `http://localhost:${env.mockPort}/ping`,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    timeout: 15_000,
  },
  projects: [
    {
      name: 'api',
      testDir: 'tests/api',
      use: { baseURL: env.bookingApiUrl },
    },
    {
      // Mêmes tests API, sans réseau, contre le bouchon : utile hors ligne
      // ou quand l'environnement de démo public est indisponible.
      name: 'api-offline',
      testDir: 'tests/api',
      use: { baseURL: `http://localhost:${env.mockPort}` },
    },
    {
      name: 'integration',
      testDir: 'tests/integration',
      use: { ...devices['Desktop Chrome'], baseURL: env.webUrl },
    },
    {
      name: 'e2e',
      testDir: bddTestDir,
      use: { ...devices['Desktop Chrome'], baseURL: env.webUrl },
    },
  ],
});
