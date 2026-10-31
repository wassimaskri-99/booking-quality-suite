import { test as base, createBdd } from 'playwright-bdd';
import { HomePage } from '../pages/HomePage';
import { AdminLoginPage } from '../pages/AdminLoginPage';

type Fixtures = {
  homePage: HomePage;
  adminLoginPage: AdminLoginPage;
  /** Données partagées entre les étapes d'un même scénario. */
  ctx: Record<string, string>;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  adminLoginPage: async ({ page }, use) => use(new AdminLoginPage(page)),
  // eslint-disable-next-line no-empty-pattern
  ctx: async ({}, use) => use({}),
});

export const { Given, When, Then } = createBdd(test);
