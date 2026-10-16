import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from './services/auth';
import { Data } from './services/data';

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

  deconnecter() {
    this.auth.deconnecter();
    this.router.navigate(['/login']);
  }
}