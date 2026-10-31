# User Stories couvertes

Application testée : **Shady Meadows B&B** ([restful-booker-platform](https://automationintesting.online)),
un site de réservation de chambres avec back-office, et son API de réservation
([restful-booker](https://restful-booker.herokuapp.com)).

Chaque User Story a des critères d'acceptance rédigés en **Gherkin** dans `features/`.
Ces fichiers sont à la fois la spécification fonctionnelle et les tests automatisés.

| ID | User Story | Critères d'acceptance | Priorité |
|---|---|---|---|
| US-01 | En tant que **visiteur**, je veux voir la présentation de l'établissement et ses chambres, afin de choisir où réserver. | [`features/accueil.feature`](../features/accueil.feature) | Haute |
| US-02 | En tant que **visiteur**, je veux envoyer un message à l'établissement, afin de poser une question avant de réserver. | [`features/contact.feature`](../features/contact.feature) | Haute |
| US-03 | En tant qu'**administrateur**, je veux me connecter au back-office, afin de gérer les chambres et les réservations. | [`features/connexion-admin.feature`](../features/connexion-admin.feature) | Critique |
| US-04 | En tant que **système partenaire**, je veux créer, consulter, modifier et annuler une réservation par API. | `tests/api/booking.api.spec.ts` + collections Bruno / Postman | Critique |
| US-05 | En tant que **système partenaire**, je veux que l'API refuse les modifications non authentifiées. | `tests/api/booking-security.api.spec.ts` | Critique |
| US-06 | En tant qu'**exploitant**, je veux que l'API de réservation tienne la charge d'un pic de trafic. | `load/k6/*.js` | Haute |

## Définition of Done (qualité)

- Critères d'acceptance Gherkin relus avec le PO et automatisés.
- Cas de test référencés dans le [plan de test](plan-de-test.md) et le [catalogue](cas-de-test.md).
- Tests de non-régression verts dans le pipeline (GitHub Actions / Azure DevOps).
- Aucune anomalie bloquante ou critique ouverte.
- Quality gate SonarQube validée (pas de nouvelle vulnérabilité ni de bug bloquant).
