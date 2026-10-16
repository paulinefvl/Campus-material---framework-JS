// Page du catalogue avec la recherche et le filtre par catégorie.
// La liste se recalcule quand la recherche ou les données changent.
import { Component, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Data } from '../../services/data';
import { CATEGORIES } from '../../data/donnees-initiales';
import { EquipementCard } from '../../components/equipement-card/equipement-card';

@Component({
  imports: [ReactiveFormsModule, EquipementCard],
  selector: 'app-catalogue',
  styleUrl: './catalogue.css',
  templateUrl: './catalogue.html',
})
export class Catalogue {
  protected data = inject(Data);
  readonly categories = CATEGORIES;

  readonly recherche = new FormControl('', { nonNullable: true });
  readonly categorie = new FormControl('', { nonNullable: true });

  // toSignal transforme les changements des formulaires en signaux.
  private readonly rechercheValeur = toSignal(this.recherche.valueChanges, { initialValue: '' });
  private readonly categorieValeur = toSignal(this.categorie.valueChanges, { initialValue: '' });

  // computed recalcule la liste sans devoir la mettre à jour à la main.
  readonly equipementsVisibles = computed(() => {
    const texte = this.rechercheValeur().trim().toLowerCase();
    const categorie = this.categorieValeur();
    return this.data.equipements().filter(e =>
      e.nom.toLowerCase().includes(texte) &&
      (categorie === '' || e.categorie === categorie)
    );
  });
}