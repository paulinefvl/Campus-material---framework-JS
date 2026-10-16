// Page de gestion du catalogue pour le responsable.
// On confirme les suppressions et on affiche le résultat.
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Data } from '../../services/data';

@Component({
  imports: [RouterLink],
  selector: 'app-gestion',
  styleUrl: './gestion.css',
  templateUrl: './gestion.html',
})
export class Gestion {
  protected data = inject(Data);
  readonly message = signal<string | null>(null);

  // Le service bloque la suppression si l'équipement est réservé.
  supprimer(id: number, nom: string) {
    if (!confirm(`Supprimer « ${nom} » ?`)) return;
    const erreur = this.data.supprimerEquipement(id);
    this.message.set(erreur ?? `« ${nom} » a été supprimé.`);
  }
}