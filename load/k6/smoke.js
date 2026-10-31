// TC-PERF-01 · Smoke de charge : 1 utilisateur virtuel, vérifie que le script et l'API fonctionnent.
import { sleep } from 'k6';
import { token, bookingJourney } from './lib/booking.js';

export const options = {
  vus: 1,
  iterations: 3,
  thresholds: {
    http_req_failed: ['rate==0'],
    http_req_duration: ['p(95)<2000'],
    checks: ['rate==1'],
  },
};

export function setup() {
  return { token: token() };
}

export default function (data) {
  bookingJourney(data.token);
  sleep(1);
}
