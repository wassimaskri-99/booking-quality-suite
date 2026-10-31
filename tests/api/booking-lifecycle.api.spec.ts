import { test, expect } from './api-fixtures';
import { runId, testData } from '../../test-data';

/**
 * Cycle de vie complet d'une réservation, en mode « serial » (docs: test-parallel) :
 * les tests partagent la même réservation et s'exécutent dans l'ordre ; si une
 * étape échoue, les suivantes sont ignorées au lieu d'échouer en cascade.
 */
test.describe('US-04 · Cycle de vie d\'une réservation', { tag: ['@api', '@regression', '@cycle-de-vie'] }, () => {
  test.describe.configure({ mode: 'serial' });

  let bookingId: number;
  const booking = { ...testData.booking('standard'), lastname: `Cycle-${runId()}` };

  test('1 · création', { tag: '@critique' }, async ({ api }, testInfo) => {
    const created = await test.step('POST /booking', () => api.create(booking));

    bookingId = created.bookingid;
    // Pièce jointe visible dans le rapport HTML et le trace viewer (docs: test-reporters / attachments).
    await testInfo.attach('réservation créée', { body: JSON.stringify(created, null, 2), contentType: 'application/json' });
    expect(bookingId).toBeGreaterThan(0);
  });

  test('2 · modification', { tag: '@critique' }, async ({ api, token }) => {
    await test.step('PATCH /booking/{id}', async () => {
      const res = await api.patch(bookingId, { totalprice: 480 }, token);
      expect(res.status()).toBe(200);
    });

    await test.step('vérification de la persistance', async () => {
      expect((await (await api.get(bookingId)).json()).totalprice).toBe(480);
    });
  });

  test(
    '3 · annulation',
    {
      tag: '@critique',
      annotation: {
        type: 'comportement connu',
        description: 'DELETE renvoie 201 Created au lieu de 204 No Content (spécificité documentée de restful-booker)',
      },
    },
    async ({ api, token }) => {
      expect((await api.delete(bookingId, token)).status()).toBe(201);
      expect((await api.get(bookingId)).status()).toBe(404);
    },
  );
});

test.describe('US-04 · Anomalies connues', { tag: ['@api', '@anomalie-connue'] }, () => {
  test(
    'TC-API-15 · une réservation avec départ avant arrivée doit être refusée',
    {
      tag: '@majeur',
      annotation: { type: 'issue', description: 'ANO-001 : l\'API accepte des dates incohérentes (checkout < checkin)' },
    },
    async ({ api, cleanup }) => {
      // test.fail (docs: test-annotations) : le test documente une anomalie ouverte.
      // Il est « vert » tant que l'anomalie existe, et devient rouge le jour où elle
      // est corrigée — rappel automatique de retirer test.fail() et de fermer ANO-001.
      test.fail();
      const invalid = {
        ...testData.booking('standard'),
        lastname: `Ano-${runId()}`,
        bookingdates: { checkin: '2027-05-10', checkout: '2027-05-01' },
      };
      const res = await api.request.post('/booking', { data: invalid, headers: { Accept: 'application/json' } });
      cleanup((await res.json().catch(() => ({}))).bookingid);
      expect(res.status(), 'des dates incohérentes doivent être rejetées').toBe(400);
    },
  );
});
