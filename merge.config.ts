import { defineConfig } from '@playwright/test';

/**
 * Configuration de fusion des rapports de shards (docs: test-sharding).
 *   npx playwright merge-reports --config merge.config.ts ./all-blob-reports
 */
export default defineConfig({
  testDir: '.',
  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    ['json', { outputFile: 'reports/json/results.json' }],
    ['./reporters/severity-reporter.ts'],
  ],
});
