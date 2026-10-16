import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Data } from '../../services/data';
import { CATEGORIES, Categorie } from '../../data/donnees-initiales';

function minSansEspaces(min: number): ValidatorFn {
  return (control: AbstractControl) =>
    control.value.trim().length >= min ? null : { minSansEspaces: true };
}

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-equipement-form',
  styleUrl: './equipement-form.css',
  templateUrl: './equipement-form.html',
})
export class EquipementForm {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private data = inject(Data);

  readonly categories = CATEGORIES;

  private readonly idParam = this.route.snapshot.paramMap.get('id');
  readonly modeEdition = this.idParam !== null;
  private readonly id = Number(this.idParam);
  readonly introuvable = signal(false);

  readonly form = new FormGroup({
    nom: new FormControl('', { nonNullable: true, validators: [minSansEspaces(3)] }),
    categorie: new FormControl<Categorie | ''>('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [minSansEspaces(10)] }),
    localisation: new FormControl('', { nonNullable: true, validators: [minSansEspaces(1)] }),
  });

  constructor() {
    if (this.modeEdition) {
      const equipement = this.data.equipements().find(e => e.id === this.id);
      if (equipement) {
        this.form.setValue({
          nom: equipement.nom,
          categorie: equipement.categorie,
          description: equipement.description,
          localisation: equipement.localisation,
        });
      } else {
        this.introuvable.set(true);
      }
    }
  }

  enregistrer() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const donnees = {
      nom: v.nom.trim(),
      categorie: v.categorie as Categorie,
      description: v.description.trim(),
      localisation: v.localisation.trim(),
    };
    if (this.modeEdition) {
      this.data.modifierEquipement(this.id, donnees);
    } else {
      this.data.ajouterEquipement(donnees);
    }
    this.router.navigate(['/gestion']);
  }
}