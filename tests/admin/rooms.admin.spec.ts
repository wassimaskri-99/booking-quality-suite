import { test, expect } from '@playwright/test';

/**
 * Tests du back-office : la session vient du setup project (storageState),
 * aucun test ne repasse par l'écran de connexion.
 */
test.describe('Back-office · gestion des chambres', { tag: ['@admin', '@regression'] }, () => {
  test('TC-ADM-03 · la session enregistrée donne accès au back-office', { tag: '@critique' }, async ({ page }) => {
    await page.goto('/admin/rooms');
    await expect(page).toHaveURL(/\/admin\/rooms/);
    await expect(page.locator('#doLogin')).toBeHidden();
  });

  test("TC-ADM-04 · chaque chambre de l'API est listée dans le back-office", { tag: '@majeur' }, async ({ page, request }) => {
    const { rooms } = (await (await request.get('/api/room')).json()) as { rooms: { roomName: string }[] };
    await page.goto('/admin/rooms');
    for (const room of rooms) {
      await expect(page.getByText(room.roomName, { exact: true }).first()).toBeVisible();
    }
  });
});
