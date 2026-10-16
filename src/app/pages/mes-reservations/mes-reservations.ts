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

  readonly mesReservations = computed(() => {
    const compte = this.auth.compte();
    if (!compte) return [];
    return this.data.reservationsDe(compte.id).map(r => ({
      reservation: r,
      equipement: this.data.equipements().find(e => e.id === r.equipementId)
    }));
  });

  annuler(reservationId: string) {
    const compte = this.auth.compte();
    if (compte) this.data.annuler(reservationId, compte.id);
  }
}