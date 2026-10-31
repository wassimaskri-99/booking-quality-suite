# language: fr
@US-02 @e2e
Fonctionnalité: Formulaire de contact
  En tant que visiteur
  Je veux envoyer un message à l'établissement
  Afin de poser une question avant de réserver

  Règles métier (spécification de l'API /api/message) :
  - Nom, e-mail, téléphone, sujet et message sont obligatoires
  - Téléphone : 11 à 21 caractères
  - Sujet : 5 à 100 caractères
  - Message : 20 à 2000 caractères

  Contexte:
    Étant donné que je suis sur la page d'accueil

  @smoke @critique @TC-CON-01
  Scénario: Envoi d'un message valide
    Quand j'envoie le message de contact "valide" du jeu de données
    Alors un message de remerciement personnalisé est affiché

  @regression @majeur @TC-CON-02
  Scénario: Envoi d'un formulaire vide
    Quand j'envoie le formulaire de contact sans le remplir
    Alors les erreurs suivantes sont affichées :
      | Name may not be blank    |
      | Subject may not be blank |
      | Message may not be blank |

  @regression @majeur @TC-CON-03
  Plan du Scénario: Contrôle des règles de validation
    Quand j'envoie le message de contact "<cas>" du jeu de données
    Alors l'erreur "<erreur>" est affichée

    Exemples:
      | cas               | erreur                                               |
      | telephone-court   | Phone must be between 11 and 21 characters.          |
      | sujet-court       | Subject must be between 5 and 100 characters.        |
      | message-court     | Message must be between 20 and 2000 characters.      |
      | email-invalide    | must be a well-formed email address                  |
