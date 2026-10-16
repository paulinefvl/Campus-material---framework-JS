import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Data } from '../../services/data';

@Component({
  imports: [RouterLink],
  selector: 'app-materiel-detail',
  styleUrl: './materiel-detail.css',
  templateUrl: './materiel-detail.html',
})
export class MaterielDetail {
  private route = inject(ActivatedRoute);
  protected data = inject(Data); 

  private readonly id = toSignal(
    this.route.paramMap.pipe(map(p => Number(p.get('id')))),
    { initialValue: NaN }  
  );

  readonly equipement = computed(() =>  
    this.data.equipements().find(e => e.id === this.id()) 
  );
}