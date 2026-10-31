import { test as base, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

type Problems = { consoleErrors: string[]; pageErrors: string[]; failedRequests: string[] };

/**
 * Fixture « auto » (docs: events, test-fixtures) : écoute la console, les exceptions JS
 * et les requêtes en échec pendant chaque test, et les joint au rapport.
 */
const test = base.extend<{ problems: Problems }>({
  problems: [
    async ({ page }, use, testInfo) => {
      const problems: Problems = { consoleErrors: [], pageErrors: [], failedRequests: [] };
      page.on('console', (msg) => msg.type() === 'error' && problems.consoleErrors.push(msg.text()));
      page.on('pageerror', (err) => problems.pageErrors.push(err.message));
      page.on('requestfailed', (req) => problems.failedRequests.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`));
      await use(problems);
      await testInfo.attach('événements-navigateur.json', {
        body: JSON.stringify(problems, null, 2),
        contentType: 'application/json',
      });
    },
    { auto: true },
  ],
});

test.describe('Événements navigateur · santé de la page', { tag: ['@ui', '@evenements', '@regression'] }, () => {
  test("TC-EVT-01 · l'accueil ne lève aucune exception JavaScript", { tag: '@majeur' }, async ({ page, problems }) => {
    const home = new HomePage(page);
    await home.open();
    await expect(home.bookNowLinks.first()).toBeVisible(); // contenu chargé côté client
    expect(problems.pageErrors).toEqual([]);
  });

  test('TC-EVT-02 · un envoi de contact invalide ne casse pas la page', { tag: '@mineur' }, async ({ page, problems }) => {
    const home = new HomePage(page);
    await home.open();
    await home.contact.submit.click();
    await expect(home.errorMessage('Name may not be blank')).toBeVisible();
    expect(problems.pageErrors).toEqual([]);
  });
});
