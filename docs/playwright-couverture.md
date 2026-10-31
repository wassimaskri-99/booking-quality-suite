# Couverture de la documentation officielle Playwright

Chaque page de la documentation [playwright.dev/docs](https://playwright.dev/docs/intro) (Node.js, v1.56),
avec son application dans ce projet et le commit qui l'a introduite.

**Légende** : ✅ appliqué · 🟡 partiel · ➖ non applicable à l'application testée (raison donnée)

**Bilan : 65 pages · 51 ✅ · 2 🟡 · 12 ➖ → 51 des 53 pages applicables couvertes (96 %).**

## Getting started

| Page | Statut | Où dans le projet | Commit |
|---|---|---|---|
| [Installation](https://playwright.dev/docs/intro) | ✅ | `package.json`, `playwright.config.ts` | `b1834f5` |
| [Writing tests](https://playwright.dev/docs/writing-tests) | ✅ | `tests/**`, `steps/**` | `b1834f5` |
| [Generating tests](https://playwright.dev/docs/codegen-intro) | ✅ | `npm run codegen` | `aa77742` |
| [Running and debugging tests](https://playwright.dev/docs/running-tests) | ✅ | `test:headed`, `test:debug`, `test:ui` | `aa77742` |
| [Trace viewer](https://playwright.dev/docs/trace-viewer-intro) | ✅ | `trace: 'retain-on-failure'`, `npm run trace` | `b1834f5` · `aa77742` |
| [Setting up CI](https://playwright.dev/docs/ci-intro) | ✅ | `.github/workflows/quality.yml`, `azure-pipelines.yml` | `b1834f5` |
| [VS Code](https://playwright.dev/docs/getting-started-vscode) | ✅ | `.vscode/extensions.json`, `.vscode/settings.json` | `aa77742` |
| Release notes · Canary releases | ➖ | Informatif : version figée `@playwright/test@1.56.1` | — |

## Playwright Test

| Page | Statut | Où dans le projet | Commit |
|---|---|---|---|
| [Agents](https://playwright.dev/docs/test-agents) | ✅ | `.claude/agents/`, `.mcp.json`, `tests/ui/seed.spec.ts`, `specs/` | `4f7ba11` |
| [Annotations](https://playwright.dev/docs/test-annotations) | ✅ | tags `@US/@TC/@critique`, `test.fail()` ANO-001/002, annotations, `test.step({ box })` | `5a17444` · `36a7c26` |
| [Command line](https://playwright.dev/docs/test-cli) | ✅ | `--last-failed`, `--only-changed`, `--repeat-each`, `--shard`, `--grep` | `aa77742` |
| [Configuration](https://playwright.dev/docs/test-configuration) | ✅ | `playwright.config.ts` (timeouts, retries, reporters, snapshots) | `b1834f5` |
| [Configuration (use)](https://playwright.dev/docs/test-use-options) | ✅ | `use` par projet, `test.use()` dans `emulation.spec.ts` | `c074d2c` |
| [Emulation](https://playwright.dev/docs/emulation) | ✅ | projet `mobile` (Pixel 7), locale, fuseau, thème, géolocalisation | `c074d2c` |
| [Fixtures](https://playwright.dev/docs/test-fixtures) | ✅ | fixtures test/worker/auto/option : `api-fixtures.ts`, `events.spec.ts`, `fixtures/` | `9b45520` · `01942b4` |
| [Global setup and teardown](https://playwright.dev/docs/test-global-setup-teardown) | ✅ | projets `health`, `auth`, teardown `cleanup` | `6919e6f` |
| [Parallelism](https://playwright.dev/docs/test-parallel) | ✅ | `fullyParallel`, `describe.configure({ mode: 'serial' })` | `b1834f5` · `5a17444` |
| [Parameterize tests](https://playwright.dev/docs/test-parameterize) | ✅ | boucles de cas, `Plan du Scénario` Gherkin, fixture option `apiCredentials` | `b1834f5` · `9b45520` |
| [Projects](https://playwright.dev/docs/test-projects) | ✅ | 10 projets : setup, api, api-offline, integration, e2e, ui, mobile, admin… | `b1834f5` → `c074d2c` |
| [Reporters](https://playwright.dev/docs/test-reporters) | ✅ | html, junit, json, blob + reporter personnalisé `reporters/severity-reporter.ts` | `d9c8d3c` |
| [Retries](https://playwright.dev/docs/test-retries) | ✅ | `retries: 2` en CI, tests *flaky* signalés | `b1834f5` |
| [Sharding](https://playwright.dev/docs/test-sharding) | ✅ | 3 shards + `merge-reports` (`merge.config.ts`) | `fcfd161` |
| [Timeouts](https://playwright.dev/docs/test-timeouts) | ✅ | test, expect, `toPass`/`poll`, webServer | `b1834f5` · `27539f5` |
| [TypeScript](https://playwright.dev/docs/test-typescript) | ✅ | tout le code de test, `tsc --noEmit` en CI | `b1834f5` |
| [UI Mode](https://playwright.dev/docs/test-ui-mode) | ✅ | `npm run test:ui`, `run-booking-tests-web.command` | `aa77742` |
| [Web server](https://playwright.dev/docs/test-webserver) | ✅ | `webServer` + `mock-server/booking-api.mjs`, projet `api-offline` | `66a6778` |

## Guides

| Page | Statut | Où dans le projet | Commit |
|---|---|---|---|
| [Accessibility testing](https://playwright.dev/docs/accessibility-testing) | ✅ | `@axe-core/playwright`, `tests/ui/accessibility.spec.ts` — **a trouvé ANO-002** | `36a7c26` |
| [Actions](https://playwright.dev/docs/input) | ✅ | `fill`, `click`, `tap`, `scrollIntoViewIfNeeded` | `b1834f5` · `c074d2c` |
| [Assertions](https://playwright.dev/docs/test-assertions) | ✅ | web-first, `expect.soft`, `expect.poll`, `toPass`, matcher `toBeValidBooking` | `27539f5` |
| [API testing](https://playwright.dev/docs/api-testing) | ✅ | `tests/api/**`, `api/BookingClient.ts`, `request.newContext` | `b1834f5` · `9b45520` |
| [Authentication](https://playwright.dev/docs/auth) | ✅ | setup `auth` + `storageState`, projet `admin` | `6919e6f` |
| [Auto-waiting](https://playwright.dev/docs/actionability) | ✅ | aucune attente fixe (`no-wait-for-timeout` en erreur ESLint) | `b1834f5` |
| [Best Practices](https://playwright.dev/docs/best-practices) | ✅ | rôles + `data-testid`, tests isolés, `eslint-plugin-playwright` | `b1834f5` |
| [Browsers](https://playwright.dev/docs/browsers) | 🟡 | Chromium desktop + mobile ; Firefox/WebKit non activés (temps de CI) | `c074d2c` |
| [Clock](https://playwright.dev/docs/clock) | ✅ | `tests/ui/clock.spec.ts` | `e305c7a` |
| [Debugging Tests](https://playwright.dev/docs/debug) | ✅ | `test:debug`, trace, vidéo et capture sur échec | `aa77742` |
| [Evaluating JavaScript](https://playwright.dev/docs/evaluating) | ✅ | `page.evaluate` (langue, fuseau, thème, géoloc, débordement) | `c074d2c` |
| [Events](https://playwright.dev/docs/events) | ✅ | `console`, `pageerror`, `requestfailed` | `01942b4` |
| [Isolation](https://playwright.dev/docs/browser-contexts) | ✅ | visiteur + admin dans deux contextes, `messages.admin.spec.ts` | `df1a410` |
| [Locators](https://playwright.dev/docs/locators) | ✅ | `getByRole`, `getByTestId`, `getByText`, `.and()`, `.filter({ has })` | `b1834f5` · `0726fdf` |
| [Mock APIs](https://playwright.dev/docs/mock) | ✅ | `route.fulfill` (succès / 500), bouchon serveur | `e537cc6` · `66a6778` |
| [Mock browser APIs](https://playwright.dev/docs/mock-browser-apis) | 🟡 | horloge et géolocalisation émulées ; pas d'`addInitScript` personnalisé | `e305c7a` · `c074d2c` |
| [Navigations](https://playwright.dev/docs/navigations) | ✅ | `goto`, `toHaveURL`, navigation par lien et par tap | `b1834f5` |
| [Network](https://playwright.dev/docs/network) | ✅ | `waitForRequest`, `route.abort`, `postDataJSON` | `e537cc6` |
| [Other locators](https://playwright.dev/docs/other-locators) | ✅ | CSS d'attribut `a[href^="/reservation/"]` combiné à un rôle | `0726fdf` |
| [Pages](https://playwright.dev/docs/pages) | ✅ | plusieurs pages / contextes dans un test | `df1a410` |
| [Page object models](https://playwright.dev/docs/pom) | ✅ | `pages/HomePage.ts`, `pages/AdminLoginPage.ts` | `b1834f5` |
| [Screenshots](https://playwright.dev/docs/screenshots) | ✅ | capture sur échec + capture d'élément | `b1834f5` · `496acc3` |
| [Snapshot testing](https://playwright.dev/docs/aria-snapshots) | ✅ | `toMatchAriaSnapshot` navigation + formulaire | `496acc3` |
| [Test generator](https://playwright.dev/docs/codegen) | ✅ | `npm run codegen` | `aa77742` |
| [Touch events](https://playwright.dev/docs/touch-events) | ✅ | `tap()` sur le projet `mobile` (`hasTouch`) | `c074d2c` |
| [Trace viewer](https://playwright.dev/docs/trace-viewer) | ✅ | traces conservées sur échec, `npm run trace` | `b1834f5` |
| [Videos](https://playwright.dev/docs/videos) | ✅ | `video: 'retain-on-failure'` | `b1834f5` |
| [Visual comparisons](https://playwright.dev/docs/test-snapshots) | ✅ | `toHaveScreenshot` + références par OS (`__screenshots__/`) | `496acc3` |
| Component testing | ➖ | L'application testée n'est pas notre code source : pas de composants à monter | — |
| Chrome extensions · WebView2 | ➖ | Ni extension ni application WebView2 dans le périmètre | — |
| Dialogs · Downloads · Frames | ➖ | L'application n'a ni boîte de dialogue, ni téléchargement, ni iframe | — |
| Handles · Service Workers · Extensibility · Library | ➖ | Handles déconseillés au profit des locators ; pas de service worker ; pas de moteur de sélecteur personnalisé nécessaire ; on utilise le test runner, pas la librairie seule | — |

## Anomalies trouvées grâce à ces fonctionnalités

| ID | Trouvée par | Description | Sévérité |
|---|---|---|---|
| ANO-001 | Annotations (`test.fail`) | L'API accepte une réservation avec départ avant arrivée | Majeure |
| ANO-002 | Accessibility testing (axe) | 2 champs de date et le champ Message sans libellé (WCAG 1.3.1 / 4.1.2) | Critique |
