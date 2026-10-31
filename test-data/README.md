# Jeux de données de test

| Jeu | Fichier | Utilisé par |
|---|---|---|
| `contact-messages` | `datasets/contact-messages.json` | Scénarios Gherkin du formulaire de contact, tests d'intégration |
| `bookings` | `datasets/bookings.json` | Tests API Playwright, tests de charge k6 |

## Cycle de vie

| Étape | Commande | Ce qui se passe |
|---|---|---|
| **Créer** | ajouter un cas dans le JSON | Un cas = une intention de test (`valide`, `telephone-court`…) |
| **Valider** | `npm run data:validate` | Structure, version semver et **règles métier** : un cas invalide doit enfreindre *une seule* règle, celle qu'il teste |
| **Publier** | `npm run data:publish` | Manifeste versionné (`reports/test-data/manifest.json` : version, nb de cas, empreinte SHA-256) publié comme artefact du pipeline |
| **Mettre à niveau** | `npm run data:bump -- bookings minor` | Incrémente la version et la date de mise à jour |

## Règles

- Les tests lisent les jeux via `test-data/index.ts`, qui renvoie une **copie** : un test ne modifie jamais le jeu partagé.
- Les données créées dans l'application reçoivent un **suffixe unique** (`runId()`) et sont supprimées en fin de test.
- Aucune donnée personnelle réelle : noms et e-mails fictifs (`example.com`).
