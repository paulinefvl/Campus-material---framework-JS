// Ce guard protège les pages qui demandent une connexion.
// On renvoie true si la personne est connectée, sinon un UrlTree vers /login.
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

// Sans session, on revient à la page de connexion.
export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  return auth.estConnecte() ? true : router.createUrlTree(['/login']);
};