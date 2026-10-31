import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';
import { env } from '../config/env';

Given('je suis sur la page de connexion du back-office', async ({ adminLoginPage }) => {
  await adminLoginPage.open();
});

When('je me connecte avec les identifiants administrateur', async ({ adminLoginPage }) => {
  await adminLoginPage.login(env.admin.username, env.admin.password);
});

When(
  "je me connecte avec l'utilisateur {string} et le mot de passe {string}",
  async ({ adminLoginPage }, utilisateur: string, motDePasse: string) => {
    await adminLoginPage.login(utilisateur, motDePasse);
  },
);

Then('j\'accède à la gestion des chambres', async ({ page }) => {
  await expect(page).toHaveURL(/\/admin\/rooms/);
});

Then('la connexion est refusée', async ({ page }) => {
  // Le back-office ne doit pas être accessible après un échec.
  await expect(page).not.toHaveURL(/\/admin\/rooms/);
});

Then('je reste sur la page de connexion', async ({ adminLoginPage }) => {
  await expect(adminLoginPage.loginButton).toBeVisible();
  await expect(adminLoginPage.password).toBeVisible();
});
