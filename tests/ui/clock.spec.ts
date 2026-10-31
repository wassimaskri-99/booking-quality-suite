import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

/**
 * Clock API (docs: clock) : l'heure du navigateur est figée, les dates proposées
 * par l'application deviennent déterministes et vérifiables.
 */
test.describe('Horloge · dates de réservation par défaut', { tag: ['@ui', '@horloge', '@regression'] }, () => {
  test("TC-CLK-01 · la réservation proposée commence aujourd'hui et dure une nuit", { tag: '@majeur' }, async ({ page }) => {
    await page.clock.setFixedTime(new Date('2027-02-14T10:00:00'));

    const home = new HomePage(page);
    await home.open();

    const href = await home.bookNowLinks.first().getAttribute('href');
    expect(href).toContain('checkin=2027-02-14');
    expect(href).toContain('checkout=2027-02-15');
  });

  test('TC-CLK-02 · le changement de mois est géré (31 → 1er)', { tag: '@mineur' }, async ({ page }) => {
    await page.clock.setFixedTime(new Date('2027-03-31T22:00:00'));

    const home = new HomePage(page);
    await home.open();

    const href = await home.bookNowLinks.first().getAttribute('href');
    expect(href).toContain('checkin=2027-03-31');
    expect(href).toContain('checkout=2027-04-01');
  });
});
