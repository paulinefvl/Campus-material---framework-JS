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
    // Chaque modification d'un signal est ainsi sauvegardée sans appel manuel depuis les pages.
    effect(() => this.sauver(CLE_EQUIPEMENTS, this.equipementsState()));
    effect(() => this.sauver(CLE_RESERVATIONS, this.reservationsState()));
  }

  /**
   * Calcule la disponibilité à partir des réservations actives.
   * @param equipementId Identifiant de l'équipement à contrôler.
   * @returns true si aucune réservation ne concerne cet équipement.
   * Aucun champ « disponible » n'est stocké afin d'éviter un état incohérent.
   */
  estDisponible(equipementId: number): boolean {
    return !this.reservations().some(r => r.equipementId === equipementId);
  }

  // null signifie « clé absente » : un tableau vide enregistré doit être conservé.
  private charger<T>(cle: string, initial: T): T {
    try {
      const brut = localStorage.getItem(cle);
      // structuredClone évite que les données initiales partagées soient modifiées par l'application.
      if (brut === null) return structuredClone(initial);
      return JSON.parse(brut) as T;
    } catch {
      this.erreurStockage.set('Lecture du stockage impossible : données initiales chargées.');
      return structuredClone(initial);
    }
  }

  // Les effets appellent cette méthode pour persister l'état sérialisable dans localStorage.
  private sauver(cle: string, valeur: unknown) {
    try {
      localStorage.setItem(cle, JSON.stringify(valeur));
    } catch {
      this.erreurStockage.set('Enregistrement impossible.');
    }
  }

  /**
   * Vérifie les règles métier puis crée une réservation.
   * @param equipementId Identifiant de l'équipement demandé.
   * @param etudiantId Identifiant de l'étudiant demandeur.
   * @returns Un message d'erreur, ou null si la réservation est créée.
   */
  reserver(equipementId: number, etudiantId: number): string | null {
    if (!this.equipements().some(e => e.id === equipementId)) return 'Équipement inexistant.';
    if (!this.estDisponible(equipementId)) return 'Équipement déjà réservé.';
    // Un UUID évite les collisions même si des réservations sont supprimées ou réordonnées.
    this.reservationsState.update(liste => [...liste, { id: crypto.randomUUID(), equipementId, etudiantId }]);
    return null;
  }

  /**
   * Annule uniquement la réservation appartenant à l'étudiant indiqué.
   * @param reservationId Identifiant de la réservation à retirer.
   * @param etudiantId Identifiant du propriétaire de la réservation.
   * Ne renvoie rien : une réservation d'un autre étudiant reste inchangée.
   */
  annuler(reservationId: string, etudiantId: number) {
    this.reservationsState.update(liste =>
      liste.filter(r => r.id !== reservationId || r.etudiantId !== etudiantId)
    );
  }

  /**
   * Retourne les réservations appartenant à un étudiant.
   * @param etudiantId Identifiant de l'étudiant recherché.
   * @returns La liste filtrée de ses réservations.
   */
  reservationsDe(etudiantId: number) {
    return this.reservations().filter(r => r.etudiantId === etudiantId);
  }

  /**
   * Ajoute un équipement avec un identifiant supérieur à tous les identifiants existants.
   * @param donnees Données métier de l'équipement, sans son identifiant.
   * Ne renvoie rien ; l'effet de persistance sauvegarde ensuite la nouvelle liste.
   */
  ajouterEquipement(donnees: Omit<Equipement, 'id'>) {
    // Math.max évite les collisions après suppression, contrairement à length + 1.
    const nouvelId = Math.max(100, ...this.equipements().map(e => e.id)) + 1;
    this.equipementsState.update(liste => [...liste, { id: nouvelId, ...donnees }]);
  }

  /**
   * Remplace les données d'un équipement existant.
   * @param id Identifiant de l'équipement à modifier.
   * @param donnees Nouvelles données, sans modifier l'identifiant.
   * Ne renvoie rien.
   */
  modifierEquipement(id: number, donnees: Omit<Equipement, 'id'>) {
    this.equipementsState.update(liste =>
      liste.map(e => e.id === id ? { ...e, ...donnees } : e)
    );
  }

  /**
   * Supprime un équipement uniquement s'il n'est pas réservé.
   * @param id Identifiant de l'équipement à supprimer.
   * @returns Un message d'erreur, ou null si la suppression est autorisée.
   */
  supprimerEquipement(id: number): string | null {
    if (!this.estDisponible(id)) {
      return 'Suppression impossible : cet équipement est actuellement réservé.';
    }
    this.equipementsState.update(liste => liste.filter(e => e.id !== id));
    return null;
  }
}