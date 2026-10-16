// Page qui affiche les réservations de l'étudiant connecté.
// Chaque réservation est associée à son équipement pour l'affichage.
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Data } from '../../services/data';
import { Auth } from '../../services/auth';

@Component({
  imports: [RouterLink],
  selector: 'app-mes-reservations',
  styleUrl: './mes-reservations.css',
  templateUrl: './mes-reservations.html',
})
export class MesReservations {
  private data = inject(Data);
  private auth = inject(Auth);

  // computed garde la liste à jour quand la session ou les données changent.
  readonly mesReservations = computed(() => {
    const compte = this.auth.compte();
    if (!compte) return [];
    return this.data.reservationsDe(compte.id).map(r => ({
      reservation: r,
      equipement: this.data.equipements().find(e => e.id === r.equipementId)
    }));
  });

  // L'id du compte est transmis pour ne pas annuler la réservation d'un autre étudiant.
  annuler(reservationId: string) {
    const compte = this.auth.compte();
    if (compte) this.data.annuler(reservationId, compte.id);
  }
}