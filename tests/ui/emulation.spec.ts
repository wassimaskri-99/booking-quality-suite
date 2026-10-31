import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

/**
 * Émulation (docs: emulation, test-use-options, evaluating) : on vérifie le contexte
 * vu par la page via page.evaluate(), puis que l'application reste utilisable.
 */
test.describe('Émulation · visiteur tunisien, mode sombre', { tag: ['@ui', '@emulation', '@regression'] }, () => {
  test.use({
    locale: 'fr-FR',
    timezoneId: 'Africa/Tunis',
    colorScheme: 'dark',
    geolocation: { latitude: 36.8625, longitude: 10.1956 }, // Ariana
    permissions: ['geolocation'],
    viewport: { width: 1280, height: 800 },
  });

  test('TC-EMU-01 · le navigateur expose la langue, le fuseau et le thème émulés', { tag: '@mineur' }, async ({ page }) => {
    const home = new HomePage(page);
    await home.open();

    const context = await page.evaluate(() => ({
      language: navigator.language,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dark: matchMedia('(prefers-color-scheme: dark)').matches,
    }));
    expect(context).toEqual({ language: 'fr-FR', timeZone: 'Africa/Tunis', dark: true });
  });

  test('TC-EMU-02 · la géolocalisation émulée est accessible', { tag: '@mineur' }, async ({ page }) => {
    await page.goto('/');
    const position = await page.evaluate(
      () =>
        new Promise<{ lat: number; lon: number }>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition((p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }), reject),
        ),
    );
    expect(position.lat).toBeCloseTo(36.86, 1);
    expect(position.lon).toBeCloseTo(10.2, 1);
  });

  test("TC-EMU-03 · l'accueil fonctionne avec ces réglages", { tag: '@majeur' }, async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await expect(home.bookNowLinks.first()).toBeVisible();
    await expect(home.contact.submit).toBeVisible();
  });
});
