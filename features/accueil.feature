# language: fr
@US-01 @e2e
Fonctionnalité: Page d'accueil de l'établissement
  En tant que visiteur
  Je veux voir la présentation de l'établissement et ses chambres
  Afin de choisir où réserver

  Contexte:
    Étant donné que je suis sur la page d'accueil

  @smoke @critique @TC-ACC-01
  Scénario: La page d'accueil présente l'établissement
    Alors le titre de bienvenue de l'établissement est affiché
    Et la section "Our Rooms" est affichée

  @regression @majeur @TC-ACC-02
  Scénario: Chaque chambre proposée peut être réservée
    Alors au moins une chambre est proposée
    Et chaque chambre proposée a un bouton "Book now"

  @regression @mineur @TC-ACC-03
  Scénario: Le formulaire de disponibilité est présent
    Alors la recherche de disponibilité propose une date d'arrivée et une date de départ
