import { Injectable, computed, effect, signal } from '@angular/core';
import { COMPTES_INITIAUX, Compte } from '../data/donnees-initiales';

const CLE_SESSION = 'campus.session';

/**
 * Service responsable de la session et des rôles de démonstration.
 * Seul l'identifiant du compte est conservé dans le stockage, puis résolu
 * contre les comptes initiaux afin d'éviter de dupliquer tout le profil.
 */
@Injectable({ providedIn: 'root' })
export class Auth {
    readonly comptes = COMPTES_INITIAUX;

    private readonly compteState = signal<Compte | null>(this.chargerSession());
    readonly compte = this.compteState.asReadonly();

    readonly estConnecte = computed(() => this.compte() !== null);
    readonly estEtudiant = computed(() => this.compte()?.role === 'student');
    readonly estResponsable = computed(() => this.compte()?.role === 'manager');

    constructor() {
        effect(() => {
            const compte = this.compteState();
            try {
                // La session ne contient que l'id : le profil reste piloté par les données connues.
                if (compte) localStorage.setItem(CLE_SESSION, JSON.stringify(compte.id));
                else localStorage.removeItem(CLE_SESSION);
            } catch {
            console.error('Session non enregistrée');
            }
        });
    }

      /**
       * Connecte le compte correspondant à l'identifiant fourni.
       * @param id Identifiant du compte de démonstration à rechercher.
       * La méthode ne renvoie rien ; un identifiant inconnu laisse la session vide.
       */
    connecter(id: number) {
        this.compteState.set(this.comptes.find(c => c.id === id) ?? null);
    }

    /**
     * Ferme la session courante et supprime l'identifiant persistant.
     * Ne prend aucun paramètre et ne renvoie rien.
     */
    deconnecter() {
        this.compteState.set(null);
    }

    // Une session absente est différente d'une session contenant une valeur vide.
    private chargerSession(): Compte | null {
        try {
            const brut = localStorage.getItem(CLE_SESSION);
            if (brut === null) return null;
            const id = JSON.parse(brut);
            return COMPTES_INITIAUX.find(c => c.id === id) ?? null;
        } catch {
            console.error('Session non chargée');
            return null;
        }
    }

}
