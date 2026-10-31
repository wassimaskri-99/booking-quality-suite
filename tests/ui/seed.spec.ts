import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

/**
 * Test « seed » des Playwright Test Agents (docs: test-agents).
 * Les agents planner / generator / healer (.claude/agents/) partent de cet état :
 * page d'accueil chargée, Page Objects du projet disponibles.
 */
test.describe('Seed des agents', { tag: '@seed' }, () => {
  test('seed', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await expect(home.bookNowLinks.first()).toBeVisible();
  });
});
