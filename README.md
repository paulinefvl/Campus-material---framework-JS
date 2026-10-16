# Campus Matériel

Application monopage de consultation et de réservation de matériel pour un campus,
réalisée avec **Angular** (composants standalone, signals, formulaires réactifs).

Projet final du module Framework JS — Sup de Vinci Rennes.

## Installation et lancement

Prérequis : Node.js v24.15.0 et npm.

```bash
npm install
npm start          # ou ng serve, puis ouvrir http://localhost:4200
```

Build de production :

```bash
npm run build      # résultat dans dist/
```

## Comptes de démonstration

La connexion est **simulée** : on choisit un compte sur la page `/login`, sans mot de passe.

| Compte         | Rôle        | Possibilités                                                    |
| -------------- | ----------- | --------------------------------------------------------------- |
| Alice Martin   | Étudiant    | Consulter, réserver, voir et annuler ses réservations           |
| Yanis Bernard  | Étudiant    | Idem (sert à vérifier que chacun ne voit que ses réservations)  |
| Camille Dupont | Responsable | Consulter le catalogue, créer, modifier, supprimer du matériel  |

## Routes

| Route                   | Contenu                                      | Accès                                         |
| ----------------------- | -------------------------------------------- | --------------------------------------------- |
| `/`                     | Redirection                                  | Vers `/catalogue` si connecté, sinon `/login` |
| `/login`                | Choix du compte de démonstration             | Public                                        |
| `/catalogue`            | Liste, recherche et filtre                   | Utilisateur connecté                          |
| `/materiels/:id`        | Fiche détaillée et réservation               | Connecté ; réservation réservée aux étudiants |
| `/mes-reservations`     | Réservations personnelles                    | Étudiant                                      |
| `/gestion`              | Gestion du catalogue (chargée à la demande)  | Responsable                                   |
| `/gestion/nouveau`      | Création d'un équipement                     | Responsable                                   |
| `/gestion/:id/modifier` | Modification d'un équipement                 | Responsable                                   |
| `/acces-refuse`         | Explication d'un refus                       | Public                                        |
| toute autre URL         | Page 404                                     | Public                                        |

## Fonctionnalités réalisées

- Catalogue de 6 équipements (4 catégories) : recherche par nom, filtre par catégorie,
  indication de disponibilité, accès à la fiche, message si aucun résultat.
- Réservation depuis la fiche (étudiants uniquement), une seule réservation active
  par équipement, page « Mes réservations » avec lien vers la fiche et annulation.
- Gestion du catalogue (responsable) : création, modification et suppression après
  confirmation. Un équipement réservé ne peut pas être supprimé, et le refus est expliqué.
- Un seul composant de formulaire réactif pour la création et la modification,
  avec messages de validation ; les saisies sont conservées en cas d'erreur.
- Routes protégées par des guards : un visiteur est redirigé vers la connexion,
  un utilisateur sans le bon rôle vers `/acces-refuse`. Une URL saisie directement
  est contrôlée de la même façon.
- Persistance dans `localStorage` : catalogue, réservations et session survivent
  au rechargement ; la session est supprimée à la déconnexion.
- Messages pour les cas particuliers : liste vide, recherche sans résultat,
  équipement inexistant, accès refusé, saisie invalide, équipement déjà réservé,
  erreur de lecture ou d'enregistrement du stockage local.

## Choix techniques

- **État partagé** : deux services injectables (`providedIn: 'root'`).
  - `Data` contient le catalogue et les réservations dans des `signal`, exposés en
    lecture seule (`asReadonly`) et modifiés uniquement par les méthodes du service.
  - `Auth` contient le compte connecté ; les rôles sont dérivés avec `computed`.
- **Disponibilité calculée** : aucun champ « disponible » n'est stocké. Un équipement
  est disponible si aucune réservation active ne possède son `equipementId`.
- **Persistance** : au démarrage, une fonction générique `charger<T>()` lit le
  `localStorage` et ne charge les données initiales (copiées avec `structuredClone`)
  que si la clé n'existe pas. Un tableau vide enregistré est donc conservé.
  Des `effect()` sauvegardent automatiquement chaque modification.
  Seul l'id du compte connecté est stocké : le rôle est relu dans la liste officielle.
- **Identifiants** : `crypto.randomUUID()` pour les réservations ; plus grand id
  existant + 1 pour un nouvel équipement (jamais `length + 1`).
- **Règles métier dans le service** : la réservation, l'annulation (uniquement ses
  propres réservations) et le refus de suppression sont vérifiés dans `Data`, et pas
  seulement dans l'interface.
- **Routing** : guards fonctionnels (`CanActivateFn`) qui renvoient `true` ou une
  redirection (`UrlTree`) ; `loadComponent` pour charger l'espace de gestion à la demande ;
  `routerLinkActive` + `ariaCurrentWhenActive` pour le lien actif.
- **Communication entre composants** : `EquipementCard` reçoit l'équipement et sa
  disponibilité par des `input()` depuis la page catalogue.
- **Formulaires** : formulaires réactifs (`FormGroup`, `FormControl`) avec un validateur
  personnalisé `minSansEspaces`, qui refuse les saisies composées uniquement d'espaces
  (`minLength` compte les espaces).

## Trajet d'une réservation

1. **Clic** : sur la fiche `/materiels/:id`, l'étudiant clique sur « Réserver »,
   ce qui appelle `reserver()` dans `MaterielDetail`.
2. **Contrôles** : le composant vérifie que l'utilisateur est un étudiant connecté,
   puis appelle `Data.reserver(equipementId, etudiantId)`. Le service vérifie que
   l'équipement existe et qu'il est disponible. Sinon, il renvoie un message
   d'erreur, qui est affiché.
3. **Mise à jour de l'état** : le service ajoute la réservation
   `{ id: crypto.randomUUID(), equipementId, etudiantId }` au signal des réservations,
   avec une copie immuable du tableau.
4. **Sauvegarde** : un `effect()` détecte le changement et enregistre les réservations
   dans `localStorage` (clé `campus.reservations`).
5. **Actualisation des vues** : la disponibilité étant calculée à partir des
   réservations, toutes les vues se mettent à jour sans rechargement : le statut de
   la fiche passe à « Réservé », le bouton est désactivé, la carte du catalogue
   change, et « Mes réservations » affiche la nouvelle ligne.

L'annulation suit le même trajet en sens inverse : `Data.annuler()` retire la
réservation, l'`effect()` sauvegarde, et l'équipement redevient disponible partout.

## Accessibilité

Labels associés aux champs, `role="status"` et `role="alert"` pour les messages,
`aria-current` sur le lien actif, en-têtes de tableau avec `scope`, focus visible.

## Structure

```
src/app/
├── data/donnees-initiales.ts      données et types fournis
├── services/data.ts               catalogue, réservations, persistance
├── services/auth.ts               session simulée
├── guards/                        authGuard, etudiantGuard, responsableGuard
├── components/equipement-card/    carte d'équipement (input)
└── pages/                         login, catalogue, materiel-detail, mes-reservations,
                                   gestion, equipement-form, acces-refuse, not-found
```

## Limites connues

- Les données sont locales au navigateur : aucune synchronisation entre ordinateurs
  (comportement attendu par le sujet).
- Les contrôles d'accès sont faits côté frontend uniquement ; dans une vraie
  application, le serveur vérifierait aussi les autorisations.
- Si l'équipement ayant le plus grand id est supprimé, son id peut être réattribué
  au prochain équipement créé.
- Extensions facultatives non réalisées : filtre conservé dans l'URL, retour à la page
  demandée après connexion, compteur par catégorie, réinitialisation des données.

## Outils utilisés

Claude IA : demande d'exemple pour refaire selon le projet
GitHub Copilot : tout le CSS, certains commentaires
Cours de FRAMEWORK JS
