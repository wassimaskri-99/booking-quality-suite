import { expect, test, type Locator, type Page } from '@playwright/test';
import type { ContactMessage } from '../test-data';

export class HomePage {
  readonly welcomeTitle: Locator;
  readonly roomsHeading: Locator;
  readonly bookNowLinks: Locator;
  readonly contact: {
    name: Locator;
    email: Locator;
    phone: Locator;
    subject: Locator;
    description: Locator;
    submit: Locator;
  };

  constructor(private readonly page: Page) {
    this.welcomeTitle = page.getByRole('heading', { level: 1 });
    this.roomsHeading = page.getByRole('heading', { name: 'Our Rooms' });
    // Uniquement les boutons des cartes chambres : la bannière a aussi un « Book Now »
    // qui pointe vers le formulaire de disponibilité, pas vers une chambre.
    this.bookNowLinks = page
      .getByRole('link', { name: 'Book now' })
      .and(page.locator('a[href^="/reservation/"]'));
    this.contact = {
      name: page.getByTestId('ContactName'),
      email: page.getByTestId('ContactEmail'),
      phone: page.getByTestId('ContactPhone'),
      subject: page.getByTestId('ContactSubject'),
      description: page.getByTestId('ContactDescription'),
      submit: page.getByRole('button', { name: 'Submit' }),
    };
  }

  async open() {
    await this.page.goto('/');
    await expect(this.welcomeTitle).toBeVisible();
  }

  async sendContactMessage(message: Partial<ContactMessage>) {
    // Étape « boxée » (docs: test-annotations) : le rapport affiche une seule étape
    // métier, et une erreur pointe vers l'appel dans le test, pas vers le Page Object.
    await test.step(
      `Envoyer le message de contact « ${message.subject ?? ''} »`,
      async () => {
        await this.contact.name.fill(message.name ?? '');
        await this.contact.email.fill(message.email ?? '');
        await this.contact.phone.fill(message.phone ?? '');
        await this.contact.subject.fill(message.subject ?? '');
        await this.contact.description.fill(message.description ?? '');
        await this.contact.submit.click();
      },
      { box: true },
    );
  }

  thankYouMessage(name: string) {
    return this.page.getByText(`Thanks for getting in touch ${name}`);
  }

  errorMessage(text: string) {
    return this.page.getByText(text, { exact: true });
  }

  dateInputs() {
    return this.page
      .locator('form', { has: this.page.getByRole('button', { name: 'Check Availability' }) })
      .locator('input');
  }
}
