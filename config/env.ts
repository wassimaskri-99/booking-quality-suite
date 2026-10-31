/**
 * Configuration des environnements de test.
 * Toutes les valeurs peuvent être surchargées par variables d'environnement
 * (pipelines GitHub Actions / Azure DevOps, ou fichier .env local).
 */
export const env = {
  /** Application web testée en E2E (restful-booker-platform). */
  webUrl: process.env.WEB_URL ?? 'https://automationintesting.online',
  /** API REST de réservation testée en intégration et en charge. */
  bookingApiUrl: process.env.BOOKING_API_URL ?? 'https://restful-booker.herokuapp.com',
  /** Port du bouchon de l'API de réservation (projet api-offline). */
  mockPort: Number(process.env.MOCK_PORT ?? 4010),
  /** Comptes de démonstration publics, documentés par les éditeurs des applications. */
  admin: {
    username: process.env.ADMIN_USER ?? 'admin',
    password: process.env.ADMIN_PASSWORD ?? 'password',
  },
  apiAdmin: {
    username: process.env.API_USER ?? 'admin',
    password: process.env.API_PASSWORD ?? 'password123',
  },
};
