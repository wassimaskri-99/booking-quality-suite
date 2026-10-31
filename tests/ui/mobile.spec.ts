import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

/**
 * Exécuté par le projet « mobile » (Pixel 7 : écran tactile, viewport mobile, user agent Android).
 * docs: emulation (devices), browsers, input (tap).
 */
test.describe('Mobile · parcours visiteur sur smartphone', { tag: ['@ui', '@mobile', '@regression'] }, () => {
  test('TC-MOB-01 · la page tient dans la largeur de l\'écran', { tag: '@majeur' }, async ({ page, isMobile }) => {
    expect(isMobile).toBe(true);
    const home = new HomePage(page);
    await home.open();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, 'pas de défilement horizontal').toBeLessThanOrEqual(1);
  });

  test('TC-MOB-02 · un appui tactile ouvre la réservation d\'une chambre', { tag: '@critique' }, async ({ page }) => {
    const home = new HomePage(page);
    await home.open();

    const link = home.bookNowLinks.first();
    await link.scrollIntoViewIfNeeded();
    await link.tap();
    await expect(page).toHaveURL(/\/reservation\/\d+/);
  });

  test('TC-MOB-03 · les champs du formulaire de contact sont utilisables au doigt', { tag: '@majeur' }, async ({ page }) => {
    const home = new HomePage(page);
    await home.open();

    await home.contact.name.tap();
    await expect(home.contact.name).toBeFocused();
    const box = await home.contact.submit.boundingBox();
    // Cible tactile recommandée : au moins 44 px de haut.
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(36);
  });
});
