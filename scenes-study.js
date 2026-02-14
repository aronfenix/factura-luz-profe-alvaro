// ============================================================
// MODO ESTUDIO Y FLASHCARDS
// ============================================================

class StudyModeScene extends Phaser.Scene {
    constructor() { super({ key: 'StudyModeScene' }); }

    create() {
        this.add.rectangle(400, 300, 800, 600, 0x0f172a);

        this.add.text(400, 40, 'MODO ESTUDIO', {
            fontFamily: 'Nunito', fontSize: '32px', fontStyle: '900', color: '#3b82f6'
        }).setOrigin(0.5);

        this.add.text(400, 75, 'Repasa los temas antes de jugar', {
            fontFamily: 'Nunito', fontSize: '14px', color: '#94a3b8'
        }).setOrigin(0.5);

        const topics = GAME_DATA.temasModoEstudio;
        topics.forEach((topic, i) => {
            const y = 140 + i * 80;
            const container = this.add.container(400, y);

            const bg = this.add.graphics();
            bg.fillStyle(0x1e293b, 1);
            bg.fillRoundedRect(-300, -30, 600, 60, 10);
            bg.lineStyle(2, Phaser.Display.Color.HexStringToColor(topic.color).color);
            bg.strokeRoundedRect(-300, -30, 600, 60, 10);

            const icon = this.add.text(-270, 0, this.getTopicIcon(topic.icono), { fontSize: '28px' }).setOrigin(0.5);
            const name = this.add.text(-230, -8, topic.nombre, { fontFamily: 'Nunito', fontSize: '18px', fontStyle: 'bold', color: topic.color });
            const desc = this.add.text(-230, 12, `Nivel ${i + 1}`, { fontFamily: 'Nunito', fontSize: '12px', color: '#94a3b8' });

            const startBtn = this.add.text(250, 0, 'ESTUDIAR', {
                fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: topic.color
            }).setOrigin(0.5).setInteractive();

            startBtn.on('pointerover', () => startBtn.setColor('#ffffff'));
            startBtn.on('pointerout', () => startBtn.setColor(topic.color));
            startBtn.on('pointerdown', () => {
                audioManager.playClick();
                this.scene.start('FlashcardScene', { topic: topic.id, topicName: topic.nombre, color: topic.color });
            });

            container.add([bg, icon, name, desc, startBtn]);
            container.setSize(600, 60);
        });

        // Back button
        const backBtn = this.add.text(400, 560, '← VOLVER AL MENÚ', {
            fontFamily: 'Nunito', fontSize: '16px', fontStyle: 'bold', color: '#f59e0b'
        }).setOrigin(0.5).setInteractive();
        backBtn.on('pointerdown', () => { audioManager.playClick(); this.scene.start('MenuScene'); });
        backBtn.on('pointerover', () => backBtn.setColor('#ffffff'));
        backBtn.on('pointerout', () => backBtn.setColor('#f59e0b'));

        this.cameras.main.fadeIn(300);
    }

    getTopicIcon(icon) {
        const icons = { lightning: '⚡', solar: '☀️', chain: '🔗', pollution: '🏭', leaf: '🌿' };
        return icons[icon] || '📚';
    }
}

// ==================== FLASHCARD SCENE ====================
class FlashcardScene extends Phaser.Scene {
    constructor() { super({ key: 'FlashcardScene' }); }

    init(data) {
        this.topic = data.topic || 'formas';
        this.topicName = data.topicName || 'Formas de Energía';
        this.topicColor = data.color || '#3b82f6';
    }

    create() {
        this.add.rectangle(400, 300, 800, 600, 0x0f172a);
        this.isFlipped = false;

        studyMode.generateFlashcards(this.topic);

        // Header
        this.add.text(400, 30, this.topicName, {
            fontFamily: 'Nunito', fontSize: '22px', fontStyle: 'bold', color: this.topicColor
        }).setOrigin(0.5);

        // Progress
        this.progressText = this.add.text(400, 55, '', {
            fontFamily: 'Nunito', fontSize: '13px', color: '#94a3b8'
        }).setOrigin(0.5);

        // Card container
        this.cardContainer = this.add.container(400, 280);
        this.createCard();

        // Buttons
        this.knownBtn = this.createActionButton(250, 510, 'LO SÉ ✓', '#22c55e', () => this.markCard(true));
        this.unknownBtn = this.createActionButton(550, 510, 'NO LO SÉ ✗', '#ef4444', () => this.markCard(false));
        this.flipBtn = this.createActionButton(400, 450, 'VOLTEAR TARJETA', '#3b82f6', () => this.flipCard());

        // Back
        const backBtn = this.add.text(70, 30, '← Volver', {
            fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#f59e0b'
        }).setInteractive();
        backBtn.on('pointerdown', () => { audioManager.playClick(); this.scene.start('StudyModeScene'); });
        backBtn.on('pointerover', () => backBtn.setColor('#ffffff'));
        backBtn.on('pointerout', () => backBtn.setColor('#f59e0b'));

        this.showCard();
        this.cameras.main.fadeIn(300);
    }

    createCard() {
        this.cardContainer.removeAll(true);

        const bg = this.add.graphics();
        bg.fillStyle(0x1e293b, 1);
        bg.fillRoundedRect(-320, -150, 640, 300, 16);
        bg.lineStyle(3, Phaser.Display.Color.HexStringToColor(this.topicColor).color);
        bg.strokeRoundedRect(-320, -150, 640, 300, 16);

        this.cardLabel = this.add.text(0, -120, 'PREGUNTA', {
            fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'bold', color: '#94a3b8'
        }).setOrigin(0.5);

        this.cardText = this.add.text(0, 0, '', {
            fontFamily: 'Nunito', fontSize: '18px', fontStyle: 'bold', color: '#ffffff',
            wordWrap: { width: 580 }, align: 'center', lineSpacing: 8
        }).setOrigin(0.5);

        this.factText = this.add.text(0, 100, '', {
            fontFamily: 'Nunito', fontSize: '12px', color: '#94a3b8',
            wordWrap: { width: 580 }, align: 'center', lineSpacing: 4
        }).setOrigin(0.5);

        this.cardContainer.add([bg, this.cardLabel, this.cardText, this.factText]);
    }

    showCard() {
        const card = studyMode.getCurrentCard();
        if (!card) { this.showResults(); return; }

        this.isFlipped = false;
        const progress = studyMode.getProgress();
        this.progressText.setText(`Tarjeta ${progress.current + 1} de ${progress.total}  |  ✓ ${progress.known}  ✗ ${progress.unknown}`);

        this.createCard();
        this.cardLabel.setText('PREGUNTA');
        this.cardText.setText(card.front);
        this.factText.setText('Toca "Voltear" para ver la respuesta');

        this.knownBtn.setAlpha(0.3);
        this.unknownBtn.setAlpha(0.3);
        this.flipBtn.setAlpha(1);
    }

    flipCard() {
        if (this.isFlipped) return;
        this.isFlipped = true;
        audioManager.playFlip();

        const card = studyMode.getCurrentCard();
        if (!card) return;

        this.tweens.add({
            targets: this.cardContainer, scaleX: 0, duration: 150, ease: 'Cubic.easeIn',
            onComplete: () => {
                this.cardLabel.setText('RESPUESTA');
                this.cardLabel.setColor(this.topicColor);
                this.cardText.setText(card.back);
                this.factText.setText(card.fact || '');
                this.tweens.add({ targets: this.cardContainer, scaleX: 1, duration: 150, ease: 'Cubic.easeOut' });
            }
        });

        this.knownBtn.setAlpha(1);
        this.unknownBtn.setAlpha(1);
        this.flipBtn.setAlpha(0.3);
    }

    markCard(known) {
        if (!this.isFlipped) return;
        audioManager.playClick();
        if (known) studyMode.markKnown();
        else studyMode.markUnknown();
        this.showCard();
    }

    showResults() {
        this.cardContainer.removeAll(true);
        const progress = studyMode.getProgress();

        const bg = this.add.graphics();
        bg.fillStyle(0x1e293b, 1);
        bg.fillRoundedRect(-320, -150, 640, 300, 16);
        bg.lineStyle(3, 0x22c55e);
        bg.strokeRoundedRect(-320, -150, 640, 300, 16);

        const title = this.add.text(0, -100, '¡SESIÓN COMPLETADA!', {
            fontFamily: 'Nunito', fontSize: '24px', fontStyle: 'bold', color: '#22c55e'
        }).setOrigin(0.5);

        const stats = this.add.text(0, -30, `Sabía: ${progress.known}\nNo sabía: ${progress.unknown}\nTotal: ${progress.total}`, {
            fontFamily: 'Nunito', fontSize: '18px', color: '#ffffff', align: 'center', lineSpacing: 8
        }).setOrigin(0.5);

        this.cardContainer.add([bg, title, stats]);

        if (progress.unknown > 0) {
            const repeatBtn = this.add.text(0, 80, 'REPETIR LAS QUE NO SABÍA', {
                fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#f59e0b'
            }).setOrigin(0.5).setInteractive();
            repeatBtn.on('pointerdown', () => {
                audioManager.playClick();
                studyMode.repeatUnknown();
                this.showCard();
            });
            repeatBtn.on('pointerover', () => repeatBtn.setColor('#ffffff'));
            repeatBtn.on('pointerout', () => repeatBtn.setColor('#f59e0b'));
            this.cardContainer.add(repeatBtn);
        }

        this.knownBtn.setAlpha(0.3);
        this.unknownBtn.setAlpha(0.3);
        this.flipBtn.setAlpha(0.3);
        this.progressText.setText('Sesión completada');
    }

    createActionButton(x, y, text, color, callback) {
        const btn = this.add.text(x, y, text, {
            fontFamily: 'Nunito', fontSize: '15px', fontStyle: 'bold', color: color
        }).setOrigin(0.5).setInteractive();
        btn.on('pointerdown', callback);
        btn.on('pointerover', () => btn.setScale(1.05));
        btn.on('pointerout', () => btn.setScale(1));
        return btn;
    }
}

// ==================== ACHIEVEMENTS SCENE ====================
class AchievementsScene extends Phaser.Scene {
    constructor() { super({ key: 'AchievementsScene' }); }

    create() {
        this.add.rectangle(400, 300, 800, 600, 0x0f172a);

        const progress = achievementSystem.getProgress();
        this.add.text(400, 35, 'LOGROS', { fontFamily: 'Nunito', fontSize: '30px', fontStyle: '900', color: '#a855f7' }).setOrigin(0.5);
        this.add.text(400, 65, `${progress.unlocked}/${progress.total} desbloqueados (${progress.percentage}%)  |  ${achievementSystem.getTotalPoints()} pts`, {
            fontFamily: 'Nunito', fontSize: '13px', color: '#94a3b8'
        }).setOrigin(0.5);

        const achievements = achievementSystem.getAll();
        const perPage = 8;
        this.page = 0;
        this.totalPages = Math.ceil(achievements.length / perPage);

        this.listContainer = this.add.container(0, 0);
        this.renderPage(achievements, perPage);

        // Nav
        if (this.totalPages > 1) {
            const prevBtn = this.add.text(200, 560, '← Anterior', { fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#3b82f6' }).setOrigin(0.5).setInteractive();
            prevBtn.on('pointerdown', () => { if (this.page > 0) { this.page--; this.renderPage(achievements, perPage); } });
            const nextBtn = this.add.text(600, 560, 'Siguiente →', { fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#3b82f6' }).setOrigin(0.5).setInteractive();
            nextBtn.on('pointerdown', () => { if (this.page < this.totalPages - 1) { this.page++; this.renderPage(achievements, perPage); } });
        }

        const backBtn = this.add.text(400, 560, '← MENÚ', { fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#f59e0b' }).setOrigin(0.5).setInteractive();
        backBtn.on('pointerdown', () => { audioManager.playClick(); this.scene.start('MenuScene'); });
        backBtn.on('pointerover', () => backBtn.setColor('#ffffff'));
        backBtn.on('pointerout', () => backBtn.setColor('#f59e0b'));

        this.cameras.main.fadeIn(300);
    }

    renderPage(achievements, perPage) {
        this.listContainer.removeAll(true);
        const start = this.page * perPage;
        const items = achievements.slice(start, start + perPage);

        items.forEach((a, i) => {
            const y = 105 + i * 56;
            const bg = this.add.graphics();
            bg.fillStyle(a.unlocked ? 0x1e293b : 0x111827, 1);
            bg.fillRoundedRect(80, y - 22, 640, 48, 8);
            if (a.unlocked) {
                bg.lineStyle(2, Phaser.Display.Color.HexStringToColor(a.color).color);
                bg.strokeRoundedRect(80, y - 22, 640, 48, 8);
            }

            const icon = this.add.text(110, y, a.unlocked ? '🏆' : '🔒', { fontSize: '20px' }).setOrigin(0.5);
            const name = this.add.text(140, y - 8, a.secret && !a.unlocked ? '???' : a.name, {
                fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: a.unlocked ? a.color : '#475569'
            });
            const desc = this.add.text(140, y + 10, a.secret && !a.unlocked ? 'Logro secreto' : a.description, {
                fontFamily: 'Nunito', fontSize: '11px', color: a.unlocked ? '#94a3b8' : '#374151'
            });
            const pts = this.add.text(690, y, `${a.points}pts`, {
                fontFamily: 'Nunito', fontSize: '12px', fontStyle: 'bold', color: a.unlocked ? '#fbbf24' : '#374151'
            }).setOrigin(1, 0.5);

            this.listContainer.add([bg, icon, name, desc, pts]);
        });
    }
}
