import { expect } from '@playwright/test';
import type { DataTable } from 'playwright-bdd';
import { When, Then } from '../fixtures';
import { runId, testData } from '../test-data';

When("j'envoie le message de contact {string} du jeu de données", async ({ homePage, ctx }, cas: string) => {
  const message = testData.contact(cas);
  // Nom unique par exécution : le message est retrouvable dans le back-office.
  message.name = `${message.name} ${runId()}`;
  ctx.contactName = message.name;
  await homePage.sendContactMessage(message);
});

When('j\'envoie le formulaire de contact sans le remplir', async ({ homePage }) => {
  await homePage.contact.submit.click();
});

Then('un message de remerciement personnalisé est affiché', async ({ homePage, ctx }) => {
  await expect(homePage.thankYouMessage(ctx.contactName)).toBeVisible();
});

Then("l'erreur {string} est affichée", async ({ homePage }, erreur: string) => {
  await expect(homePage.errorMessage(erreur)).toBeVisible();
});

Then('les erreurs suivantes sont affichées :', async ({ homePage }, table: DataTable) => {
  for (const [erreur] of table.raw()) {
    await expect(homePage.errorMessage(erreur)).toBeVisible();
  }
});
