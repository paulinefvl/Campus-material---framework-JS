import { Injectable, effect, signal } from '@angular/core';
import { EQUIPEMENTS_INITIAUX, RESERVATIONS_INITIALES, Equipement, Reservation } from '../data/donnees-initiales';

const CLE_EQUIPEMENTS = 'campus.equipements';
const CLE_RESERVATIONS = 'campus.reservations';

@Injectable({ providedIn: 'root' })
export class Data {
  readonly erreurStockage = signal<string | null>(null);

  private readonly equipementsState = signal<Equipement[]>(this.charger(CLE_EQUIPEMENTS, EQUIPEMENTS_INITIAUX));
  private readonly reservationsState = signal<Reservation[]>(this.charger(CLE_RESERVATIONS, RESERVATIONS_INITIALES));

  readonly equipements = this.equipementsState.asReadonly();
  readonly reservations = this.reservationsState.asReadonly();

  constructor() {
    effect(() => this.sauver(CLE_EQUIPEMENTS, this.equipementsState()));
    effect(() => this.sauver(CLE_RESERVATIONS, this.reservationsState()));
  }

  estDisponible(equipementId: number): boolean {
    return !this.reservations().some(r => r.equipementId === equipementId);
  }

  private charger<T>(cle: string, initial: T): T {
    try {
      const brut = localStorage.getItem(cle);
      if (brut === null) return structuredClone(initial);
      return JSON.parse(brut) as T;
    } catch {
      this.erreurStockage.set('Lecture du stockage impossible : données initiales chargées.');
      return structuredClone(initial);
    }
  }

  private sauver(cle: string, valeur: unknown) {
    try {
      localStorage.setItem(cle, JSON.stringify(valeur));
    } catch {
      this.erreurStockage.set('Enregistrement impossible.');
    }
  }

  reserver(equipementId: number, etudiantId: number): string | null {
    if (!this.equipements().some(e => e.id === equipementId)) return 'Équipement inexistant.';
    if (!this.estDisponible(equipementId)) return 'Équipement déjà réservé.';
    this.reservationsState.update(liste => [...liste, { id: crypto.randomUUID(), equipementId, etudiantId }]);
    return null;
  }

  annuler(reservationId: string, etudiantId: number) {
    this.reservationsState.update(liste =>
      liste.filter(r => r.id !== reservationId || r.etudiantId !== etudiantId)
    );
  }

  reservationsDe(etudiantId: number) {
    return this.reservations().filter(r => r.etudiantId === etudiantId);
  }

  ajouterEquipement(donnees: Omit<Equipement, 'id'>) {
    const nouvelId = Math.max(100, ...this.equipements().map(e => e.id)) + 1;
    this.equipementsState.update(liste => [...liste, { id: nouvelId, ...donnees }]);
  }

  modifierEquipement(id: number, donnees: Omit<Equipement, 'id'>) {
    this.equipementsState.update(liste =>
      liste.map(e => e.id === id ? { ...e, ...donnees } : e)
    );
  }

  supprimerEquipement(id: number): string | null {
    if (!this.estDisponible(id)) {
      return 'Suppression impossible : cet équipement est actuellement réservé.';
    }
    this.equipementsState.update(liste => liste.filter(e => e.id !== id));
    return null;
  }
}