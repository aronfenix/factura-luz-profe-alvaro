// ============================================================
// FIREBASE CONFIGURATION - Leaderboard energia
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyCBCMuQd1B1WYg3wcuwVZ98_tYoQpNoW7I",
    authDomain: "factura-energia.firebaseapp.com",
    databaseURL: "https://factura-energia-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "factura-energia",
    storageBucket: "factura-energia.firebasestorage.app",
    messagingSenderId: "1055194415019",
    appId: "1:1055194415019:web:53866602a5ff46440edcee"
};

// ==================== LEADERBOARD MANAGER ====================
class LeaderboardManager {
    constructor() {
        this.isFirebaseEnabled = false;
        this.db = null;
        this.localStorageKey = 'profeAlvaroEnergiaLeaderboard';
        this.cacheVersion = 2; // Incrementar para forzar limpieza de caché en todos los dispositivos
        this.checkCacheVersion();
        this.initFirebase();
    }

    checkCacheVersion() {
        const storedVersion = parseInt(localStorage.getItem(this.localStorageKey + '_v') || '0');
        if (storedVersion < this.cacheVersion) {
            localStorage.removeItem(this.localStorageKey);
            localStorage.setItem(this.localStorageKey + '_v', String(this.cacheVersion));
        }
    }

    initFirebase() {
        if (firebaseConfig.apiKey === "TU_API_KEY") {
            console.log('Firebase no configurado. Usando localStorage.');
            this.isFirebaseEnabled = false;
            return;
        }

        try {
            if (typeof firebase !== 'undefined') {
                if (!firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                }
                this.db = firebase.database();
                this.isFirebaseEnabled = true;
                console.log('Firebase inicializado correctamente (energia).');
            } else {
                console.log('Firebase SDK no cargado. Usando localStorage.');
                this.isFirebaseEnabled = false;
            }
        } catch (error) {
            console.log('Error al inicializar Firebase:', error);
            this.isFirebaseEnabled = false;
        }
    }

    async saveScore(entry) {
        this.saveToLocalStorage(entry);

        if (this.isFirebaseEnabled && this.db) {
            try {
                const newScoreRef = this.db.ref('leaderboard_energia').push();
                await newScoreRef.set({
                    ...entry,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
                console.log('Puntuacion guardada en Firebase (energia)');
            } catch (error) {
                console.log('Error al guardar en Firebase:', error);
            }
        }
    }

    // Solo conserva la mejor puntuación de cada jugador
    deduplicateByName(scores) {
        const best = {};
        scores.forEach(entry => {
            const key = (entry.name || 'ANÓNIMO').trim().toUpperCase();
            if (!best[key] || entry.score > best[key].score) {
                best[key] = entry;
            }
        });
        return Object.values(best).sort((a, b) => b.score - a.score);
    }

    async getScores(limit = 50) {
        if (this.isFirebaseEnabled && this.db) {
            try {
                const snapshot = await this.db.ref('leaderboard_energia')
                    .orderByChild('score')
                    .limitToLast(limit)
                    .once('value');

                const scores = [];
                snapshot.forEach(child => {
                    scores.push(child.val());
                });

                const deduped = this.deduplicateByName(scores);
                localStorage.setItem(this.localStorageKey, JSON.stringify(deduped));
                return deduped;
            } catch (error) {
                console.log('Error al obtener de Firebase, usando localStorage:', error);
                return this.getFromLocalStorage();
            }
        }
        return this.getFromLocalStorage();
    }

    saveToLocalStorage(entry) {
        const scores = this.getFromLocalStorage();
        scores.push(entry);
        const deduped = this.deduplicateByName(scores);
        localStorage.setItem(this.localStorageKey, JSON.stringify(deduped.slice(0, 50)));
    }

    getFromLocalStorage() {
        try {
            return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
        } catch {
            return [];
        }
    }

    clearLocal() {
        localStorage.removeItem(this.localStorageKey);
    }
}

const leaderboardManager = new LeaderboardManager();
window.leaderboardManager = leaderboardManager;
