#!/usr/bin/env node
/**
 * Bouchon (mock) de l'API restful-booker.
 *
 * Reproduit le contrat utilisé par les tests (y compris ses particularités :
 * DELETE → 201, mauvais identifiants → 200 « Bad credentials »).
 * Démarré automatiquement par Playwright (option `webServer`) pour le projet
 * `api-offline` : les tests API tournent sans réseau, en local comme en CI.
 *
 *   node mock-server/booking-api.mjs [port]
 */
import http from 'node:http';

const port = Number(process.argv[2] ?? process.env.MOCK_PORT ?? 4010);
const db = new Map();
const tokens = new Set();
let nextId = 1;

const send = (res, code, body) => {
  const isText = typeof body === 'string';
  res.writeHead(code, { 'Content-Type': isText ? 'text/plain' : 'application/json' });
  res.end(isText ? body : JSON.stringify(body));
};

const server = http.createServer((req, res) => {
  let raw = '';
  req.on('data', (chunk) => (raw += chunk));
  req.on('end', () => {
    const url = new URL(req.url, 'http://localhost');
    let body;
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch {
      return send(res, 400, 'Bad Request');
    }
    const token = (req.headers.cookie ?? '').match(/token=([^;]+)/)?.[1];
    const authenticated = token !== undefined && tokens.has(token);
    const id = Number(url.pathname.match(/^\/booking\/(\d+)$/)?.[1]);

    if (url.pathname === '/ping') return send(res, 201, 'Created');

    if (url.pathname === '/auth' && req.method === 'POST') {
      if (body.username === 'admin' && body.password === 'password123') {
        const t = Math.random().toString(16).slice(2, 17);
        tokens.add(t);
        return send(res, 200, { token: t });
      }
      return send(res, 200, { reason: 'Bad credentials' });
    }

    if (url.pathname === '/booking' && req.method === 'POST') {
      const booking = { ...body };
      db.set(nextId, booking);
      return send(res, 200, { bookingid: nextId++, booking });
    }

    if (url.pathname === '/booking' && req.method === 'GET') {
      const first = url.searchParams.get('firstname');
      const last = url.searchParams.get('lastname');
      const ids = [...db.entries()]
        .filter(([, b]) => (!first || b.firstname === first) && (!last || b.lastname === last))
        .map(([bookingid]) => ({ bookingid }));
      return send(res, 200, ids);
    }

    if (id) {
      if (!db.has(id)) return send(res, req.method === 'GET' ? 404 : 405, 'Not Found');
      if (req.method === 'GET') return send(res, 200, db.get(id));
      if (!authenticated) return send(res, 403, 'Forbidden');
      if (req.method === 'PUT') {
        db.set(id, body);
        return send(res, 200, body);
      }
      if (req.method === 'PATCH') {
        db.set(id, { ...db.get(id), ...body });
        return send(res, 200, db.get(id));
      }
      if (req.method === 'DELETE') {
        db.delete(id);
        return send(res, 201, 'Created');
      }
    }
    return send(res, 404, 'Not Found');
  });
});

server.listen(port, () => console.log(`Mock restful-booker sur http://localhost:${port}`));
