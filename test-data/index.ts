import contactMessages from './datasets/contact-messages.json';
import bookings from './datasets/bookings.json';

export type ContactMessage = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
};

export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
};

type Dataset<T> = { dataset: string; version: string; cases: Record<string, T> };

function pick<T>(ds: Dataset<T>, key: string): T {
  const value = ds.cases[key];
  if (!value) {
    throw new Error(`Cas "${key}" absent du jeu de données ${ds.dataset} v${ds.version}`);
  }
  // Copie : un test ne doit jamais modifier le jeu de données partagé.
  return structuredClone(value);
}

/** Suffixe unique : chaque exécution crée ses propres données (pas de collision en parallèle). */
export const runId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const testData = {
  contact: (key: string) => pick(contactMessages as Dataset<ContactMessage>, key),
  booking: (key: string) => pick(bookings as Dataset<Booking>, key),
  versions: {
    contactMessages: contactMessages.version,
    bookings: bookings.version,
  },
};
