// Carte d'un équipement dans le catalogue.
// Les input() servent à recevoir les données envoyées par le parent.
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Equipement } from '../../data/donnees-initiales';

@Component({
  imports: [RouterLink],
  selector: 'app-equipement-card',
  styleUrl: './equipement-card.css',
  templateUrl: './equipement-card.html',
})
export class EquipementCard {
  readonly equipement = input.required<Equipement>();
  readonly disponible = input.required<boolean>();
}