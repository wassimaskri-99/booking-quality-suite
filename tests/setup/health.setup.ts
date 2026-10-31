import { test as setup, expect } from '@playwright/test';
import { env } from '../../config/env';

/**
 * Setup project (docs: test-global-setup-teardown) : vérifie que les environnements
 * répondent AVANT de lancer la campagne. S'ils sont indisponibles, la campagne
 * s'arrête tout de suite avec un message clair, au lieu de 40 échecs trompeurs.
 */
setup('les environnements de test sont disponibles', async ({ request }) => {
  await setup.step('API de réservation', async () => {
    const res = await request.get(`${env.bookingApiUrl}/ping`, { timeout: 30_000 });
    expect(res.status(), `${env.bookingApiUrl} est indisponible`).toBe(201);
  });

  await setup.step('Application web', async () => {
    const res = await request.get(`${env.webUrl}/api/room`, { timeout: 30_000 });
    expect(res.ok(), `${env.webUrl} est indisponible`).toBeTruthy();
  });
});
