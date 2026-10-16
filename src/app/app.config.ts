// Configuration de départ de l'application standalone.
// On y branche le routeur et les erreurs globales du navigateur.
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

/**
 * Configuration globale de l'application standalone.
 * Elle enregistre notamment le routeur et la gestion des erreurs navigateur.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
