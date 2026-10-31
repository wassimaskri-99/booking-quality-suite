import { test as teardown, expect } from '@playwright/test';
import { existsSync, rmSync } from 'node:fs';

/** Teardown (docs: test-global-setup-teardown) : supprime la session enregistrée. */
teardown('suppression de la session administrateur', async () => {
  rmSync('.auth', { recursive: true, force: true });
  expect(existsSync('.auth')).toBe(false);
});
