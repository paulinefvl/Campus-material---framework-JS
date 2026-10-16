// Ici, on regroupe toutes les routes de l'application.
// L'ordre compte, surtout pour la route joker qui reste à la fin.
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
  // L'accueil renvoie directement vers le catalogue.
  { path: '', pathMatch: 'full', redirectTo: 'catalogue' },
  { path: 'login', component: Login, title: 'Connexion' },
  { path: 'catalogue', component: Catalogue, canActivate: [authGuard], title: 'Catalogue' },
  { path: 'materiels/:id', component: MaterielDetail, canActivate: [authGuard], title: 'Fiche matériel' },
  { path: 'mes-reservations', component: MesReservations, canActivate: [etudiantGuard], title: 'Mes réservations' },
  {
    path: 'gestion', canActivate: [responsableGuard], title: 'Gestion du catalogue',
    // La gestion est chargée seulement quand on en a besoin.
    loadComponent: () => import('./pages/gestion/gestion').then(m => m.Gestion)
  },
  {
    path: 'gestion/nouveau', canActivate: [responsableGuard], title: 'Nouvel équipement',
    // L'URL permet au même formulaire de créer ou de modifier.
    loadComponent: () => import('./pages/equipement-form/equipement-form').then(m => m.EquipementForm)
  },
  {
    path: 'gestion/:id/modifier', canActivate: [responsableGuard], title: 'Modifier un équipement',
    loadComponent: () => import('./pages/equipement-form/equipement-form').then(m => m.EquipementForm)
  },
  { path: 'acces-refuse', component: AccesRefuse, title: 'Accès refusé' },
  // Cette route doit rester en dernier pour ne pas bloquer les autres.
  { path: '**', component: NotFound, title: 'Page introuvable' },
];