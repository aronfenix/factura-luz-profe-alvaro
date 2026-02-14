// ============================================================
// SISTEMA DE POWER-UPS - Ayudas especiales del Profe Alvaro
// La Factura de la Luz del Profe Alvaro
// ============================================================

class PowerUpManager {
    constructor() {
        this.activePowerUps = [];
        this.hudElements = [];
        this.spawnedPowerUps = [];
        this.isShieldActive = false;
        this.isDoubleActive = false;
        this.isFreezeActive = false;

        this.TYPES = {
            CONGELAR: {
                id: 'congelar',
                name: 'CONGELAR',
                description: 'Pausa el temporizador 5s',
                color: '#06b6d4',
                colorHex: 0x06b6d4,
                duration: 5000,
                icon: 'snowflake'
            },
            FIFTY: {
                id: 'fifty',
                name: '50/50',
                description: 'Elimina 2 respuestas incorrectas',
                color: '#8b5cf6',
                colorHex: 0x8b5cf6,
                duration: 0,
                icon: 'scissors'
            },
            DOBLE: {
                id: 'doble',
                name: 'DOBLE',
                description: 'Puntos dobles en la siguiente respuesta',
                color: '#f59e0b',
                colorHex: 0xf59e0b,
                duration: 0,
                icon: 'x2'
            },
            VIDA: {
                id: 'vida',
                name: 'VIDA EXTRA',
                description: '+1 vida',
                color: '#ef4444',
                colorHex: 0xef4444,
                duration: 0,
                icon: 'heart'
            },
            ESCUDO: {
                id: 'escudo',
                name: 'ESCUDO',
                description: 'Protege de un fallo',
                color: '#22c55e',
                colorHex: 0x22c55e,
                duration: 0,
                icon: 'shield'
            }
        };

        this.HUMOR_QUOTES = [
            "Un power-up! Esto no estaba en el examen...",
            "Ayuda extra? En MIS clases? Bueno, vale...",
            "Power-up! Como cuando me compre 200 estufas: una ayudita extra.",
            "Ojala hubiera power-ups en la vida real... Espera, se llaman cafes.",
            "Eso si que es eficiencia energetica: maximo resultado, minimo esfuerzo!",
            "Un bonus! Pero no te acostumbres, eh?",
            "Vaya, vaya... alguien tiene suerte hoy!",
            "Recogiendo power-ups como quien recoge aprobados: con alegria!",
            "Esto es como encontrar un enchufe libre en la biblioteca!",
            "Power-up activado! La energia no se crea ni se destruye... pero se potencia!"
        ];

        this.SPAWN_CHANCE = 0.25;
        this.MIN_COMBO = 3;
        this.DESPAWN_TIME = 4000;
    }

    // ==================== ICON GENERATION (Canvas-based) ====================

    createPowerUpIcon(type, size = 48) {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const cx = size / 2;
            const cy = size / 2;
            const r = size * 0.35;

            // Background circle with glow
            ctx.shadowColor = type.color;
            ctx.shadowBlur = 8;
            ctx.fillStyle = type.color;
            ctx.beginPath();
            ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = type.color;
            ctx.globalAlpha = 0.25;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;

            // Draw specific icon
            switch (type.icon) {
                case 'snowflake':
                    this._drawSnowflake(ctx, cx, cy, r);
                    break;
                case 'scissors':
                    this._drawScissors(ctx, cx, cy, r);
                    break;
                case 'x2':
                    this._drawX2(ctx, cx, cy, r);
                    break;
                case 'heart':
                    this._drawHeart(ctx, cx, cy, r);
                    break;
                case 'shield':
                    this._drawShield(ctx, cx, cy, r);
                    break;
            }

            return canvas;
        } catch (e) {
            console.warn('PowerUpManager: Error creating icon for', type.name, e);
            return document.createElement('canvas');
        }
    }

    _drawSnowflake(ctx, cx, cy, r) {
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        const armLen = r * 0.7;
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            const ex = cx + Math.cos(angle) * armLen;
            const ey = cy + Math.sin(angle) * armLen;
            // Main arm
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(ex, ey);
            ctx.stroke();
            // Side branches
            const branchLen = armLen * 0.35;
            const mid = 0.55;
            const mx = cx + Math.cos(angle) * armLen * mid;
            const my = cy + Math.sin(angle) * armLen * mid;
            for (let d = -1; d <= 1; d += 2) {
                const ba = angle + d * 0.7;
                ctx.beginPath();
                ctx.moveTo(mx, my);
                ctx.lineTo(mx + Math.cos(ba) * branchLen, my + Math.sin(ba) * branchLen);
                ctx.stroke();
            }
        }
        // Center dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }

    _drawScissors(ctx, cx, cy, r) {
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        // Left blade
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.4, cy - r * 0.6);
        ctx.lineTo(cx + r * 0.2, cy + r * 0.1);
        ctx.stroke();
        // Right blade
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.4, cy - r * 0.6);
        ctx.lineTo(cx - r * 0.2, cy + r * 0.1);
        ctx.stroke();
        // Handle loops
        ctx.beginPath();
        ctx.arc(cx - r * 0.3, cy + r * 0.35, r * 0.22, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + r * 0.3, cy + r * 0.35, r * 0.22, 0, Math.PI * 2);
        ctx.stroke();
        // 50/50 text
        ctx.fillStyle = '#c4b5fd';
        ctx.font = `bold ${r * 0.45}px Nunito`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('50', cx, cy - r * 0.15);
    }

    _drawX2(ctx, cx, cy, r) {
        ctx.fillStyle = '#f59e0b';
        ctx.font = `bold ${r * 1.1}px Nunito`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('x2', cx, cy);
        // Sparkle accents
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.arc(cx + r * 0.5, cy - r * 0.45, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx - r * 0.55, cy + r * 0.35, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    _drawHeart(ctx, cx, cy, r) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        const topY = cy - r * 0.1;
        const botY = cy + r * 0.65;
        ctx.moveTo(cx, botY);
        ctx.bezierCurveTo(cx - r * 0.9, cy + r * 0.1, cx - r * 0.9, cy - r * 0.6, cx - r * 0.15, cy - r * 0.6);
        ctx.bezierCurveTo(cx, cy - r * 0.6, cx, topY, cx, topY);
        ctx.bezierCurveTo(cx, topY, cx, cy - r * 0.6, cx + r * 0.15, cy - r * 0.6);
        ctx.bezierCurveTo(cx + r * 0.9, cy - r * 0.6, cx + r * 0.9, cy + r * 0.1, cx, botY);
        ctx.fill();
        // Shine
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.arc(cx - r * 0.25, cy - r * 0.3, r * 0.15, 0, Math.PI * 2);
        ctx.fill();
        // Plus symbol
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 1.5, cy - r * 0.15, 3, r * 0.3);
        ctx.fillRect(cx - r * 0.15, cy - 1.5, r * 0.3, 3);
    }

    _drawShield(ctx, cx, cy, r) {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.moveTo(cx, cy - r * 0.75);
        ctx.lineTo(cx + r * 0.65, cy - r * 0.4);
        ctx.lineTo(cx + r * 0.55, cy + r * 0.25);
        ctx.quadraticCurveTo(cx, cy + r * 0.8, cx, cy + r * 0.8);
        ctx.quadraticCurveTo(cx, cy + r * 0.8, cx - r * 0.55, cy + r * 0.25);
        ctx.lineTo(cx - r * 0.65, cy - r * 0.4);
        ctx.closePath();
        ctx.fill();
        // Inner shine
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.moveTo(cx, cy - r * 0.5);
        ctx.lineTo(cx + r * 0.35, cy - r * 0.25);
        ctx.lineTo(cx + r * 0.28, cy + r * 0.1);
        ctx.lineTo(cx, cy + r * 0.35);
        ctx.lineTo(cx, cy - r * 0.5);
        ctx.closePath();
        ctx.globalAlpha = 0.4;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        // Checkmark
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.2, cy);
        ctx.lineTo(cx - r * 0.02, cy + r * 0.2);
        ctx.lineTo(cx + r * 0.25, cy - r * 0.15);
        ctx.stroke();
    }

    // ==================== HUD ICON (small, for active power-up display) ====================

    createHudIcon(type, size = 28) {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const cx = size / 2;
            const cy = size / 2;
            const r = size * 0.38;

            ctx.fillStyle = type.color;
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;

            ctx.strokeStyle = type.color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(cx, cy, r + 1, 0, Math.PI * 2);
            ctx.stroke();

            switch (type.icon) {
                case 'snowflake':
                    this._drawSnowflakeMini(ctx, cx, cy, r);
                    break;
                case 'scissors':
                    ctx.fillStyle = type.color;
                    ctx.font = `bold ${r * 0.9}px Nunito`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('50', cx, cy);
                    break;
                case 'x2':
                    ctx.fillStyle = type.color;
                    ctx.font = `bold ${r * 0.95}px Nunito`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('x2', cx, cy);
                    break;
                case 'heart':
                    this._drawHeartMini(ctx, cx, cy, r);
                    break;
                case 'shield':
                    this._drawShieldMini(ctx, cx, cy, r);
                    break;
            }

            return canvas;
        } catch (e) {
            console.warn('PowerUpManager: Error creating HUD icon', e);
            return document.createElement('canvas');
        }
    }

    _drawSnowflakeMini(ctx, cx, cy, r) {
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * r * 0.7, cy + Math.sin(angle) * r * 0.7);
            ctx.stroke();
        }
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    _drawHeartMini(ctx, cx, cy, r) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(cx, cy + r * 0.5);
        ctx.bezierCurveTo(cx - r * 0.8, cy, cx - r * 0.8, cy - r * 0.5, cx, cy - r * 0.2);
        ctx.bezierCurveTo(cx + r * 0.8, cy - r * 0.5, cx + r * 0.8, cy, cx, cy + r * 0.5);
        ctx.fill();
    }

    _drawShieldMini(ctx, cx, cy, r) {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.moveTo(cx, cy - r * 0.6);
        ctx.lineTo(cx + r * 0.5, cy - r * 0.3);
        ctx.lineTo(cx + r * 0.4, cy + r * 0.2);
        ctx.quadraticCurveTo(cx, cy + r * 0.65, cx, cy + r * 0.65);
        ctx.quadraticCurveTo(cx, cy + r * 0.65, cx - r * 0.4, cy + r * 0.2);
        ctx.lineTo(cx - r * 0.5, cy - r * 0.3);
        ctx.closePath();
        ctx.fill();
    }

    // ==================== SPAWN SYSTEM ====================

    trySpawnPowerUp(scene, x, y, combo) {
        try {
            if (!scene || !scene.add) return null;

            const comboVal = combo || 0;
            if (comboVal < this.MIN_COMBO) return null;

            if (Math.random() > this.SPAWN_CHANCE) return null;

            const typeKeys = Object.keys(this.TYPES);
            const randomKey = typeKeys[Math.floor(Math.random() * typeKeys.length)];
            const type = this.TYPES[randomKey];

            return this._spawnPowerUp(scene, x, y, type);
        } catch (e) {
            console.warn('PowerUpManager: Error in trySpawnPowerUp', e);
            return null;
        }
    }

    _spawnPowerUp(scene, x, y, type) {
        try {
            // Generate textures if not already present
            const textureKey = `powerup_${type.id}`;
            if (!scene.textures.exists(textureKey)) {
                scene.textures.addCanvas(textureKey, this.createPowerUpIcon(type, 48));
            }

            const container = scene.add.container(x, y);
            container.setDepth(800);
            container.setAlpha(0);

            // Glow background ring
            const glowRing = scene.add.circle(0, 0, 30, type.colorHex, 0.15);
            container.add(glowRing);

            // Outer pulsing ring
            const outerRing = scene.add.circle(0, 0, 28, type.colorHex, 0);
            outerRing.setStrokeStyle(2, type.colorHex, 0.6);
            container.add(outerRing);

            // Icon sprite
            const icon = scene.add.image(0, 0, textureKey);
            container.add(icon);

            // Name label below
            const label = scene.add.text(0, 32, type.name, {
                fontFamily: 'Nunito',
                fontSize: '10px',
                fontStyle: 'bold',
                color: type.color,
                stroke: '#0f172a',
                strokeThickness: 3
            }).setOrigin(0.5);
            container.add(label);

            // Make interactive
            container.setSize(56, 56);
            container.setInteractive();

            // Store type reference
            container.powerUpType = type;

            // Spawn entrance animation
            scene.tweens.add({
                targets: container,
                alpha: 1,
                scale: { from: 0.3, to: 1 },
                duration: 400,
                ease: 'Back.easeOut'
            });

            // Floating bob animation
            scene.tweens.add({
                targets: container,
                y: y - 10,
                duration: 1200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Pulsing glow
            scene.tweens.add({
                targets: glowRing,
                scale: 1.4,
                alpha: 0.05,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Outer ring pulse
            scene.tweens.add({
                targets: outerRing,
                scale: 1.3,
                alpha: 0,
                duration: 1000,
                repeat: -1,
                ease: 'Cubic.easeOut'
            });

            // Icon subtle rotation
            scene.tweens.add({
                targets: icon,
                angle: { from: -5, to: 5 },
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Click handler
            container.on('pointerdown', () => {
                this._collectPowerUp(scene, container, type);
            });

            container.on('pointerover', () => {
                scene.tweens.add({
                    targets: container,
                    scaleX: 1.15,
                    scaleY: 1.15,
                    duration: 150,
                    ease: 'Back.easeOut'
                });
            });

            container.on('pointerout', () => {
                scene.tweens.add({
                    targets: container,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 150,
                    ease: 'Cubic.easeOut'
                });
            });

            // Auto-despawn timer
            const despawnTimer = scene.time.delayedCall(this.DESPAWN_TIME, () => {
                this._despawnPowerUp(scene, container);
            });

            container.despawnTimer = despawnTimer;
            this.spawnedPowerUps.push(container);

            return container;
        } catch (e) {
            console.warn('PowerUpManager: Error spawning power-up', e);
            return null;
        }
    }

    _despawnPowerUp(scene, container) {
        try {
            if (!container || !container.active) return;

            // Remove from tracking array
            const idx = this.spawnedPowerUps.indexOf(container);
            if (idx > -1) this.spawnedPowerUps.splice(idx, 1);

            // Fade-out animation
            scene.tweens.add({
                targets: container,
                alpha: 0,
                scale: 0.3,
                y: container.y - 30,
                duration: 400,
                ease: 'Cubic.easeIn',
                onComplete: () => {
                    try { container.destroy(); } catch (e) {}
                }
            });
        } catch (e) {
            console.warn('PowerUpManager: Error despawning power-up', e);
        }
    }

    // ==================== COLLECTION & ACTIVATION ====================

    _collectPowerUp(scene, container, type) {
        try {
            if (!container || !container.active) return;

            // Cancel despawn timer
            if (container.despawnTimer) {
                container.despawnTimer.destroy();
            }

            // Remove from spawned list
            const idx = this.spawnedPowerUps.indexOf(container);
            if (idx > -1) this.spawnedPowerUps.splice(idx, 1);

            // Play collection sound
            try { audioManager.playPowerUp(); } catch (e) {}

            // Camera flash
            try {
                const colorInt = type.colorHex;
                scene.cameras.main.flash(200,
                    (colorInt >> 16) & 0xff,
                    (colorInt >> 8) & 0xff,
                    colorInt & 0xff
                );
            } catch (e) {}

            // Collection burst particles
            this._createCollectionBurst(scene, container.x, container.y, type);

            // Show power-up name popup
            this._showCollectionPopup(scene, container.x, container.y, type);

            // Show humor quote from professor
            this._showHumorQuote(scene);

            // Dramatic collection animation on the container
            scene.tweens.killTweensOf(container);
            scene.tweens.add({
                targets: container,
                scale: 1.8,
                alpha: 0,
                duration: 350,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    try { container.destroy(); } catch (e) {}
                }
            });

            // Activate the power-up effect
            this._activatePowerUp(scene, type);

        } catch (e) {
            console.warn('PowerUpManager: Error collecting power-up', e);
        }
    }

    _createCollectionBurst(scene, x, y, type) {
        try {
            const particleCount = 16;
            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount;
                const speed = 80 + Math.random() * 60;
                const size = 3 + Math.random() * 4;
                const particle = scene.add.circle(x, y, size, type.colorHex);
                particle.setDepth(900);
                particle.setAlpha(0.9);

                scene.tweens.add({
                    targets: particle,
                    x: x + Math.cos(angle) * speed,
                    y: y + Math.sin(angle) * speed,
                    alpha: 0,
                    scale: 0,
                    duration: 500 + Math.random() * 200,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        try { particle.destroy(); } catch (e) {}
                    }
                });
            }

            // Central flash circle
            const flash = scene.add.circle(x, y, 5, 0xffffff, 0.9);
            flash.setDepth(901);
            scene.tweens.add({
                targets: flash,
                scale: 4,
                alpha: 0,
                duration: 300,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    try { flash.destroy(); } catch (e) {}
                }
            });

            // Expanding ring
            const ring = scene.add.circle(x, y, 8, type.colorHex, 0);
            ring.setStrokeStyle(3, type.colorHex, 0.8);
            ring.setDepth(899);
            scene.tweens.add({
                targets: ring,
                scale: 5,
                alpha: 0,
                duration: 600,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    try { ring.destroy(); } catch (e) {}
                }
            });
        } catch (e) {
            console.warn('PowerUpManager: Error in collection burst', e);
        }
    }

    _showCollectionPopup(scene, x, y, type) {
        try {
            // Power-up name flying up
            const namePopup = scene.add.text(x, y - 10, type.name, {
                fontFamily: 'Nunito',
                fontSize: '22px',
                fontStyle: '900',
                color: type.color,
                stroke: '#0f172a',
                strokeThickness: 5
            }).setOrigin(0.5).setDepth(1000);

            scene.tweens.add({
                targets: namePopup,
                y: y - 70,
                alpha: 0,
                scale: 1.4,
                duration: 1000,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    try { namePopup.destroy(); } catch (e) {}
                }
            });

            // Description below
            const descPopup = scene.add.text(x, y + 15, type.description, {
                fontFamily: 'Nunito',
                fontSize: '12px',
                fontStyle: 'bold',
                color: '#94a3b8',
                stroke: '#0f172a',
                strokeThickness: 3
            }).setOrigin(0.5).setDepth(1000);

            scene.tweens.add({
                targets: descPopup,
                y: y - 30,
                alpha: 0,
                duration: 1200,
                delay: 200,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    try { descPopup.destroy(); } catch (e) {}
                }
            });
        } catch (e) {
            console.warn('PowerUpManager: Error showing collection popup', e);
        }
    }

    _showHumorQuote(scene) {
        try {
            const quote = this.HUMOR_QUOTES[Math.floor(Math.random() * this.HUMOR_QUOTES.length)];

            const quoteContainer = scene.add.container(400, 560);
            quoteContainer.setDepth(1100);
            quoteContainer.setAlpha(0);

            const bg = scene.add.graphics();
            bg.fillStyle(0x1e293b, 0.92);
            bg.fillRoundedRect(-280, -18, 560, 36, 8);
            bg.lineStyle(1, 0xf59e0b, 0.5);
            bg.strokeRoundedRect(-280, -18, 560, 36, 8);

            const quoteText = scene.add.text(0, 0, `"${quote}"`, {
                fontFamily: 'Nunito',
                fontSize: '12px',
                fontStyle: 'italic',
                color: '#fbbf24',
                align: 'center',
                wordWrap: { width: 540 }
            }).setOrigin(0.5);

            quoteContainer.add([bg, quoteText]);

            // Slide up animation
            quoteContainer.y = 590;
            scene.tweens.add({
                targets: quoteContainer,
                y: 560,
                alpha: 1,
                duration: 400,
                ease: 'Back.easeOut'
            });

            // Auto-destroy after showing
            scene.time.delayedCall(2500, () => {
                scene.tweens.add({
                    targets: quoteContainer,
                    alpha: 0,
                    y: 580,
                    duration: 300,
                    ease: 'Cubic.easeIn',
                    onComplete: () => {
                        try { quoteContainer.destroy(); } catch (e) {}
                    }
                });
            });
        } catch (e) {
            console.warn('PowerUpManager: Error showing humor quote', e);
        }
    }

    // ==================== POWER-UP ACTIVATION LOGIC ====================

    _activatePowerUp(scene, type) {
        try {
            switch (type.id) {
                case 'congelar':
                    this.activateFreeze(scene);
                    break;
                case 'fifty':
                    this.activateFiftyFifty(scene);
                    break;
                case 'doble':
                    this.activateDouble(scene);
                    break;
                case 'vida':
                    this.activateExtraLife(scene);
                    break;
                case 'escudo':
                    this.activateShield(scene);
                    break;
            }
        } catch (e) {
            console.warn('PowerUpManager: Error activating power-up', type.id, e);
        }
    }

    // --- CONGELAR (Freeze Time) ---
    activateFreeze(scene) {
        try {
            this.isFreezeActive = true;

            // Store reference to scene timer if it exists
            if (scene.timerEvent) {
                scene.timerEvent.paused = true;
            }

            // Visual freeze overlay
            const freezeOverlay = scene.add.rectangle(400, 300, 800, 600, 0x06b6d4, 0.08);
            freezeOverlay.setDepth(700);

            // Frost border effect
            const frostBorder = scene.add.graphics();
            frostBorder.setDepth(701);
            frostBorder.lineStyle(4, 0x06b6d4, 0.4);
            frostBorder.strokeRoundedRect(2, 2, 796, 596, 12);
            frostBorder.lineStyle(2, 0x67e8f9, 0.25);
            frostBorder.strokeRoundedRect(8, 8, 784, 584, 10);

            // Floating ice crystals
            for (let i = 0; i < 6; i++) {
                const crystal = scene.add.text(
                    100 + Math.random() * 600,
                    80 + Math.random() * 440,
                    '*',
                    {
                        fontFamily: 'Nunito',
                        fontSize: (10 + Math.random() * 14) + 'px',
                        color: '#67e8f9'
                    }
                ).setOrigin(0.5).setAlpha(0.5).setDepth(702);

                scene.tweens.add({
                    targets: crystal,
                    y: crystal.y - 20 - Math.random() * 30,
                    alpha: 0,
                    duration: 3000 + Math.random() * 2000,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        try { crystal.destroy(); } catch (e) {}
                    }
                });
            }

            // Show HUD indicator
            this._addHudIndicator(scene, this.TYPES.CONGELAR, 5000);

            // Timer countdown text
            const timerText = scene.add.text(400, 55, 'CONGELADO 5s', {
                fontFamily: 'Nunito',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#06b6d4',
                stroke: '#0f172a',
                strokeThickness: 3
            }).setOrigin(0.5).setDepth(1000);

            let remaining = 5;
            const countdownEvent = scene.time.addEvent({
                delay: 1000,
                repeat: 4,
                callback: () => {
                    remaining--;
                    if (remaining > 0) {
                        timerText.setText(`CONGELADO ${remaining}s`);
                    }
                }
            });

            // Unfreeze after 5 seconds
            scene.time.delayedCall(5000, () => {
                this.isFreezeActive = false;

                if (scene.timerEvent && scene.timerEvent.paused !== undefined) {
                    scene.timerEvent.paused = false;
                }

                // Remove freeze visuals
                scene.tweens.add({
                    targets: [freezeOverlay, frostBorder, timerText],
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        try {
                            freezeOverlay.destroy();
                            frostBorder.destroy();
                            timerText.destroy();
                        } catch (e) {}
                    }
                });
            });
        } catch (e) {
            console.warn('PowerUpManager: Error activating freeze', e);
            this.isFreezeActive = false;
        }
    }

    // --- 50/50 ---
    activateFiftyFifty(scene) {
        try {
            if (!scene.buttons || !scene.currentScenario) return;

            const correctAnswer = scene.currentScenario.respuesta;
            const wrongButtons = scene.buttons.filter(b =>
                b && b.active && b.answerText !== correctAnswer
            );

            // Shuffle wrong answers and remove 2
            Phaser.Utils.Array.Shuffle(wrongButtons);
            const toRemove = wrongButtons.slice(0, 2);

            toRemove.forEach((btn, i) => {
                scene.time.delayedCall(i * 200, () => {
                    if (!btn || !btn.active) return;

                    // Visual strikethrough effect
                    try {
                        btn.bg.clear();
                        btn.bg.fillStyle(0x1e293b, 0.3);
                        btn.bg.fillRoundedRect(-120, -24, 240, 48, 10);

                        // Diagonal cross lines
                        btn.bg.lineStyle(3, 0x8b5cf6, 0.6);
                        btn.bg.beginPath();
                        btn.bg.moveTo(-110, -18);
                        btn.bg.lineTo(110, 18);
                        btn.bg.strokePath();
                        btn.bg.beginPath();
                        btn.bg.moveTo(110, -18);
                        btn.bg.lineTo(-110, 18);
                        btn.bg.strokePath();
                    } catch (e) {}

                    // Fade label
                    if (btn.label) {
                        btn.label.setAlpha(0.25);
                    }

                    // Disable interaction
                    btn.disableInteractive();

                    // Sparkle effect at button position
                    try {
                        for (let j = 0; j < 5; j++) {
                            const spark = scene.add.circle(
                                btn.x + (Math.random() - 0.5) * 100,
                                btn.y + (Math.random() - 0.5) * 30,
                                2 + Math.random() * 3,
                                0x8b5cf6
                            );
                            spark.setDepth(900);
                            scene.tweens.add({
                                targets: spark,
                                alpha: 0,
                                scale: 0,
                                y: spark.y - 20,
                                duration: 400,
                                delay: Math.random() * 200,
                                onComplete: () => {
                                    try { spark.destroy(); } catch (e) {}
                                }
                            });
                        }
                    } catch (e) {}

                    try { audioManager.playClick(); } catch (e) {}
                });
            });
        } catch (e) {
            console.warn('PowerUpManager: Error activating 50/50', e);
        }
    }

    // --- DOBLE (Double Points) ---
    activateDouble(scene) {
        try {
            this.isDoubleActive = true;

            // Show HUD indicator
            this._addHudIndicator(scene, this.TYPES.DOBLE, 0, 'Prox. respuesta');

            // Glowing aura on score text
            if (scene.scoreText) {
                scene.tweens.add({
                    targets: scene.scoreText,
                    scaleX: 1.3,
                    scaleY: 1.3,
                    duration: 400,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                scene.scoreText.setColor('#f59e0b');
            }
        } catch (e) {
            console.warn('PowerUpManager: Error activating double', e);
            this.isDoubleActive = false;
        }
    }

    // --- VIDA EXTRA ---
    activateExtraLife(scene) {
        try {
            if (scene.lives !== undefined) {
                scene.lives++;
            }

            if (typeof scene.updateLivesDisplay === 'function') {
                scene.updateLivesDisplay();
            }

            // Animated heart particles rising
            for (let i = 0; i < 8; i++) {
                const heart = scene.add.text(
                    30 + Math.random() * 80,
                    20,
                    '+',
                    {
                        fontFamily: 'Nunito',
                        fontSize: '16px',
                        fontStyle: 'bold',
                        color: '#ef4444'
                    }
                ).setOrigin(0.5).setDepth(900).setAlpha(0.8);

                scene.tweens.add({
                    targets: heart,
                    y: heart.y - 40 - Math.random() * 30,
                    x: heart.x + (Math.random() - 0.5) * 40,
                    alpha: 0,
                    scale: 1.5,
                    duration: 800 + Math.random() * 400,
                    delay: i * 60,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        try { heart.destroy(); } catch (e) {}
                    }
                });
            }

            // Flash the lives text red
            if (scene.livesText) {
                scene.tweens.add({
                    targets: scene.livesText,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    duration: 200,
                    yoyo: true,
                    ease: 'Back.easeOut'
                });
            }
        } catch (e) {
            console.warn('PowerUpManager: Error activating extra life', e);
        }
    }

    // --- ESCUDO (Shield) ---
    activateShield(scene) {
        try {
            this.isShieldActive = true;

            // Show HUD indicator (persistent until used)
            this._addHudIndicator(scene, this.TYPES.ESCUDO, 0, 'Activo');

            // Shield aura effect around the play area
            const shieldAura = scene.add.graphics();
            shieldAura.setDepth(699);
            shieldAura.lineStyle(3, 0x22c55e, 0.35);
            shieldAura.strokeRoundedRect(4, 4, 792, 592, 10);
            shieldAura.setAlpha(0);

            scene.tweens.add({
                targets: shieldAura,
                alpha: 1,
                duration: 500,
                ease: 'Cubic.easeOut'
            });

            // Pulsing shield border
            scene.tweens.add({
                targets: shieldAura,
                alpha: 0.3,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Store reference for cleanup
            this._shieldAura = shieldAura;
        } catch (e) {
            console.warn('PowerUpManager: Error activating shield', e);
            this.isShieldActive = false;
        }
    }

    // ==================== GAME INTEGRATION HELPERS ====================

    /**
     * Call this from the game's handleCorrect method.
     * Returns the score multiplier (2 if double is active, 1 otherwise).
     */
    getScoreMultiplier() {
        if (this.isDoubleActive) {
            this.isDoubleActive = false;
            this._removeHudIndicator('doble');
            return 2;
        }
        return 1;
    }

    /**
     * Call this from the game's handleWrong method.
     * Returns true if the shield absorbed the hit (no life should be lost).
     */
    shouldAbsorbHit(scene) {
        if (this.isShieldActive) {
            this.isShieldActive = false;
            this._removeHudIndicator('escudo');

            // Shield break effect
            try {
                if (this._shieldAura) {
                    scene.tweens.killTweensOf(this._shieldAura);
                    scene.tweens.add({
                        targets: this._shieldAura,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => {
                            try { this._shieldAura.destroy(); } catch (e) {}
                            this._shieldAura = null;
                        }
                    });
                }

                // Shield shatter particles
                for (let i = 0; i < 12; i++) {
                    const angle = (Math.PI * 2 * i) / 12;
                    const shard = scene.add.circle(
                        400 + Math.cos(angle) * 30,
                        300 + Math.sin(angle) * 30,
                        4 + Math.random() * 4,
                        0x22c55e
                    );
                    shard.setDepth(900);
                    scene.tweens.add({
                        targets: shard,
                        x: shard.x + Math.cos(angle) * (80 + Math.random() * 60),
                        y: shard.y + Math.sin(angle) * (80 + Math.random() * 60),
                        alpha: 0,
                        scale: 0,
                        duration: 600,
                        ease: 'Cubic.easeOut',
                        onComplete: () => {
                            try { shard.destroy(); } catch (e) {}
                        }
                    });
                }

                // Show shield absorbed text
                const absorbText = scene.add.text(400, 280, 'ESCUDO!', {
                    fontFamily: 'Nunito',
                    fontSize: '28px',
                    fontStyle: '900',
                    color: '#22c55e',
                    stroke: '#0f172a',
                    strokeThickness: 5
                }).setOrigin(0.5).setDepth(1000);

                scene.tweens.add({
                    targets: absorbText,
                    y: 240,
                    alpha: 0,
                    scale: 1.5,
                    duration: 1000,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        try { absorbText.destroy(); } catch (e) {}
                    }
                });

                try { audioManager.playElectricBuzz(); } catch (e) {}
            } catch (e) {}

            return true;
        }
        return false;
    }

    /**
     * Returns true if the timer should be frozen (CONGELAR active).
     */
    isTimerFrozen() {
        return this.isFreezeActive;
    }

    /**
     * Call when the scene's score text needs to be restored after double points.
     */
    resetDoubleVisuals(scene) {
        try {
            if (scene.scoreText && !this.isDoubleActive) {
                scene.tweens.killTweensOf(scene.scoreText);
                scene.scoreText.setScale(1);
                scene.scoreText.setColor('#fbbf24');
            }
        } catch (e) {}
    }

    // ==================== HUD SYSTEM ====================

    _addHudIndicator(scene, type, duration, customLabel) {
        try {
            const hudTextureKey = `powerup_hud_${type.id}`;
            if (!scene.textures.exists(hudTextureKey)) {
                scene.textures.addCanvas(hudTextureKey, this.createHudIcon(type, 28));
            }

            // Position based on how many indicators are active
            const activeCount = this.hudElements.filter(h => h && h.active).length;
            const hudX = 770 - activeCount * 38;
            const hudY = 55;

            const hudContainer = scene.add.container(hudX, hudY);
            hudContainer.setDepth(1200);
            hudContainer.setAlpha(0);
            hudContainer.setScale(0.5);
            hudContainer.powerUpId = type.id;

            // Background pill
            const bg = scene.add.graphics();
            bg.fillStyle(0x0f172a, 0.85);
            bg.fillRoundedRect(-16, -16, 32, 32, 8);
            bg.lineStyle(1.5, type.colorHex, 0.6);
            bg.strokeRoundedRect(-16, -16, 32, 32, 8);

            // Icon
            const icon = scene.add.image(0, 0, hudTextureKey);

            hudContainer.add([bg, icon]);

            // Optional label
            if (customLabel) {
                const lbl = scene.add.text(0, 22, customLabel, {
                    fontFamily: 'Nunito',
                    fontSize: '8px',
                    fontStyle: 'bold',
                    color: type.color
                }).setOrigin(0.5);
                hudContainer.add(lbl);
            }

            // Entrance animation
            scene.tweens.add({
                targets: hudContainer,
                alpha: 1,
                scale: 1,
                duration: 300,
                ease: 'Back.easeOut'
            });

            // Subtle pulse
            scene.tweens.add({
                targets: hudContainer,
                scaleX: 1.08,
                scaleY: 1.08,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            this.hudElements.push(hudContainer);

            // Auto-remove for timed power-ups
            if (duration > 0) {
                scene.time.delayedCall(duration, () => {
                    this._removeHudIndicator(type.id);
                });
            }
        } catch (e) {
            console.warn('PowerUpManager: Error adding HUD indicator', e);
        }
    }

    _removeHudIndicator(typeId) {
        try {
            const idx = this.hudElements.findIndex(h => h && h.active && h.powerUpId === typeId);
            if (idx === -1) return;

            const hud = this.hudElements[idx];
            this.hudElements.splice(idx, 1);

            if (hud && hud.scene) {
                hud.scene.tweens.add({
                    targets: hud,
                    alpha: 0,
                    scale: 0.3,
                    duration: 300,
                    ease: 'Cubic.easeIn',
                    onComplete: () => {
                        try { hud.destroy(); } catch (e) {}
                    }
                });
            }
        } catch (e) {
            console.warn('PowerUpManager: Error removing HUD indicator', e);
        }
    }

    // ==================== CLEANUP ====================

    /**
     * Call when transitioning between scenes to clean up all power-up state.
     */
    cleanup() {
        try {
            // Destroy all spawned power-ups
            this.spawnedPowerUps.forEach(p => {
                try { if (p && p.active) p.destroy(); } catch (e) {}
            });
            this.spawnedPowerUps = [];

            // Destroy all HUD elements
            this.hudElements.forEach(h => {
                try { if (h && h.active) h.destroy(); } catch (e) {}
            });
            this.hudElements = [];

            // Reset all state flags
            this.isShieldActive = false;
            this.isDoubleActive = false;
            this.isFreezeActive = false;
            this._shieldAura = null;
        } catch (e) {
            console.warn('PowerUpManager: Error during cleanup', e);
        }
    }

    /**
     * Preload power-up textures into a scene.
     * Call this in the BootScene or at the start of a game scene.
     */
    preloadTextures(scene) {
        try {
            if (!scene || !scene.textures) return;

            Object.values(this.TYPES).forEach(type => {
                const key = `powerup_${type.id}`;
                if (!scene.textures.exists(key)) {
                    scene.textures.addCanvas(key, this.createPowerUpIcon(type, 48));
                }
                const hudKey = `powerup_hud_${type.id}`;
                if (!scene.textures.exists(hudKey)) {
                    scene.textures.addCanvas(hudKey, this.createHudIcon(type, 28));
                }
            });
        } catch (e) {
            console.warn('PowerUpManager: Error preloading textures', e);
        }
    }
}

// ==================== GLOBAL INSTANCE ====================
window.powerUpManager = new PowerUpManager();
