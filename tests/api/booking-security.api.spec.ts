import { test, expect } from './api-fixtures';
import { runId, testData } from '../../test-data';

test.describe('US-05 · Sécurité de l\'API de réservation', { tag: ['@api', '@securite', '@regression', '@critique'] }, () => {
  test('TC-SEC-01 · modification refusée sans jeton', async ({ api, cleanup }) => {
    const original = { ...testData.booking('standard'), lastname: `Sec1-${runId()}` };
    const { bookingid } = await api.create(original);
    cleanup(bookingid);

    const res = await api.update(bookingid, { ...original, totalprice: 1 });
    expect(res.status()).toBe(403);
    expect(await (await api.get(bookingid)).json()).toEqual(original);
  });

  test('TC-SEC-02 · suppression refusée avec un jeton invalide', async ({ api, cleanup }) => {
    const { bookingid } = await api.create({ ...testData.booking('standard'), lastname: `Sec2-${runId()}` });
    cleanup(bookingid);

    const res = await api.delete(bookingid, 'jeton-invalide');
    expect(res.status()).toBe(403);
    expect((await api.get(bookingid)).status()).toBe(200);
  });

  test('TC-SEC-03 · aucun jeton avec un mauvais mot de passe', async ({ api }) => {
    const token = await api.token('admin', 'mauvais-mot-de-passe');
    expect(token).toBeUndefined();
  });
});
