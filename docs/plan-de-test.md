# Plan de test — Shady Meadows B&B

| | |
|---|---|
| **Version** | 1.0 |
| **Application** | Site de réservation + back-office ([restful-booker-platform](https://automationintesting.online)) et API de réservation ([restful-booker](https://restful-booker.herokuapp.com)) |
| **Référentiel** | [User Stories](user-stories.md) · [Catalogue des cas de test](cas-de-test.md) · [Stratégie](strategie-de-test.md) |
| **Méthode** | Scrum : les critères d'acceptance Gherkin sont écrits pendant l'affinage, avant le développement |

## 1. Objectifs

1. Vérifier que chaque User Story respecte ses critères d'acceptance.
2. Protéger les parcours critiques par une **non-régression automatisée** exécutée à chaque modification et chaque nuit.
3. Mesurer le comportement de l'API de réservation sous charge.
4. Fournir à l'équipe un **rapport de synthèse** lisible après chaque campagne.

## 2. Périmètre

| Dans le périmètre | Hors périmètre |
|---|---|
| Page d'accueil, formulaire de contact, connexion back-office (UI) | Paiement (non disponible dans l'application) |
| API de réservation : authentification, CRUD, sécurité | Compatibilité navigateurs autres que Chromium (prévue en v2) |
| Cohérence API ↔ interface | Tests d'accessibilité complets (audit axe prévu en v2) |
| Charge de l'API (smoke, charge nominale) | Tests de sécurité intrusifs (pentest) |

## 3. Types de tests

| Niveau | Outil | Où | Déclenchement |
|---|---|---|---|
| Acceptance / E2E (Gherkin) | Playwright + playwright-bdd | `features/`, `steps/` | Chaque push, PR, nuit |
| Intégration API ↔ UI | Playwright | `tests/integration/` | Chaque push, PR, nuit |
| API fonctionnelle et sécurité | Playwright `request` | `tests/api/` | Chaque push, PR, nuit |
| API exploratoire / manuelle | Bruno, Postman | `api-collections/` | Chaque push (Bruno CLI) + à la demande |
| Charge (non fonctionnel) | k6 | `load/k6/` | Smoke à chaque push, charge chaque nuit |
| Analyse de code / vulnérabilités | SonarQube (SonarCloud), ESLint, npm audit | `sonar-project.properties` | Chaque push |

## 4. Données de test

Jeux versionnés dans `test-data/datasets/` (voir [README des données](../test-data/README.md)).
Chaque exécution ajoute un suffixe unique aux données créées pour éviter les collisions entre exécutions parallèles.
Les ressources créées par les tests API sont supprimées en fin de test.

## 5. Critères d'entrée et de sortie

**Entrée** : User Story prête (critères Gherkin validés), environnement de test disponible (`/ping` répond).

**Sortie d'une campagne** :
- 100 % des tests `@critique` passés.
- ≥ 95 % de l'ensemble des tests passés, chaque échec analysé et rattaché à une anomalie.
- Aucune anomalie bloquante ou critique ouverte.
- Seuils k6 respectés (p95 < 2 s, erreurs < 1 %).
- Quality gate SonarQube validée.

## 6. Gestion des anomalies

Formulaire d'anomalie : [`.github/ISSUE_TEMPLATE/anomalie.yml`](../.github/ISSUE_TEMPLATE/anomalie.yml).

| Sévérité | Définition | Délai de correction attendu |
|---|---|---|
| Bloquante | Parcours critique impossible, pas de contournement | Immédiat |
| Critique | Parcours critique dégradé ou faille de sécurité | Dans le sprint |
| Majeure | Fonctionnalité secondaire en échec | Sprint suivant |
| Mineure | Défaut cosmétique ou de libellé | Backlog |

## 7. Reporting et alertes

- **Après chaque exécution** : rapport HTML Playwright, résultats JUnit, rapport de synthèse de campagne (`scripts/campaign-report.ts`) affiché dans le résumé du pipeline.
- **Chaque nuit (06:00 Tunis)** : campagne complète + charge ; en cas d'échec, une **issue d'alerte** est ouverte (ou mise à jour) automatiquement avec le résumé.
- Le dernier rapport HTML est publié sur GitHub Pages.

## 8. Risques

| Risque | Impact | Mitigation |
|---|---|---|
| Environnements de démo publics lents ou réinitialisés | Faux échecs | 2 relances en CI, tests marqués *flaky* dans le rapport, données créées par le test lui-même |
| Données partagées entre testeurs | Collisions | Suffixe unique par exécution, nettoyage en fin de test |
| Charge sur un service public | Gêne pour les autres utilisateurs | Charge volontairement limitée (≤ 5 VUs, 1 min), exécutée une fois par nuit |
