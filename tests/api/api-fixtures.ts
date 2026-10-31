import { test as base } from '@playwright/test';
import { BookingClient } from '../../api/BookingClient';
import { env } from '../../config/env';

type ApiFixtures = {
  api: BookingClient;
  token: string;
  /** Enregistre une réservation à supprimer automatiquement en fin de test. */
  cleanup: (bookingId: number) => void;
};

export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => use(new BookingClient(request)),

  token: async ({ api }, use) => {
    const token = await api.token(env.apiAdmin.username, env.apiAdmin.password);
    if (!token) throw new Error("Impossible d'obtenir un jeton d'authentification");
    await use(token);
  },

  cleanup: async ({ api, token }, use) => {
    const ids: number[] = [];
    await use((id) => ids.push(id));
    for (const id of ids) {
      await api.delete(id, token); // nettoyage best-effort : la ressource peut déjà être supprimée
    }
  },
});

export { expect } from '@playwright/test';
