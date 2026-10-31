import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { testData } from '../../test-data';

/**
 * Tests d'intégration : l'interface affiche-t-elle exactement ce que l'API renvoie ?
 * Ils détectent les écarts front ↔ back qu'un test UI ou API seul ne voit pas.
 */
test.describe('Intégration API ↔ interface', { tag: ['@integration', '@regression'] }, () => {
  test('TC-INT-01 · chaque chambre renvoyée par l\'API est affichée', { tag: '@majeur' }, async ({ page, request }) => {
    const res = await request.get('/api/room');
    expect(res.ok()).toBeTruthy();
    const { rooms } = (await res.json()) as { rooms: { roomid: number; type: string }[] };
    expect(rooms.length).toBeGreaterThan(0);

    const home = new HomePage(page);
    await home.open();

    for (const room of rooms) {
      await expect(page.locator(`a[href^="/reservation/${room.roomid}"]`), `chambre ${room.roomid}`).toBeVisible();
      await expect(page.getByText(room.type, { exact: true }).first()).toBeVisible();
    }
    await expect(home.bookNowLinks).toHaveCount(rooms.length);
  });

  test('TC-INT-02 · le nom de l\'établissement vient de l\'API', { tag: '@mineur' }, async ({ page, request }) => {
    const branding = await (await request.get('/api/branding')).json();
    const home = new HomePage(page);
    await home.open();
    await expect(home.welcomeTitle).toContainText(branding.name);
  });

  test('TC-INT-03 · l\'interface affiche les erreurs de validation renvoyées par l\'API', { tag: '@majeur' }, async ({ page, request }) => {
    const invalid = testData.contact('telephone-court');

    // 1. Ce que l'API répond pour ce message invalide…
    const res = await request.post('/api/message', { data: invalid });
    expect(res.status()).toBe(400);
    const apiErrors = (await res.json()) as string[];
    expect(apiErrors.length).toBeGreaterThan(0);

    // 2. …doit être exactement ce que voit l'utilisateur.
    const home = new HomePage(page);
    await home.open();
    await home.sendContactMessage(invalid);
    for (const error of apiErrors) {
      await expect(home.errorMessage(error)).toBeVisible();
    }
  });
});
