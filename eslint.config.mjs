import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  { ignores: ['node_modules', '.features-gen', 'reports', 'test-results', 'playwright-report'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['tests/**/*.ts', 'steps/**/*.ts', 'pages/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-force-option': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'warn',
      // Les assertions des tests BDD vivent dans les fichiers steps/.
      'playwright/expect-expect': ['warn', { assertFunctionNames: ['expect'] }],
    },
  },
  {
    // Étapes Gherkin et Page Objects : les assertions y sont légitimes hors bloc test().
    files: ['steps/**/*.ts', 'pages/**/*.ts'],
    rules: { 'playwright/no-standalone-expect': 'off' },
  },
  {
    files: ['scripts/**/*.mjs', 'load/**/*.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        __ENV: 'readonly',
        __VU: 'readonly',
        __ITER: 'readonly',
        open: 'readonly',
      },
    },
  },
);
