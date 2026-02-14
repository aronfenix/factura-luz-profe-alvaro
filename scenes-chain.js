// ============================================================
// TRANSFORMATION SCENE - Puzzle de cadenas de transformación
// ============================================================

class TransformationScene extends Phaser.Scene {
    constructor() { super({ key: 'TransformationScene' }); }

    init(data) {
        this.level = data.level || 3;
        this.totalCorrect = data.totalCorrect || 0;
        this.correctAnswers = data.correctAnswers || 0;
        this.score = data.score || 0;
        this.lives = data.lives || 3;
        this.maxCombo = data.maxCombo || 0;
        this.chainsCompleted = 0;
        this.chainsFailed = 0;
        this.currentChainIndex = 0;
    }

    create() {
        this.effects = new EffectsManager(this);
        this.add.rectangle(400, 300, 800, 600, 0x0f172a);

        // Get chains for this level
        this.chains = GAME_DATA.getCadenasNivel(this.level);
        // Shuffle and pick up to 3 chains
        this.chains = Phaser.Utils.Array.Shuffle([...this.chains]).slice(0, 3);

        // Header
        this.add.text(400, 25, 'CADENAS DE TRANSFORMACIÓN', {
            fontFamily: 'Nunito', fontSize: '22px', fontStyle: '900', color: '#f59e0b'
        }).setOrigin(0.5);

        this.add.text(400, 50, 'Ordena los tipos de energía en la secuencia correcta', {
            fontFamily: 'Nunito', fontSize: '12px', color: '#94a3b8'
        }).setOrigin(0.5);

        // Progress
        this.progressText = this.add.text(400, 72, '', {
            fontFamily: 'Nunito', fontSize: '13px', fontStyle: 'bold', color: '#ffffff'
        }).setOrigin(0.5);

        // Professor
        this.professor = this.add.sprite(720, 130, 'prof_idle_0').setScale(1.2);
        this.profBubble = this.add.container(720, 70).setAlpha(0);
        const bubbleBg = this.add.graphics();
        bubbleBg.fillStyle(0x1e293b, 0.95);
        bubbleBg.fillRoundedRect(-90, -25, 180, 50, 10);
        bubbleBg.lineStyle(2, 0xf59e0b);
        bubbleBg.strokeRoundedRect(-90, -25, 180, 50, 10);
        this.profText = this.add.text(0, 0, '', {
            fontFamily: 'Nunito', fontSize: '10px', color: '#ffffff',
            wordWrap: { width: 160 }, align: 'center'
        }).setOrigin(0.5);
        this.profBubble.add([bubbleBg, this.profText]);

        // Container for chain puzzle elements
        this.puzzleContainer = this.add.container(0, 0);

        // Score display
        this.add.text(30, 25, `Puntuación: ${this.score}`, {
            fontFamily: 'Nunito', fontSize: '13px', fontStyle: 'bold', color: '#fbbf24'
        });

        // Start first chain
        this.showChain();
        this.cameras.main.fadeIn(500);

        // Play music
        audioManager.playLevelMusic && audioManager.playLevelMusic(this.level);
    }

    showChain() {
        this.puzzleContainer.removeAll(true);

        if (this.currentChainIndex >= this.chains.length) {
            this.showChainResults();
            return;
        }

        const chain = this.chains[this.currentChainIndex];
        this.currentChain = chain;
        this.progressText.setText(`Cadena ${this.currentChainIndex + 1} de ${this.chains.length}  |  ✓ ${this.chainsCompleted}  ✗ ${this.chainsFailed}`);

        // Chain name
        const nameText = this.add.text(350, 110, `"${chain.nombre}"`, {
            fontFamily: 'Nunito', fontSize: '20px', fontStyle: 'bold', color: '#ffffff'
        }).setOrigin(0.5);
        this.puzzleContainer.add(nameText);

        const instrText = this.add.text(350, 140, 'Arrastra los bloques a los huecos en el orden correcto', {
            fontFamily: 'Nunito', fontSize: '12px', color: '#94a3b8'
        }).setOrigin(0.5);
        this.puzzleContainer.add(instrText);

        // Calculate layout
        const numSteps = chain.pasos.length;
        const slotWidth = 110;
        const slotHeight = 50;
        const slotGap = 14;
        const totalSlotsWidth = numSteps * slotWidth + (numSteps - 1) * slotGap;
        const slotsStartX = 400 - totalSlotsWidth / 2;

        // Draw target slots (drop zones)
        this.dropSlots = [];
        for (let i = 0; i < numSteps; i++) {
            const x = slotsStartX + i * (slotWidth + slotGap) + slotWidth / 2;
            const y = 230;

            // Slot background
            const slotBg = this.add.graphics();
            slotBg.fillStyle(0x1e293b, 1);
            slotBg.fillRoundedRect(x - slotWidth / 2, y - slotHeight / 2, slotWidth, slotHeight, 10);
            slotBg.lineStyle(2, 0x475569);
            slotBg.strokeRoundedRect(x - slotWidth / 2, y - slotHeight / 2, slotWidth, slotHeight, 10);
            this.puzzleContainer.add(slotBg);

            // Step number
            const numLabel = this.add.text(x, y - 35, `Paso ${i + 1}`, {
                fontFamily: 'Nunito', fontSize: '10px', fontStyle: 'bold', color: '#64748b'
            }).setOrigin(0.5);
            this.puzzleContainer.add(numLabel);

            // Arrow between slots
            if (i < numSteps - 1) {
                const arrowX = x + slotWidth / 2 + slotGap / 2;
                const arrow = this.add.text(arrowX, y, '→', {
                    fontSize: '22px', color: '#475569'
                }).setOrigin(0.5);
                this.puzzleContainer.add(arrow);
            }

            this.dropSlots.push({
                x, y, width: slotWidth, height: slotHeight,
                occupied: null, index: i, bg: slotBg,
                correctAnswer: chain.pasos[i]
            });
        }

        // Create draggable blocks (shuffled, with distractors)
        this.draggableBlocks = [];
        const correctTypes = [...chain.pasos];

        // Add 2-3 distractor blocks
        const allTypes = GAME_DATA.tiposEnergia;
        const distractors = allTypes.filter(t => !correctTypes.includes(t));
        const shuffledDistractors = Phaser.Utils.Array.Shuffle([...distractors]);
        const numDistractors = Math.min(3, 10 - correctTypes.length, shuffledDistractors.length);
        const blockTypes = [...correctTypes, ...shuffledDistractors.slice(0, numDistractors)];
        const shuffledBlocks = Phaser.Utils.Array.Shuffle(blockTypes);

        // Layout blocks at bottom
        const blockWidth = 110;
        const blockHeight = 44;
        const blockGap = 10;
        const blocksPerRow = Math.min(shuffledBlocks.length, 5);
        const numRows = Math.ceil(shuffledBlocks.length / blocksPerRow);
        const totalBlocksWidth = blocksPerRow * blockWidth + (blocksPerRow - 1) * blockGap;
        const blocksStartX = 400 - totalBlocksWidth / 2;

        const chainColors = {
            'Química': '#ef4444', 'Térmica': '#f97316', 'Mecánica': '#3b82f6',
            'Eléctrica': '#fbbf24', 'Luminosa': '#fde68a', 'Sonora': '#a855f7',
            'Nuclear': '#22d3ee', 'Potencial': '#22c55e', 'Cinética': '#6366f1',
            'Elástica': '#ec4899'
        };

        shuffledBlocks.forEach((type, i) => {
            const row = Math.floor(i / blocksPerRow);
            const col = i % blocksPerRow;
            const rowItems = Math.min(blocksPerRow, shuffledBlocks.length - row * blocksPerRow);
            const rowWidth = rowItems * blockWidth + (rowItems - 1) * blockGap;
            const rowStartX = 400 - rowWidth / 2;

            const x = rowStartX + col * (blockWidth + blockGap) + blockWidth / 2;
            const y = 370 + row * (blockHeight + blockGap + 5);

            const color = chainColors[type] || '#94a3b8';
            const colorNum = Phaser.Display.Color.HexStringToColor(color).color;

            // Block container
            const container = this.add.container(x, y);
            container.setSize(blockWidth, blockHeight);

            const bg = this.add.graphics();
            bg.fillStyle(Phaser.Display.Color.HexStringToColor(color).color, 0.2);
            bg.fillRoundedRect(-blockWidth / 2, -blockHeight / 2, blockWidth, blockHeight, 8);
            bg.lineStyle(2, colorNum);
            bg.strokeRoundedRect(-blockWidth / 2, -blockHeight / 2, blockWidth, blockHeight, 8);

            const label = this.add.text(0, 0, type, {
                fontFamily: 'Nunito', fontSize: '13px', fontStyle: 'bold', color: color
            }).setOrigin(0.5);

            container.add([bg, label]);
            container.setInteractive({ draggable: true, hitArea: new Phaser.Geom.Rectangle(-blockWidth / 2, -blockHeight / 2, blockWidth, blockHeight), hitAreaCallback: Phaser.Geom.Rectangle.Contains });
            container.setDepth(100);

            container.blockType = type;
            container.originX = x;
            container.originY = y;
            container.inSlot = null;
            container.blockBg = bg;
            container.blockLabel = label;
            container.blockColor = color;
            container.blockColorNum = colorNum;

            this.puzzleContainer.add(container);
            this.draggableBlocks.push(container);
        });

        // Setup drag events
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setDepth(200);
            gameObject.setScale(1.1);
            audioManager.playClick();

            // If it was in a slot, free it
            if (gameObject.inSlot !== null) {
                this.dropSlots[gameObject.inSlot].occupied = null;
                this.updateSlotVisual(gameObject.inSlot, false);
                gameObject.inSlot = null;
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.setDepth(100);
            gameObject.setScale(1);

            // Check if dropped on a slot
            let placed = false;
            for (let i = 0; i < this.dropSlots.length; i++) {
                const slot = this.dropSlots[i];
                if (slot.occupied) continue;

                const dist = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, slot.x, slot.y);
                if (dist < 65) {
                    // Place in slot
                    gameObject.x = slot.x;
                    gameObject.y = slot.y;
                    slot.occupied = gameObject;
                    gameObject.inSlot = i;
                    this.updateSlotVisual(i, true);
                    audioManager.playPlace && audioManager.playPlace();
                    placed = true;
                    break;
                }
            }

            if (!placed) {
                // Return to origin
                this.tweens.add({
                    targets: gameObject,
                    x: gameObject.originX,
                    y: gameObject.originY,
                    duration: 200,
                    ease: 'Back.easeOut'
                });
            }

            // Check if all slots are filled
            this.checkAllSlotsFilled();
        });

        // Check button (initially hidden)
        this.checkBtn = this.add.container(400, 530);
        const checkBg = this.add.graphics();
        checkBg.fillStyle(0x22c55e, 1);
        checkBg.fillRoundedRect(-80, -20, 160, 40, 10);
        const checkLabel = this.add.text(0, 0, 'COMPROBAR', {
            fontFamily: 'Nunito', fontSize: '16px', fontStyle: 'bold', color: '#ffffff'
        }).setOrigin(0.5);
        this.checkBtn.add([checkBg, checkLabel]);
        this.checkBtn.setSize(160, 40);
        this.checkBtn.setInteractive();
        this.checkBtn.setAlpha(0.3);
        this.checkBtn.canCheck = false;
        this.checkBtn.on('pointerdown', () => {
            if (this.checkBtn.canCheck) this.verifyChain();
        });
        this.checkBtn.on('pointerover', () => { if (this.checkBtn.canCheck) this.checkBtn.setScale(1.05); });
        this.checkBtn.on('pointerout', () => this.checkBtn.setScale(1));
        this.puzzleContainer.add(this.checkBtn);

        // Reset button
        const resetBtn = this.add.text(400, 565, 'Reiniciar bloques', {
            fontFamily: 'Nunito', fontSize: '12px', color: '#64748b'
        }).setOrigin(0.5).setInteractive();
        resetBtn.on('pointerdown', () => {
            audioManager.playClick();
            this.resetBlocks();
        });
        resetBtn.on('pointerover', () => resetBtn.setColor('#94a3b8'));
        resetBtn.on('pointerout', () => resetBtn.setColor('#64748b'));
        this.puzzleContainer.add(resetBtn);

        // Professor comment
        this.showProfComment(Phaser.Utils.Array.GetRandom([
            "Ordena la cadena de transformación...",
            "Recuerda: la energía se TRANSFORMA.",
            "Cada paso convierte un tipo en otro."
        ]));

        // Entrance animations
        this.effects.dramaticEntrance(nameText, 'top', 400);
    }

    updateSlotVisual(index, filled) {
        const slot = this.dropSlots[index];
        slot.bg.clear();
        if (filled) {
            slot.bg.fillStyle(0x334155, 1);
            slot.bg.fillRoundedRect(slot.x - slot.width / 2, slot.y - slot.height / 2, slot.width, slot.height, 10);
            slot.bg.lineStyle(2, 0x22c55e);
            slot.bg.strokeRoundedRect(slot.x - slot.width / 2, slot.y - slot.height / 2, slot.width, slot.height, 10);
        } else {
            slot.bg.fillStyle(0x1e293b, 1);
            slot.bg.fillRoundedRect(slot.x - slot.width / 2, slot.y - slot.height / 2, slot.width, slot.height, 10);
            slot.bg.lineStyle(2, 0x475569);
            slot.bg.strokeRoundedRect(slot.x - slot.width / 2, slot.y - slot.height / 2, slot.width, slot.height, 10);
        }
    }

    checkAllSlotsFilled() {
        const allFilled = this.dropSlots.every(s => s.occupied !== null);
        this.checkBtn.setAlpha(allFilled ? 1 : 0.3);
        this.checkBtn.canCheck = allFilled;
    }

    resetBlocks() {
        this.draggableBlocks.forEach(block => {
            if (block.inSlot !== null) {
                this.dropSlots[block.inSlot].occupied = null;
                this.updateSlotVisual(block.inSlot, false);
                block.inSlot = null;
            }
            this.tweens.add({
                targets: block,
                x: block.originX,
                y: block.originY,
                duration: 300,
                ease: 'Back.easeOut'
            });
        });
        this.checkBtn.setAlpha(0.3);
        this.checkBtn.canCheck = false;
    }

    verifyChain() {
        const chain = this.currentChain;
        let allCorrect = true;

        // Check each slot
        for (let i = 0; i < this.dropSlots.length; i++) {
            const slot = this.dropSlots[i];
            const block = slot.occupied;
            if (!block) { allCorrect = false; break; }

            if (block.blockType === slot.correctAnswer) {
                // Correct - green highlight
                slot.bg.clear();
                slot.bg.fillStyle(0x22c55e, 0.3);
                slot.bg.fillRoundedRect(slot.x - slot.width / 2, slot.y - slot.height / 2, slot.width, slot.height, 10);
                slot.bg.lineStyle(3, 0x22c55e);
                slot.bg.strokeRoundedRect(slot.x - slot.width / 2, slot.y - slot.height / 2, slot.width, slot.height, 10);
                this.effects.greenPulse(slot.x, slot.y);
            } else {
                // Wrong - red highlight
                allCorrect = false;
                slot.bg.clear();
                slot.bg.fillStyle(0xef4444, 0.3);
                slot.bg.fillRoundedRect(slot.x - slot.width / 2, slot.y - slot.height / 2, slot.width, slot.height, 10);
                slot.bg.lineStyle(3, 0xef4444);
                slot.bg.strokeRoundedRect(slot.x - slot.width / 2, slot.y - slot.height / 2, slot.width, slot.height, 10);
                this.effects.redPulse(slot.x, slot.y);
            }
        }

        // Disable interaction temporarily
        this.checkBtn.canCheck = false;
        this.checkBtn.setAlpha(0.3);
        this.draggableBlocks.forEach(b => b.disableInteractive());

        if (allCorrect) {
            this.chainCorrect();
        } else {
            this.chainWrong();
        }
    }

    chainCorrect() {
        audioManager.playChainComplete && audioManager.playChainComplete();
        this.chainsCompleted++;
        this.score += 200;

        // Update achievements
        achievementSystem.updateStats({ chainsCompleted: 1 });

        // Lightning effects between blocks
        for (let i = 0; i < this.dropSlots.length - 1; i++) {
            const s1 = this.dropSlots[i];
            const s2 = this.dropSlots[i + 1];
            this.time.delayedCall(i * 200, () => {
                this.effects.lightning(s1.x + s1.width / 2, s1.y, s2.x - s2.width / 2, s2.y, 2);
            });
        }

        this.effects.sparks(400, 230);
        this.showProfComment(Phaser.Utils.Array.GetRandom([
            "¡Correcto! Bien hecho.",
            "¡Esa cadena está perfecta!",
            "Vaya, has acertado la secuencia."
        ]));

        // Show explanation
        this.time.delayedCall(800, () => {
            this.showExplanation(this.currentChain, true);
        });
    }

    chainWrong() {
        audioManager.playError && audioManager.playError();
        this.chainsFailed++;
        this.effects.shake(0.01, 300);

        this.showProfComment(Phaser.Utils.Array.GetRandom([
            "¡MAL! Piensa en el orden...",
            "¡No! La energía no funciona así.",
            "Incorrecto. Inténtalo de nuevo."
        ]));

        // Show correct answer after delay
        this.time.delayedCall(2000, () => {
            // Show the correct sequence
            this.showExplanation(this.currentChain, false);
        });
    }

    showExplanation(chain, wasCorrect) {
        // Create overlay
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7).setDepth(300);
        const panel = this.add.container(400, 300).setDepth(301);

        const bg = this.add.graphics();
        bg.fillStyle(0x1e293b, 1);
        bg.fillRoundedRect(-320, -160, 640, 320, 16);
        const borderColor = wasCorrect ? 0x22c55e : 0xef4444;
        bg.lineStyle(3, borderColor);
        bg.strokeRoundedRect(-320, -160, 640, 320, 16);

        const title = this.add.text(0, -130, wasCorrect ? '¡CADENA CORRECTA!' : 'CADENA INCORRECTA', {
            fontFamily: 'Nunito', fontSize: '22px', fontStyle: 'bold',
            color: wasCorrect ? '#22c55e' : '#ef4444'
        }).setOrigin(0.5);

        // Show correct sequence
        const seqText = this.add.text(0, -90, chain.nombre, {
            fontFamily: 'Nunito', fontSize: '16px', fontStyle: 'bold', color: '#ffffff'
        }).setOrigin(0.5);

        const chainStr = chain.pasos.join('  →  ');
        const seqFlow = this.add.text(0, -55, chainStr, {
            fontFamily: 'Nunito', fontSize: '15px', fontStyle: 'bold', color: '#f59e0b'
        }).setOrigin(0.5);

        // Explanation
        const expText = this.add.text(0, 20, chain.explicacion, {
            fontFamily: 'Nunito', fontSize: '14px', color: '#cbd5e1',
            wordWrap: { width: 580 }, align: 'center', lineSpacing: 6
        }).setOrigin(0.5);

        // Score
        const scoreLabel = wasCorrect ?
            this.add.text(0, 100, '+200 puntos', { fontFamily: 'Nunito', fontSize: '18px', fontStyle: 'bold', color: '#fbbf24' }).setOrigin(0.5) :
            this.add.text(0, 100, 'Sin puntos esta vez', { fontFamily: 'Nunito', fontSize: '14px', color: '#64748b' }).setOrigin(0.5);

        // Continue button
        const contBtn = this.add.text(0, 140, 'CONTINUAR →', {
            fontFamily: 'Nunito', fontSize: '16px', fontStyle: 'bold', color: '#3b82f6'
        }).setOrigin(0.5).setInteractive();
        contBtn.on('pointerdown', () => {
            audioManager.playClick();
            overlay.destroy();
            panel.destroy();
            this.currentChainIndex++;
            this.input.removeAllListeners('dragstart');
            this.input.removeAllListeners('drag');
            this.input.removeAllListeners('dragend');
            this.showChain();
        });
        contBtn.on('pointerover', () => contBtn.setColor('#ffffff'));
        contBtn.on('pointerout', () => contBtn.setColor('#3b82f6'));

        panel.add([bg, title, seqText, seqFlow, expText, scoreLabel, contBtn]);

        // Animate in
        panel.setScale(0);
        panel.setAlpha(0);
        this.tweens.add({
            targets: panel,
            scale: 1, alpha: 1,
            duration: 400,
            ease: 'Back.easeOut'
        });
    }

    showChainResults() {
        this.puzzleContainer.removeAll(true);
        this.input.removeAllListeners('dragstart');
        this.input.removeAllListeners('drag');
        this.input.removeAllListeners('dragend');

        // Results panel
        const panel = this.add.container(400, 280);

        const bg = this.add.graphics();
        bg.fillStyle(0x1e293b, 1);
        bg.fillRoundedRect(-280, -150, 560, 300, 16);
        bg.lineStyle(3, 0xf59e0b);
        bg.strokeRoundedRect(-280, -150, 560, 300, 16);

        const title = this.add.text(0, -120, 'CADENAS COMPLETADAS', {
            fontFamily: 'Nunito', fontSize: '24px', fontStyle: 'bold', color: '#f59e0b'
        }).setOrigin(0.5);

        const correctText = this.add.text(0, -60, `Cadenas correctas: ${this.chainsCompleted}/${this.chains.length}`, {
            fontFamily: 'Nunito', fontSize: '18px', fontStyle: 'bold', color: '#22c55e'
        }).setOrigin(0.5);

        const wrongText = this.add.text(0, -25, `Cadenas incorrectas: ${this.chainsFailed}`, {
            fontFamily: 'Nunito', fontSize: '16px', color: '#ef4444'
        }).setOrigin(0.5);

        const bonusPoints = this.chainsCompleted * 200;
        const bonusText = this.add.text(0, 20, `Bonus cadenas: +${bonusPoints} pts`, {
            fontFamily: 'Nunito', fontSize: '18px', fontStyle: 'bold', color: '#fbbf24'
        }).setOrigin(0.5);

        const totalText = this.add.text(0, 60, `Puntuación total: ${this.score}`, {
            fontFamily: 'Nunito', fontSize: '16px', color: '#94a3b8'
        }).setOrigin(0.5);

        // Continue button
        const contBtn = this.add.text(0, 120, 'VER RESULTADOS DEL NIVEL →', {
            fontFamily: 'Nunito', fontSize: '16px', fontStyle: 'bold', color: '#3b82f6'
        }).setOrigin(0.5).setInteractive();
        contBtn.on('pointerdown', () => {
            audioManager.playClick();
            this.cameras.main.fadeOut(500);
            this.time.delayedCall(500, () => {
                this.scene.start('LevelResultScene', {
                    level: this.level,
                    correctAnswers: this.correctAnswers,
                    totalCorrect: this.totalCorrect,
                    score: this.score,
                    lives: this.lives,
                    maxCombo: this.maxCombo,
                    passed: true,
                    chainsCompleted: this.chainsCompleted,
                    chainsFailed: this.chainsFailed
                });
            });
        });
        contBtn.on('pointerover', () => contBtn.setColor('#ffffff'));
        contBtn.on('pointerout', () => contBtn.setColor('#3b82f6'));

        panel.add([bg, title, correctText, wrongText, bonusText, totalText, contBtn]);

        // Animate
        panel.setScale(0);
        this.tweens.add({
            targets: panel,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        if (this.chainsCompleted === this.chains.length) {
            // Perfect - fireworks
            this.time.delayedCall(300, () => this.effects.firework(200, 200));
            this.time.delayedCall(600, () => this.effects.firework(600, 180));
        }
    }

    showProfComment(text) {
        this.profText.setText(text);
        this.profBubble.setAlpha(0);
        this.tweens.add({
            targets: this.profBubble,
            alpha: 1, duration: 300, ease: 'Power2',
            hold: 2500,
            yoyo: true
        });
    }
}
