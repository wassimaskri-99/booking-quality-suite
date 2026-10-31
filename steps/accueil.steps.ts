import { expect } from '@playwright/test';
import { Given, Then } from '../fixtures';

Given("je suis sur la page d'accueil", async ({ homePage }) => {
  await homePage.open();
});

Then("le titre de bienvenue de l'établissement est affiché", async ({ homePage }) => {
  await expect(homePage.welcomeTitle).toContainText('Welcome');
});

Then('la section {string} est affichée', async ({ page }, section: string) => {
  await expect(page.getByRole('heading', { name: section })).toBeVisible();
});

Then('au moins une chambre est proposée', async ({ homePage }) => {
  await expect(homePage.bookNowLinks.first()).toBeVisible();
});

Then('chaque chambre proposée a un bouton {string}', async ({ homePage }, label: string) => {
  const links = await homePage.bookNowLinks.all();
  expect(links.length).toBeGreaterThan(0);
  for (const link of links) {
    await expect(link).toHaveText(label);
    // Le lien de réservation cible la page de réservation de la chambre.
    await expect(link).toHaveAttribute('href', /\/reservation\/\d+/);
  }
});

Then(
  "la recherche de disponibilité propose une date d'arrivée et une date de départ",
  async ({ homePage }) => {
    await expect(homePage.dateInputs()).toHaveCount(2);
  },
);
