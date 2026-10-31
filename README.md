# Booking Quality Suite

[![Quality pipeline](https://github.com/wassimaskri-99/booking-quality-suite/actions/workflows/quality.yml/badge.svg)](https://github.com/wassimaskri-99/booking-quality-suite/actions/workflows/quality.yml)
[![Rapport](https://img.shields.io/badge/rapport-live-2ea44f?logo=github)](https://wassimaskri-99.github.io/booking-quality-suite/)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Gherkin](https://img.shields.io/badge/Gherkin-23D96C?logo=cucumber&logoColor=white)
![k6](https://img.shields.io/badge/k6-7D64FF?logo=k6&logoColor=white)
![Bruno](https://img.shields.io/badge/Bruno-F4AA41)
![Postman](https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=white)
![SonarQube](https://img.shields.io/badge/SonarQube-4E9BCD?logo=sonarqube&logoColor=white)
![Azure DevOps](https://img.shields.io/badge/Azure%20DevOps-0078D7?logo=azuredevops&logoColor=white)

Démarche qualité complète sur une application de réservation, **de la User Story au rapport de campagne** :
critères d'acceptance en Gherkin, plan et cas de test, tests automatisés E2E, d'intégration et API,
tests de charge, jeux de données versionnés, analyse de code, pipelines CI/CD et alertes.

**Application testée** : [Shady Meadows B&B](https://automationintesting.online) (site + back-office) et son API de réservation
[restful-booker](https://restful-booker.herokuapp.com) — deux applications de démonstration publiques prévues pour l'entraînement aux tests.

---

## Activités de test couvertes

| Activité | Où le trouver |
|---|---|
| **Identifier les cas de test** depuis les User Stories | [`docs/user-stories.md`](docs/user-stories.md) → [`docs/cas-de-test.md`](docs/cas-de-test.md) (26 cas, sévérité, traçabilité US) |
| **Plan de test** et stratégie | [`docs/plan-de-test.md`](docs/plan-de-test.md) · [`docs/strategie-de-test.md`](docs/strategie-de-test.md) |
| **Critères d'acceptance en Gherkin** | [`features/*.feature`](features/) — en français, exécutés tels quels par `playwright-bdd` |
| **Non-régression** identifiée et exécutée | Tags `@smoke` / `@regression`, à chaque push + chaque nuit |
| **Tests API** | [`tests/api/`](tests/api/) (Playwright) · [`api-collections/bruno`](api-collections/bruno) · [`api-collections/postman`](api-collections/postman) |
| **Tests automatisés end-to-end** | [`features/`](features/) + [`steps/`](steps/) + Page Objects [`pages/`](pages/) |
| **Tests automatisés d'intégration** | [`tests/integration/`](tests/integration/) : l'interface affiche-t-elle ce que renvoie l'API ? |
| **Tests de charge automatisés** | [`load/k6/`](load/k6/) : smoke (1 VU) et charge nominale (5 VUs) avec seuils p95 / taux d'erreur |
| **Vulnérabilités / analyse de code** | [`sonar-project.properties`](sonar-project.properties) (SonarQube) · ESLint · `npm audit` dans le pipeline |
| **Jeux de données** : création, publication, mise à niveau | [`test-data/`](test-data/) + [`scripts/test-data.mjs`](scripts/test-data.mjs) (`validate`, `publish`, `bump`) |
| **Rédaction et suivi des anomalies** | Formulaire [`.github/ISSUE_TEMPLATE/anomalie.yml`](.github/ISSUE_TEMPLATE/anomalie.yml) + grille de sévérité du plan |
| **Rapports de synthèse classés** | [`scripts/campaign-report.mjs`](scripts/campaign-report.mjs) : par type et par sévérité, verdict selon les critères de sortie |
| **Analyse quotidienne + remontée d'alertes** | Campagne de nuit 06:00 → issue `alerte-qualite` ouverte si échec, fermée au retour au vert |
| **Amélioration de la qualité** (préventif / correctif) | [`docs/strategie-de-test.md`](docs/strategie-de-test.md#amélioration-continue) |
| **Azure DevOps** | [`azure-pipelines.yml`](azure-pipelines.yml) (mêmes étapes, résultats publiés dans l'onglet *Tests*) |
| **Scrum** | Gherkin écrit à l'affinage, Definition of Done qualité dans [`docs/user-stories.md`](docs/user-stories.md) |

---

## Architecture

```
features/            Critères d'acceptance Gherkin (français)       ─┐
steps/               Implémentation des étapes                       ├─ E2E
pages/               Page Objects                                   ─┘
fixtures/            Fixtures Playwright + liaison BDD
tests/integration/   Cohérence API ↔ interface
tests/api/           API : CRUD, sécurité (Playwright request)
api/                 Client de l'API de réservation
api-collections/     Bruno et Postman (mêmes scénarios, exécutés en CI)
load/k6/             Tests de charge
test-data/           Jeux de données versionnés + README
scripts/             Gestion des données, rapport de campagne
docs/                User Stories, plan, stratégie, catalogue des cas
.github/             Pipeline GitHub Actions, formulaire d'anomalie
azure-pipelines.yml  Pipeline Azure DevOps
```

## Pipeline

```
push / PR / nuit
   │
   ├─ Analyse statique ── jeux de données · TypeScript · ESLint · npm audit · SonarQube
   │
   ├─ Tests fonctionnels ── Gherkin E2E · intégration · API ──► rapport de synthèse ──► GitHub Pages
   ├─ Collections API ───── Bruno · Postman/Newman
   ├─ Charge ────────────── k6 smoke (toujours) · charge nominale (nuit)
   │
   └─ Alerte (nuit) ─────── issue « alerte-qualite » ouverte / mise à jour / fermée
```

## Lancer en local

```bash
npm ci
npx playwright install chromium

npm test                  # campagne complète (E2E Gherkin + intégration + API)
npm run test:smoke        # tests @smoke uniquement
npm run test:api          # API uniquement
npm run test:bruno        # collection Bruno
npm run test:postman      # collection Postman (Newman)
npm run load:smoke        # k6 (nécessite k6 installé)
npm run data:validate     # contrôle des jeux de données
npm run report            # rapport de synthèse de campagne
npm run report:open       # rapport HTML Playwright
```

Les URL et comptes de démonstration sont dans [`config/env.ts`](config/env.ts) et peuvent être surchargés par variables d'environnement (`WEB_URL`, `BOOKING_API_URL`, …).

## Conventions

- **Tags** : `@US-xx` (User Story), `@TC-xxx` (cas de test), `@critique` / `@majeur` / `@mineur` (sévérité), `@smoke` / `@regression` (campagne).
- **Sélecteurs** : rôles accessibles et `data-testid`, jamais de XPath positionnel ni d'attente fixe (`waitForTimeout` interdit par ESLint).
- **Données** : chaque test crée ses propres données (suffixe unique) et les supprime.
- **Échecs** : trace, capture et vidéo conservées ; tests relancés avec succès signalés *instables*.

## Auteur

**Wassim Askri** — QA Automation Engineer · ISTQB® CTFL v4.0
[LinkedIn](https://www.linkedin.com/in/wassim-askri) · [GitHub](https://github.com/wassimaskri-99)
