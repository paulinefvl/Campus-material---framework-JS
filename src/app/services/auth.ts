import { Injectable, computed, effect, signal } from '@angular/core';
import { COMPTES_INITIAUX, Compte } from '../data/donnees-initiales';

const CLE_SESSION = 'campus.session';

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
                if (compte) localStorage.setItem(CLE_SESSION, JSON.stringify(compte.id));
                else localStorage.removeItem(CLE_SESSION);
            } catch {
            console.error('Session non enregistrée');
            }
        });
    }

    connecter(id: number) {
        this.compteState.set(this.comptes.find(c => c.id === id) ?? null);
    }

    deconnecter() {
        this.compteState.set(null);
    }

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
