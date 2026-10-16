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

  choisir(id: number) {
    this.auth.connecter(id);
    this.router.navigate(['/catalogue'], { replaceUrl: true });
  }
}
