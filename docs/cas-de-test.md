# Catalogue des cas de test

Statut d'automatisation : ✅ automatisé · 🧪 manuel / exploratoire

| ID | US | Titre | Type | Préconditions | Résultat attendu | Sévérité | Auto |
|---|---|---|---|---|---|---|---|
| TC-ACC-01 | US-01 | Présentation de l'établissement | E2E | Site accessible | Titre de bienvenue et section « Our Rooms » visibles | Critique | ✅ |
| TC-ACC-02 | US-01 | Chambres réservables | E2E | ≥ 1 chambre en base | Chaque chambre a un lien « Book now » vers `/reservation/{id}` | Majeure | ✅ |
| TC-ACC-03 | US-01 | Recherche de disponibilité | E2E | — | Champs d'arrivée et de départ présents | Mineure | ✅ |
| TC-CON-01 | US-02 | Message valide | E2E | Jeu `contact-messages/valide` | Remerciement personnalisé avec le nom saisi | Critique | ✅ |
| TC-CON-02 | US-02 | Formulaire vide | E2E | — | Erreurs « may not be blank » pour nom, sujet, message | Majeure | ✅ |
| TC-CON-03 | US-02 | Règles de validation (4 cas) | E2E | Jeux `telephone-court`, `sujet-court`, `message-court`, `email-invalide` | Message d'erreur de la règle concernée | Majeure | ✅ |
| TC-ADM-01 | US-03 | Connexion valide | E2E | Compte admin de démo | Redirection vers `/admin/rooms` | Critique | ✅ |
| TC-ADM-02 | US-03 | Connexion refusée (2 cas) | E2E / Sécurité | — | Pas d'accès au back-office, formulaire toujours affiché | Critique | ✅ |
| TC-INT-01 | US-01 | Chambres API = chambres affichées | Intégration | — | Chaque type de chambre de `/api/room` est affiché | Majeure | ✅ |
| TC-INT-02 | US-01 | Nom de l'établissement API = page | Intégration | — | Le nom de `/api/branding` apparaît dans le titre | Mineure | ✅ |
| TC-INT-03 | US-02 | Règles de validation API = interface | Intégration | — | Les erreurs renvoyées par `/api/message` sont celles affichées | Majeure | ✅ |
| TC-API-01 | US-04 | Disponibilité de l'API (`/ping`) | API | — | `201 Created` | Critique | ✅ |
| TC-API-02 | US-04 | Authentification et jeton | API | Compte API de démo | `200` + jeton non vide | Critique | ✅ |
| TC-API-03 | US-04 | Création de réservation (3 jeux) | API | Jeu `bookings/*` | `200`, identifiant retourné, corps identique à la demande | Critique | ✅ |
| TC-API-04 | US-04 | Consultation par identifiant | API | Réservation créée | `200`, données conformes | Critique | ✅ |
| TC-API-05 | US-04 | Recherche par nom | API | Réservation créée | L'identifiant figure dans `/booking?firstname=&lastname=` | Majeure | ✅ |
| TC-API-06 | US-04 | Modification complète (PUT) | API | Jeton valide | `200`, nouvelles valeurs persistées | Critique | ✅ |
| TC-API-07 | US-04 | Modification partielle (PATCH) | API | Jeton valide | Seuls les champs envoyés changent | Majeure | ✅ |
| TC-API-08 | US-04 | Annulation (DELETE) | API | Jeton valide | `201`, puis `404` en consultation | Critique | ✅ |
| TC-API-09 | US-04 | Réservation inexistante | API | — | `404` | Mineure | ✅ |
| TC-SEC-01 | US-05 | Modification sans jeton | API / Sécurité | — | `403`, données inchangées | Critique | ✅ |
| TC-SEC-02 | US-05 | Suppression avec jeton invalide | API / Sécurité | — | `403`, réservation toujours présente | Critique | ✅ |
| TC-SEC-03 | US-05 | Authentification avec mauvais mot de passe | API / Sécurité | — | Pas de jeton (`Bad credentials`) | Critique | ✅ |
| TC-PERF-01 | US-06 | Smoke de charge | Charge | — | 1 VU, p95 < 2 s, 0 % d'erreur | Majeure | ✅ |
| TC-PERF-02 | US-06 | Charge nominale | Charge | — | 5 VUs / 1 min, p95 < 2 s, erreurs < 1 % | Majeure | ✅ |
| TC-EXP-01 | US-04 | Exploration des cas limites de dates | API | Bruno | Comportement documenté dans une anomalie si incohérent | Majeure | 🧪 |
