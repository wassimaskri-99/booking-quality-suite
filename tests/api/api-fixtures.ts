import { test as base } from '@playwright/test';
import { BookingClient } from '../../api/BookingClient';
import { env } from '../../config/env';

type Credentials = { username: string; password: string };

type TestFixtures = {
  api: BookingClient;
  /** Enregistre une réservation à supprimer automatiquement en fin de test. */
  cleanup: (bookingId: number) => void;
};

type WorkerFixtures = {
  /** Option (docs: test-parameterize) : surchargeable par projet ou par fichier avec test.use(). */
  apiCredentials: Credentials;
  /** Jeton partagé par tous les tests d'un même worker (docs: test-fixtures, scope « worker »). */
  token: string;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  apiCredentials: [env.apiAdmin, { option: true, scope: 'worker' }],

  token: [
    async ({ playwright, apiCredentials }, use, workerInfo) => {
      // Un seul appel /auth par worker au lieu d'un par test.
      const context = await playwright.request.newContext({ baseURL: workerInfo.project.use.baseURL });
      const token = await new BookingClient(context).token(apiCredentials.username, apiCredentials.password);
      if (!token) throw new Error(`Authentification refusée pour « ${apiCredentials.username} »`);
      await use(token);
      await context.dispose();
    },
    { scope: 'worker' },
  ],

  api: async ({ request }, use) => use(new BookingClient(request)),

  cleanup: async ({ api, token }, use) => {
    const ids: number[] = [];
    await use((id) => ids.push(id));
    for (const id of ids) {
      await api.delete(id, token); // nettoyage best-effort : la ressource peut déjà être supprimée
    }
  },
});

export { expect } from '@playwright/test';
