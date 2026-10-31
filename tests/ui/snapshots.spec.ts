import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Snapshots · structure et rendu', { tag: ['@ui', '@snapshot', '@regression'] }, () => {
  test('TC-SNAP-01 · la navigation garde la même structure accessible', { tag: '@majeur' }, async ({ page }) => {
    const home = new HomePage(page);
    await home.open();

    // ARIA snapshot (docs: aria-snapshots) : compare l'arbre d'accessibilité, pas les pixels.
    // Indépendant du système et du navigateur, il détecte un lien supprimé ou renommé.
    await expect(page.getByRole('navigation')).toMatchAriaSnapshot(`
      - navigation:
        - link "Shady Meadows B&B"
        - list:
          - listitem:
            - link "Rooms"
          - listitem:
            - link "Booking"
          - listitem:
            - link "Amenities"
          - listitem:
            - link "Location"
          - listitem:
            - link "Contact"
          - listitem:
            - link "Admin"
    `);
  });

  test('TC-SNAP-02 · le formulaire de contact garde la même structure', { tag: '@mineur' }, async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await expect(page.locator('form').filter({ has: home.contact.submit })).toMatchAriaSnapshot(`
      - textbox
      - textbox
      - textbox
      - textbox
      - textbox
      - button "Submit"
    `);
  });

  test('TC-SNAP-03 · le rendu de la barre de navigation ne régresse pas', { tag: '@mineur' }, async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    // Comparaison visuelle (docs: test-snapshots) : référence par OS/navigateur,
    // tolérance faible pour l'anti-crénelage des polices.
    await expect(page.getByRole('navigation')).toHaveScreenshot('navigation.png', { maxDiffPixelRatio: 0.02 });
  });
});
