import http from 'k6/http';
import { check, group } from 'k6';

export const BASE_URL = __ENV.BOOKING_API_URL || 'https://restful-booker.herokuapp.com';
const JSON_HEADERS = { 'Content-Type': 'application/json', Accept: 'application/json' };

// Jeu de données partagé avec les tests Playwright et les collections Bruno/Postman.
const bookings = JSON.parse(open('../../../test-data/datasets/bookings.json')).cases;
const cases = Object.values(bookings);

export function token() {
  const res = http.post(
    `${BASE_URL}/auth`,
    JSON.stringify({ username: __ENV.API_USER || 'admin', password: __ENV.API_PASSWORD || 'password123' }),
    { headers: JSON_HEADERS, tags: { name: 'POST /auth' } },
  );
  check(res, { 'auth 200': (r) => r.status === 200, 'jeton reçu': (r) => !!r.json('token') });
  return res.json('token');
}

/** Parcours utilisateur type : créer → consulter → rechercher → annuler. */
export function bookingJourney(authToken) {
  const booking = { ...cases[__ITER % cases.length], lastname: `k6-${__VU}-${__ITER}` };

  group('Créer une réservation', () => {
    const res = http.post(`${BASE_URL}/booking`, JSON.stringify(booking), {
      headers: JSON_HEADERS,
      tags: { name: 'POST /booking' },
    });
    check(res, { 'création 200': (r) => r.status === 200 });
    booking.id = res.json('bookingid');
  });

  if (!booking.id) return;

  group('Consulter la réservation', () => {
    const res = http.get(`${BASE_URL}/booking/${booking.id}`, {
      headers: JSON_HEADERS,
      tags: { name: 'GET /booking/{id}' },
    });
    check(res, { 'consultation 200': (r) => r.status === 200 });
  });

  group('Rechercher par nom', () => {
    const res = http.get(`${BASE_URL}/booking?lastname=${booking.lastname}`, {
      tags: { name: 'GET /booking?lastname' },
    });
    check(res, { 'recherche 200': (r) => r.status === 200 });
  });

  group('Annuler la réservation', () => {
    const res = http.del(`${BASE_URL}/booking/${booking.id}`, null, {
      headers: { ...JSON_HEADERS, Cookie: `token=${authToken}` },
      tags: { name: 'DELETE /booking/{id}' },
    });
    check(res, { 'annulation 201': (r) => r.status === 201 });
  });
}
