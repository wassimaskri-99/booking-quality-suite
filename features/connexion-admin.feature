# language: fr
@US-03 @e2e
Fonctionnalité: Connexion au back-office
  En tant qu'administrateur
  Je veux me connecter au back-office
  Afin de gérer les chambres et les réservations

  Contexte:
    Étant donné que je suis sur la page de connexion du back-office

  @smoke @critique @TC-ADM-01
  Scénario: Connexion avec des identifiants valides
    Quand je me connecte avec les identifiants administrateur
    Alors j'accède à la gestion des chambres

  @regression @critique @securite @TC-ADM-02
  Plan du Scénario: Connexion refusée avec des identifiants invalides
    Quand je me connecte avec l'utilisateur "<utilisateur>" et le mot de passe "<mot_de_passe>"
    Alors la connexion est refusée
    Et je reste sur la page de connexion

    Exemples:
      | utilisateur | mot_de_passe   |
      | admin       | mauvais-mdp    |
      | inconnu     | password       |
