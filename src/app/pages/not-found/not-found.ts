// Page affichée quand l'URL ne correspond à aucune route.
// Le lien du template permet de revenir à l'accueil.
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-not-found',
  styleUrl: './not-found.css',
  templateUrl: './not-found.html',
})
export class NotFound {}