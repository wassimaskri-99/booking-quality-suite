// TC-PERF-02 · Charge nominale : montée à 5 utilisateurs virtuels sur ~1 minute.
// Volontairement modeste : l'API cible est un service de démonstration public.
import { sleep } from 'k6';
import { token, bookingJourney } from './lib/booking.js';

export const options = {
  scenarios: {
    charge_nominale: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '15s', target: 5 },
        { duration: '30s', target: 5 },
        { duration: '15s', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    'http_req_duration{name:POST /booking}': ['p(95)<2000'],
    'http_req_duration{name:GET /booking/{id}}': ['p(95)<1500'],
    http_req_duration: ['p(95)<2000', 'p(99)<4000'],
    checks: ['rate>0.99'],
  },
};

export function setup() {
  return { token: token() };
}

export default function (data) {
  bookingJourney(data.token);
  sleep(1 + Math.random()); // temps de réflexion d'un utilisateur réel
}
