import { expect, type Locator, type Page } from '@playwright/test';

export class AdminLoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    this.username = page.locator('#username');
    this.password = page.locator('#password');
    this.loginButton = page.locator('#doLogin');
  }

  async open() {
    await this.page.goto('/admin');
    await expect(this.loginButton).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
