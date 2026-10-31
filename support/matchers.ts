import { expect as baseExpect } from '@playwright/test';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Matchers personnalisés (docs: test-assertions « Add custom matchers using expect.extend »).
 * Un seul appel vérifie tout le contrat d'une réservation et donne un message d'échec lisible.
 */
export const expect = baseExpect.extend({
  toBeValidBooking(received: unknown) {
    const problems: string[] = [];
    const b = received as Record<string, unknown> | null;
    if (!b || typeof b !== 'object') {
      problems.push('la réponse n’est pas un objet');
    } else {
      for (const field of ['firstname', 'lastname'] as const) {
        if (typeof b[field] !== 'string' || !(b[field] as string).length) problems.push(`${field} doit être un texte non vide`);
      }
      if (typeof b.totalprice !== 'number' || b.totalprice < 0) problems.push('totalprice doit être un nombre ≥ 0');
      if (typeof b.depositpaid !== 'boolean') problems.push('depositpaid doit être un booléen');
      const dates = b.bookingdates as { checkin?: string; checkout?: string } | undefined;
      if (!dates || !ISO_DATE.test(dates.checkin ?? '') || !ISO_DATE.test(dates.checkout ?? '')) {
        problems.push('bookingdates.checkin / checkout doivent être au format AAAA-MM-JJ');
      } else if (dates.checkin! >= dates.checkout!) {
        problems.push('checkout doit être postérieur à checkin');
      }
    }
    const pass = problems.length === 0;
    return {
      pass,
      name: 'toBeValidBooking',
      message: () =>
        pass
          ? 'réservation conforme au contrat (attendu : non conforme)'
          : `réservation non conforme au contrat :\n  - ${problems.join('\n  - ')}\nreçu : ${this.utils.printReceived(received)}`,
    };
  },
});
