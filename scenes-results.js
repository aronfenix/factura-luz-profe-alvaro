// ============================================================
// RESULTADOS, FINAL Y LEADERBOARD - La Factura de la Luz
// ============================================================

class LevelResultScene extends Phaser.Scene {
    constructor() { super({ key: 'LevelResultScene' }); }

    init(data) {
        this.level = data.level;
        this.correctAnswers = data.correctAnswers || 0;
        this.totalCorrect = data.totalCorrect || 0;
        this.score = data.score || 0;
        this.lives = data.lives || 0;
        this.maxCombo = data.maxCombo || 0;
        this.passed = data.passed || false;
        this.chainsCompleted = data.chainsCompleted || 0;
        this.chainsFailed = data.chainsFailed || 0;
        this.totalQuestions = data.totalQuestions || 15;
        this.levelMetric = data.levelMetric || '';
    }

    create() {
        this.add.rectangle(400, 300, 800, 600, 0x0f172a);
        this.effects = new EffectsManager(this);

        // Professor
        const profState = this.passed ? 'laugh' : 'angry';
        this.professor = this.add.sprite(400, 140, `prof_${profState}_0`).setScale(3);
        this.time.addEvent({
            delay: 250,
            callback: () => {
                const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                this.professor.setTexture(`prof_${profState}_${frame}`);
            },
            loop: true
        });

        // Title
        const levelInfo = GAME_DATA.niveles[this.level - 1];
        const title = this.passed ? '¡NIVEL SUPERADO!' : 'NIVEL FALLIDO';
        const titleColor = this.passed ? '#22c55e' : '#ef4444';

        this.add.text(400, 270, title, {
            fontFamily: 'Nunito', fontSize: '28px', fontStyle: '900', color: titleColor
        }).setOrigin(0.5);

        this.add.text(400, 300, `Nivel ${this.level}: ${levelInfo.nombre}`, {
            fontFamily: 'Nunito', fontSize: '14px', color: '#94a3b8'
        }).setOrigin(0.5);

        // Stats
        let statsText = `Aciertos: ${this.correctAnswers}/${this.totalQuestions}\nCombo máximo: x${this.maxCombo}\nPuntuación: ${this.score}`;
        if (this.chainsCompleted > 0) {
            statsText += `\nCadenas: ${this.chainsCompleted} completadas`;
        }

        this.add.text(400, 370, statsText, {
            fontFamily: 'Nunito', fontSize: '16px', color: '#ffffff',
            align: 'center', lineSpacing: 8
        }).setOrigin(0.5);

        // Professor phrase
        const phraseType = this.passed ? 'nivelSuperado' : 'nivelFallido';
        const phrases = GAME_DATA.frases[phraseType];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        this.add.text(400, 445, `"${phrase}"`, {
            fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'italic', color: '#f59e0b',
            align: 'center', wordWrap: { width: 600 }
        }).setOrigin(0.5);

        // Update achievements
        if (this.passed) {
            const updates = { levelsCompleted: 1, highScore: this.score, maxCombo: this.maxCombo };
            if (this.correctAnswers === this.totalQuestions) updates.perfectLevels = 1;
            if (this.lives === 3) updates.noDamageLevels = 1;
            achievementSystem.updateStats(updates);
        }

        // Button
        const btnText = this.passed ?
            (this.level >= 5 ? 'VER RESULTADO FINAL' : 'SIGUIENTE NIVEL →') :
            'VER RESULTADO';

        this.createButton(400, 520, btnText, this.passed ? '#22c55e' : '#ef4444', () => {
            audioManager.playClick();
            this.nextScene();
        });

        // Effects
        if (this.passed) {
            audioManager.playVictoryMusic && audioManager.playVictoryMusic();
            this.createConfetti();
        } else {
            audioManager.playDefeatMusic && audioManager.playDefeatMusic();
        }

        this.cameras.main.fadeIn(500);
    }

    createButton(x, y, text, color, callback) {
        const colorNum = Phaser.Display.Color.HexStringToColor(color).color;
        const container = this.add.container(x, y);
        const bg = this.add.graphics();
        bg.fillStyle(0x1e293b, 1);
        bg.fillRoundedRect(-130, -22, 260, 44, 10);
        bg.lineStyle(3, colorNum);
        bg.strokeRoundedRect(-130, -22, 260, 44, 10);
        const label = this.add.text(0, 0, text, {
            fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: color
        }).setOrigin(0.5);
        container.add([bg, label]);
        container.setSize(260, 44);
        container.setInteractive();
        container.on('pointerover', () => { bg.clear(); bg.fillStyle(colorNum, 1); bg.fillRoundedRect(-130, -22, 260, 44, 10); label.setColor('#0f172a'); });
        container.on('pointerout', () => { bg.clear(); bg.fillStyle(0x1e293b, 1); bg.fillRoundedRect(-130, -22, 260, 44, 10); bg.lineStyle(3, colorNum); bg.strokeRoundedRect(-130, -22, 260, 44, 10); label.setColor(color); });
        container.on('pointerdown', callback);
        return container;
    }

    createConfetti() {
        for (let i = 0; i < 40; i++) {
            this.time.delayedCall(i * 80, () => {
                const confetti = this.add.image(Math.random() * 800, -20, 'confetti');
                confetti.setTint(Phaser.Display.Color.RandomRGB().color);
                this.tweens.add({
                    targets: confetti, y: 650, x: confetti.x + (Math.random() - 0.5) * 200,
                    rotation: Math.PI * 4, duration: 2500 + Math.random() * 1000,
                    onComplete: () => confetti.destroy()
                });
            });
        }
    }

    nextScene() {
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            if (this.passed && this.level < 5) {
                this.scene.start('LevelIntroScene', {
                    level: this.level + 1,
                    totalCorrect: this.totalCorrect,
                    score: this.score,
                    lives: this.lives
                });
            } else {
                this.scene.start('FinalScene', {
                    victory: this.passed && this.level >= 5,
                    level: this.level,
                    totalCorrect: this.totalCorrect,
                    score: this.score,
                    lives: this.lives
                });
            }
        });
    }
}

// ==================== ESCENA FINAL ====================
class FinalScene extends Phaser.Scene {
    constructor() { super({ key: 'FinalScene' }); }

    init(data) {
        this.victory = data.victory;
        this.level = data.level;
        this.totalCorrect = data.totalCorrect || 0;
        this.score = data.score || 0;
        this.lives = data.lives || 0;
    }

    create() {
        const bgColor = this.victory ? 0x064e3b : 0x7f1d1d;
        this.add.rectangle(400, 300, 800, 600, bgColor);
        this.effects = new EffectsManager(this);

        if (this.victory) {
            this.showVictoryScene();
        } else {
            this.showDefeatScene();
        }
    }

    showVictoryScene() {
        // Update stats
        achievementSystem.updateStats({
            victories: 1,
            levelsCompleted: 5,
            highScore: this.score,
            gamesPlayed: 1
        });

        // Title with glow
        const victoryTitle = this.add.text(400, 35, '¡COLEGIO PERÚ SALVADO!', {
            fontFamily: 'Nunito', fontSize: '32px', fontStyle: '900', color: '#fbbf24'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: victoryTitle, alpha: 0.7, yoyo: true, repeat: -1, duration: 500
        });

        this.add.text(400, 68, '¡Has salvado al Colegio Perú!', {
            fontFamily: 'Nunito', fontSize: '14px', color: '#22c55e'
        }).setOrigin(0.5);

        // Scene: Professor walking away with paid bill
        this.add.rectangle(400, 155, 800, 90, 0x1e3a2e);
        this.add.rectangle(400, 115, 800, 3, 0x2d5a3d);

        // Sun
        this.add.circle(680, 120, 22, 0xfbbf24);

        // Professor walking away
        this.professor = this.add.sprite(500, 148, 'prof_walk_0').setScale(1.8).setFlipX(true);
        this.time.addEvent({
            delay: 300,
            callback: () => {
                if (this.professor && this.professor.active) {
                    const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                    this.professor.setTexture(`prof_walk_${frame}`);
                }
            },
            loop: true
        });

        // Bill (factura) he's carrying
        const factura = this.add.graphics();
        factura.fillStyle(0xffffff);
        factura.fillRect(535, 162, 18, 14);
        factura.fillStyle(0x22c55e);
        factura.fillRect(538, 165, 12, 2);
        factura.fillRect(538, 169, 8, 2);
        // "PAGADA" stamp
        const stamp = this.add.text(544, 172, 'OK', {
            fontSize: '6px', fontStyle: 'bold', color: '#22c55e'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: [this.professor, factura, stamp],
            x: '-=600', duration: 10000, ease: 'Linear', delay: 2000
        });
        this.tweens.add({
            targets: this.professor, y: '+=3', yoyo: true, repeat: -1, duration: 200
        });

        // Epilogue
        const epilogoBox = this.add.rectangle(400, 250, 700, 70, 0x0f172a, 0.95);
        epilogoBox.setStrokeStyle(3, 0x22c55e);

        const epilogos = [
            '"¡47.000€ PAGADOS! ¡El Colegio Perú se salva!\n¡Y yo me quedo! Es broma... o no."',
            '"¡Habéis dominado la energía! La directora Paloma me ha dado un abrazo.\nCasi lloré. ¡Iros a casa y apagad las luces!"',
            '"¡La factura del cole está pagada! Voy a celebrarlo...\ndesenchufando las 200 estufas. Bueno, 199."',
            '"¡Alumnos del Colegio Perú, sois LEYENDA!\nAhora a ver si también aprobáis el examen..."'
        ];
        const epilogo = epilogos[Math.floor(Math.random() * epilogos.length)];

        this.add.text(400, 250, epilogo, {
            fontFamily: 'Nunito', fontSize: '13px', fontStyle: 'italic', color: '#ffffff',
            align: 'center', lineSpacing: 6
        }).setOrigin(0.5);

        // Score
        this.add.text(400, 310, `PUNTUACIÓN FINAL: ${this.score}`, {
            fontFamily: 'Nunito', fontSize: '20px', fontStyle: '900', color: '#fbbf24'
        }).setOrigin(0.5);

        this.add.text(400, 335, `Aciertos: ${this.totalCorrect}  |  Nivel: ${this.level}/5`, {
            fontFamily: 'Nunito', fontSize: '12px', color: '#94a3b8'
        }).setOrigin(0.5);

        this.showCommonUI(true);
        audioManager.playVictoryMusic && audioManager.playVictoryMusic();
        this.createMassiveConfetti();
        this.cameras.main.fadeIn(500);
    }

    showDefeatScene() {
        // Update stats
        achievementSystem.updateStats({
            losses: 1,
            highScore: this.score,
            gamesPlayed: 1
        });

        // Professor laughing (smaller, top-left)
        this.professor = this.add.sprite(80, 60, 'prof_laugh_0').setScale(1.5);
        this.time.addEvent({
            delay: 200,
            callback: () => {
                const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                this.professor.setTexture(`prof_laugh_${frame}`);
            },
            loop: true
        });

        this.add.text(400, 30, 'APAGÓN TOTAL', {
            fontFamily: 'Nunito', fontSize: '26px', fontStyle: '900', color: '#ef4444'
        }).setOrigin(0.5);

        const subtitle = this.lives <= 0 ? 'Te has quedado sin vidas...' : 'No has superado el nivel...';
        this.add.text(400, 58, subtitle, {
            fontFamily: 'Nunito', fontSize: '13px', color: '#94a3b8'
        }).setOrigin(0.5);

        this.add.text(400, 85,
            `Nivel: ${this.level}/5  |  Aciertos: ${this.totalCorrect}  |  Puntos: ${this.score}`, {
            fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#fbbf24', align: 'center'
        }).setOrigin(0.5);

        const phrase = GAME_DATA.frases.derrotaFinal[Math.floor(Math.random() * GAME_DATA.frases.derrotaFinal.length)];
        this.add.text(400, 115, `"${phrase}"`, {
            fontFamily: 'Nunito', fontSize: '13px', fontStyle: 'italic', color: '#ef4444',
            align: 'center', wordWrap: { width: 650 }
        }).setOrigin(0.5);

        this.showCommonUI(false);
        audioManager.playDefeatMusic && audioManager.playDefeatMusic();
        this.cameras.main.fadeIn(500);
    }

    showCommonUI(isVictory) {
        const buttonY = 580;

        // Buttons row
        this.createSmallButton(150, buttonY, 'MENÚ', '#3b82f6', () => {
            audioManager.playClick();
            this.scene.start('MenuScene');
        });

        this.createSmallButton(350, buttonY, 'RANKING', '#f59e0b', () => {
            audioManager.playClick();
            this.scene.start('LeaderboardScene');
        });

        this.createSmallButton(550, buttonY, 'REINTENTAR', '#22c55e', () => {
            audioManager.playClick();
            this.scene.start('LevelIntroScene', { level: 1 });
        });

        // Name input for leaderboard
        if (this.score > 0) {
            const inputY = isVictory ? 360 : 155;
            this.showNameInput(inputY);
        }
    }

    showNameInput(baseY) {
        this.add.text(400, baseY, 'Escribe tu nombre para el ranking:', {
            fontFamily: 'Nunito', fontSize: '13px', color: '#94a3b8'
        }).setOrigin(0.5);

        this.nameInput = '';
        this.nameContainer = this.add.container(400, baseY + 25);

        const inputBg = this.add.graphics();
        inputBg.fillStyle(0x1e293b, 1);
        inputBg.fillRoundedRect(-120, -14, 240, 28, 8);
        inputBg.lineStyle(2, 0x3b82f6);
        inputBg.strokeRoundedRect(-120, -14, 240, 28, 8);

        this.nameDisplay = this.add.text(0, 0, '_', {
            fontFamily: 'Nunito', fontSize: '15px', fontStyle: 'bold', color: '#ffffff'
        }).setOrigin(0.5);

        this.nameContainer.add([inputBg, this.nameDisplay]);

        // Virtual keyboard
        this.createNameKeyboard(baseY + 55);

        // Physical keyboard support
        this.input.keyboard.on('keydown', (event) => {
            if (event.key === 'Enter') {
                this.saveName();
            } else if (event.key === 'Backspace') {
                this.nameInput = this.nameInput.slice(0, -1);
                this.nameDisplay.setText(this.nameInput + '_');
            } else if (event.key.length === 1 && this.nameInput.length < 10) {
                this.nameInput += event.key.toUpperCase();
                this.nameDisplay.setText(this.nameInput + '_');
            }
        });
    }

    createNameKeyboard(keyboardY) {
        // Keyboard layout: all rows use positive Y offsets from keyboardY (no negative)
        // Row 0: Numbers (0-9)       y = 0
        // Row 1: QWERTYUIOP          y = 28
        // Row 2: ASDFGHJKL           y = 56
        // Row 3: ZXCVBNM + DEL       y = 84
        // Row 4: GUARDAR button      y = 116
        this.keyboard = this.add.container(400, keyboardY);

        // Numbers row (0-9)
        const numRow = '1234567890';
        const numStartX = -((numRow.length - 1) * 30) / 2;
        for (let i = 0; i < numRow.length; i++) {
            const key = numRow[i];
            const x = numStartX + i * 30;
            const keyBtn = this.add.container(x, 0);
            const keyBg = this.add.graphics();
            keyBg.fillStyle(0x1e293b, 1);
            keyBg.fillRoundedRect(-13, -12, 26, 24, 4);
            keyBg.lineStyle(1, 0x475569);
            keyBg.strokeRoundedRect(-13, -12, 26, 24, 4);
            const keyText = this.add.text(0, 0, key, {
                fontFamily: 'Nunito', fontSize: '11px', fontStyle: 'bold', color: '#94a3b8'
            }).setOrigin(0.5);
            keyBtn.add([keyBg, keyText]);
            keyBtn.setSize(26, 24);
            keyBtn.setInteractive();
            keyBtn.on('pointerdown', () => {
                if (this.nameInput.length < 10) {
                    this.nameInput += key;
                    this.nameDisplay.setText(this.nameInput + '_');
                    audioManager.playClick();
                }
            });
            keyBtn.on('pointerover', () => keyText.setColor('#ffffff'));
            keyBtn.on('pointerout', () => keyText.setColor('#94a3b8'));
            this.keyboard.add(keyBtn);
        }

        // Letter rows
        const keys = 'QWERTYUIOPASDFGHJKLZXCVBNM';
        const rows = [keys.slice(0, 10), keys.slice(10, 19), keys.slice(19, 26)];

        rows.forEach((row, rowIndex) => {
            const startX = -((row.length - 1) * 30) / 2;
            for (let i = 0; i < row.length; i++) {
                const key = row[i];
                const x = startX + i * 30;
                const y = 28 + rowIndex * 28;

                const keyBtn = this.add.container(x, y);
                const keyBg = this.add.graphics();
                keyBg.fillStyle(0x1e293b, 1);
                keyBg.fillRoundedRect(-13, -12, 26, 24, 4);
                keyBg.lineStyle(1, 0x475569);
                keyBg.strokeRoundedRect(-13, -12, 26, 24, 4);
                const keyText = this.add.text(0, 0, key, {
                    fontFamily: 'Nunito', fontSize: '11px', fontStyle: 'bold', color: '#94a3b8'
                }).setOrigin(0.5);

                keyBtn.add([keyBg, keyText]);
                keyBtn.setSize(26, 24);
                keyBtn.setInteractive();

                keyBtn.on('pointerdown', () => {
                    if (this.nameInput.length < 10) {
                        this.nameInput += key;
                        this.nameDisplay.setText(this.nameInput + '_');
                        audioManager.playClick();
                    }
                });

                keyBtn.on('pointerover', () => keyText.setColor('#ffffff'));
                keyBtn.on('pointerout', () => keyText.setColor('#94a3b8'));

                this.keyboard.add(keyBtn);
            }
        });

        // Delete button (right of ZXCVBNM row)
        const delBtn = this.add.container(125, 84);
        const delBg = this.add.graphics();
        delBg.fillStyle(0x1e293b, 1);
        delBg.fillRoundedRect(-25, -12, 50, 24, 4);
        delBg.lineStyle(1, 0xef4444);
        delBg.strokeRoundedRect(-25, -12, 50, 24, 4);
        const delText = this.add.text(0, 0, 'DEL', {
            fontFamily: 'Nunito', fontSize: '10px', fontStyle: 'bold', color: '#ef4444'
        }).setOrigin(0.5);
        delBtn.add([delBg, delText]);
        delBtn.setSize(50, 24);
        delBtn.setInteractive();
        delBtn.on('pointerdown', () => {
            this.nameInput = this.nameInput.slice(0, -1);
            this.nameDisplay.setText(this.nameInput + '_');
            audioManager.playClick();
        });
        this.keyboard.add(delBtn);

        // Big GUARDAR button below the keyboard
        const enterBtn = this.add.container(0, 116);
        const enterBg = this.add.graphics();
        enterBg.fillStyle(0x22c55e, 1);
        enterBg.fillRoundedRect(-110, -14, 220, 28, 6);
        const enterText = this.add.text(0, 0, 'GUARDAR PUNTUACIÓN', {
            fontFamily: 'Nunito', fontSize: '13px', fontStyle: '900', color: '#ffffff'
        }).setOrigin(0.5);
        enterBtn.add([enterBg, enterText]);
        enterBtn.setSize(220, 28);
        enterBtn.setInteractive();
        enterBtn.on('pointerdown', () => {
            audioManager.playClick();
            this.saveName();
        });
        enterBtn.on('pointerover', () => {
            enterBg.clear();
            enterBg.fillStyle(0x16a34a, 1);
            enterBg.fillRoundedRect(-110, -14, 220, 28, 6);
        });
        enterBtn.on('pointerout', () => {
            enterBg.clear();
            enterBg.fillStyle(0x22c55e, 1);
            enterBg.fillRoundedRect(-110, -14, 220, 28, 6);
        });
        this.keyboard.add(enterBtn);
    }

    createSmallButton(x, y, text, color, callback) {
        const colorNum = Phaser.Display.Color.HexStringToColor(color).color;
        const container = this.add.container(x, y);
        const bg = this.add.graphics();
        bg.fillStyle(0x1e293b, 1);
        bg.fillRoundedRect(-65, -16, 130, 32, 8);
        bg.lineStyle(2, colorNum);
        bg.strokeRoundedRect(-65, -16, 130, 32, 8);
        const label = this.add.text(0, 0, text, {
            fontFamily: 'Nunito', fontSize: '13px', fontStyle: 'bold', color: color
        }).setOrigin(0.5);
        container.add([bg, label]);
        container.setSize(130, 32);
        container.setInteractive();
        container.on('pointerover', () => { bg.clear(); bg.fillStyle(colorNum, 1); bg.fillRoundedRect(-65, -16, 130, 32, 8); label.setColor('#0f172a'); });
        container.on('pointerout', () => { bg.clear(); bg.fillStyle(0x1e293b, 1); bg.fillRoundedRect(-65, -16, 130, 32, 8); bg.lineStyle(2, colorNum); bg.strokeRoundedRect(-65, -16, 130, 32, 8); label.setColor(color); });
        container.on('pointerdown', callback);
    }

    async saveName() {
        if (this.savingInProgress) return;
        this.savingInProgress = true;

        if (this.nameInput.length === 0) this.nameInput = 'ANÓNIMO';

        const entry = {
            name: this.nameInput,
            score: this.score,
            level: this.level,
            correct: this.totalCorrect,
            date: new Date().toISOString(),
            victory: this.victory
        };

        try {
            if (window.leaderboardManager) {
                await leaderboardManager.saveScore(entry);
            }
        } catch (e) {
            console.log('Error guardando:', e);
        }

        // Feedback visual
        if (this.nameContainer) this.nameContainer.destroy();
        if (this.keyboard) this.keyboard.destroy();

        const savedY = this.victory ? 430 : 380;
        this.add.text(400, savedY, '¡Puntuación guardada!', {
            fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#22c55e'
        }).setOrigin(0.5);
    }

    createMassiveConfetti() {
        for (let i = 0; i < 80; i++) {
            this.time.delayedCall(i * 50, () => {
                const confetti = this.add.image(Math.random() * 800, -20, 'confetti');
                confetti.setTint(Phaser.Display.Color.RandomRGB().color);
                confetti.setScale(1 + Math.random());
                this.tweens.add({
                    targets: confetti, y: 650, x: confetti.x + (Math.random() - 0.5) * 300,
                    rotation: Math.PI * 6, duration: 2000 + Math.random() * 2000,
                    onComplete: () => confetti.destroy()
                });
            });
        }

        // Fireworks
        this.time.delayedCall(500, () => this.effects.firework(200, 200));
        this.time.delayedCall(1200, () => this.effects.firework(600, 180));
        this.time.delayedCall(2000, () => this.effects.firework(400, 150));
    }
}

// ==================== ESCENA LEADERBOARD ====================
class LeaderboardScene extends Phaser.Scene {
    constructor() { super({ key: 'LeaderboardScene' }); }

    async create() {
        this.add.rectangle(400, 300, 800, 600, 0x0f172a);

        this.add.text(400, 35, 'RANKING GLOBAL', {
            fontFamily: 'Nunito', fontSize: '28px', fontStyle: '900', color: '#fbbf24'
        }).setOrigin(0.5);

        this.add.text(400, 62, 'La Factura de la Luz', {
            fontFamily: 'Nunito', fontSize: '12px', color: '#94a3b8'
        }).setOrigin(0.5);

        // Loading indicator
        this.loadingText = this.add.text(400, 300, 'Cargando puntuaciones...', {
            fontFamily: 'Nunito', fontSize: '16px', color: '#3b82f6'
        }).setOrigin(0.5);

        // Load scores
        let scores = [];
        try {
            if (window.leaderboardManager) {
                scores = await leaderboardManager.getScores(50);
            }
        } catch (e) {
            console.log('Error cargando ranking:', e);
        }

        this.loadingText.destroy();
        this.displayLeaderboard(scores);

        // Back button
        const backBtn = this.add.text(400, 560, '← VOLVER AL MENÚ', {
            fontFamily: 'Nunito', fontSize: '16px', fontStyle: 'bold', color: '#f59e0b'
        }).setOrigin(0.5).setInteractive();
        backBtn.on('pointerdown', () => { audioManager.playClick(); this.scene.start('MenuScene'); });
        backBtn.on('pointerover', () => backBtn.setColor('#ffffff'));
        backBtn.on('pointerout', () => backBtn.setColor('#f59e0b'));

        this.cameras.main.fadeIn(500);
    }

    displayLeaderboard(scores) {
        if (scores.length === 0) {
            this.add.text(400, 300, 'No hay puntuaciones todavía.\n¡Sé el primero en jugar!', {
                fontFamily: 'Nunito', fontSize: '16px', color: '#64748b', align: 'center', lineSpacing: 8
            }).setOrigin(0.5);
            return;
        }

        // Header
        this.add.text(60, 90, '#', { fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'bold', color: '#64748b' });
        this.add.text(100, 90, 'NOMBRE', { fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'bold', color: '#64748b' });
        this.add.text(340, 90, 'PUNTOS', { fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'bold', color: '#64748b' });
        this.add.text(460, 90, 'NIVEL', { fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'bold', color: '#64748b' });
        this.add.text(560, 90, 'FECHA', { fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'bold', color: '#64748b' });

        // Separator
        const sep = this.add.graphics();
        sep.fillStyle(0x334155, 1);
        sep.fillRect(50, 108, 700, 2);

        // Show top 12
        const displayScores = scores.slice(0, 12);
        displayScores.forEach((entry, index) => {
            const y = 125 + index * 32;

            // Row background (alternating)
            if (index % 2 === 0) {
                const rowBg = this.add.rectangle(400, y + 4, 700, 30, 0x1e293b, 0.5);
            }

            // Medal for top 3
            if (index < 3) {
                const medalColors = [0xfbbf24, 0xc0c0c0, 0xcd7f32];
                const medalEmoji = ['🥇', '🥈', '🥉'];
                this.add.text(38, y, medalEmoji[index], { fontSize: '14px' }).setOrigin(0.5);
            }

            // Rank
            let rankColor = '#ffffff';
            if (index === 0) rankColor = '#fbbf24';
            else if (index === 1) rankColor = '#c0c0c0';
            else if (index === 2) rankColor = '#cd7f32';

            this.add.text(60, y, `${index + 1}`, {
                fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: rankColor
            });

            // Name
            this.add.text(100, y, (entry.name || 'ANÓNIMO').substring(0, 10), {
                fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold',
                color: entry.victory ? '#22c55e' : '#ffffff'
            });

            // Score
            this.add.text(340, y, `${entry.score}`, {
                fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#fbbf24'
            });

            // Level
            this.add.text(460, y, `${entry.level}/5`, {
                fontFamily: 'Nunito', fontSize: '14px', color: '#94a3b8'
            });

            // Date
            let dateStr = '-';
            if (entry.date) {
                const d = new Date(entry.date);
                dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
            }
            this.add.text(560, y, dateStr, {
                fontFamily: 'Nunito', fontSize: '13px', color: '#64748b'
            });
        });
    }
}
