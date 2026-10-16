// Page de détail d'un équipement et de réservation.
// On lit l'id dans l'URL puis on cherche l'équipement dans Data.
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Data } from '../../services/data';
import { Auth } from '../../services/auth';

@Component({
  imports: [RouterLink],
  selector: 'app-materiel-detail',
  styleUrl: './materiel-detail.css',
  templateUrl: './materiel-detail.html',
})
export class MaterielDetail {
  private route = inject(ActivatedRoute);
  protected data = inject(Data); 
  protected auth = inject(Auth);
  readonly message = signal<string | null>(null);

  private readonly id = toSignal(
    // Number transforme le paramètre texte en nombre.
    this.route.paramMap.pipe(map(p => Number(p.get('id')))),
    { initialValue: NaN }  
  );

  // computed retrouve automatiquement le bon équipement.
  readonly equipement = computed(() =>  
    this.data.equipements().find(e => e.id === this.id()) 
  );

  // On réserve et on affiche le message renvoyé par le service.
  reserver(equipementId: number) {
    const compte = this.auth.compte();
    if (!compte || !this.auth.estEtudiant()) {
      this.message.set('Seuls les étudiants peuvent réserver du matériel.');
      return;
    }
    const erreur = this.data.reserver(equipementId, compte.id);
    this.message.set(erreur ?? 'Réservation effectuée.');
  }
}