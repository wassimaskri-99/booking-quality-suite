import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { HomePage } from '../../pages/HomePage';

type Violation = { id: string; impact?: string | null; help: string; nodes: unknown[] };

const summary = (violations: Violation[]) =>
  violations.map((v) => `${v.impact ?? '?'} · ${v.id} (${v.nodes.length}) — ${v.help}`).join('\n') || 'aucune';

const ANO_002 = {
  type: 'issue',
  description:
    'ANO-002 (critique, WCAG 1.3.1 / 4.1.2) : champs sans libellé — les 2 dates de « Check Availability » ' +
    'et le champ « Message » (#description) du formulaire de contact. Les lecteurs d\'écran ne les annoncent pas.',
};

/** Accessibilité automatisée avec axe-core (docs: accessibility-testing), règles WCAG 2.1 A/AA. */
test.describe('Accessibilité · WCAG 2.1 A/AA', { tag: ['@ui', '@a11y', '@regression'] }, () => {
  test("TC-A11Y-01 · audit complet de la page d'accueil", { tag: '@critique', annotation: ANO_002 }, async ({ page }, testInfo) => {
    // Anomalie ouverte détectée par cet audit : le test est attendu en échec tant qu'elle n'est pas corrigée.
    test.fail();
    const home = new HomePage(page);
    await home.open();

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    await testInfo.attach('audit-axe.json', { body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' });
    testInfo.annotations.push({ type: 'audit a11y', description: summary(results.violations) });

    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical, summary(critical)).toEqual([]);
  });

  test('TC-A11Y-02 · le formulaire de contact est accessible', { tag: '@majeur', annotation: ANO_002 }, async ({ page }) => {
    test.fail();
    const home = new HomePage(page);
    await home.open();

    const results = await new AxeBuilder({ page })
      .include('form:has([data-testid="ContactName"])')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations, summary(results.violations)).toEqual([]);
  });

  test("TC-A11Y-03 · aucune autre violation critique que l'anomalie connue", { tag: '@critique' }, async ({ page }) => {
    // Garde-fou : l'anomalie connue est exclue, toute NOUVELLE violation critique fait échouer la campagne.
    const home = new HomePage(page);
    await home.open();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .disableRules(['label'])
      .analyze();
    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical, summary(critical)).toEqual([]);
  });
});
