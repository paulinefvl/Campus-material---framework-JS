// Ce service gère les équipements, les réservations et les règles métier.
// Les pages passent par lui pour garder les mêmes règles partout.
import { Injectable, effect, signal } from '@angular/core';
import { EQUIPEMENTS_INITIAUX, RESERVATIONS_INITIALES, Equipement, Reservation } from '../data/donnees-initiales';

const CLE_EQUIPEMENTS = 'campus.equipements';
const CLE_RESERVATIONS = 'campus.reservations';

/**
 * Centralise les équipements, les réservations et les règles métier.
 * Les signaux exposent l'état à l'interface et les effets le persistent
 * automatiquement dans localStorage.
 */
@Injectable({ providedIn: 'root' })
export class Data {
  readonly erreurStockage = signal<string | null>(null);

  private readonly equipementsState = signal<Equipement[]>(this.charger(CLE_EQUIPEMENTS, EQUIPEMENTS_INITIAUX));
  private readonly reservationsState = signal<Reservation[]>(this.charger(CLE_RESERVATIONS, RESERVATIONS_INITIALES));

  readonly equipements = this.equipementsState.asReadonly();
  readonly reservations = this.reservationsState.asReadonly();

  constructor() {
    // Les effects sauvegardent les changements automatiquement.
    effect(() => this.sauver(CLE_EQUIPEMENTS, this.equipementsState()));
    effect(() => this.sauver(CLE_RESERVATIONS, this.reservationsState()));
  }

  // On calcule la disponibilité avec les réservations, sans stocker un champ en plus.
  estDisponible(equipementId: number): boolean {
    return !this.reservations().some(r => r.equipementId === equipementId);
  }

  // Si la clé vaut null, on charge les données de départ ; un tableau vide reste valide.
  private charger<T>(cle: string, initial: T): T {
    try {
      const brut = localStorage.getItem(cle);
      // structuredClone évite de modifier directement les données de départ.
      if (brut === null) return structuredClone(initial);
      return JSON.parse(brut) as T;
    } catch {
      this.erreurStockage.set('Lecture du stockage impossible : données initiales chargées.');
      return structuredClone(initial);
    }
  }

  // Les effects passent ici pour enregistrer les données dans localStorage.
  private sauver(cle: string, valeur: unknown) {
    try {
      localStorage.setItem(cle, JSON.stringify(valeur));
    } catch {
      this.erreurStockage.set('Enregistrement impossible.');
    }
  }

  // On vérifie d'abord que l'équipement existe et qu'il n'est pas déjà réservé.
  reserver(equipementId: number, etudiantId: number): string | null {
    if (!this.equipements().some(e => e.id === equipementId)) return 'Équipement inexistant.';
    if (!this.estDisponible(equipementId)) return 'Équipement déjà réservé.';
    // Un UUID évite les doublons, même après des suppressions.
    this.reservationsState.update(liste => [...liste, { id: crypto.randomUUID(), equipementId, etudiantId }]);
    return null;
  }

  // On vérifie l'étudiant pour qu'il ne puisse pas annuler la réservation d'un autre.
  annuler(reservationId: string, etudiantId: number) {
    this.reservationsState.update(liste =>
      liste.filter(r => r.id !== reservationId || r.etudiantId !== etudiantId)
    );
  }

  // On ne renvoie que les réservations de l'étudiant connecté.
  reservationsDe(etudiantId: number) {
    return this.reservations().filter(r => r.etudiantId === etudiantId);
  }

  // On crée un équipement avec un nouvel id plus grand que les ids existants.
  ajouterEquipement(donnees: Omit<Equipement, 'id'>) {
    // Math.max évite un doublon si un équipement a été supprimé.
    const nouvelId = Math.max(100, ...this.equipements().map(e => e.id)) + 1;
    this.equipementsState.update(liste => [...liste, { id: nouvelId, ...donnees }]);
  }

  // On garde le même id et on remplace seulement les informations modifiées.
  modifierEquipement(id: number, donnees: Omit<Equipement, 'id'>) {
    this.equipementsState.update(liste =>
      liste.map(e => e.id === id ? { ...e, ...donnees } : e)
    );
  }

  // Un équipement réservé ne peut pas être supprimé.
  supprimerEquipement(id: number): string | null {
    if (!this.estDisponible(id)) {
      return 'Suppression impossible : cet équipement est actuellement réservé.';
    }
    this.equipementsState.update(liste => liste.filter(e => e.id !== id));
    return null;
  }
}