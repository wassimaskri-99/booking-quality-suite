import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { runId, testData } from '../../test-data';

/**
 * Isolation (docs: browser-contexts) : deux utilisateurs dans le même test.
 * Le visiteur (contexte vierge) écrit, l'administrateur (contexte avec session) lit.
 */
test.describe('Back-office · messages des visiteurs', { tag: ['@admin', '@integration', '@regression'] }, () => {
  test('TC-ADM-05 · un message envoyé par un visiteur arrive dans la boîte de l\'admin', { tag: '@critique' }, async ({ browser, page }) => {
    const message = { ...testData.contact('valide'), name: `Visiteur ${runId()}`, subject: `Question ${runId()}` };

    await test.step('le visiteur envoie un message (contexte sans session)', async () => {
      const visitorContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
      const visitor = new HomePage(await visitorContext.newPage());
      await visitor.open();
      await visitor.sendContactMessage(message);
      await expect(visitor.thankYouMessage(message.name)).toBeVisible();
      await visitorContext.close();
    });

    await test.step("l'administrateur le voit dans sa boîte de réception", async () => {
      await page.goto('/admin/message');
      await expect(page.getByText(message.name).first()).toBeVisible();
      await expect(page.getByText(message.subject).first()).toBeVisible();
    });
  });
});
