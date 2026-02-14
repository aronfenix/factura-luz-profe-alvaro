// ============================================================
// ESCENAS DE JUEGO - 5 niveles con mecanicas distintas
// La Factura de la Luz del Profe Alvaro v2
// ============================================================

// ==================== NIVEL 1: EL APAGON — Clasifica la Energía ====================
class Level1Scene extends Phaser.Scene {
    constructor() { super({ key: 'Level1Scene' }); }

    init(data) {
        this.level = 1;
        this.score = data.score || 0;
        this.lives = data.lives !== undefined ? data.lives : 3;
        this.totalCorrect = data.totalCorrect || 0;
        this.correctCount = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.currentIndex = 0;
    }

    create() {
        this.effects = new EffectsManager(this);
        this.add.image(400, 300, `bg_level_1`).setAlpha(0.25);
        this.add.rectangle(400, 300, 800, 600, 0x0f172a, 0.7);

        this.scenarios = Phaser.Utils.Array.Shuffle([...GAME_DATA.nivel1Escenarios]);

        // Header
        this.add.text(400, 18, 'EL APAGON — Clasifica la Energía', {
            fontFamily: 'Nunito', fontSize: '18px', fontStyle: '900', color: '#3b82f6'
        }).setOrigin(0.5);

        // Progress bar background
        this.add.rectangle(400, 42, 300, 8, 0x1e293b).setOrigin(0.5);
        this.progressBar = this.add.rectangle(251, 42, 0, 8, 0x3b82f6).setOrigin(0, 0.5);
        this.progressText = this.add.text(560, 42, '0/15', {
            fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'bold', color: '#94a3b8'
        }).setOrigin(0, 0.5);

        // Lives
        this.livesText = this.add.text(30, 18, '', {
            fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#ef4444'
        });
        this.updateLivesDisplay();

        // Score & combo
        this.scoreText = this.add.text(770, 18, `${this.score}`, {
            fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#fbbf24'
        }).setOrigin(1, 0);
        this.comboText = this.add.text(400, 575, '', {
            fontFamily: 'Nunito', fontSize: '13px', fontStyle: 'bold', color: '#f59e0b'
        }).setOrigin(0.5);

        // Professor
        this.professor = this.add.sprite(700, 120, 'prof_idle_0').setScale(1.1);
        this.profBubble = this.createProfBubble(700, 60);

        // Scenario display area
        this.scenarioContainer = this.add.container(0, 0);

        // Timer bar
        this.timerBg = this.add.rectangle(400, 395, 500, 10, 0x1e293b).setOrigin(0.5);
        this.timerBar = this.add.rectangle(151, 395, 498, 8, 0x3b82f6).setOrigin(0, 0.5);

        // Answer buttons
        this.buttons = [];
        this.buttonContainer = this.add.container(0, 0);

        try { audioManager.playLevelMusic(1); } catch(e) {}
        this.cameras.main.fadeIn(500);
        this.time.delayedCall(600, () => this.showScenario());
    }

    showScenario() {
        if (this.currentIndex >= this.scenarios.length || this.lives <= 0) {
            this.endLevel();
            return;
        }

        this.scenarioContainer.removeAll(true);
        this.buttonContainer.removeAll(true);
        this.buttons = [];

        const scenario = this.scenarios[this.currentIndex];
        this.currentScenario = scenario;

        // Update progress
        this.progressText.setText(`${this.currentIndex + 1}/15`);
        this.progressBar.width = (this.currentIndex / 15) * 298;

        // Scenario icon
        const iconKey = `scenario_${scenario.icono}`;
        if (this.textures.exists(iconKey)) {
            const icon = this.add.image(350, 180, iconKey).setScale(1.2);
            this.scenarioContainer.add(icon);
        }

        // Scenario text
        const text = this.add.text(350, 280, scenario.texto, {
            fontFamily: 'Nunito', fontSize: '22px', fontStyle: 'bold', color: '#ffffff',
            align: 'center', wordWrap: { width: 500 }
        }).setOrigin(0.5);
        this.scenarioContainer.add(text);

        const hint = this.add.text(350, 330, 'Elige la energía más importante en este caso', {
            fontFamily: 'Nunito', fontSize: '13px', color: '#94a3b8'
        }).setOrigin(0.5);
        this.scenarioContainer.add(hint);

        // Shuffle options
        const options = Phaser.Utils.Array.Shuffle([...scenario.opciones]);

        // Create 4 answer buttons (2x2 grid)
        options.forEach((opt, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = 250 + col * 260;
            const y = 435 + row * 60;
            this.createAnswerButton(x, y, opt, 240, 48);
        });

        // Timer
        this.canAnswer = true;
        const timeForThis = Math.max(7, 12 - this.currentIndex * 0.25);
        this.timeLeft = timeForThis;
        this.maxTime = timeForThis;
        this.timerBar.width = 498;
        this.timerBar.fillColor = 0x3b82f6;

        if (this.timerEvent) this.timerEvent.destroy();
        this.timerEvent = this.time.addEvent({
            delay: 50, loop: true,
            callback: () => {
                if (!this.canAnswer) return;
                if (window.powerUpManager && powerUpManager.isTimerFrozen()) return;
                this.timeLeft -= 0.05;
                const ratio = Math.max(0, this.timeLeft / this.maxTime);
                this.timerBar.width = 498 * ratio;
                if (ratio < 0.3) this.timerBar.fillColor = 0xef4444;
                else if (ratio < 0.6) this.timerBar.fillColor = 0xf59e0b;
                if (this.timeLeft <= 0) {
                    this.canAnswer = false;
                    this.timerEvent.destroy();
                    this.handleWrong();
                }
            }
        });

        // Entrance animation
        this.effects.dramaticEntrance(text, 'top', 0);
    }

    createAnswerButton(x, y, text, w, h) {
        const container = this.add.container(x, y);
        const bg = this.add.graphics();
        bg.fillStyle(0x1e293b, 0.95);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
        bg.lineStyle(2, 0x475569);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);

        const label = this.add.text(0, 0, text, {
            fontFamily: 'Nunito', fontSize: '15px', fontStyle: 'bold', color: '#ffffff'
        }).setOrigin(0.5);

        container.add([bg, label]);
        container.setSize(w, h);
        container.setInteractive();
        container.answerText = text;
        container.bg = bg;
        container.label = label;

        container.on('pointerover', () => {
            if (!this.canAnswer) return;
            bg.clear();
            bg.fillStyle(0x334155, 1);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
            bg.lineStyle(2, 0x3b82f6);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
        });
        container.on('pointerout', () => {
            if (!this.canAnswer) return;
            bg.clear();
            bg.fillStyle(0x1e293b, 0.95);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
            bg.lineStyle(2, 0x475569);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
        });
        container.on('pointerdown', () => {
            if (!this.canAnswer) return;
            this.canAnswer = false;
            if (this.timerEvent) this.timerEvent.destroy();
            this.checkAnswer(text, container);
        });

        this.buttonContainer.add(container);
        this.buttons.push(container);
    }

    checkAnswer(answer, btn) {
        const correct = answer === this.currentScenario.respuesta;

        if (correct) {
            this.handleCorrect(btn);
        } else {
            this.handleWrong(btn);
        }
    }

    handleCorrect(btn) {
        this.correctCount++;
        this.totalCorrect++;
        this.combo++;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;

        // Power-up score multiplier
        const multiplier = window.powerUpManager ? powerUpManager.getScoreMultiplier() : 1;
        const baseScore = 100 + this.combo * 50;
        this.score += baseScore * multiplier;
        this.scoreText.setText(`${this.score}`);
        if (multiplier > 1) {
            this.effects.scorePopup(350, 250, `x${multiplier} DOBLE!`, '#f59e0b');
            if (window.powerUpManager) powerUpManager.resetDoubleVisuals(this);
        }

        if (this.combo >= 3) {
            this.comboText.setText(`Combo x${this.combo}!`);
            this.comboText.setAlpha(1);
            this.effects.comboCounter(400, 500, this.combo);
            // Try spawning a power-up on combos
            if (window.powerUpManager) {
                const pu = powerUpManager.trySpawnPowerUp(this, 100 + Math.random() * 600, 350, this.combo);
            }
        }

        try { audioManager.playCorrect(); } catch(e) {}

        // Green flash on button
        if (btn) {
            btn.bg.clear();
            btn.bg.fillStyle(0x22c55e, 0.5);
            btn.bg.fillRoundedRect(-120, -24, 240, 48, 10);
            btn.bg.lineStyle(3, 0x22c55e);
            btn.bg.strokeRoundedRect(-120, -24, 240, 48, 10);
        }

        this.effects.greenPulse(350, 280);
        this.showProfComment(GAME_DATA.getRandomFrase('correcta'));
        this.professor.setTexture('prof_talk_0');

        // Show explanation on correct answers too
        const expText = this.add.text(350, 350, this.currentScenario.explicacion, {
            fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'italic', color: '#22c55e',
            align: 'center', wordWrap: { width: 500 }
        }).setOrigin(0.5).setAlpha(0);
        this.scenarioContainer.add(expText);
        this.tweens.add({ targets: expText, alpha: 1, duration: 300 });

        achievementSystem.updateStats({ totalCorrect: 1, maxCombo: this.maxCombo });

        this.time.delayedCall(3500, () => {
            this.professor.setTexture('prof_idle_0');
            this.currentIndex++;
            this.showScenario();
        });
    }

    handleWrong(btn) {
        // Check shield first
        if (window.powerUpManager && powerUpManager.shouldAbsorbHit(this)) {
            this.showProfComment('El escudo te ha salvado!');
            this.time.delayedCall(1200, () => {
                this.currentIndex++;
                this.showScenario();
            });
            return;
        }

        this.combo = 0;
        this.lives--;
        this.updateLivesDisplay();
        this.comboText.setText('').setAlpha(0);

        try { audioManager.playError(); } catch(e) {}
        this.effects.shake(0.008, 300);

        // Red flash on wrong button
        if (btn) {
            btn.bg.clear();
            btn.bg.fillStyle(0xef4444, 0.5);
            btn.bg.fillRoundedRect(-120, -24, 240, 48, 10);
            btn.bg.lineStyle(3, 0xef4444);
            btn.bg.strokeRoundedRect(-120, -24, 240, 48, 10);
        }

        // Highlight correct answer
        this.buttons.forEach(b => {
            if (b.answerText === this.currentScenario.respuesta) {
                b.bg.clear();
                b.bg.fillStyle(0x22c55e, 0.5);
                b.bg.fillRoundedRect(-120, -24, 240, 48, 10);
                b.bg.lineStyle(3, 0x22c55e);
                b.bg.strokeRoundedRect(-120, -24, 240, 48, 10);
            }
        });

        this.effects.redPulse(350, 280);

        // Show explanation
        const expText = this.add.text(350, 350, this.currentScenario.explicacion, {
            fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'italic', color: '#fbbf24',
            align: 'center', wordWrap: { width: 500 }
        }).setOrigin(0.5).setAlpha(0);
        this.scenarioContainer.add(expText);
        this.tweens.add({ targets: expText, alpha: 1, duration: 300 });

        this.showProfComment(this.currentScenario.explicacion.substring(0, 80) + '...');
        this.professor.setTexture('prof_angry_0');

        this.time.delayedCall(5000, () => {
            this.professor.setTexture('prof_idle_0');
            this.currentIndex++;
            this.showScenario();
        });
    }

    endLevel() {
        if (this.timerEvent) this.timerEvent.destroy();
        if (window.powerUpManager) powerUpManager.cleanup();
        const passed = this.correctCount >= 10 && this.lives > 0;

        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('LevelResultScene', {
                level: this.level, score: this.score, lives: this.lives,
                totalCorrect: this.totalCorrect, passed,
                correctAnswers: this.correctCount, maxCombo: this.maxCombo,
                totalQuestions: this.scenarios.length,
                levelMetric: `${this.correctCount}/15 escenarios`
            });
        });
    }

    updateLivesDisplay() {
        let hearts = '';
        for (let i = 0; i < Math.max(this.lives, 3); i++) hearts += i < this.lives ? '♥ ' : '♡ ';
        this.livesText.setText(hearts);
    }

    createProfBubble(x, y) {
        const container = this.add.container(x, y).setAlpha(0);
        const bg = this.add.graphics();
        bg.fillStyle(0x1e293b, 0.95);
        bg.fillRoundedRect(-100, -22, 200, 44, 8);
        bg.lineStyle(2, 0xf59e0b);
        bg.strokeRoundedRect(-100, -22, 200, 44, 8);
        this.profBubbleText = this.add.text(0, 0, '', {
            fontFamily: 'Nunito', fontSize: '10px', color: '#ffffff',
            wordWrap: { width: 180 }, align: 'center'
        }).setOrigin(0.5);
        container.add([bg, this.profBubbleText]);
        return container;
    }

    showProfComment(text) {
        this.profBubbleText.setText(text);
        this.profBubble.setAlpha(0);
        this.tweens.add({
            targets: this.profBubble, alpha: 1, duration: 200, hold: 2000, yoyo: true
        });
    }
}

// ==================== NIVEL 2: LA CENTRAL — Renovable o No Renovable ====================
class Level2Scene extends Phaser.Scene {
    constructor() { super({ key: 'Level2Scene' }); }

    init(data) {
        this.level = 2;
        this.score = data.score || 0;
        this.lives = data.lives !== undefined ? data.lives : 3;
        this.totalCorrect = data.totalCorrect || 0;
        this.correctCount = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.currentCardIndex = 0;
        this.bonusIndex = 0;
        this.phase = 'sorting';
    }

    create() {
        this.effects = new EffectsManager(this);
        this.add.image(400, 300, 'bg_level_2').setAlpha(0.25);
        this.add.rectangle(400, 300, 800, 600, 0x0f172a, 0.7);

        this.cards = Phaser.Utils.Array.Shuffle([...GAME_DATA.nivel2Cartas]);

        // Header
        this.add.text(400, 18, 'LA CENTRAL — ¿Renovable o No Renovable?', {
            fontFamily: 'Nunito', fontSize: '16px', fontStyle: '900', color: '#22c55e'
        }).setOrigin(0.5);

        // Progress
        this.add.rectangle(400, 42, 300, 8, 0x1e293b).setOrigin(0.5);
        this.progressBar = this.add.rectangle(251, 42, 0, 8, 0x22c55e).setOrigin(0, 0.5);
        this.progressText = this.add.text(560, 42, '0/20', {
            fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'bold', color: '#94a3b8'
        }).setOrigin(0, 0.5);

        // Lives & Score
        this.livesText = this.add.text(30, 18, '', {
            fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#ef4444'
        });
        this.updateLivesDisplay();
        this.scoreText = this.add.text(770, 18, `${this.score}`, {
            fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#fbbf24'
        }).setOrigin(1, 0);
        this.comboText = this.add.text(400, 575, '', {
            fontFamily: 'Nunito', fontSize: '13px', fontStyle: 'bold', color: '#f59e0b'
        }).setOrigin(0.5);

        // Dato display
        this.datoText = this.add.text(400, 545, '', {
            fontFamily: 'Nunito', fontSize: '11px', fontStyle: 'italic', color: '#94a3b8',
            align: 'center', wordWrap: { width: 700 }
        }).setOrigin(0.5);

        // Professor
        this.professor = this.add.sprite(700, 130, 'prof_idle_0').setScale(1.1);
        this.profBubble = this.createProfBubble(700, 70);

        // Card display area
        this.cardContainer = this.add.container(0, 0);

        try { audioManager.playLevelMusic(2); } catch(e) {}
        this.cameras.main.fadeIn(500);
        this.time.delayedCall(600, () => this.showCard());
    }

    showCard() {
        if (this.lives <= 0) { this.endLevel(); return; }
        if (this.currentCardIndex >= this.cards.length) {
            this.startBonusRound();
            return;
        }

        this.cardContainer.removeAll(true);
        const card = this.cards[this.currentCardIndex];
        this.currentCard = card;
        this.canAnswer = true;

        // Update progress
        this.progressText.setText(`${this.currentCardIndex + 1}/20`);
        this.progressBar.width = (this.currentCardIndex / 20) * 298;

        // Card display - name and icon
        const cardBg = this.add.graphics();
        cardBg.fillStyle(0x1e293b, 0.95);
        cardBg.fillRoundedRect(200, 100, 400, 140, 14);
        cardBg.lineStyle(3, 0x94a3b8);
        cardBg.strokeRoundedRect(200, 100, 400, 140, 14);
        this.cardContainer.add(cardBg);

        // Energy icon
        const iconKey = `energy_${card.icono}`;
        if (this.textures.exists(iconKey)) {
            const icon = this.add.image(400, 145, iconKey).setScale(0.8);
            this.cardContainer.add(icon);
        }

        // Card name
        const nameText = this.add.text(400, 205, card.nombre, {
            fontFamily: 'Nunito', fontSize: '22px', fontStyle: 'bold', color: '#ffffff'
        }).setOrigin(0.5);
        this.cardContainer.add(nameText);

        // Question
        const question = this.add.text(400, 270, '¿Es una fuente de energía renovable o no renovable?', {
            fontFamily: 'Nunito', fontSize: '13px', color: '#94a3b8'
        }).setOrigin(0.5);
        this.cardContainer.add(question);

        // Two big answer buttons
        this.createAnswerBtn(250, 340, 'RENOVABLE', '#22c55e', 0x22c55e, true);
        this.createAnswerBtn(550, 340, 'NO RENOVABLE', '#ef4444', 0xef4444, false);

        // Entrance animation
        this.effects.dramaticEntrance(nameText, 'top', 0);
    }

    createAnswerBtn(x, y, label, color, colorHex, isRenewable) {
        const w = 220, h = 56;
        const container = this.add.container(x, y);
        const bg = this.add.graphics();
        bg.fillStyle(0x1e293b, 0.95);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 12);
        bg.lineStyle(3, colorHex);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12);

        const icon = this.add.text(0, -5, isRenewable ? '♻' : '⛽', { fontSize: '18px' }).setOrigin(0.5);
        const text = this.add.text(0, 16, label, {
            fontFamily: 'Nunito', fontSize: '15px', fontStyle: '900', color: color
        }).setOrigin(0.5);

        container.add([bg, icon, text]);
        container.setSize(w, h);
        container.setInteractive();
        container.bg = bg;

        container.on('pointerover', () => {
            if (!this.canAnswer) return;
            bg.clear();
            bg.fillStyle(colorHex, 0.2);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 12);
            bg.lineStyle(3, colorHex);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12);
        });
        container.on('pointerout', () => {
            if (!this.canAnswer) return;
            bg.clear();
            bg.fillStyle(0x1e293b, 0.95);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 12);
            bg.lineStyle(3, colorHex);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12);
        });
        container.on('pointerdown', () => {
            if (!this.canAnswer) return;
            this.canAnswer = false;
            this.checkSortAnswer(isRenewable, bg, colorHex, w, h);
        });

        this.cardContainer.add(container);
    }

    checkSortAnswer(answeredRenewable, btnBg, btnColor, w, h) {
        const correct = answeredRenewable === this.currentCard.renovable;

        if (correct) {
            this.correctCount++;
            this.totalCorrect++;
            this.combo++;
            if (this.combo > this.maxCombo) this.maxCombo = this.combo;
            const multiplier = window.powerUpManager ? powerUpManager.getScoreMultiplier() : 1;
            const baseScore = 100 + this.combo * 30;
            this.score += baseScore * multiplier;
            this.scoreText.setText(`${this.score}`);
            if (multiplier > 1) {
                this.effects.scorePopup(400, 250, `x${multiplier} DOBLE!`, '#f59e0b');
                if (window.powerUpManager) powerUpManager.resetDoubleVisuals(this);
            }
            if (this.combo >= 3) {
                this.comboText.setText(`Combo x${this.combo}!`);
                this.effects.comboCounter(400, 500, this.combo);
                if (window.powerUpManager) {
                    powerUpManager.trySpawnPowerUp(this, 100 + Math.random() * 600, 400, this.combo);
                }
            }

            try { audioManager.playCorrect(); } catch(e) {}

            // Green flash on button
            btnBg.clear();
            btnBg.fillStyle(0x22c55e, 0.5);
            btnBg.fillRoundedRect(-w / 2, -h / 2, w, h, 12);
            btnBg.lineStyle(3, 0x22c55e);
            btnBg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12);

            this.effects.greenPulse(400, 200);
            this.showProfComment(GAME_DATA.getRandomFrase('correcta'));
            this.professor.setTexture('prof_talk_0');

            // Show explanation panel
            this.showCardExplanation(true, this.currentCard);

            achievementSystem.updateStats({ totalCorrect: 1, maxCombo: this.maxCombo });
        } else {
            // Check shield
            if (window.powerUpManager && powerUpManager.shouldAbsorbHit(this)) {
                this.showProfComment('El escudo te ha salvado!');
                this.showCardExplanation(true, this.currentCard);
                return;
            }
            this.combo = 0;
            this.lives--;
            this.updateLivesDisplay();
            this.comboText.setText('').setAlpha(0);

            try { audioManager.playError(); } catch(e) {}
            this.effects.shake(0.008, 300);

            // Red flash on button
            btnBg.clear();
            btnBg.fillStyle(0xef4444, 0.5);
            btnBg.fillRoundedRect(-w / 2, -h / 2, w, h, 12);
            btnBg.lineStyle(3, 0xef4444);
            btnBg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12);

            this.effects.redPulse(400, 200);
            this.showProfComment(`No! Es ${this.currentCard.renovable ? 'RENOVABLE' : 'NO RENOVABLE'}.`);
            this.professor.setTexture('prof_angry_0');

            // Show explanation panel
            this.showCardExplanation(false, this.currentCard);
        }
    }

    startBonusRound() {
        this.phase = 'bonus';
        this.cardContainer.removeAll(true);

        const bonusTitle = this.add.text(400, 120, '¡RONDA BONUS!', {
            fontFamily: 'Nunito', fontSize: '24px', fontStyle: '900', color: '#fbbf24'
        }).setOrigin(0.5);
        this.cardContainer.add(bonusTitle);
        this.cardContainer.add(this.add.text(400, 150, '5 preguntas rápidas sobre lo aprendido', {
            fontFamily: 'Nunito', fontSize: '13px', color: '#94a3b8'
        }).setOrigin(0.5));

        this.bonusQuestions = [...GAME_DATA.nivel2PreguntasBonus];
        this.bonusIndex = 0;

        this.time.delayedCall(1500, () => this.showBonusQuestion());
    }

    showBonusQuestion() {
        if (this.bonusIndex >= this.bonusQuestions.length || this.lives <= 0) {
            this.endLevel();
            return;
        }

        this.cardContainer.removeAll(true);
        const q = this.bonusQuestions[this.bonusIndex];

        const qText = this.add.text(400, 200, q.pregunta, {
            fontFamily: 'Nunito', fontSize: '18px', fontStyle: 'bold', color: '#ffffff',
            align: 'center', wordWrap: { width: 600 }
        }).setOrigin(0.5);
        this.cardContainer.add(qText);

        const options = Phaser.Utils.Array.Shuffle([...q.opciones]);
        this.bonusCanAnswer = true;

        options.forEach((opt, i) => {
            const x = 250 + (i % 2) * 300;
            const y = 310 + Math.floor(i / 2) * 60;
            const container = this.add.container(x, y);
            const bg = this.add.graphics();
            bg.fillStyle(0x1e293b, 0.95);
            bg.fillRoundedRect(-130, -22, 260, 44, 10);
            bg.lineStyle(2, 0x475569);
            bg.strokeRoundedRect(-130, -22, 260, 44, 10);
            const label = this.add.text(0, 0, opt, {
                fontFamily: 'Nunito', fontSize: '13px', fontStyle: 'bold', color: '#ffffff'
            }).setOrigin(0.5);
            container.add([bg, label]);
            container.setSize(260, 44);
            container.setInteractive();

            container.on('pointerover', () => {
                if (!this.bonusCanAnswer) return;
                bg.clear(); bg.fillStyle(0x334155, 1); bg.fillRoundedRect(-130, -22, 260, 44, 10);
                bg.lineStyle(2, 0x3b82f6); bg.strokeRoundedRect(-130, -22, 260, 44, 10);
            });
            container.on('pointerout', () => {
                if (!this.bonusCanAnswer) return;
                bg.clear(); bg.fillStyle(0x1e293b, 0.95); bg.fillRoundedRect(-130, -22, 260, 44, 10);
                bg.lineStyle(2, 0x475569); bg.strokeRoundedRect(-130, -22, 260, 44, 10);
            });
            container.on('pointerdown', () => {
                if (!this.bonusCanAnswer) return;
                this.bonusCanAnswer = false;
                const isCorrect = opt === q.respuesta;
                if (isCorrect) {
                    this.correctCount++;
                    this.totalCorrect++;
                    this.score += 150;
                    this.scoreText.setText(`${this.score}`);
                    bg.clear(); bg.fillStyle(0x22c55e, 0.5); bg.fillRoundedRect(-130, -22, 260, 44, 10);
                    try { audioManager.playCorrect(); } catch(e) {}
                } else {
                    this.lives--;
                    this.updateLivesDisplay();
                    bg.clear(); bg.fillStyle(0xef4444, 0.5); bg.fillRoundedRect(-130, -22, 260, 44, 10);
                    try { audioManager.playError(); } catch(e) {}
                }
                this.datoText.setText(q.explicacion);
                this.time.delayedCall(1500, () => { this.bonusIndex++; this.showBonusQuestion(); });
            });
            this.cardContainer.add(container);
        });
    }

    showCardExplanation(wasCorrect, card) {
        // Overlay + panel showing what this energy source is
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6).setDepth(200);
        const panel = this.add.container(400, 300).setDepth(201);
        const bg = this.add.graphics();
        bg.fillStyle(0x1e293b, 1);
        bg.fillRoundedRect(-280, -120, 560, 240, 14);
        bg.lineStyle(3, wasCorrect ? 0x22c55e : 0xef4444);
        bg.strokeRoundedRect(-280, -120, 560, 240, 14);

        const title = this.add.text(0, -90, wasCorrect ? 'CORRECTO!' : 'INCORRECTO', {
            fontFamily: 'Nunito', fontSize: '20px', fontStyle: '900', color: wasCorrect ? '#22c55e' : '#ef4444'
        }).setOrigin(0.5);

        const name = this.add.text(0, -55, card.nombre, {
            fontFamily: 'Nunito', fontSize: '18px', fontStyle: 'bold', color: '#ffffff'
        }).setOrigin(0.5);

        const type = this.add.text(0, -25, card.renovable ? 'RENOVABLE' : 'NO RENOVABLE', {
            fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: card.renovable ? '#22c55e' : '#ef4444'
        }).setOrigin(0.5);

        const dato = this.add.text(0, 25, card.dato, {
            fontFamily: 'Nunito', fontSize: '13px', color: '#cbd5e1',
            wordWrap: { width: 500 }, align: 'center', lineSpacing: 4
        }).setOrigin(0.5);

        // Timer bar showing 5 seconds countdown
        const timerBg = this.add.rectangle(0, 90, 300, 6, 0x475569);
        const timerFill = this.add.rectangle(-150, 90, 300, 6, wasCorrect ? 0x22c55e : 0xef4444).setOrigin(0, 0.5);

        panel.add([bg, title, name, type, dato, timerBg, timerFill]);
        panel.setScale(0);
        this.tweens.add({ targets: panel, scale: 1, duration: 300, ease: 'Back.easeOut' });

        // Shrink timer bar over 8 seconds
        this.tweens.add({ targets: timerFill, width: 0, duration: 8000, ease: 'Linear' });

        this.time.delayedCall(8000, () => {
            overlay.destroy();
            panel.destroy();
            this.professor.setTexture('prof_idle_0');
            this.currentCardIndex++;
            this.showCard();
        });
    }

    endLevel() {
        if (window.powerUpManager) powerUpManager.cleanup();
        const passed = this.correctCount >= 14 && this.lives > 0;
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('LevelResultScene', {
                level: this.level, score: this.score, lives: this.lives,
                totalCorrect: this.totalCorrect, passed,
                correctAnswers: this.correctCount, maxCombo: this.maxCombo,
                totalQuestions: 25,
                levelMetric: `${this.correctCount}/25 aciertos`
            });
        });
    }

    updateLivesDisplay() {
        let hearts = '';
        for (let i = 0; i < Math.max(this.lives, 3); i++) hearts += i < this.lives ? '♥ ' : '♡ ';
        this.livesText.setText(hearts);
    }

    createProfBubble(x, y) {
        const container = this.add.container(x, y).setAlpha(0);
        const bg = this.add.graphics();
        bg.fillStyle(0x1e293b, 0.95);
        bg.fillRoundedRect(-100, -22, 200, 44, 8);
        bg.lineStyle(2, 0xf59e0b);
        bg.strokeRoundedRect(-100, -22, 200, 44, 8);
        this.profBubbleText = this.add.text(0, 0, '', {
            fontFamily: 'Nunito', fontSize: '10px', color: '#ffffff',
            wordWrap: { width: 180 }, align: 'center'
        }).setOrigin(0.5);
        container.add([bg, this.profBubbleText]);
        return container;
    }

    showProfComment(text) {
        this.profBubbleText.setText(text);
        this.profBubble.setAlpha(0);
        this.tweens.add({
            targets: this.profBubble, alpha: 1, duration: 200, hold: 4000, yoyo: true
        });
    }
}

// ==================== NIVEL 3: LA CADENA — Cadenas de Transformacion ====================
class Level3Scene extends Phaser.Scene {
    constructor() { super({ key: 'Level3Scene' }); }

    init(data) {
        this.level = 3;
        this.score = data.score || 0;
        this.lives = data.lives !== undefined ? data.lives : 3;
        this.totalCorrect = data.totalCorrect || 0;
        this.chainsCompleted = 0;
        this.chainsFailed = 0;
        this.currentChainIndex = 0;
    }

    create() {
        this.effects = new EffectsManager(this);
        this.add.rectangle(400, 300, 800, 600, 0x0f172a);

        this.chains = GAME_DATA.getCadenasNivel(3);
        this.chains = Phaser.Utils.Array.Shuffle([...this.chains]).slice(0, 5);

        // Header
        this.add.text(400, 20, 'LA CADENA — Transformaciones de Energía', {
            fontFamily: 'Nunito', fontSize: '18px', fontStyle: '900', color: '#f59e0b'
        }).setOrigin(0.5);

        this.add.text(400, 44, 'Ordena los tipos de energía en la secuencia correcta', {
            fontFamily: 'Nunito', fontSize: '11px', color: '#94a3b8'
        }).setOrigin(0.5);

        this.progressText = this.add.text(400, 64, '', {
            fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'bold', color: '#ffffff'
        }).setOrigin(0.5);

        // Score
        this.add.text(30, 20, 'Puntos:', {
            fontFamily: 'Nunito', fontSize: '12px', color: '#94a3b8'
        });
        this.scoreText = this.add.text(90, 20, `${this.score}`, {
            fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#fbbf24'
        });

        // Professor
        this.professor = this.add.sprite(720, 120, 'prof_idle_0').setScale(1.1);
        this.profBubble = this.add.container(720, 60).setAlpha(0);
        const pbg = this.add.graphics();
        pbg.fillStyle(0x1e293b, 0.95);
        pbg.fillRoundedRect(-90, -22, 180, 44, 8);
        pbg.lineStyle(2, 0xf59e0b);
        pbg.strokeRoundedRect(-90, -22, 180, 44, 8);
        this.profBubbleText = this.add.text(0, 0, '', {
            fontFamily: 'Nunito', fontSize: '10px', color: '#ffffff',
            wordWrap: { width: 160 }, align: 'center'
        }).setOrigin(0.5);
        this.profBubble.add([pbg, this.profBubbleText]);

        this.puzzleContainer = this.add.container(0, 0);

        try { audioManager.playLevelMusic(3); } catch(e) {}
        this.cameras.main.fadeIn(500);
        this.showChain();
    }

    showChain() {
        this.puzzleContainer.removeAll(true);

        if (this.currentChainIndex >= this.chains.length) {
            this.showChainResults();
            return;
        }

        const chain = this.chains[this.currentChainIndex];
        this.currentChain = chain;
        this.selectedSteps = [];
        this.canSelect = true;
        this.progressText.setText(`Cadena ${this.currentChainIndex + 1}/${this.chains.length}  |  Correctas: ${this.chainsCompleted}`);

        // Chain name
        const nameText = this.add.text(350, 100, `"${chain.nombre}"`, {
            fontFamily: 'Nunito', fontSize: '20px', fontStyle: 'bold', color: '#ffffff'
        }).setOrigin(0.5);
        this.puzzleContainer.add(nameText);

        const instrText = this.add.text(350, 128, 'Pulsa los tipos de energía en el orden correcto', {
            fontFamily: 'Nunito', fontSize: '11px', color: '#94a3b8'
        }).setOrigin(0.5);
        this.puzzleContainer.add(instrText);

        // Slot display area - shows selected steps
        const numSteps = chain.pasos.length;
        const slotW = 110, slotH = 46, slotGap = 12;
        const totalW = numSteps * slotW + (numSteps - 1) * slotGap;
        const startX = 400 - totalW / 2;

        this.slotLabels = [];
        this.slotBgs = [];
        for (let i = 0; i < numSteps; i++) {
            const x = startX + i * (slotW + slotGap) + slotW / 2;
            const y = 210;

            const slotBg = this.add.graphics();
            slotBg.fillStyle(0x1e293b, 1);
            slotBg.fillRoundedRect(x - slotW / 2, y - slotH / 2, slotW, slotH, 8);
            slotBg.lineStyle(2, 0x475569);
            slotBg.strokeRoundedRect(x - slotW / 2, y - slotH / 2, slotW, slotH, 8);
            this.puzzleContainer.add(slotBg);
            this.slotBgs.push({ bg: slotBg, x, y, w: slotW, h: slotH });

            const numLabel = this.add.text(x, y - 32, `Paso ${i + 1}`, {
                fontFamily: 'Nunito', fontSize: '10px', fontStyle: 'bold', color: '#64748b'
            }).setOrigin(0.5);
            this.puzzleContainer.add(numLabel);

            const slotLabel = this.add.text(x, y, '?', {
                fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#475569'
            }).setOrigin(0.5);
            this.puzzleContainer.add(slotLabel);
            this.slotLabels.push(slotLabel);

            if (i < numSteps - 1) {
                const arrow = this.add.text(x + slotW / 2 + slotGap / 2, y, '→', {
                    fontSize: '20px', color: '#475569'
                }).setOrigin(0.5);
                this.puzzleContainer.add(arrow);
            }
        }

        // Clickable energy blocks
        const chainColors = {
            'Química': '#ef4444', 'Térmica': '#f97316', 'Mecánica': '#3b82f6',
            'Eléctrica': '#fbbf24', 'Luminosa': '#fde68a', 'Sonora': '#a855f7',
            'Nuclear': '#22d3ee', 'Potencial': '#22c55e', 'Cinética': '#6366f1', 'Elástica': '#ec4899'
        };

        const correctTypes = [...chain.pasos];
        const distractors = GAME_DATA.tiposEnergia.filter(t => !correctTypes.includes(t));
        const shuffDist = Phaser.Utils.Array.Shuffle([...distractors]);
        const numDist = Math.min(3, shuffDist.length);
        const blockTypes = Phaser.Utils.Array.Shuffle([...correctTypes, ...shuffDist.slice(0, numDist)]);

        this.blockButtons = [];
        const blockW = 110, blockH = 40, blockGap = 8;
        const perRow = Math.min(blockTypes.length, 5);

        blockTypes.forEach((type, i) => {
            const row = Math.floor(i / perRow);
            const col = i % perRow;
            const rowItems = Math.min(perRow, blockTypes.length - row * perRow);
            const rowW = rowItems * blockW + (rowItems - 1) * blockGap;
            const rowStartX = 400 - rowW / 2;
            const x = rowStartX + col * (blockW + blockGap) + blockW / 2;
            const y = 330 + row * (blockH + blockGap + 5);

            const color = chainColors[type] || '#94a3b8';
            const colorNum = Phaser.Display.Color.HexStringToColor(color).color;

            const container = this.add.container(x, y);
            container.setSize(blockW, blockH);
            const bg = this.add.graphics();
            bg.fillStyle(colorNum, 0.2);
            bg.fillRoundedRect(-blockW / 2, -blockH / 2, blockW, blockH, 8);
            bg.lineStyle(2, colorNum);
            bg.strokeRoundedRect(-blockW / 2, -blockH / 2, blockW, blockH, 8);
            const label = this.add.text(0, 0, type, {
                fontFamily: 'Nunito', fontSize: '13px', fontStyle: 'bold', color: color
            }).setOrigin(0.5);
            container.add([bg, label]);
            container.setInteractive();
            container.blockType = type;
            container.blockBg = bg;
            container.blockColor = color;
            container.blockColorNum = colorNum;
            container.used = false;

            container.on('pointerover', () => {
                if (!this.canSelect || container.used) return;
                bg.clear();
                bg.fillStyle(colorNum, 0.4);
                bg.fillRoundedRect(-blockW / 2, -blockH / 2, blockW, blockH, 8);
                bg.lineStyle(3, colorNum);
                bg.strokeRoundedRect(-blockW / 2, -blockH / 2, blockW, blockH, 8);
            });
            container.on('pointerout', () => {
                if (!this.canSelect || container.used) return;
                bg.clear();
                bg.fillStyle(colorNum, 0.2);
                bg.fillRoundedRect(-blockW / 2, -blockH / 2, blockW, blockH, 8);
                bg.lineStyle(2, colorNum);
                bg.strokeRoundedRect(-blockW / 2, -blockH / 2, blockW, blockH, 8);
            });
            container.on('pointerdown', () => {
                if (!this.canSelect || container.used) return;
                this.selectBlock(container);
            });

            this.puzzleContainer.add(container);
            this.blockButtons.push(container);
        });

        // Reset button
        const resetBtn = this.add.text(400, 500, 'REINICIAR', {
            fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'bold', color: '#64748b'
        }).setOrigin(0.5).setInteractive();
        resetBtn.on('pointerdown', () => { if (this.canSelect) this.resetSelection(); });
        resetBtn.on('pointerover', () => resetBtn.setColor('#ffffff'));
        resetBtn.on('pointerout', () => resetBtn.setColor('#64748b'));
        this.puzzleContainer.add(resetBtn);

        this.effects.dramaticEntrance(nameText, 'top', 0);
    }

    selectBlock(container) {
        const chain = this.currentChain;
        const slotIndex = this.selectedSteps.length;
        if (slotIndex >= chain.pasos.length) return;

        try { audioManager.playClick(); } catch(e) {}

        // Mark block as used
        container.used = true;
        container.setAlpha(0.3);
        this.selectedSteps.push(container.blockType);

        // Update slot display
        const slot = this.slotBgs[slotIndex];
        const chainColors = {
            'Química': '#ef4444', 'Térmica': '#f97316', 'Mecánica': '#3b82f6',
            'Eléctrica': '#fbbf24', 'Luminosa': '#fde68a', 'Sonora': '#a855f7',
            'Nuclear': '#22d3ee', 'Potencial': '#22c55e', 'Cinética': '#6366f1', 'Elástica': '#ec4899'
        };
        const color = chainColors[container.blockType] || '#94a3b8';
        const colorNum = Phaser.Display.Color.HexStringToColor(color).color;

        slot.bg.clear();
        slot.bg.fillStyle(colorNum, 0.3);
        slot.bg.fillRoundedRect(slot.x - slot.w / 2, slot.y - slot.h / 2, slot.w, slot.h, 8);
        slot.bg.lineStyle(2, colorNum);
        slot.bg.strokeRoundedRect(slot.x - slot.w / 2, slot.y - slot.h / 2, slot.w, slot.h, 8);

        this.slotLabels[slotIndex].setText(container.blockType).setColor(color);

        // Check if all slots filled
        if (this.selectedSteps.length >= chain.pasos.length) {
            this.canSelect = false;
            this.time.delayedCall(400, () => this.verifyChain());
        }
    }

    resetSelection() {
        this.selectedSteps = [];
        // Reset all blocks
        this.blockButtons.forEach(b => {
            b.used = false;
            b.setAlpha(1);
            const bw = 110, bh = 40;
            b.blockBg.clear();
            b.blockBg.fillStyle(b.blockColorNum, 0.2);
            b.blockBg.fillRoundedRect(-bw / 2, -bh / 2, bw, bh, 8);
            b.blockBg.lineStyle(2, b.blockColorNum);
            b.blockBg.strokeRoundedRect(-bw / 2, -bh / 2, bw, bh, 8);
        });
        // Reset slots
        this.slotBgs.forEach((slot, i) => {
            slot.bg.clear();
            slot.bg.fillStyle(0x1e293b, 1);
            slot.bg.fillRoundedRect(slot.x - slot.w / 2, slot.y - slot.h / 2, slot.w, slot.h, 8);
            slot.bg.lineStyle(2, 0x475569);
            slot.bg.strokeRoundedRect(slot.x - slot.w / 2, slot.y - slot.h / 2, slot.w, slot.h, 8);
            this.slotLabels[i].setText('?').setColor('#475569');
        });
    }

    verifyChain() {
        const chain = this.currentChain;
        let allCorrect = true;

        for (let i = 0; i < chain.pasos.length; i++) {
            const correct = this.selectedSteps[i] === chain.pasos[i];
            const slot = this.slotBgs[i];
            const c = correct ? 0x22c55e : 0xef4444;
            slot.bg.clear();
            slot.bg.fillStyle(c, 0.3);
            slot.bg.fillRoundedRect(slot.x - slot.w / 2, slot.y - slot.h / 2, slot.w, slot.h, 8);
            slot.bg.lineStyle(3, c);
            slot.bg.strokeRoundedRect(slot.x - slot.w / 2, slot.y - slot.h / 2, slot.w, slot.h, 8);
            if (!correct) allCorrect = false;
        }

        if (allCorrect) {
            this.chainsCompleted++;
            this.totalCorrect++;
            this.score += 200;
            this.scoreText.setText(`${this.score}`);
            try { audioManager.playCorrect(); } catch(e) {}
            achievementSystem.updateStats({ chainsCompleted: 1 });
            this.effects.sparks(400, 210);
        } else {
            this.chainsFailed++;
            try { audioManager.playError(); } catch(e) {}
            this.effects.shake(0.01, 300);
        }

        this.time.delayedCall(800, () => this.showExplanation(this.currentChain, allCorrect));
    }

    showExplanation(chain, wasCorrect) {
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7).setDepth(300);
        const panel = this.add.container(400, 300).setDepth(301);
        const bg = this.add.graphics();
        bg.fillStyle(0x1e293b, 1);
        bg.fillRoundedRect(-300, -140, 600, 280, 14);
        bg.lineStyle(3, wasCorrect ? 0x22c55e : 0xef4444);
        bg.strokeRoundedRect(-300, -140, 600, 280, 14);

        const title = this.add.text(0, -110, wasCorrect ? 'CORRECTO!' : 'INCORRECTO', {
            fontFamily: 'Nunito', fontSize: '22px', fontStyle: 'bold', color: wasCorrect ? '#22c55e' : '#ef4444'
        }).setOrigin(0.5);
        const name = this.add.text(0, -75, chain.nombre, {
            fontFamily: 'Nunito', fontSize: '16px', fontStyle: 'bold', color: '#ffffff'
        }).setOrigin(0.5);
        const flow = this.add.text(0, -45, chain.pasos.join('  →  '), {
            fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#f59e0b'
        }).setOrigin(0.5);
        const exp = this.add.text(0, 20, chain.explicacion, {
            fontFamily: 'Nunito', fontSize: '13px', color: '#cbd5e1',
            wordWrap: { width: 540 }, align: 'center', lineSpacing: 4
        }).setOrigin(0.5);
        const pts = this.add.text(0, 85, wasCorrect ? '+200 puntos' : '', {
            fontFamily: 'Nunito', fontSize: '16px', fontStyle: 'bold', color: '#fbbf24'
        }).setOrigin(0.5);
        const cont = this.add.text(0, 120, 'CONTINUAR →', {
            fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#3b82f6'
        }).setOrigin(0.5).setInteractive();
        cont.on('pointerdown', () => {
            overlay.destroy(); panel.destroy();
            this.currentChainIndex++;
            this.showChain();
        });
        cont.on('pointerover', () => cont.setColor('#ffffff'));
        cont.on('pointerout', () => cont.setColor('#3b82f6'));

        panel.add([bg, title, name, flow, exp, pts, cont]);
        panel.setScale(0);
        this.tweens.add({ targets: panel, scale: 1, duration: 400, ease: 'Back.easeOut' });
    }

    showChainResults() {
        this.puzzleContainer.removeAll(true);

        const passed = this.chainsCompleted >= 3;

        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('LevelResultScene', {
                level: this.level, score: this.score, lives: this.lives,
                totalCorrect: this.totalCorrect, passed,
                correctAnswers: this.chainsCompleted, maxCombo: 0,
                chainsCompleted: this.chainsCompleted, chainsFailed: this.chainsFailed,
                totalQuestions: this.chains.length,
                levelMetric: `${this.chainsCompleted}/${this.chains.length} cadenas`
            });
        });
    }
}

// ==================== NIVEL 4: EL DESASTRE — Mapa de la ciudad ====================
class Level4Scene extends Phaser.Scene {
    constructor() { super({ key: 'Level4Scene' }); }

    init(data) {
        this.level = 4;
        this.score = data.score || 0;
        this.lives = data.lives !== undefined ? data.lives : 3;
        this.totalCorrect = data.totalCorrect || 0;
        this.contamination = 30;
        this.decisionsCorrect = 0;
        this.resolvedCount = 0;
    }

    create() {
        this.effects = new EffectsManager(this);

        // City background
        this.add.image(400, 300, 'bg_level_4').setAlpha(0.35);
        this.smogOverlay = this.add.rectangle(400, 300, 800, 600, 0x78716c, 0).setDepth(0);

        // Dark base
        this.add.rectangle(400, 300, 800, 600, 0x0f172a, 0.55).setDepth(1);

        // Header
        this.add.text(400, 15, 'EL DESASTRE — Mapa de la ciudad', {
            fontFamily: 'Nunito', fontSize: '16px', fontStyle: '900', color: '#ef4444'
        }).setOrigin(0.5).setDepth(5);

        this.add.text(400, 36, 'Haz clic en cada zona para decidir', {
            fontFamily: 'Nunito', fontSize: '11px', color: '#94a3b8'
        }).setOrigin(0.5).setDepth(5);

        // Contamination meter
        this.add.text(30, 55, 'Contaminación:', {
            fontFamily: 'Nunito', fontSize: '11px', fontStyle: 'bold', color: '#94a3b8'
        }).setDepth(5);
        this.meterBg = this.add.rectangle(200, 55, 200, 14, 0x1e293b).setOrigin(0, 0.5).setDepth(5);
        this.meterFill = this.add.rectangle(201, 55, 0, 12, 0x22c55e).setOrigin(0, 0.5).setDepth(5);
        this.meterText = this.add.text(410, 55, '30%', {
            fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'bold', color: '#22c55e'
        }).setOrigin(0, 0.5).setDepth(5);

        // Score
        this.scoreText = this.add.text(770, 15, `${this.score}`, {
            fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#fbbf24'
        }).setOrigin(1, 0).setDepth(5);

        // Progress
        this.progressText = this.add.text(770, 36, '0/10', {
            fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'bold', color: '#94a3b8'
        }).setOrigin(1, 0).setDepth(5);

        // Professor (small, corner)
        this.professor = this.add.sprite(50, 570, 'prof_idle_0').setScale(0.7).setDepth(5);
        this.profBubble = this.add.container(130, 545).setAlpha(0).setDepth(6);
        const pbg = this.add.graphics();
        pbg.fillStyle(0x1e293b, 0.95);
        pbg.fillRoundedRect(-80, -20, 160, 40, 8);
        pbg.lineStyle(2, 0xf59e0b);
        pbg.strokeRoundedRect(-80, -20, 160, 40, 8);
        this.profBubbleText = this.add.text(0, 0, '', {
            fontFamily: 'Nunito', fontSize: '9px', color: '#ffffff',
            wordWrap: { width: 145 }, align: 'center'
        }).setOrigin(0.5);
        this.profBubble.add([pbg, this.profBubbleText]);

        // Define city zones
        this.dilemas = [...GAME_DATA.nivel4Dilemas];
        this.zones = [
            { x: 120, y: 140, w: 130, h: 80,  label: 'HOSPITAL',     icon: '+',  dilemaIdx: 0, resolved: false },
            { x: 310, y: 120, w: 130, h: 80,  label: 'COLEGIO',      icon: '🏫', dilemaIdx: 1, resolved: false },
            { x: 530, y: 120, w: 140, h: 80,  label: 'FABRICA',      icon: '🏭', dilemaIdx: 2, resolved: false },
            { x: 120, y: 270, w: 130, h: 80,  label: 'TRANSPORTE',   icon: '🚌', dilemaIdx: 3, resolved: false },
            { x: 340, y: 260, w: 120, h: 90,  label: 'CENTRAL',      icon: '⚡', dilemaIdx: 4, resolved: false },
            { x: 540, y: 260, w: 140, h: 80,  label: 'BARRIO NUEVO', icon: '🏘',  dilemaIdx: 5, resolved: false },
            { x: 120, y: 400, w: 130, h: 80,  label: 'EMBALSE',      icon: '💧', dilemaIdx: 6, resolved: false },
            { x: 340, y: 400, w: 130, h: 80,  label: 'PLAZA',        icon: '☀',  dilemaIdx: 7, resolved: false },
            { x: 540, y: 390, w: 130, h: 80,  label: 'RIO',          icon: '🏞',  dilemaIdx: 8, resolved: false },
            { x: 690, y: 260, w: 95,  h: 80,  label: 'FAROLAS',      icon: '💡', dilemaIdx: 9, resolved: false }
        ];

        // Container for zones
        this.mapContainer = this.add.container(0, 0).setDepth(2);

        // Draw roads between zones (simple grid)
        const roads = this.add.graphics().setDepth(1);
        roads.lineStyle(4, 0x374151, 0.6);
        // Horizontal roads
        roads.beginPath(); roads.moveTo(60, 180); roads.lineTo(740, 180); roads.stroke();
        roads.beginPath(); roads.moveTo(60, 310); roads.lineTo(740, 310); roads.stroke();
        roads.beginPath(); roads.moveTo(60, 440); roads.lineTo(740, 440); roads.stroke();
        // Vertical roads
        roads.beginPath(); roads.moveTo(185, 100); roads.lineTo(185, 500); roads.stroke();
        roads.beginPath(); roads.moveTo(400, 100); roads.lineTo(400, 500); roads.stroke();
        roads.beginPath(); roads.moveTo(610, 100); roads.lineTo(610, 500); roads.stroke();
        // Dashed center lines
        roads.lineStyle(1, 0xfbbf24, 0.3);
        for (let x = 65; x < 740; x += 25) {
            roads.beginPath(); roads.moveTo(x, 180); roads.lineTo(x + 12, 180); roads.stroke();
            roads.beginPath(); roads.moveTo(x, 310); roads.lineTo(x + 12, 310); roads.stroke();
            roads.beginPath(); roads.moveTo(x, 440); roads.lineTo(x + 12, 440); roads.stroke();
        }

        // Create zone buttons
        this.zoneContainers = [];
        this.zones.forEach((zone, i) => {
            this.createZone(zone, i);
        });

        this.updateMeter();

        // Overlay container for dilema popups
        this.overlayContainer = this.add.container(0, 0).setDepth(10);

        try { audioManager.playLevelMusic(4); } catch(e) {}
        this.cameras.main.fadeIn(500);

        this.showProfComment('Haz clic en los edificios!');
    }

    createZone(zone, index) {
        const container = this.add.container(zone.x, zone.y).setDepth(3);

        // Building background
        const bg = this.add.graphics();
        bg.fillStyle(0x1e293b, 0.9);
        bg.fillRoundedRect(-zone.w / 2, -zone.h / 2, zone.w, zone.h, 8);
        bg.lineStyle(2, 0xef4444);
        bg.strokeRoundedRect(-zone.w / 2, -zone.h / 2, zone.w, zone.h, 8);

        // Icon
        const icon = this.add.text(0, -12, zone.icon, {
            fontSize: '22px'
        }).setOrigin(0.5);

        // Label
        const label = this.add.text(0, 16, zone.label, {
            fontFamily: 'Nunito', fontSize: '9px', fontStyle: 'bold', color: '#e2e8f0'
        }).setOrigin(0.5);

        // Alert marker (pulsing !)
        const alert = this.add.text(zone.w / 2 - 8, -zone.h / 2 + 2, '!', {
            fontFamily: 'Nunito', fontSize: '16px', fontStyle: '900', color: '#ef4444'
        }).setOrigin(0.5);
        this.tweens.add({ targets: alert, alpha: 0.3, duration: 500, yoyo: true, repeat: -1 });

        container.add([bg, icon, label, alert]);
        container.setSize(zone.w, zone.h);
        container.setInteractive();

        // Store refs
        zone.container = container;
        zone.bgGraphics = bg;
        zone.alertMark = alert;
        zone.iconText = icon;

        // Hover effects
        container.on('pointerover', () => {
            if (zone.resolved) return;
            bg.clear();
            bg.fillStyle(0x334155, 0.95);
            bg.fillRoundedRect(-zone.w / 2, -zone.h / 2, zone.w, zone.h, 8);
            bg.lineStyle(3, 0xf59e0b);
            bg.strokeRoundedRect(-zone.w / 2, -zone.h / 2, zone.w, zone.h, 8);
            container.setScale(1.05);
        });
        container.on('pointerout', () => {
            if (zone.resolved) return;
            bg.clear();
            bg.fillStyle(0x1e293b, 0.9);
            bg.fillRoundedRect(-zone.w / 2, -zone.h / 2, zone.w, zone.h, 8);
            bg.lineStyle(2, 0xef4444);
            bg.strokeRoundedRect(-zone.w / 2, -zone.h / 2, zone.w, zone.h, 8);
            container.setScale(1);
        });
        container.on('pointerdown', () => {
            if (zone.resolved) return;
            this.openDilema(zone);
        });

        this.zoneContainers.push(container);
    }

    openDilema(zone) {
        const dilema = this.dilemas[zone.dilemaIdx];

        // Dark overlay
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.75);
        this.overlayContainer.add(overlay);

        // Panel
        const panel = this.add.container(400, 300);
        const panelBg = this.add.graphics();
        panelBg.fillStyle(0x1e293b, 1);
        panelBg.fillRoundedRect(-320, -200, 640, 400, 14);
        panelBg.lineStyle(3, 0xef4444);
        panelBg.strokeRoundedRect(-320, -200, 640, 400, 14);
        panel.add(panelBg);

        // Zone title
        const zoneTitle = this.add.text(0, -175, `${zone.icon}  ${zone.label}`, {
            fontFamily: 'Nunito', fontSize: '16px', fontStyle: '900', color: '#f59e0b'
        }).setOrigin(0.5);
        panel.add(zoneTitle);

        // Situation text
        const sitText = this.add.text(0, -120, dilema.situacion, {
            fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#ffffff',
            align: 'center', wordWrap: { width: 580 }, lineSpacing: 4
        }).setOrigin(0.5);
        panel.add(sitText);

        // Option buttons
        dilema.opciones.forEach((opt, i) => {
            const y = -30 + i * 65;
            const btnContainer = this.add.container(0, y);
            const btnBg = this.add.graphics();
            btnBg.fillStyle(0x0f172a, 0.95);
            btnBg.fillRoundedRect(-280, -24, 560, 48, 8);
            btnBg.lineStyle(2, 0x475569);
            btnBg.strokeRoundedRect(-280, -24, 560, 48, 8);

            const btnLabel = this.add.text(-260, -4, opt.texto, {
                fontFamily: 'Nunito', fontSize: '13px', fontStyle: 'bold', color: '#ffffff'
            });

            // Contamination indicator
            const contColor = opt.contaminacion > 0 ? '#ef4444' : (opt.contaminacion < 0 ? '#22c55e' : '#94a3b8');
            const contSign = opt.contaminacion > 0 ? '+' : '';
            const contLabel = this.add.text(255, 0, `${contSign}${opt.contaminacion}%`, {
                fontFamily: 'Nunito', fontSize: '11px', fontStyle: 'bold', color: contColor
            }).setOrigin(1, 0.5);

            btnContainer.add([btnBg, btnLabel, contLabel]);
            btnContainer.setSize(560, 48);
            btnContainer.setInteractive();

            btnContainer.on('pointerover', () => {
                btnBg.clear();
                btnBg.fillStyle(0x334155, 1);
                btnBg.fillRoundedRect(-280, -24, 560, 48, 8);
                btnBg.lineStyle(2, 0x3b82f6);
                btnBg.strokeRoundedRect(-280, -24, 560, 48, 8);
            });
            btnContainer.on('pointerout', () => {
                btnBg.clear();
                btnBg.fillStyle(0x0f172a, 0.95);
                btnBg.fillRoundedRect(-280, -24, 560, 48, 8);
                btnBg.lineStyle(2, 0x475569);
                btnBg.strokeRoundedRect(-280, -24, 560, 48, 8);
            });
            btnContainer.on('pointerdown', () => {
                this.handleDecision(zone, opt, overlay, panel);
            });

            panel.add(btnContainer);
        });

        this.overlayContainer.add(panel);

        // Entrance
        panel.setScale(0);
        this.tweens.add({ targets: panel, scale: 1, duration: 300, ease: 'Back.easeOut' });
    }

    handleDecision(zone, option, overlay, panel) {
        // Remove option interactivity
        panel.list.forEach(c => { if (c.input) c.disableInteractive(); });

        this.contamination = Math.max(0, Math.min(100, this.contamination + option.contaminacion));
        this.score += option.puntos;
        this.scoreText.setText(`${this.score}`);
        if (option.puntos >= 80) { this.decisionsCorrect++; this.totalCorrect++; }
        this.resolvedCount++;
        this.progressText.setText(`${this.resolvedCount}/10`);

        const isGood = option.contaminacion <= 0 && option.puntos >= 70;

        if (isGood) { try { audioManager.playCorrect(); } catch(e) {} }
        else { try { audioManager.playError(); } catch(e) {} }

        this.updateMeter();

        // Show explanation in the panel
        const expBg = this.add.graphics();
        expBg.fillStyle(0x0f172a, 0.95);
        expBg.fillRoundedRect(-280, -24, 560, 70, 8);
        expBg.lineStyle(2, isGood ? 0x22c55e : 0xef4444);
        expBg.strokeRoundedRect(-280, -24, 560, 70, 8);

        const resultContainer = this.add.container(0, 140);
        const resultLabel = this.add.text(0, -8, isGood ? '¡BUENA DECISIÓN!' : 'NO ES LA MEJOR OPCIÓN...', {
            fontFamily: 'Nunito', fontSize: '12px', fontStyle: '900', color: isGood ? '#22c55e' : '#ef4444'
        }).setOrigin(0.5);
        const expText = this.add.text(0, 14, option.explicacion, {
            fontFamily: 'Nunito', fontSize: '11px', color: '#cbd5e1',
            wordWrap: { width: 530 }, align: 'center'
        }).setOrigin(0.5);
        resultContainer.add([expBg, resultLabel, expText]);
        panel.add(resultContainer);

        // Update zone on the map
        zone.resolved = true;
        zone.alertMark.setVisible(false);
        const zoneColor = isGood ? 0x22c55e : (option.contaminacion > 10 ? 0xef4444 : 0xf59e0b);
        zone.bgGraphics.clear();
        zone.bgGraphics.fillStyle(zoneColor, 0.3);
        zone.bgGraphics.fillRoundedRect(-zone.w / 2, -zone.h / 2, zone.w, zone.h, 8);
        zone.bgGraphics.lineStyle(3, zoneColor);
        zone.bgGraphics.strokeRoundedRect(-zone.w / 2, -zone.h / 2, zone.w, zone.h, 8);
        zone.container.disableInteractive();
        zone.container.setScale(1);

        // Professor comment
        this.showProfComment(isGood ? GAME_DATA.getRandomFrase('correcta') : GAME_DATA.getRandomFrase('decision'));

        // Warning at high contamination
        if (this.contamination >= 70 && this.contamination < 100) {
            this.showProfComment(GAME_DATA.getRandomFrase('contaminacionAlta'));
            this.professor.setTexture('prof_angry_0');
        }

        // Close panel after 5 seconds
        this.time.delayedCall(5000, () => {
            this.tweens.add({
                targets: panel, scale: 0, duration: 200, ease: 'Back.easeIn',
                onComplete: () => {
                    this.overlayContainer.removeAll(true);
                    this.professor.setTexture('prof_idle_0');
                    // Check if all resolved
                    if (this.resolvedCount >= this.zones.length || this.contamination >= 100) {
                        this.time.delayedCall(500, () => this.endLevel());
                    }
                }
            });
        });
    }

    updateMeter() {
        const ratio = this.contamination / 100;
        this.meterFill.width = 198 * ratio;

        if (ratio < 0.4) { this.meterFill.fillColor = 0x22c55e; this.meterText.setColor('#22c55e'); }
        else if (ratio < 0.7) { this.meterFill.fillColor = 0xf59e0b; this.meterText.setColor('#f59e0b'); }
        else { this.meterFill.fillColor = 0xef4444; this.meterText.setColor('#ef4444'); }

        this.meterText.setText(`${Math.round(this.contamination)}%`);
        this.smogOverlay.setAlpha(ratio * 0.4);
    }

    endLevel() {
        const passed = this.contamination < 100 && this.score >= 500;

        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('LevelResultScene', {
                level: this.level, score: this.score, lives: this.lives,
                totalCorrect: this.totalCorrect, passed,
                correctAnswers: this.decisionsCorrect, maxCombo: 0,
                totalQuestions: this.dilemas.length,
                contamination: Math.round(this.contamination),
                levelMetric: `Contaminación: ${Math.round(this.contamination)}%`
            });
        });
    }

    showProfComment(text) {
        this.profBubbleText.setText(text);
        this.profBubble.setAlpha(0);
        this.tweens.add({ targets: this.profBubble, alpha: 1, duration: 200, hold: 2500, yoyo: true });
    }
}

// ==================== NIVEL 5: LA FACTURA FINAL — Speed Round Mix ====================
class Level5Scene extends Phaser.Scene {
    constructor() { super({ key: 'Level5Scene' }); }

    init(data) {
        this.level = 5;
        this.score = data.score || 0;
        this.lives = data.lives !== undefined ? data.lives : 3;
        this.totalCorrect = data.totalCorrect || 0;
        this.bill = 47000;
        this.globalTime = 240; // 4 minutes
        this.currentRetoIndex = 0;
        this.correctCount = 0;
    }

    create() {
        this.effects = new EffectsManager(this);
        this.add.rectangle(400, 300, 800, 600, 0x3b0764);
        this.add.rectangle(400, 300, 800, 600, 0x0f172a, 0.8);

        this.retos = Phaser.Utils.Array.Shuffle([...GAME_DATA.nivel5Retos]);

        // Header
        this.add.text(400, 15, 'LA FACTURA FINAL', {
            fontFamily: 'Nunito', fontSize: '20px', fontStyle: '900', color: '#a855f7'
        }).setOrigin(0.5);

        // Bill counter (big, prominent)
        this.billText = this.add.text(400, 55, '47.000€', {
            fontFamily: '"Press Start 2P"', fontSize: '22px', color: '#ef4444'
        }).setOrigin(0.5);
        this.tweens.add({ targets: this.billText, alpha: 0.7, yoyo: true, repeat: -1, duration: 600 });

        // Bill progress bar
        this.add.rectangle(400, 82, 500, 10, 0x1e293b).setOrigin(0.5);
        this.billBar = this.add.rectangle(151, 82, 498, 8, 0xef4444).setOrigin(0, 0.5);

        // Global timer
        this.timerText = this.add.text(750, 55, '4:00', {
            fontFamily: 'Nunito', fontSize: '20px', fontStyle: '900', color: '#fbbf24'
        }).setOrigin(0.5);

        // Score
        this.scoreText = this.add.text(30, 55, `Puntos: ${this.score}`, {
            fontFamily: 'Nunito', fontSize: '13px', fontStyle: 'bold', color: '#fbbf24'
        });

        // Professor
        this.professor = this.add.sprite(720, 160, 'prof_talk_0').setScale(0.9);
        this.time.addEvent({ delay: 300, callback: () => {
            const f = this.professor.texture.key.endsWith('0') ? 1 : 0;
            this.professor.setTexture(`prof_talk_${f}`);
        }, loop: true });

        // Challenge area
        this.challengeContainer = this.add.container(0, 0);

        // Feedback text
        this.feedbackText = this.add.text(400, 570, '', {
            fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#22c55e'
        }).setOrigin(0.5);

        // Global timer
        this.combo = 0;
        this.globalTimer = this.time.addEvent({
            delay: 1000, loop: true,
            callback: () => {
                // Freeze power-up pauses the global timer
                if (window.powerUpManager && powerUpManager.isTimerFrozen()) return;
                this.globalTime--;
                const min = Math.floor(this.globalTime / 60);
                const sec = this.globalTime % 60;
                this.timerText.setText(`${min}:${sec.toString().padStart(2, '0')}`);
                if (this.globalTime <= 30) this.timerText.setColor('#ef4444');
                if (this.globalTime <= 0) { this.globalTimer.destroy(); this.endLevel(); }
            }
        });

        try { audioManager.playLevelMusic(5); } catch(e) {}
        this.cameras.main.fadeIn(500);
        this.time.delayedCall(600, () => this.showReto());
    }

    showReto() {
        if (this.bill <= 0) { this.victoryEnd(); return; }
        if (this.globalTime <= 0) { this.endLevel(); return; }

        // Cycle through retos (loop if needed)
        if (this.currentRetoIndex >= this.retos.length) {
            this.retos = Phaser.Utils.Array.Shuffle([...GAME_DATA.nivel5Retos]);
            this.currentRetoIndex = 0;
        }

        this.challengeContainer.removeAll(true);
        this.input.removeAllListeners('drag');
        this.input.removeAllListeners('dragend');
        this.input.removeAllListeners('dragstart');

        const reto = this.retos[this.currentRetoIndex];
        this.currentReto = reto;
        this.canAnswer = true;

        // Per-challenge timer
        if (this.retoTimer) this.retoTimer.destroy();

        switch (reto.tipo) {
            case 'clasificacion': this.showClasificacion(reto); break;
            case 'renovable': this.showRenovable(reto); break;
            case 'cadena': this.showMiniCadena(reto); break;
            case 'pregunta': this.showPregunta(reto); break;
        }
    }

    showClasificacion(reto) {
        // Type label
        this.challengeContainer.add(this.add.text(400, 115, 'CLASIFICA', {
            fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'bold', color: '#3b82f6'
        }).setOrigin(0.5));

        this.challengeContainer.add(this.add.text(400, 200, reto.texto, {
            fontFamily: 'Nunito', fontSize: '22px', fontStyle: 'bold', color: '#ffffff',
            align: 'center', wordWrap: { width: 500 }
        }).setOrigin(0.5));

        this.challengeContainer.add(this.add.text(400, 250, '¿Qué tipo de energía es?', {
            fontFamily: 'Nunito', fontSize: '12px', color: '#94a3b8'
        }).setOrigin(0.5));

        const options = Phaser.Utils.Array.Shuffle([...reto.opciones]);
        options.forEach((opt, i) => {
            const x = 250 + (i % 2) * 300;
            const y = 320 + Math.floor(i / 2) * 55;
            this.createSpeedButton(x, y, opt, () => {
                if (!this.canAnswer) return;
                this.canAnswer = false;
                if (this.retoTimer) this.retoTimer.destroy();
                this.handleRetoAnswer(opt === reto.respuesta, 'clasificacion');
            });
        });

        this.startRetoTimer(8);
    }

    showRenovable(reto) {
        this.challengeContainer.add(this.add.text(400, 115, '¿RENOVABLE O NO?', {
            fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'bold', color: '#22c55e'
        }).setOrigin(0.5));

        this.challengeContainer.add(this.add.text(400, 220, reto.texto, {
            fontFamily: 'Nunito', fontSize: '26px', fontStyle: 'bold', color: '#ffffff'
        }).setOrigin(0.5));

        // Two big buttons
        this.createSpeedButton(250, 350, 'RENOVABLE', () => {
            if (!this.canAnswer) return;
            this.canAnswer = false;
            if (this.retoTimer) this.retoTimer.destroy();
            this.handleRetoAnswer(reto.respuesta === true, 'renovable');
        }, 200, '#22c55e');

        this.createSpeedButton(550, 350, 'NO RENOVABLE', () => {
            if (!this.canAnswer) return;
            this.canAnswer = false;
            if (this.retoTimer) this.retoTimer.destroy();
            this.handleRetoAnswer(reto.respuesta === false, 'renovable');
        }, 200, '#ef4444');

        this.startRetoTimer(7);
    }

    showMiniCadena(reto) {
        this.challengeContainer.add(this.add.text(400, 115, 'MINI-CADENA', {
            fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'bold', color: '#f59e0b'
        }).setOrigin(0.5));

        this.challengeContainer.add(this.add.text(400, 155, `"${reto.nombre}"`, {
            fontFamily: 'Nunito', fontSize: '18px', fontStyle: 'bold', color: '#ffffff'
        }).setOrigin(0.5));

        this.challengeContainer.add(this.add.text(400, 180, 'Ordena la cadena', {
            fontFamily: 'Nunito', fontSize: '11px', color: '#94a3b8'
        }).setOrigin(0.5));

        // For speed round, simplify: show the steps as clickable buttons in the right order
        const allSteps = Phaser.Utils.Array.Shuffle([...reto.pasos, ...reto.distractores]);
        this.selectedSteps = [];
        this.correctSteps = reto.pasos;

        // Display area for selected steps
        this.selectedDisplay = this.add.text(400, 230, '_ → _ → _'.substring(0, reto.pasos.length * 4 - 3), {
            fontFamily: 'Nunito', fontSize: '16px', fontStyle: 'bold', color: '#f59e0b'
        }).setOrigin(0.5);
        this.challengeContainer.add(this.selectedDisplay);

        // Step buttons
        this.stepButtons = [];
        const perRow = Math.min(allSteps.length, 4);
        allSteps.forEach((step, i) => {
            const col = i % perRow;
            const row = Math.floor(i / perRow);
            const totalW = perRow * 130 + (perRow - 1) * 10;
            const startX = 400 - totalW / 2 + 65;
            const x = startX + col * 140;
            const y = 310 + row * 55;

            const btn = this.createSpeedButton(x, y, step, () => {
                if (!this.canAnswer) return;
                this.selectedSteps.push(step);
                btn.setAlpha(0.3);
                btn.disableInteractive();

                const display = this.selectedSteps.join(' → ');
                this.selectedDisplay.setText(display);

                if (this.selectedSteps.length === this.correctSteps.length) {
                    this.canAnswer = false;
                    if (this.retoTimer) this.retoTimer.destroy();
                    const correct = this.selectedSteps.every((s, idx) => s === this.correctSteps[idx]);
                    this.handleRetoAnswer(correct, 'cadena');
                }
            }, 120);
            this.stepButtons.push(btn);
        });

        this.startRetoTimer(18);
    }

    showPregunta(reto) {
        this.challengeContainer.add(this.add.text(400, 115, 'PREGUNTA RÁPIDA', {
            fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'bold', color: '#a855f7'
        }).setOrigin(0.5));

        this.challengeContainer.add(this.add.text(400, 200, reto.pregunta, {
            fontFamily: 'Nunito', fontSize: '18px', fontStyle: 'bold', color: '#ffffff',
            align: 'center', wordWrap: { width: 550 }
        }).setOrigin(0.5));

        const options = Phaser.Utils.Array.Shuffle([...reto.opciones]);
        options.forEach((opt, i) => {
            const x = 250 + (i % 2) * 300;
            const y = 310 + Math.floor(i / 2) * 55;
            this.createSpeedButton(x, y, opt, () => {
                if (!this.canAnswer) return;
                this.canAnswer = false;
                if (this.retoTimer) this.retoTimer.destroy();
                this.handleRetoAnswer(opt === reto.respuesta, 'pregunta');
            });
        });

        this.startRetoTimer(8);
    }

    createSpeedButton(x, y, text, callback, w = 240, color = '#ffffff') {
        const h = 44;
        const container = this.add.container(x, y);
        const bg = this.add.graphics();
        bg.fillStyle(0x1e293b, 0.95);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
        bg.lineStyle(2, 0x475569);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
        const label = this.add.text(0, 0, text, {
            fontFamily: 'Nunito', fontSize: '13px', fontStyle: 'bold', color: color
        }).setOrigin(0.5);
        container.add([bg, label]);
        container.setSize(w, h).setInteractive();
        container.on('pointerdown', callback);
        container.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(0x334155, 1);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
            bg.lineStyle(2, 0x3b82f6);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
        });
        container.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(0x1e293b, 0.95);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
            bg.lineStyle(2, 0x475569);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
        });
        this.challengeContainer.add(container);
        return container;
    }

    startRetoTimer(seconds) {
        this.retoTimeLeft = seconds;
        // Timer bar for individual reto
        this.retoTimerBg = this.add.rectangle(400, 470, 400, 8, 0x1e293b).setOrigin(0.5);
        this.retoTimerBar = this.add.rectangle(201, 470, 398, 6, 0x3b82f6).setOrigin(0, 0.5);
        this.challengeContainer.add(this.retoTimerBg);
        this.challengeContainer.add(this.retoTimerBar);

        this.retoTimer = this.time.addEvent({
            delay: 50, loop: true,
            callback: () => {
                if (!this.canAnswer) return;
                if (window.powerUpManager && powerUpManager.isTimerFrozen()) return;
                this.retoTimeLeft -= 0.05;
                const ratio = Math.max(0, this.retoTimeLeft / seconds);
                this.retoTimerBar.width = 398 * ratio;
                if (ratio < 0.3) this.retoTimerBar.fillColor = 0xef4444;
                else if (ratio < 0.6) this.retoTimerBar.fillColor = 0xf59e0b;
                if (this.retoTimeLeft <= 0) {
                    this.canAnswer = false;
                    this.retoTimer.destroy();
                    this.handleRetoAnswer(false, this.currentReto.tipo);
                }
            }
        });
    }

    handleRetoAnswer(correct, tipo) {
        if (correct) {
            this.combo = (this.combo || 0) + 1;
            const reduction = GAME_DATA.nivel5Recompensas[tipo] || 2000;
            this.bill = Math.max(0, this.bill - reduction);
            const multiplier = window.powerUpManager ? powerUpManager.getScoreMultiplier() : 1;
            this.score += 100 * multiplier;
            this.correctCount++;
            this.totalCorrect++;

            let feedbackMsg = `-${reduction}€!`;
            if (multiplier > 1) {
                feedbackMsg += ` (x${multiplier})`;
                if (window.powerUpManager) powerUpManager.resetDoubleVisuals(this);
            }
            this.feedbackText.setText(feedbackMsg).setColor('#22c55e').setAlpha(1);
            try { audioManager.playCorrect(); } catch(e) {}
            this.effects.greenPulse(400, 300);

            // Power-up spawn on combos
            if (this.combo >= 3 && window.powerUpManager) {
                powerUpManager.trySpawnPowerUp(this, 100 + Math.random() * 600, 300, this.combo);
            }
        } else {
            // Check shield
            if (window.powerUpManager && powerUpManager.shouldAbsorbHit(this)) {
                this.feedbackText.setText('Escudo!').setColor('#22c55e').setAlpha(1);
                this.tweens.add({ targets: this.feedbackText, alpha: 0, delay: 1500, duration: 500 });
                this.time.delayedCall(2500, () => { this.currentRetoIndex++; this.showReto(); });
                return;
            }
            this.combo = 0;
            this.feedbackText.setText('Sin descuento').setColor('#ef4444').setAlpha(1);
            try { audioManager.playError(); } catch(e) {}
            this.effects.shake(0.005, 200);
        }

        // Update bill display
        const billFormatted = this.bill.toLocaleString('es-ES');
        this.billText.setText(`${billFormatted}€`);
        this.billBar.width = 498 * (this.bill / 47000);
        if (this.bill < 20000) this.billBar.fillColor = 0xf59e0b;
        if (this.bill < 10000) this.billBar.fillColor = 0x22c55e;
        if (this.bill <= 0) this.billBar.fillColor = 0x22c55e;

        this.tweens.add({ targets: this.feedbackText, alpha: 0, delay: 1500, duration: 500 });

        this.time.delayedCall(2500, () => {
            this.currentRetoIndex++;
            if (this.bill <= 0) { this.victoryEnd(); }
            else { this.showReto(); }
        });
    }

    victoryEnd() {
        if (this.globalTimer) this.globalTimer.destroy();
        if (this.retoTimer) this.retoTimer.destroy();
        if (window.powerUpManager) powerUpManager.cleanup();

        this.billText.setText('0€').setColor('#22c55e');
        this.effects.firework(200, 200);
        this.effects.firework(600, 200);

        this.challengeContainer.removeAll(true);
        this.challengeContainer.add(this.add.text(400, 300, '¡FACTURA DEL COLE PAGADA!', {
            fontFamily: 'Nunito', fontSize: '32px', fontStyle: '900', color: '#22c55e'
        }).setOrigin(0.5));

        this.time.delayedCall(2500, () => this.endLevel());
    }

    endLevel() {
        if (this.globalTimer) this.globalTimer.destroy();
        if (this.retoTimer) this.retoTimer.destroy();
        if (window.powerUpManager) powerUpManager.cleanup();

        const passed = this.bill <= 0;

        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('LevelResultScene', {
                level: this.level, score: this.score, lives: this.lives,
                totalCorrect: this.totalCorrect, passed,
                correctAnswers: this.correctCount, maxCombo: 0,
                totalQuestions: this.retos.length,
                billRemaining: this.bill,
                levelMetric: this.bill <= 0 ? 'Factura PAGADA!' : `Quedan ${this.bill.toLocaleString('es-ES')}€`
            });
        });
    }
}
