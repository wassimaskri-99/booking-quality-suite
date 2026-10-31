import { test as setup, expect } from '@playwright/test';
import { AdminLoginPage } from '../../pages/AdminLoginPage';
import { env } from '../../config/env';

const ADMIN_STATE = '.auth/admin.json';

/**
 * Authentification une seule fois (docs: auth) : la session de l'administrateur
 * est enregistrée dans un storageState réutilisé par tous les tests du back-office.
 */
setup("connexion de l'administrateur", async ({ page }) => {
  const login = new AdminLoginPage(page);
  await login.open();
  await login.login(env.admin.username, env.admin.password);
  await expect(page).toHaveURL(/\/admin\/rooms/);
  await page.context().storageState({ path: ADMIN_STATE });
});
