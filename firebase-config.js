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
        this.initFirebase();
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

                scores.sort((a, b) => b.score - a.score);
                localStorage.setItem(this.localStorageKey, JSON.stringify(scores));
                return scores;
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
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem(this.localStorageKey, JSON.stringify(scores.slice(0, 50)));
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
