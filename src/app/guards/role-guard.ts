// Ces guards vérifient le rôle avant d'ouvrir une page.
// Sans session, on va vers /login ; avec le mauvais rôle, vers /acces-refuse.
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

// La page de gestion est réservée au responsable.
export const responsableGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  if (!auth.estConnecte()) return router.createUrlTree(['/login']);
  return auth.estResponsable() ? true : router.createUrlTree(['/acces-refuse']);
};

// Les réservations sont réservées à l'étudiant.
export const etudiantGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  if (!auth.estConnecte()) return router.createUrlTree(['/login']);
  return auth.estEtudiant() ? true : router.createUrlTree(['/acces-refuse']);
};
