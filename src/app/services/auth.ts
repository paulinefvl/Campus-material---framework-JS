// Ce service gère la session et les rôles de la démonstration.
// On garde seulement l'id du compte, puis on retrouve ses infos au démarrage.
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
                // On stocke seulement l'id pour ne pas copier tout le profil.
                if (compte) localStorage.setItem(CLE_SESSION, JSON.stringify(compte.id));
                else localStorage.removeItem(CLE_SESSION);
            } catch {
            console.error('Session non enregistrée');
            }
        });
    }

    // On cherche le compte choisi et on le met dans la session.
    connecter(id: number) {
        this.compteState.set(this.comptes.find(c => c.id === id) ?? null);
    }

    // Mettre la session à null déclenche aussi la suppression dans localStorage.
    deconnecter() {
        this.compteState.set(null);
    }

    // Si la clé n'existe pas, personne n'est connecté.
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
