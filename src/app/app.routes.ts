import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { etudiantGuard, responsableGuard } from './guards/role-guard';
import { Login } from './pages/login/login';
import { Catalogue } from './pages/catalogue/catalogue';
import { MaterielDetail } from './pages/materiel-detail/materiel-detail';
import { MesReservations } from './pages/mes-reservations/mes-reservations';
import { AccesRefuse } from './pages/acces-refuse/acces-refuse';
import { NotFound } from './pages/not-found/not-found';

/**
 * Déclare les routes publiques et protégées de l'application.
 * Les routes sont ordonnées du cas le plus précis vers le joker final.
 */
export const routes: Routes = [
  // La redirection d'accueil doit être évaluée avant les routes métier.
  { path: '', pathMatch: 'full', redirectTo: 'catalogue' },
  { path: 'login', component: Login, title: 'Connexion' },
  { path: 'catalogue', component: Catalogue, canActivate: [authGuard], title: 'Catalogue' },
  { path: 'materiels/:id', component: MaterielDetail, canActivate: [authGuard], title: 'Fiche matériel' },
  { path: 'mes-reservations', component: MesReservations, canActivate: [etudiantGuard], title: 'Mes réservations' },
  {
    path: 'gestion', canActivate: [responsableGuard], title: 'Gestion du catalogue',
    // La gestion est chargée à la demande pour alléger le premier chargement.
    loadComponent: () => import('./pages/gestion/gestion').then(m => m.Gestion)
  },
  {
    path: 'gestion/nouveau', canActivate: [responsableGuard], title: 'Nouvel équipement',
    loadComponent: () => import('./pages/equipement-form/equipement-form').then(m => m.EquipementForm)
  },
  {
    path: 'gestion/:id/modifier', canActivate: [responsableGuard], title: 'Modifier un équipement',
    loadComponent: () => import('./pages/equipement-form/equipement-form').then(m => m.EquipementForm)
  },
  { path: 'acces-refuse', component: AccesRefuse, title: 'Accès refusé' },
  // Le joker doit rester en dernier pour ne pas intercepter une route valide.
  { path: '**', component: NotFound, title: 'Page introuvable' },
];