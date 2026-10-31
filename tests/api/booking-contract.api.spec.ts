import { test } from './api-fixtures';
import { expect } from '../../support/matchers';
import { runId, testData } from '../../test-data';

test.describe('US-04 · Contrat de l\'API de réservation', { tag: ['@api', '@regression', '@contrat'] }, () => {
  test('TC-API-10 · chaque réservation renvoyée respecte le contrat', { tag: '@majeur' }, async ({ api, cleanup }) => {
    const { bookingid, booking } = await api.create({ ...testData.booking('longue-duree'), lastname: `Ctr-${runId()}` });
    cleanup(bookingid);

    // Matcher personnalisé : toutes les règles du contrat en une assertion.
    expect(booking).toBeValidBooking();
    const fetched: unknown = await (await api.get(bookingid)).json();
    expect(fetched).toBeValidBooking();
  });

  test('TC-API-11 · un contrat invalide est détecté', { tag: '@mineur' }, async () => {
    expect({ firstname: 'A', lastname: '', totalprice: -1, depositpaid: 'oui', bookingdates: {} }).not.toBeValidBooking();
  });

  test('TC-API-12 · la réponse de consultation est complète', { tag: '@majeur' }, async ({ api, cleanup }) => {
    const booking = { ...testData.booking('standard'), lastname: `Soft-${runId()}` };
    const { bookingid } = await api.create(booking);
    cleanup(bookingid);
    const res = await api.get(bookingid);
    const body = await res.json();

    // Assertions « soft » : tous les écarts sont listés d'un coup au lieu de s'arrêter au premier.
    expect.soft(res.headers()['content-type']).toContain('application/json');
    expect.soft(body.firstname).toBe(booking.firstname);
    expect.soft(body.totalprice).toBe(booking.totalprice);
    expect.soft(body.depositpaid).toBe(booking.depositpaid);
    expect.soft(body.bookingdates).toEqual(booking.bookingdates);
    expect.soft(body.additionalneeds).toBe(booking.additionalneeds);
  });

  test('TC-API-13 · une nouvelle réservation devient trouvable par recherche', { tag: '@majeur' }, async ({ api, cleanup }) => {
    const booking = { ...testData.booking('sans-acompte'), lastname: `Poll-${runId()}` };
    const { bookingid } = await api.create(booking);
    cleanup(bookingid);

    // expect.poll : relance la recherche jusqu'à ce que l'index soit à jour (cohérence à terme).
    await expect
      .poll(
        async () => {
          const res = await api.search({ lastname: booking.lastname });
          return (await res.json()).map((b: { bookingid: number }) => b.bookingid);
        },
        { message: 'la réservation doit apparaître dans la recherche', timeout: 15_000, intervals: [500, 1_000, 2_000] },
      )
      .toContain(bookingid);
  });

  test("TC-API-14 · l'API redevient disponible (toPass)", { tag: '@mineur' }, async ({ api }) => {
    // toPass : réessaie tout le bloc, utile pour attendre un service qui démarre.
    await expect(async () => {
      expect((await api.ping()).status()).toBe(201);
    }).toPass({ timeout: 20_000, intervals: [1_000, 2_000] });
  });
});
