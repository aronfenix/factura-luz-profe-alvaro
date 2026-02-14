// ============================================================
// LA FACTURA DE LA LUZ DEL PROFE ÁLVARO - ESCENAS PRINCIPALES
// ============================================================

// ==================== BOOT SCENE ====================
class BootScene extends Phaser.Scene {
    constructor() { super({ key: 'BootScene' }); }

    preload() {
        const loadingFill = document.getElementById('loading-fill');
        const loadingText = document.getElementById('loading-text');
        const update = (text, prog) => { loadingText.textContent = text; loadingFill.style.width = prog + '%'; };

        // Professor sprites
        update('Invocando al Profe Álvaro...', 5);
        const states = ['idle', 'talk', 'laugh', 'angry', 'shock', 'point', 'victory', 'defeat', 'walk'];
        states.forEach(state => {
            for (let frame = 0; frame < 2; frame++) {
                this.textures.addCanvas(`prof_${state}_${frame}`, SpriteGenerator.createProfessor(state, frame));
            }
        });

        // Energy icons (base)
        update('Generando fuentes de energía...', 15);
        const sources = ['solar', 'wind', 'hydro', 'coal', 'gas', 'nuclear', 'oil', 'biomass', 'geothermal'];
        sources.forEach(s => {
            this.textures.addCanvas(`energy_${s}`, SpriteGenerator.createEnergyIcon(s));
            this.textures.addCanvas(`energy_${s}_sm`, SpriteGenerator.createEnergyIcon(s, 40));
        });

        // Extra energy icons (Level 2 cards)
        update('Cargando fuentes extra...', 25);
        const extraSources = ['wave', 'wave2', 'solar_thermal', 'wind_offshore', 'hydro_small', 'biogas', 'solar_passive', 'fuel', 'fracking', 'peat', 'combined'];
        extraSources.forEach(s => {
            this.textures.addCanvas(`energy_${s}`, SpriteGenerator.createEnergyIconExtra(s));
        });

        // Scenario icons (Level 1)
        update('Preparando escenarios...', 30);
        const scenarioTypes = ['ball', 'lightbulb', 'spring', 'pot', 'food', 'book', 'drum', 'battery', 'car', 'sun', 'rubber', 'fire', 'plane'];
        scenarioTypes.forEach(type => {
            this.textures.addCanvas(`scenario_${type}`, SpriteGenerator.createScenarioIcon(type));
        });
        // nuclear and lightning use energy icons
        if (!this.textures.exists('scenario_nuclear')) this.textures.addCanvas('scenario_nuclear', SpriteGenerator.createEnergyIcon('nuclear'));
        if (!this.textures.exists('scenario_lightning')) this.textures.addCanvas('scenario_lightning', SpriteGenerator.createParticle('lightning'));

        // City backgrounds
        update('Construyendo la ciudad...', 40);
        for (let i = 1; i <= 5; i++) {
            this.textures.addCanvas(`bg_level_${i}`, SpriteGenerator.createCityBackground(i));
        }

        // Grid cell
        update('Montando la red eléctrica...', 55);
        this.textures.addCanvas('grid_cell', SpriteGenerator.createGridCell(80));
        this.textures.addCanvas('grid_cell_sm', SpriteGenerator.createGridCell(60));

        // Particles
        update('Preparando efectos...', 65);
        ['star', 'spark', 'smoke', 'leaf', 'heart', 'heartEmpty', 'lightning', 'confetti', 'drop'].forEach(type => {
            this.textures.addCanvas(type, SpriteGenerator.createParticle(type));
        });

        // Chain blocks for transformation puzzle
        update('Preparando cadenas de transformación...', 75);
        const chainColors = {
            'Química': '#ef4444', 'Térmica': '#f97316', 'Mecánica': '#3b82f6',
            'Eléctrica': '#fbbf24', 'Luminosa': '#fde68a', 'Sonora': '#a855f7',
            'Nuclear': '#22d3ee', 'Potencial': '#22c55e', 'Cinética': '#6366f1',
            'Elástica': '#ec4899'
        };
        Object.entries(chainColors).forEach(([name, color]) => {
            this.textures.addCanvas(`chain_${name}`, SpriteGenerator.createChainBlock(name, color));
        });

        // Meter bars
        update('Calibrando medidores...', 85);
        this.textures.addCanvas('meter_green', SpriteGenerator.createMeterBar(200, 20, '#22c55e'));
        this.textures.addCanvas('meter_red', SpriteGenerator.createMeterBar(200, 20, '#ef4444'));
        this.textures.addCanvas('meter_blue', SpriteGenerator.createMeterBar(200, 20, '#3b82f6'));

        update('¡Conectando a la red!', 100);
    }

    create() {
        // Preload power-up textures
        if (window.powerUpManager) {
            try { powerUpManager.preloadTextures(this); } catch(e) {}
        }
        this.time.delayedCall(600, () => {
            document.getElementById('loading-screen').classList.add('hidden');
            this.scene.start('CinematicIntroScene');
        });
    }
}

// ==================== CINEMATIC INTRO ====================
class CinematicIntroScene extends Phaser.Scene {
    constructor() { super({ key: 'CinematicIntroScene' }); }

    create() {
        this.dialogueIndex = 0;
        this.isTyping = false;
        this.canSkip = false;
        this.fullText = '';

        // Dark bg
        this.add.rectangle(400, 300, 800, 600, 0x0f172a);

        // Bill icon (big lightning emoji via text)
        this.billIcon = this.add.text(400, 150, '⚡', { fontSize: '80px' }).setOrigin(0.5).setAlpha(0);

        // Professor
        this.professor = this.add.sprite(400, 250, 'prof_idle_0').setScale(3.5).setAlpha(0);

        // Dialogue box
        this.dialogueBox = this.add.graphics();
        this.dialogueBox.fillStyle(0x1e293b, 0.95);
        this.dialogueBox.fillRoundedRect(50, 420, 700, 150, 12);
        this.dialogueBox.lineStyle(3, 0xf59e0b);
        this.dialogueBox.strokeRoundedRect(50, 420, 700, 150, 12);

        this.speakerText = this.add.text(80, 438, '', { fontFamily: 'Nunito', fontSize: '15px', fontStyle: 'bold', color: '#f59e0b' });
        this.dialogueText = this.add.text(80, 465, '', { fontFamily: 'Nunito', fontSize: '14px', color: '#ffffff', wordWrap: { width: 640 }, lineSpacing: 6 });

        this.continueText = this.add.text(700, 545, '▶', { fontFamily: 'Nunito', fontSize: '18px', color: '#22c55e' }).setAlpha(0);
        this.tweens.add({ targets: this.continueText, alpha: 1, duration: 500, yoyo: true, repeat: -1 });

        this.add.text(650, 20, 'ENTER: Saltar', { fontFamily: 'Nunito', fontSize: '12px', color: '#475569' });

        this.input.on('pointerdown', () => this.advanceDialogue());
        this.input.keyboard.on('keydown-SPACE', () => this.advanceDialogue());
        this.input.keyboard.on('keydown-ENTER', () => this.skipIntro());

        this.cameras.main.fadeIn(800);
        this.time.delayedCall(800, () => this.showDialogue());

        this.input.once('pointerdown', () => { audioManager.init(); audioManager.playMenuMusic(); });
    }

    showDialogue() {
        const historia = GAME_DATA.historia.intro;
        if (this.dialogueIndex >= historia.length) { this.endIntro(); return; }

        const current = historia[this.dialogueIndex];
        this.isTyping = true;
        this.canSkip = false;
        this.fullText = current.texto;

        if (current.personaje === 'profesor') {
            this.speakerText.setText('PROFE ÁLVARO');
            this.speakerText.setColor('#f59e0b');
            if (this.professor.alpha === 0) {
                this.billIcon.setAlpha(0);
                this.tweens.add({ targets: this.professor, alpha: 1, duration: 500 });
            }
            this.professorTalk = this.time.addEvent({
                delay: 150, callback: () => {
                    const f = this.professor.texture.key.endsWith('0') ? 1 : 0;
                    this.professor.setTexture(`prof_talk_${f}`);
                }, loop: true
            });
        } else {
            this.speakerText.setText('NARRADOR');
            this.speakerText.setColor('#22c55e');
            if (this.dialogueIndex < 2) {
                this.professor.setAlpha(0);
                this.billIcon.setAlpha(1);
            }
        }

        this.dialogueText.setText('');
        let charIndex = 0;
        this.typewriter = this.time.addEvent({
            delay: 35, callback: () => {
                if (charIndex < this.fullText.length) {
                    this.dialogueText.setText(this.fullText.substring(0, charIndex + 1));
                    charIndex++;
                    if (charIndex % 2 === 0) audioManager.playDialogueBeep();
                } else {
                    this.typewriter.destroy();
                    this.isTyping = false;
                    this.canSkip = true;
                    if (this.professorTalk) { this.professorTalk.destroy(); this.professor.setTexture('prof_idle_0'); }
                }
            }, loop: true
        });
    }

    advanceDialogue() {
        if (this.isTyping) {
            this.typewriter.destroy();
            this.dialogueText.setText(this.fullText);
            this.isTyping = false;
            this.canSkip = true;
            if (this.professorTalk) { this.professorTalk.destroy(); this.professor.setTexture('prof_idle_0'); }
        } else if (this.canSkip) {
            this.dialogueIndex++;
            this.showDialogue();
        }
    }

    skipIntro() {
        if (this.typewriter) this.typewriter.destroy();
        if (this.professorTalk) this.professorTalk.destroy();
        this.endIntro();
    }

    endIntro() {
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => { this.scene.start('MenuScene'); });
    }
}

// ==================== MENU SCENE ====================
class MenuScene extends Phaser.Scene {
    constructor() { super({ key: 'MenuScene' }); }

    create() {
        // BG
        this.add.rectangle(400, 300, 800, 600, 0x0f172a);

        // Gradient overlay
        const g = this.add.graphics();
        g.fillGradientStyle(0x1e293b, 0x1e293b, 0x0f172a, 0x0f172a, 0.5);
        g.fillRect(0, 0, 800, 600);

        // Title
        this.add.text(400, 55, 'LA FACTURA DE LA LUZ', { fontFamily: 'Nunito', fontSize: '28px', fontStyle: '900', color: '#f59e0b' }).setOrigin(0.5);
        this.add.text(400, 90, 'DEL PROFE ÁLVARO', { fontFamily: 'Nunito', fontSize: '34px', fontStyle: '900', color: '#fbbf24' }).setOrigin(0.5);

        // Subtitle with bill amount
        const billText = this.add.text(400, 125, 'Colegio Perú - 47.000€ de factura', { fontFamily: '"Press Start 2P"', fontSize: '9px', color: '#ef4444' }).setOrigin(0.5);
        this.tweens.add({ targets: billText, alpha: 0.5, duration: 800, yoyo: true, repeat: -1 });

        // Professor
        this.professor = this.add.sprite(400, 260, 'prof_idle_0').setScale(2.5);
        this.time.addEvent({ delay: 400, callback: () => {
            const f = this.professor.texture.key.endsWith('0') ? 1 : 0;
            this.professor.setTexture(`prof_idle_${f}`);
        }, loop: true });
        this.tweens.add({ targets: this.professor, x: 450, duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        // Speech bubble
        const bubbleBg = this.add.graphics();
        bubbleBg.fillStyle(0xffffff, 0.95);
        bubbleBg.fillRoundedRect(300, 355, 200, 40, 10);
        this.speechText = this.add.text(400, 375, '"47.000€..."', { fontFamily: 'Nunito', fontSize: '13px', fontStyle: 'bold', color: '#0f172a' }).setOrigin(0.5);
        this.time.addEvent({ delay: 3000, callback: () => {
            const frases = ['"47.000€..."', '"200 estufas..."', '"La dire me mata..."', '"La factura del cole..."', '"¡Salvadme alumnos!"'];
            this.speechText.setText(frases[Math.floor(Math.random() * frases.length)]);
        }, loop: true });

        // Energy icons floating
        const icons = ['solar', 'wind', 'hydro', 'coal', 'nuclear'];
        icons.forEach((ic, i) => {
            const img = this.add.image(80 + i * 160, 420, `energy_${ic}_sm`).setScale(0.7).setAlpha(0.3);
            this.tweens.add({ targets: img, y: 415, duration: 1500 + i * 200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        });

        // Buttons
        this.createButton(400, 470, 'JUGAR', '#22c55e', () => { audioManager.playClick(); this.startGame(); });
        this.createButton(250, 525, 'ESTUDIAR', '#3b82f6', () => { audioManager.playClick(); this.scene.start('StudyModeScene'); }, 160);
        this.createButton(400, 525, 'RANKING', '#f59e0b', () => { audioManager.playClick(); this.scene.start('LeaderboardScene'); }, 160);
        this.createButton(550, 525, 'LOGROS', '#a855f7', () => { audioManager.playClick(); this.scene.start('AchievementsScene'); }, 160);

        this.add.text(400, 575, 'Click para activar audio', { fontFamily: 'Nunito', fontSize: '11px', color: '#475569' }).setOrigin(0.5);

        this.input.once('pointerdown', () => { audioManager.init(); audioManager.resume(); audioManager.playMenuMusic(); });
        this.cameras.main.fadeIn(500);
    }

    createButton(x, y, text, color, callback, width = 220) {
        const container = this.add.container(x, y);
        const hw = width / 2;
        const bg = this.add.graphics();
        const colorHex = Phaser.Display.Color.HexStringToColor(color).color;
        bg.fillStyle(0x1e293b, 1);
        bg.fillRoundedRect(-hw, -22, width, 44, 8);
        bg.lineStyle(2, colorHex);
        bg.strokeRoundedRect(-hw, -22, width, 44, 8);
        const label = this.add.text(0, 0, text, { fontFamily: 'Nunito', fontSize: width < 200 ? '14px' : '18px', fontStyle: 'bold', color: color }).setOrigin(0.5);
        container.add([bg, label]);
        container.setSize(width, 44);
        container.setInteractive();
        container.on('pointerover', () => {
            audioManager.playHover();
            bg.clear();
            bg.fillStyle(colorHex, 1);
            bg.fillRoundedRect(-hw, -22, width, 44, 8);
            label.setColor('#0f172a');
        });
        container.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(0x1e293b, 1);
            bg.fillRoundedRect(-hw, -22, width, 44, 8);
            bg.lineStyle(2, colorHex);
            bg.strokeRoundedRect(-hw, -22, width, 44, 8);
            label.setColor(color);
        });
        container.on('pointerdown', callback);
        return container;
    }

    startGame() {
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => { this.scene.start('LevelIntroScene', { level: 1 }); });
    }
}

// ==================== LEVEL INTRO SCENE ====================
class LevelIntroScene extends Phaser.Scene {
    constructor() { super({ key: 'LevelIntroScene' }); }

    init(data) {
        this.level = data.level || 1;
        this.totalCorrect = data.totalCorrect || 0;
        this.score = data.score || 0;
        this.lives = data.lives !== undefined ? data.lives : 3;
    }

    create() {
        const levelInfo = GAME_DATA.niveles[this.level - 1];

        this.add.image(400, 300, `bg_level_${this.level}`).setAlpha(0.5);
        this.add.rectangle(400, 300, 800, 600, 0x0f172a, 0.75);

        // Level number
        const levelNum = this.add.text(400, 130, `NIVEL ${this.level}`, {
            fontFamily: 'Nunito', fontSize: '52px', fontStyle: '900', color: levelInfo.color
        }).setOrigin(0.5).setAlpha(0);

        const levelName = this.add.text(400, 195, levelInfo.nombre, {
            fontFamily: '"Press Start 2P"', fontSize: '16px', color: '#ffffff'
        }).setOrigin(0.5).setAlpha(0);

        const tema = this.add.text(400, 230, `Tema: ${levelInfo.tema}`, {
            fontFamily: 'Nunito', fontSize: '16px', fontStyle: 'bold', color: '#94a3b8'
        }).setOrigin(0.5).setAlpha(0);

        const desc = this.add.text(400, 290, levelInfo.descripcion, {
            fontFamily: 'Nunito', fontSize: '14px', color: '#22c55e', align: 'center',
            wordWrap: { width: 600 }, lineSpacing: 6
        }).setOrigin(0.5).setAlpha(0);

        this.professor = this.add.sprite(400, 420, 'prof_talk_0').setScale(2.2).setAlpha(0);

        // Animate in
        this.tweens.add({ targets: levelNum, alpha: 1, y: 110, duration: 700, ease: 'Back.easeOut' });
        this.tweens.add({ targets: levelName, alpha: 1, duration: 500, delay: 300 });
        this.tweens.add({ targets: tema, alpha: 1, duration: 500, delay: 500 });
        this.tweens.add({ targets: desc, alpha: 1, duration: 500, delay: 700 });
        this.tweens.add({ targets: this.professor, alpha: 1, duration: 500, delay: 900 });

        // Animate professor
        this.time.addEvent({ delay: 200, callback: () => {
            const f = this.professor.texture.key.endsWith('0') ? 1 : 0;
            this.professor.setTexture(`prof_talk_${f}`);
        }, loop: true });

        // Show level dialogue
        this.time.delayedCall(1400, () => this.showLevelDialogue());

        audioManager.stopMusic();
        this.cameras.main.fadeIn(500);
    }

    showLevelDialogue() {
        const dialogues = GAME_DATA.historia[`nivel${this.level}Intro`];
        let index = 0;

        const dBox = this.add.graphics();
        dBox.fillStyle(0x1e293b, 0.95);
        dBox.fillRoundedRect(100, 490, 600, 70, 10);
        dBox.lineStyle(2, 0xf59e0b);
        dBox.strokeRoundedRect(100, 490, 600, 70, 10);

        const dText = this.add.text(400, 525, '', {
            fontFamily: 'Nunito', fontSize: '13px', fontStyle: 'bold', color: '#ffffff',
            align: 'center', wordWrap: { width: 560 }
        }).setOrigin(0.5);

        const showNext = () => {
            if (index >= dialogues.length) { this.startLevel(); return; }
            dText.setText(dialogues[index].texto);
            audioManager.playDialogueBeep();
            index++;
            this.time.delayedCall(2800, showNext);
        };
        showNext();
    }

    startLevel() {
        this.cameras.main.fadeOut(500);
        const levelScenes = {
            1: 'Level1Scene',
            2: 'Level2Scene',
            3: 'Level3Scene',
            4: 'Level4Scene',
            5: 'Level5Scene'
        };
        const sceneKey = levelScenes[this.level] || 'Level1Scene';
        this.time.delayedCall(500, () => {
            this.scene.start(sceneKey, {
                level: this.level,
                totalCorrect: this.totalCorrect,
                score: this.score,
                lives: this.lives
            });
        });
    }
}
