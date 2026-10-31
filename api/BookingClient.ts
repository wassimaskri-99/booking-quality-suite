import { expect, type APIRequestContext } from '@playwright/test';
import type { Booking } from '../test-data';

/** Client de l'API restful-booker : centralise les URL, en-têtes et contrôles de statut. */
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  private readonly json = { Accept: 'application/json', 'Content-Type': 'application/json' };

  ping() {
    return this.request.get('/ping');
  }

  async token(username: string, password: string): Promise<string | undefined> {
    const res = await this.request.post('/auth', { data: { username, password }, headers: this.json });
    expect(res.status(), 'POST /auth').toBe(200);
    const body = await res.json();
    return body.token;
  }

  async create(booking: Booking): Promise<{ bookingid: number; booking: Booking }> {
    const res = await this.request.post('/booking', { data: booking, headers: this.json });
    expect(res.status(), 'POST /booking').toBe(200);
    return res.json();
  }

  get(id: number) {
    return this.request.get(`/booking/${id}`, { headers: { Accept: 'application/json' } });
  }

  search(params: Record<string, string>) {
    return this.request.get('/booking', { params });
  }

  update(id: number, booking: Booking, token?: string) {
    return this.request.put(`/booking/${id}`, { data: booking, headers: this.auth(token) });
  }

  patch(id: number, partial: Partial<Booking>, token?: string) {
    return this.request.patch(`/booking/${id}`, { data: partial, headers: this.auth(token) });
  }

  delete(id: number, token?: string) {
    return this.request.delete(`/booking/${id}`, { headers: this.auth(token) });
  }

  private auth(token?: string) {
    return token ? { ...this.json, Cookie: `token=${token}` } : this.json;
  }
}
