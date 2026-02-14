// ============================================================
// LOGROS Y ESTADISTICAS - Energia
// ============================================================

class AchievementSystem {
    constructor() {
        this.storageKey = 'profeAlvaroEnergiaAchievements';
        this.statsKey = 'profeAlvaroEnergiaStats';
        this.achievements = this.defineAchievements();
        this.load();
    }

    defineAchievements() {
        return {
            'first_spark': { id: 'first_spark', name: 'Primera Chispa', description: 'Responde tu primera pregunta correctamente', icon: 'spark', color: '#3b82f6', condition: (s) => s.totalCorrect >= 1, points: 10 },
            'level_1': { id: 'level_1', name: 'Apagon Superado', description: 'Completa el Nivel 1: El Apagon', icon: 'lightning', color: '#3b82f6', condition: (s) => s.levelsCompleted >= 1, points: 50 },
            'level_2': { id: 'level_2', name: 'Director de Central', description: 'Completa el Nivel 2: La Central', icon: 'lightning', color: '#22c55e', condition: (s) => s.levelsCompleted >= 2, points: 75 },
            'level_3': { id: 'level_3', name: 'Maestro de Cadenas', description: 'Completa el Nivel 3: La Cadena', icon: 'chain', color: '#f59e0b', condition: (s) => s.levelsCompleted >= 3, points: 100 },
            'level_4': { id: 'level_4', name: 'Heroe Ambiental', description: 'Completa el Nivel 4: El Desastre', icon: 'leaf', color: '#ef4444', condition: (s) => s.levelsCompleted >= 4, points: 125 },
            'game_complete': { id: 'game_complete', name: 'Ingeniero Energetico', description: 'Completa los 5 niveles y paga la factura del profe', icon: 'crown', color: '#fbbf24', condition: (s) => s.victories >= 1, points: 200 },
            'combo_3': { id: 'combo_3', name: 'En Racha', description: 'Consigue un combo de 3 respuestas seguidas', icon: 'fire', color: '#f97316', condition: (s) => s.maxCombo >= 3, points: 25 },
            'combo_5': { id: 'combo_5', name: 'Imparable', description: 'Consigue un combo de 5', icon: 'fire', color: '#f97316', condition: (s) => s.maxCombo >= 5, points: 50 },
            'combo_8': { id: 'combo_8', name: 'Corriente Continua', description: 'Consigue un combo de 8', icon: 'fire', color: '#fbbf24', condition: (s) => s.maxCombo >= 8, points: 100 },
            'perfect_level': { id: 'perfect_level', name: 'Suministro Perfecto', description: 'Completa un nivel con 8/8 aciertos', icon: 'star', color: '#fbbf24', condition: (s) => s.perfectLevels >= 1, points: 100 },
            'no_damage': { id: 'no_damage', name: 'Aislamiento Total', description: 'Completa un nivel sin perder vidas', icon: 'shield', color: '#22c55e', condition: (s) => s.noDamageLevels >= 1, points: 75 },
            'green_grid': { id: 'green_grid', name: '100% Renovable', description: 'Completa un grid usando solo renovables', icon: 'leaf', color: '#22c55e', condition: (s) => s.allRenewableGrids >= 1, points: 100 },
            'chain_master': { id: 'chain_master', name: 'Maestro de Transformaciones', description: 'Completa 5 cadenas de transformacion', icon: 'chain', color: '#f59e0b', condition: (s) => s.chainsCompleted >= 5, points: 75 },
            'play_10': { id: 'play_10', name: 'Alumno Dedicado', description: 'Juega 10 partidas', icon: 'book', color: '#3b82f6', condition: (s) => s.gamesPlayed >= 10, points: 30 },
            'play_50': { id: 'play_50', name: 'Adicto a los Kilovatios', description: 'Juega 50 partidas', icon: 'book', color: '#a855f7', condition: (s) => s.gamesPlayed >= 50, points: 100 },
            'answer_50': { id: 'answer_50', name: 'Medio Centenar', description: 'Responde 50 preguntas correctamente', icon: 'check', color: '#22c55e', condition: (s) => s.totalCorrect >= 50, points: 50 },
            'answer_200': { id: 'answer_200', name: 'Central de Conocimiento', description: 'Responde 200 preguntas correctamente', icon: 'check', color: '#fbbf24', condition: (s) => s.totalCorrect >= 200, points: 150 },
            'speedster': { id: 'speedster', name: 'Velocidad de la Luz', description: 'Responde 5 preguntas en menos de 5 segundos', icon: 'lightning', color: '#06b6d4', condition: (s) => s.fastAnswers >= 5, points: 75 },
            'night_owl': { id: 'night_owl', name: 'Buho Energetico', description: 'Juega entre las 00:00 y las 05:00', icon: 'moon', color: '#8b5cf6', condition: (s) => s.nightOwl, points: 25, secret: true },
            'persistent': { id: 'persistent', name: 'No Me Apago', description: 'Pierde 10 veces y sigue jugando', icon: 'retry', color: '#ef4444', condition: (s) => s.losses >= 10 && s.gamesPlayed > s.losses, points: 50, secret: true }
        };
    }

    load() {
        try {
            this.unlockedAchievements = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            this.stats = JSON.parse(localStorage.getItem(this.statsKey) || '{}');
        } catch { this.unlockedAchievements = []; this.stats = {}; }

        this.stats = {
            totalCorrect: 0, totalWrong: 0, gamesPlayed: 0, victories: 0, losses: 0,
            levelsCompleted: 0, maxCombo: 0, perfectLevels: 0, noDamageLevels: 0,
            fastAnswers: 0, chainsCompleted: 0, allRenewableGrids: 0,
            totalPlayTime: 0, nightOwl: false, highScore: 0,
            ...this.stats
        };
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.unlockedAchievements));
        localStorage.setItem(this.statsKey, JSON.stringify(this.stats));
    }

    updateStats(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            if (typeof value === 'number' && typeof this.stats[key] === 'number') {
                this.stats[key] += value;
            } else if (key === 'maxCombo' || key === 'highScore') {
                this.stats[key] = Math.max(this.stats[key] || 0, value);
            } else {
                this.stats[key] = value;
            }
        });
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 5) this.stats.nightOwl = true;
        this.save();
        return this.checkAchievements();
    }

    checkAchievements() {
        const newlyUnlocked = [];
        Object.values(this.achievements).forEach(a => {
            if (!this.unlockedAchievements.includes(a.id) && a.condition(this.stats)) {
                this.unlockedAchievements.push(a.id);
                newlyUnlocked.push(a);
            }
        });
        if (newlyUnlocked.length > 0) this.save();
        return newlyUnlocked;
    }

    getUnlocked() { return this.unlockedAchievements.map(id => this.achievements[id]).filter(Boolean); }
    getAll() { return Object.values(this.achievements).map(a => ({ ...a, unlocked: this.unlockedAchievements.includes(a.id) })); }
    getTotalPoints() { return this.getUnlocked().reduce((sum, a) => sum + a.points, 0); }
    getProgress() { const t = Object.keys(this.achievements).length; const u = this.unlockedAchievements.length; return { unlocked: u, total: t, percentage: Math.floor((u / t) * 100) }; }
    getFormattedStats() {
        return {
            'Partidas jugadas': this.stats.gamesPlayed, 'Victorias': this.stats.victories,
            'Derrotas': this.stats.losses, 'Respuestas correctas': this.stats.totalCorrect,
            'Combo maximo': this.stats.maxCombo, 'Niveles perfectos': this.stats.perfectLevels,
            'Cadenas completadas': this.stats.chainsCompleted, 'Grids 100% renovable': this.stats.allRenewableGrids,
            'Mejor puntuacion': this.stats.highScore
        };
    }
}

// ==================== STUDY MODE ====================
class StudyMode {
    constructor() {
        this.currentTopic = null;
        this.flashcards = [];
        this.currentIndex = 0;
        this.knownCards = [];
        this.unknownCards = [];
    }

    generateFlashcards(topic) {
        this.currentTopic = topic;
        this.flashcards = [];
        this.currentIndex = 0;
        this.knownCards = [];
        this.unknownCards = [];

        switch (topic) {
            case 'formas':
                this.flashcards = GAME_DATA.nivel1Preguntas.map(q => ({
                    front: q.pregunta, back: q.respuesta, fact: q.explicacion, type: 'formas'
                }));
                break;
            case 'fuentes':
                this.flashcards = GAME_DATA.nivel2Preguntas.map(q => ({
                    front: q.pregunta, back: q.respuesta, fact: q.explicacion, type: 'fuentes'
                }));
                break;
            case 'transformaciones':
                this.flashcards = GAME_DATA.nivel3Preguntas.map(q => ({
                    front: q.pregunta, back: q.respuesta, fact: q.explicacion, type: 'transformaciones'
                }));
                // Add chain cards
                GAME_DATA.cadenas.forEach(c => {
                    this.flashcards.push({
                        front: `Cadena: ${c.nombre}`, back: c.pasos.join(' -> '), fact: c.explicacion, type: 'cadena'
                    });
                });
                break;
            case 'impacto':
                this.flashcards = GAME_DATA.nivel4Preguntas.map(q => ({
                    front: q.pregunta, back: q.respuesta, fact: q.explicacion, type: 'impacto'
                }));
                break;
            case 'sostenible':
                this.flashcards = GAME_DATA.nivel5Preguntas.map(q => ({
                    front: q.pregunta, back: q.respuesta, fact: q.explicacion, type: 'sostenible'
                }));
                break;
        }

        this.flashcards = Phaser.Utils.Array.Shuffle(this.flashcards);
        return this.flashcards;
    }

    getCurrentCard() { return this.flashcards[this.currentIndex] || null; }

    markKnown() {
        if (this.currentIndex < this.flashcards.length) { this.knownCards.push(this.flashcards[this.currentIndex]); this.currentIndex++; }
        return this.getCurrentCard();
    }

    markUnknown() {
        if (this.currentIndex < this.flashcards.length) { this.unknownCards.push(this.flashcards[this.currentIndex]); this.currentIndex++; }
        return this.getCurrentCard();
    }

    getProgress() {
        return { current: this.currentIndex, total: this.flashcards.length, known: this.knownCards.length, unknown: this.unknownCards.length };
    }

    repeatUnknown() {
        if (this.unknownCards.length > 0) {
            this.flashcards = Phaser.Utils.Array.Shuffle([...this.unknownCards]);
            this.currentIndex = 0;
            this.unknownCards = [];
            return true;
        }
        return false;
    }

    isComplete() { return this.currentIndex >= this.flashcards.length; }
}

const achievementSystem = new AchievementSystem();
const studyMode = new StudyMode();
window.achievementSystem = achievementSystem;
window.studyMode = studyMode;
