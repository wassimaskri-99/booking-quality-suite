import { test, expect } from './api-fixtures';
import { runId, testData } from '../../test-data';

test.describe('US-04 · API de réservation', { tag: ['@api', '@regression'] }, () => {
  test('TC-API-01 · l\'API répond au ping', { tag: ['@smoke', '@critique'] }, async ({ api }) => {
    const res = await api.ping();
    expect(res.status()).toBe(201);
  });

  test('TC-API-02 · l\'authentification renvoie un jeton', { tag: ['@smoke', '@critique'] }, async ({ token }) => {
    expect(token).toMatch(/^\w+$/);
  });

  for (const cas of ['standard', 'sans-acompte', 'longue-duree']) {
    test(`TC-API-03 · création d'une réservation « ${cas} »`, { tag: '@critique' }, async ({ api, cleanup }) => {
      const booking = testData.booking(cas);
      booking.lastname = `${booking.lastname}-${runId()}`;

      const created = await api.create(booking);
      cleanup(created.bookingid);

      expect(created.bookingid).toBeGreaterThan(0);
      expect(created.booking).toEqual(booking);
    });
  }

  test('TC-API-04 · consultation d\'une réservation par identifiant', { tag: '@critique' }, async ({ api, cleanup }) => {
    const booking = { ...testData.booking('standard'), lastname: `Get-${runId()}` };
    const { bookingid } = await api.create(booking);
    cleanup(bookingid);

    const res = await api.get(bookingid);
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(booking);
  });

  test('TC-API-05 · recherche d\'une réservation par nom', { tag: '@majeur' }, async ({ api, cleanup }) => {
    const booking = { ...testData.booking('standard'), lastname: `Search-${runId()}` };
    const { bookingid } = await api.create(booking);
    cleanup(bookingid);

    const res = await api.search({ firstname: booking.firstname, lastname: booking.lastname });
    expect(res.status()).toBe(200);
    const ids = (await res.json()).map((b: { bookingid: number }) => b.bookingid);
    expect(ids).toContain(bookingid);
  });

  test('TC-API-06 · modification complète d\'une réservation', { tag: '@critique' }, async ({ api, token, cleanup }) => {
    const { bookingid } = await api.create({ ...testData.booking('standard'), lastname: `Put-${runId()}` });
    cleanup(bookingid);

    const updated = { ...testData.booking('longue-duree'), lastname: `Put-${runId()}` };
    const res = await api.update(bookingid, updated, token);
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(updated);

    expect(await (await api.get(bookingid)).json()).toEqual(updated);
  });

  test('TC-API-07 · modification partielle d\'une réservation', { tag: '@majeur' }, async ({ api, token, cleanup }) => {
    const original = { ...testData.booking('standard'), lastname: `Patch-${runId()}` };
    const { bookingid } = await api.create(original);
    cleanup(bookingid);

    const res = await api.patch(bookingid, { totalprice: 999, additionalneeds: 'Dinner' }, token);
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ...original, totalprice: 999, additionalneeds: 'Dinner' });
  });

  test('TC-API-08 · annulation d\'une réservation', { tag: '@critique' }, async ({ api, token }) => {
    const { bookingid } = await api.create({ ...testData.booking('sans-acompte'), lastname: `Del-${runId()}` });

    const res = await api.delete(bookingid, token);
    // L'API renvoie 201 (et non 204) à la suppression : comportement documenté de restful-booker.
    expect(res.status()).toBe(201);
    expect((await api.get(bookingid)).status()).toBe(404);
  });

  test('TC-API-09 · une réservation inexistante renvoie 404', { tag: '@mineur' }, async ({ api }) => {
    const res = await api.get(999_999_999);
    expect(res.status()).toBe(404);
  });
});
