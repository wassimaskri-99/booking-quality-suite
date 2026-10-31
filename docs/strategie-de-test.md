# Stratégie de test

## Pyramide appliquée

```
            ┌───────────────┐
            │  E2E Gherkin  │  12 scénarios : parcours visibles par l'utilisateur
            ├───────────────┤
            │  Intégration  │  cohérence API ↔ interface
            ├───────────────┤
            │      API      │  CRUD, sécurité, contrats de réponse
            └───────────────┘
   + charge k6 (non fonctionnel)  + analyse statique SonarQube / ESLint
```

L'essentiel de la logique métier est vérifié au niveau **API** (rapide, stable).
Les tests **E2E** couvrent uniquement les parcours critiques, écrits en **Gherkin** pour être lus et validés par le PO.

## Principes

1. **Le Gherkin est la spécification.** Les critères d'acceptance sont rédigés avec le PO pendant l'affinage, puis exécutés tels quels (`playwright-bdd`). Pas de double maintenance.
2. **Tests indépendants.** Chaque test crée ses données et les supprime ; aucun ordre d'exécution n'est supposé.
3. **Sélecteurs robustes.** Rôles accessibles et `data-testid` en priorité, jamais de XPath positionnel.
4. **Classification.** Tags `@critique`, `@majeur`, `@mineur` (sévérité si le test échoue) et `@smoke`, `@regression` (périmètre de campagne). Le rapport de synthèse regroupe les résultats par ces tags.
5. **Traçabilité.** Chaque scénario porte l'ID de sa User Story (`@US-02`) et de son cas de test (`@TC-CON-01`).
6. **Échec = information.** Trace, capture et vidéo sont conservées pour chaque échec ; un test relancé avec succès est signalé *flaky* pour être stabilisé, pas ignoré.

## Campagnes

| Campagne | Contenu | Commande |
|---|---|---|
| Smoke | `@smoke` + API + k6 smoke | `npm run test:smoke` |
| Non-régression | Tous les tests fonctionnels | `npm test` |
| Nuit | Non-régression + Bruno + k6 charge + alerte | pipeline planifié |

## Amélioration continue

- **Préventif** : revue des critères Gherkin avant développement, analyse statique à chaque push, quality gate bloquante.
- **Correctif** : chaque anomalie corrigée reçoit un test de non-régression avant fermeture.
- **Suivi** : taux de réussite, tests flaky et durée de campagne suivis dans le rapport de synthèse.
