// Page affichée quand le compte n'a pas le bon rôle.
// Le lien du template permet de revenir au catalogue.
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-acces-refuse',
  styleUrl: './acces-refuse.css',
  templateUrl: './acces-refuse.html',
})
export class AccesRefuse {}