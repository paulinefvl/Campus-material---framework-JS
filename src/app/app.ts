import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from './services/auth';
import { Data } from './services/data';

/**
 * Composant racine de l'application.
 * Il affiche l'en-tête, la navigation et le contenu de la route active.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected auth = inject(Auth);
  protected data = inject(Data);
  private router = inject(Router);

  /** Déconnecte le compte courant puis redirige vers l'écran de connexion. */
  deconnecter() {
    this.auth.deconnecter();
    this.router.navigate(['/login']);
  }
}