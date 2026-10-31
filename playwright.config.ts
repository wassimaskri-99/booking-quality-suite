import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { env } from './config/env';

const ADMIN_STATE = '.auth/admin.json';

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
    // ── Setup / teardown (docs: test-global-setup-teardown, auth) ─────────────
    {
      name: 'health',
      testDir: 'tests/setup',
      testMatch: /health\.setup\.ts/,
      retries: 0,
    },
    {
      name: 'auth',
      testDir: 'tests/setup',
      testMatch: /auth\.setup\.ts/,
      dependencies: ['health'],
      teardown: 'cleanup',
      use: { ...devices['Desktop Chrome'], baseURL: env.webUrl },
    },
    {
      name: 'cleanup',
      testDir: 'tests/setup',
      testMatch: /cleanup\.teardown\.ts/,
    },

    // ── Campagne ───────────────────────────────────────────────────────────────
    {
      name: 'api',
      testDir: 'tests/api',
      dependencies: ['health'],
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
      dependencies: ['health'],
      use: { ...devices['Desktop Chrome'], baseURL: env.webUrl },
    },
    {
      name: 'e2e',
      testDir: bddTestDir,
      dependencies: ['health'],
      use: { ...devices['Desktop Chrome'], baseURL: env.webUrl },
    },
    {
      // Fonctionnalités avancées : réseau, horloge, émulation, snapshots, a11y, événements.
      name: 'ui',
      testDir: 'tests/ui',
      testIgnore: /mobile\.spec\.ts/,
      dependencies: ['health'],
      use: { ...devices['Desktop Chrome'], baseURL: env.webUrl },
    },
    {
      // docs: emulation — appareil mobile réel émulé (écran tactile, viewport, user agent).
      name: 'mobile',
      testDir: 'tests/ui',
      testMatch: /mobile\.spec\.ts/,
      dependencies: ['health'],
      use: { ...devices['Pixel 7'], baseURL: env.webUrl },
    },
    {
      // Back-office : session réutilisée depuis le setup project « auth ».
      name: 'admin',
      testDir: 'tests/admin',
      dependencies: ['auth'],
      use: { ...devices['Desktop Chrome'], baseURL: env.webUrl, storageState: ADMIN_STATE },
    },
  ],
});
