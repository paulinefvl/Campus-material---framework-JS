import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const responsableGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  if (!auth.estConnecte()) return router.createUrlTree(['/login']);
  return auth.estResponsable() ? true : router.createUrlTree(['/acces-refuse']);
};

export const etudiantGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  if (!auth.estConnecte()) return router.createUrlTree(['/login']);
  return auth.estEtudiant() ? true : router.createUrlTree(['/acces-refuse']);
};
