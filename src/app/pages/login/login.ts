// Page où l'on choisit un compte de démonstration.
// Il n'y a pas de vrai mot de passe dans cette application.
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  imports: [],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})

export class Login {
  protected auth = inject(Auth);
  private router = inject(Router);

  // On connecte le compte choisi puis on ouvre le catalogue.
  choisir(id: number) {
    this.auth.connecter(id);
    this.router.navigate(['/catalogue'], { replaceUrl: true });
  }
}
