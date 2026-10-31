import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { testData } from '../../test-data';

test.describe('Réseau · interception et bouchons', { tag: ['@ui', '@reseau', '@regression'] }, () => {
  test("TC-NET-01 · le formulaire envoie exactement les champs saisis à l'API", { tag: '@majeur' }, async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    const message = testData.contact('valide');

    // docs: network — on capture la requête réellement émise par l'interface.
    const requestPromise = page.waitForRequest((r) => r.url().endsWith('/api/message') && r.method() === 'POST');
    await home.sendContactMessage(message);
    const request = await requestPromise;

    expect(request.postDataJSON()).toMatchObject(message);
    expect(request.headers()['content-type']).toContain('application/json');
  });

  test('TC-NET-02 · une réponse bouchonnée évite de créer des données de test', { tag: '@mineur' }, async ({ page }) => {
    // docs: mock — l'API est remplacée par une réponse contrôlée, rien n'est écrit en base.
    let intercepted = 0;
    await page.route('**/api/message', async (route) => {
      intercepted++;
      await route.fulfill({ status: 200, json: { messageid: 999 } });
    });

    const home = new HomePage(page);
    await home.open();
    const message = { ...testData.contact('valide'), name: 'Bouchon Réseau' };
    await home.sendContactMessage(message);

    await expect(home.thankYouMessage(message.name)).toBeVisible();
    expect(intercepted).toBe(1);
  });

  test("TC-NET-03 · une erreur serveur n'affiche pas de faux remerciement", { tag: '@majeur' }, async ({ page }) => {
    await page.route('**/api/message', (route) => route.fulfill({ status: 500, body: 'Internal Server Error' }));

    const home = new HomePage(page);
    await home.open();
    const message = { ...testData.contact('valide'), name: 'Panne Serveur' };
    await home.sendContactMessage(message);

    await expect(home.thankYouMessage(message.name)).toBeHidden();
  });

  test('TC-NET-04 · la page reste utilisable sans images (réseau lent ou bloqué)', { tag: '@mineur' }, async ({ page }) => {
    const blocked: string[] = [];
    await page.route(/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/, (route) => {
      blocked.push(route.request().url());
      return route.abort();
    });

    const home = new HomePage(page);
    await home.open();
    await expect(home.bookNowLinks.first()).toBeVisible();
    await expect(home.contact.submit).toBeEnabled();
    expect(blocked.length, 'au moins une image a été interceptée').toBeGreaterThan(0);
  });
});
