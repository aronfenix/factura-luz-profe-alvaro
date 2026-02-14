// ============================================================
// FIREBASE CONFIGURATION - Leaderboard energia
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyAFbl1QfAwsGeQCvto4WAmbThtCtEQ4NhM",
    authDomain: "la-venganza-del-profe-alvaro.firebaseapp.com",
    databaseURL: "https://la-venganza-del-profe-alvaro-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "la-venganza-del-profe-alvaro",
    storageBucket: "la-venganza-del-profe-alvaro.firebasestorage.app",
    messagingSenderId: "999306931083",
    appId: "1:999306931083:web:8a0e51b81e3bd59f881d8e"
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
