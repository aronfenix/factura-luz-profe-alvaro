// ============================================================
// EFECTOS VISUALES - Chispas, humo, pulsos verdes
// ============================================================

class EffectsManager {
    constructor(scene) {
        this.scene = scene;
    }

    shake(intensity = 0.008, duration = 200) {
        this.scene.cameras.main.shake(duration, intensity);
    }

    flash(color = 0xffffff, duration = 200) {
        this.scene.cameras.main.flash(duration, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff);
    }

    slowMotion(duration = 1000, scale = 0.3) {
        this.scene.time.timeScale = scale;
        this.scene.time.delayedCall(duration * scale, () => { this.scene.time.timeScale = 1; });
    }

    zoomTo(target, zoom = 1.3, duration = 500, callback) {
        this.scene.cameras.main.pan(target.x, target.y, duration, 'Power2');
        this.scene.cameras.main.zoomTo(zoom, duration, 'Power2', false, (cam, progress) => {
            if (progress === 1 && callback) callback();
        });
    }

    zoomReset(duration = 500) {
        this.scene.cameras.main.pan(400, 300, duration, 'Power2');
        this.scene.cameras.main.zoomTo(1, duration, 'Power2');
    }

    // Vignette using border rectangles
    createVignette(intensity = 0.25) {
        const container = this.scene.add.container(0, 0);
        for (let i = 0; i < 8; i++) {
            const rect = this.scene.add.rectangle(400, i * 10, 800, 20, 0x000000);
            rect.setAlpha(intensity * (1 - i / 8));
            container.add(rect);
        }
        for (let i = 0; i < 8; i++) {
            const rect = this.scene.add.rectangle(400, 600 - i * 10, 800, 20, 0x000000);
            rect.setAlpha(intensity * (1 - i / 8));
            container.add(rect);
        }
        for (let i = 0; i < 6; i++) {
            container.add(this.scene.add.rectangle(i * 12, 300, 24, 600, 0x000000).setAlpha(intensity * (1 - i / 6) * 0.6));
            container.add(this.scene.add.rectangle(800 - i * 12, 300, 24, 600, 0x000000).setAlpha(intensity * (1 - i / 6) * 0.6));
        }
        container.setDepth(1000);
        container.setScrollFactor(0);
        return container;
    }

    // Particle explosion
    explode(x, y, config = {}) {
        const { count = 20, colors = [0x22c55e, 0x3b82f6, 0xf59e0b], speed = 300, lifespan = 1000, scale = 1, gravity = 300 } = config;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const velocity = speed * (0.5 + Math.random() * 0.5);
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = (4 + Math.random() * 4) * scale;
            const particle = this.scene.add.circle(x, y, size, color);
            particle.setDepth(500);
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            this.scene.tweens.add({
                targets: particle,
                x: x + vx * (lifespan / 1000),
                y: y + vy * (lifespan / 1000) + gravity * Math.pow(lifespan / 1000, 2) / 2,
                alpha: 0, scale: 0, duration: lifespan, ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    // Electric sparks
    sparks(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const spark = this.scene.add.circle(x, y, 2 + Math.random() * 3, 0xfbbf24);
            spark.setDepth(500);
            const angle = Math.random() * Math.PI * 2;
            const dist = 30 + Math.random() * 60;
            this.scene.tweens.add({
                targets: spark,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                alpha: 0, scale: 0, duration: 300 + Math.random() * 300,
                ease: 'Cubic.easeOut',
                onComplete: () => spark.destroy()
            });
        }
    }

    // Smoke puff
    smokePuff(x, y, count = 8) {
        for (let i = 0; i < count; i++) {
            const smoke = this.scene.add.circle(x, y, 5 + Math.random() * 8, 0x6b7280);
            smoke.setAlpha(0.5);
            smoke.setDepth(500);
            this.scene.tweens.add({
                targets: smoke,
                x: x + (Math.random() - 0.5) * 60,
                y: y - 30 - Math.random() * 40,
                alpha: 0, scale: 2 + Math.random(), duration: 800 + Math.random() * 400,
                ease: 'Cubic.easeOut',
                onComplete: () => smoke.destroy()
            });
        }
    }

    // Green pulse (renewable placed)
    greenPulse(x, y) {
        const ring = this.scene.add.circle(x, y, 10, 0x22c55e);
        ring.setAlpha(0.6);
        ring.setDepth(500);
        this.scene.tweens.add({
            targets: ring,
            scale: 4, alpha: 0, duration: 600, ease: 'Cubic.easeOut',
            onComplete: () => ring.destroy()
        });
    }

    // Red pulse (pollution warning)
    redPulse(x, y) {
        const ring = this.scene.add.circle(x, y, 10, 0xef4444);
        ring.setAlpha(0.6);
        ring.setDepth(500);
        this.scene.tweens.add({
            targets: ring,
            scale: 3, alpha: 0, duration: 500, ease: 'Cubic.easeOut',
            onComplete: () => ring.destroy()
        });
    }

    // Firework
    firework(x, y) {
        const trail = this.scene.add.circle(x, 600, 3, 0xfbbf24);
        this.scene.tweens.add({
            targets: trail, y: y, duration: 700, ease: 'Cubic.easeOut',
            onUpdate: () => {
                if (Math.random() > 0.5) {
                    const s = this.scene.add.circle(trail.x, trail.y, 2, 0xfbbf24);
                    this.scene.tweens.add({ targets: s, alpha: 0, scale: 0, duration: 200, onComplete: () => s.destroy() });
                }
            },
            onComplete: () => {
                trail.destroy();
                this.explode(x, y, { count: 30, speed: 350, gravity: 180 });
                audioManager.playExplosion && audioManager.playExplosion();
            }
        });
    }

    // Animated text
    createAnimatedText(x, y, text, style, effect = 'wave') {
        const container = this.scene.add.container(x, y);
        const chars = text.split('');
        const tempText = this.scene.add.text(0, 0, 'W', style);
        const charWidth = tempText.width;
        tempText.destroy();
        const totalWidth = chars.length * charWidth;
        const offsetX = -totalWidth / 2;

        chars.forEach((char, i) => {
            const charText = this.scene.add.text(offsetX + i * charWidth, 0, char, style).setOrigin(0.5);
            container.add(charText);
            if (effect === 'wave') {
                this.scene.tweens.add({ targets: charText, y: -8, duration: 500, yoyo: true, repeat: -1, delay: i * 50, ease: 'Sine.easeInOut' });
            } else if (effect === 'typewriter') {
                charText.setAlpha(0);
                this.scene.time.delayedCall(i * 60, () => { charText.setAlpha(1); audioManager.playDialogueBeep && audioManager.playDialogueBeep(); });
            }
        });
        return container;
    }

    // Dramatic entrance
    dramaticEntrance(target, from = 'bottom', duration = 700) {
        const origX = target.x, origY = target.y, origAlpha = target.alpha, origScale = target.scale || target.scaleX || 1;
        switch (from) {
            case 'bottom': target.y = 700; target.alpha = 0; break;
            case 'top': target.y = -100; target.alpha = 0; break;
            case 'left': target.x = -100; target.alpha = 0; break;
            case 'right': target.x = 900; target.alpha = 0; break;
            case 'zoom': target.setScale(0); target.alpha = 0; break;
        }
        return this.scene.tweens.add({ targets: target, x: origX, y: origY, alpha: origAlpha, scale: origScale, duration, ease: 'Back.easeOut' });
    }

    float(target, amplitude = 8, duration = 2000) {
        return this.scene.tweens.add({ targets: target, y: target.y - amplitude, duration, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    pulse(target, scale = 1.08, duration = 500) {
        return this.scene.tweens.add({ targets: target, scaleX: scale, scaleY: scale, duration, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    scorePopup(x, y, text, color = '#fbbf24') {
        const popup = this.scene.add.text(x, y, text, {
            fontFamily: 'Nunito', fontSize: '18px', fontStyle: 'bold', color: color, stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(1000);
        this.scene.tweens.add({ targets: popup, y: y - 60, alpha: 0, scale: 1.3, duration: 900, ease: 'Cubic.easeOut', onComplete: () => popup.destroy() });
        return popup;
    }

    // Lightning bolt between two points
    lightning(x1, y1, x2, y2, branches = 4) {
        const graphics = this.scene.add.graphics();
        graphics.setDepth(999);
        const drawBolt = (sx, sy, ex, ey, width, alpha) => {
            graphics.lineStyle(width, 0xfbbf24, alpha);
            graphics.beginPath();
            graphics.moveTo(sx, sy);
            const segs = 6;
            for (let i = 1; i <= segs; i++) {
                const p = i / segs;
                const tx = sx + (ex - sx) * p + (Math.random() - 0.5) * 30 * (1 - p);
                const ty = sy + (ey - sy) * p + (Math.random() - 0.5) * 15;
                graphics.lineTo(tx, ty);
            }
            graphics.strokePath();
        };
        drawBolt(x1, y1, x2, y2, 3, 1);
        drawBolt(x1, y1, x2, y2, 6, 0.4);
        for (let i = 0; i < branches; i++) {
            const t = 0.3 + Math.random() * 0.4;
            const bx = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 20;
            const by = y1 + (y2 - y1) * t;
            drawBolt(bx, by, bx + (Math.random() - 0.5) * 60, by + 30 + Math.random() * 30, 2, 0.6);
        }
        this.flash(0xfbbf24, 80);
        this.scene.tweens.add({ targets: graphics, alpha: 0, duration: 200, onComplete: () => graphics.destroy() });
    }

    // Pollution overlay effect
    pollutionOverlay(intensity) {
        const overlay = this.scene.add.rectangle(400, 300, 800, 600, 0x78350f);
        overlay.setAlpha(intensity * 0.15);
        overlay.setDepth(900);
        this.scene.tweens.add({ targets: overlay, alpha: 0, duration: 2000, onComplete: () => overlay.destroy() });
    }

    // Ambient floating particles in the background
    ambientParticles(scene, type = 'energy') {
        const particles = [];
        const spawnParticle = () => {
            if (!scene || !scene.add) return;
            let particle;
            let startX = Math.random() * 800;
            let startY, targetY, color, size, duration;

            switch (type) {
                case 'energy':
                    startY = 600 + 20;
                    targetY = -40;
                    color = 0xfbbf24;
                    size = 3 + Math.random() * 3;
                    duration = 4000 + Math.random() * 3000;
                    particle = scene.add.graphics();
                    particle.setDepth(500);
                    particle.lineStyle(2, color, 0.7);
                    particle.beginPath();
                    particle.moveTo(0, 0);
                    const segments = 3;
                    for (let s = 1; s <= segments; s++) {
                        particle.lineTo((Math.random() - 0.5) * 10, -s * 6);
                    }
                    particle.strokePath();
                    particle.setPosition(startX, startY);
                    particle.setAlpha(0.6 + Math.random() * 0.4);
                    break;
                case 'stars':
                    startX = Math.random() * 800;
                    startY = Math.random() * 600;
                    color = 0xffffff;
                    size = 1 + Math.random() * 2;
                    duration = 1500 + Math.random() * 1500;
                    particle = scene.add.circle(startX, startY, size, color);
                    particle.setDepth(500);
                    particle.setAlpha(0);
                    scene.tweens.add({
                        targets: particle,
                        alpha: { from: 0, to: 0.5 + Math.random() * 0.5 },
                        scale: { from: 0.5, to: 1.2 },
                        duration: duration / 2,
                        yoyo: true,
                        ease: 'Sine.easeInOut',
                        onComplete: () => {
                            const idx = particles.indexOf(particle);
                            if (idx > -1) particles.splice(idx, 1);
                            particle.destroy();
                        }
                    });
                    particles.push(particle);
                    return;
                case 'leaves':
                    startX = Math.random() * 800;
                    startY = -20;
                    targetY = 620;
                    color = 0x22c55e;
                    size = 4 + Math.random() * 4;
                    duration = 5000 + Math.random() * 3000;
                    particle = scene.add.ellipse(startX, startY, size * 2, size, color);
                    particle.setDepth(500);
                    particle.setAlpha(0.6 + Math.random() * 0.3);
                    particle.setRotation(Math.random() * Math.PI * 2);
                    scene.tweens.add({
                        targets: particle,
                        rotation: particle.rotation + (Math.random() > 0.5 ? 1 : -1) * Math.PI * 2,
                        duration: duration,
                        ease: 'Linear'
                    });
                    break;
                case 'smoke':
                    startX = Math.random() * 800;
                    startY = 620;
                    targetY = -40;
                    color = 0x374151;
                    size = 8 + Math.random() * 10;
                    duration = 6000 + Math.random() * 3000;
                    particle = scene.add.circle(startX, startY, size, color);
                    particle.setDepth(500);
                    particle.setAlpha(0.3 + Math.random() * 0.2);
                    break;
                default:
                    return;
            }

            if (type !== 'stars') {
                const driftX = startX + (Math.random() - 0.5) * 150;
                scene.tweens.add({
                    targets: particle,
                    x: driftX,
                    y: targetY,
                    alpha: 0,
                    scale: type === 'smoke' ? 2 + Math.random() : 0.3,
                    duration: duration,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        const idx = particles.indexOf(particle);
                        if (idx > -1) particles.splice(idx, 1);
                        particle.destroy();
                    }
                });
                particles.push(particle);
            }
        };

        const intervalId = setInterval(spawnParticle, 500);

        const cleanup = () => {
            clearInterval(intervalId);
            particles.forEach(p => { if (p && p.destroy) p.destroy(); });
            particles.length = 0;
        };

        return cleanup;
    }

    // Glowing border around the screen that intensifies with combo level
    comboGlow(intensity = 1) {
        const container = this.scene.add.container(0, 0);
        container.setDepth(500);
        container.setScrollFactor(0);

        const thickness = 6 + intensity * 2;
        let glowColor;
        if (intensity >= 7) {
            glowColor = 0xff00ff; // rainbow will be handled via tint cycling
        } else if (intensity >= 4) {
            glowColor = 0xfbbf24; // golden
        } else {
            glowColor = 0x3b82f6; // blue
        }

        const top = this.scene.add.rectangle(400, thickness / 2, 800, thickness, glowColor);
        const bottom = this.scene.add.rectangle(400, 600 - thickness / 2, 800, thickness, glowColor);
        const left = this.scene.add.rectangle(thickness / 2, 300, thickness, 600, glowColor);
        const right = this.scene.add.rectangle(800 - thickness / 2, 300, thickness, 600, glowColor);

        const edges = [top, bottom, left, right];
        edges.forEach(edge => {
            edge.setAlpha(0.5);
            edge.setDepth(500);
            container.add(edge);
        });

        // Pulse with sine wave
        const pulseEvent = this.scene.time.addEvent({
            delay: 30,
            loop: true,
            callback: () => {
                const time = this.scene.time.now / 1000;
                const pulseAlpha = 0.3 + 0.4 * Math.sin(time * 3) * (intensity / 10);
                edges.forEach(edge => edge.setAlpha(Math.min(pulseAlpha + 0.2, 0.9)));

                // Rainbow color cycling for intensity 7+
                if (intensity >= 7) {
                    const hue = (time * 120) % 360;
                    const rainbowColor = Phaser.Display.Color.HSLToColor(hue / 360, 1, 0.5).color;
                    edges.forEach(edge => edge.setFillStyle(rainbowColor));
                }
            }
        });

        container.once('destroy', () => { pulseEvent.destroy(); });

        return container;
    }

    // Theatrical screen wipe transition
    screenWipe(direction = 'left', color = 0x000000, duration = 800, callback) {
        const halfDur = duration / 2;

        if (direction === 'circle') {
            // Circular iris wipe
            const mask = this.scene.add.graphics();
            mask.setDepth(500);
            mask.setScrollFactor(0);
            let radius = 0;
            const maxRadius = Math.sqrt(400 * 400 + 300 * 300) + 50;
            // Expand circle to cover screen
            this.scene.tweens.addCounter({
                from: 0, to: maxRadius, duration: halfDur, ease: 'Cubic.easeIn',
                onUpdate: (tween) => {
                    radius = tween.getValue();
                    mask.clear();
                    mask.fillStyle(color, 1);
                    mask.fillCircle(400, 300, radius);
                },
                onComplete: () => {
                    if (callback) callback();
                    // Reverse: shrink circle
                    this.scene.tweens.addCounter({
                        from: maxRadius, to: 0, duration: halfDur, ease: 'Cubic.easeOut',
                        onUpdate: (tween) => {
                            radius = tween.getValue();
                            mask.clear();
                            mask.fillStyle(color, 1);
                            mask.fillCircle(400, 300, radius);
                        },
                        onComplete: () => { mask.destroy(); }
                    });
                }
            });
            return;
        }

        // Directional bar wipe
        const bar = this.scene.add.rectangle(0, 0, 800, 600, color);
        bar.setOrigin(0, 0);
        bar.setDepth(500);
        bar.setScrollFactor(0);

        let fromProps, toProps, reverseProps;
        switch (direction) {
            case 'left':
                bar.setPosition(-800, 0);
                toProps = { x: 0 };
                reverseProps = { x: 800 };
                break;
            case 'right':
                bar.setPosition(800, 0);
                toProps = { x: 0 };
                reverseProps = { x: -800 };
                break;
            case 'up':
                bar.setPosition(0, 600);
                toProps = { y: 0 };
                reverseProps = { y: -600 };
                break;
            case 'down':
                bar.setPosition(0, -600);
                toProps = { y: 0 };
                reverseProps = { y: 600 };
                break;
            default:
                bar.setPosition(-800, 0);
                toProps = { x: 0 };
                reverseProps = { x: 800 };
                break;
        }

        this.scene.tweens.add({
            targets: bar,
            ...toProps,
            duration: halfDur,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                if (callback) callback();
                this.scene.tweens.add({
                    targets: bar,
                    ...reverseProps,
                    duration: halfDur,
                    ease: 'Cubic.easeOut',
                    onComplete: () => { bar.destroy(); }
                });
            }
        });
    }

    // Extra dramatic score popup for big moments
    scorePopupBig(x, y, text, color = '#fbbf24') {
        const popup = this.scene.add.text(x, y, text, {
            fontFamily: 'Nunito', fontSize: '36px', fontStyle: 'bold',
            color: color, stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5).setDepth(500);

        // Start big, settle to normal, then float up and fade
        popup.setScale(2.5);
        this.scene.tweens.add({
            targets: popup,
            scale: 1.2,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: popup,
                    y: y - 100,
                    alpha: 0,
                    scale: 0.8,
                    duration: 1000,
                    ease: 'Cubic.easeOut',
                    onComplete: () => popup.destroy()
                });
            }
        });

        // Bounce upward
        this.scene.tweens.add({
            targets: popup,
            y: y - 20,
            duration: 200,
            yoyo: true,
            ease: 'Sine.easeOut'
        });

        // Spawn mini particles around it
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            const dist = 20 + Math.random() * 30;
            const pColor = Phaser.Display.Color.HexStringToColor(color).color || 0xfbbf24;
            const p = this.scene.add.circle(x, y, 2 + Math.random() * 3, pColor);
            p.setDepth(500);
            this.scene.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                alpha: 0,
                scale: 0,
                duration: 500 + Math.random() * 300,
                ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }

        return popup;
    }

    // Called when player gets a perfect level
    perfectCelebration() {
        // Multiple fireworks at staggered times
        const positions = [
            { x: 200, y: 150 }, { x: 400, y: 100 },
            { x: 600, y: 150 }, { x: 300, y: 200 }, { x: 500, y: 180 }
        ];
        positions.forEach((pos, i) => {
            this.scene.time.delayedCall(i * 400, () => {
                this.firework(pos.x, pos.y);
            });
        });

        // Rainbow confetti rain
        const confettiColors = [0xff0000, 0xff8800, 0xffff00, 0x00ff00, 0x0088ff, 0x8800ff, 0xff00ff];
        for (let i = 0; i < 60; i++) {
            this.scene.time.delayedCall(Math.random() * 2000, () => {
                const cx = Math.random() * 800;
                const cy = -20;
                const confettiColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                const confetti = this.scene.add.rectangle(cx, cy, 6 + Math.random() * 6, 4 + Math.random() * 4, confettiColor);
                confetti.setDepth(500);
                confetti.setRotation(Math.random() * Math.PI * 2);
                confetti.setAlpha(0.8 + Math.random() * 0.2);
                this.scene.tweens.add({
                    targets: confetti,
                    y: 620,
                    x: cx + (Math.random() - 0.5) * 200,
                    rotation: confetti.rotation + (Math.random() - 0.5) * Math.PI * 4,
                    alpha: 0,
                    duration: 2500 + Math.random() * 1500,
                    ease: 'Sine.easeIn',
                    onComplete: () => confetti.destroy()
                });
            });
        }

        // Screen flash
        this.flash(0xffffff, 400);

        // Dramatic zoom effect
        this.scene.cameras.main.zoomTo(1.15, 600, 'Sine.easeInOut', false, (cam, progress) => {
            if (progress === 1) {
                this.scene.cameras.main.zoomTo(1, 600, 'Sine.easeInOut');
            }
        });
    }

    // Animated combo counter
    comboCounter(x, y, comboNum) {
        const baseFontSize = Math.min(24 + comboNum * 4, 64);
        const comboText = this.scene.add.text(x, y, `x${comboNum}!`, {
            fontFamily: 'Nunito', fontSize: `${baseFontSize}px`, fontStyle: 'bold',
            color: comboNum >= 8 ? '#ff4444' : comboNum >= 5 ? '#ff8800' : '#fbbf24',
            stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5).setDepth(500);

        // Scale punch and float up
        comboText.setScale(2);
        this.scene.tweens.add({
            targets: comboText,
            scale: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: comboText,
                    y: y - 70,
                    alpha: 0,
                    duration: 800,
                    ease: 'Cubic.easeOut',
                    onComplete: () => comboText.destroy()
                });
            }
        });

        // At combo 5+, add fire particles around the text
        if (comboNum >= 5) {
            for (let i = 0; i < 8 + comboNum; i++) {
                const fireColors = [0xff4400, 0xff8800, 0xffcc00];
                const fc = fireColors[Math.floor(Math.random() * fireColors.length)];
                const fireP = this.scene.add.circle(
                    x + (Math.random() - 0.5) * 40,
                    y + (Math.random() - 0.5) * 20,
                    2 + Math.random() * 4, fc
                );
                fireP.setDepth(500);
                fireP.setAlpha(0.8);
                this.scene.tweens.add({
                    targets: fireP,
                    y: fireP.y - 30 - Math.random() * 40,
                    x: fireP.x + (Math.random() - 0.5) * 30,
                    alpha: 0,
                    scale: 0,
                    duration: 400 + Math.random() * 400,
                    ease: 'Cubic.easeOut',
                    onComplete: () => fireP.destroy()
                });
            }
        }

        // At combo 8+, add lightning effect
        if (comboNum >= 8) {
            const lx1 = x + (Math.random() - 0.5) * 60;
            const ly1 = y - 40;
            const lx2 = x + (Math.random() - 0.5) * 60;
            const ly2 = y + 40;
            this.lightning(lx1, ly1, lx2, ly2, 2);
        }

        return comboText;
    }

    // Theatrical text reveal - letter by letter with effects
    dramaticReveal(x, y, text, style = {}) {
        const defaultStyle = {
            fontFamily: 'Nunito', fontSize: '32px', fontStyle: 'bold',
            color: '#ffffff', stroke: '#000000', strokeThickness: 5
        };
        const mergedStyle = { ...defaultStyle, ...style };

        const container = this.scene.add.container(x, y);
        container.setDepth(500);

        const chars = text.split('');
        // Measure character width
        const tempText = this.scene.add.text(0, 0, 'W', mergedStyle);
        const charWidth = tempText.width;
        tempText.destroy();
        const totalWidth = chars.length * charWidth;
        const offsetX = -totalWidth / 2;

        chars.forEach((char, i) => {
            const charText = this.scene.add.text(offsetX + i * charWidth, 0, char, mergedStyle).setOrigin(0.5);
            charText.setAlpha(0);
            charText.setScale(2);
            container.add(charText);

            this.scene.time.delayedCall(i * 80, () => {
                charText.setAlpha(1);
                // Screen shake on each letter
                this.shake(0.003, 50);
                // Scale punch for each letter
                this.scene.tweens.add({
                    targets: charText,
                    scale: 1,
                    duration: 150,
                    ease: 'Back.easeOut'
                });

                // Final letter triggers flash and particle burst
                if (i === chars.length - 1) {
                    this.scene.time.delayedCall(100, () => {
                        this.flash(0xffffff, 150);
                        this.explode(x, y, {
                            count: 20,
                            colors: [0xffffff, 0xfbbf24, 0x3b82f6],
                            speed: 200,
                            lifespan: 800,
                            scale: 0.8,
                            gravity: 100
                        });
                    });
                }
            });
        });

        return container;
    }

    // Power-up activation effect
    powerUpActivation(x, y, color = 0x3b82f6) {
        // Circular shockwave expanding outward
        const shockwave = this.scene.add.circle(x, y, 10, color);
        shockwave.setAlpha(0.7);
        shockwave.setDepth(500);
        shockwave.setFillStyle(color, 0);
        shockwave.setStrokeStyle(4, color, 0.8);
        this.scene.tweens.add({
            targets: shockwave,
            scale: 8,
            alpha: 0,
            duration: 600,
            ease: 'Cubic.easeOut',
            onComplete: () => shockwave.destroy()
        });

        // Second ring with slight delay
        this.scene.time.delayedCall(100, () => {
            const ring2 = this.scene.add.circle(x, y, 10, color);
            ring2.setAlpha(0.5);
            ring2.setDepth(500);
            ring2.setFillStyle(color, 0);
            ring2.setStrokeStyle(3, color, 0.6);
            this.scene.tweens.add({
                targets: ring2,
                scale: 6,
                alpha: 0,
                duration: 500,
                ease: 'Cubic.easeOut',
                onComplete: () => ring2.destroy()
            });
        });

        // Radial light rays spinning briefly
        const rays = this.scene.add.graphics();
        rays.setDepth(500);
        rays.setPosition(x, y);
        const numRays = 12;
        for (let i = 0; i < numRays; i++) {
            const angle = (Math.PI * 2 * i) / numRays;
            rays.lineStyle(2, color, 0.6);
            rays.beginPath();
            rays.moveTo(Math.cos(angle) * 15, Math.sin(angle) * 15);
            rays.lineTo(Math.cos(angle) * 60, Math.sin(angle) * 60);
            rays.strokePath();
        }
        rays.setAlpha(0.8);
        this.scene.tweens.add({
            targets: rays,
            rotation: Math.PI / 4,
            alpha: 0,
            scale: 2,
            duration: 500,
            ease: 'Cubic.easeOut',
            onComplete: () => rays.destroy()
        });

        // Color flash matching the power-up
        const r = (color >> 16) & 0xff;
        const g = (color >> 8) & 0xff;
        const b = color & 0xff;
        this.scene.cameras.main.flash(200, r, g, b);
    }
}

// ==================== CINEMATIC SYSTEM ====================
class CinematicManager {
    constructor(scene) {
        this.scene = scene;
        this.letterboxTop = null;
        this.letterboxBottom = null;
        this.isActive = false;
    }

    enter(duration = 500) {
        this.isActive = true;
        this.letterboxTop = this.scene.add.rectangle(400, -40, 800, 80, 0x000000).setDepth(2000).setScrollFactor(0);
        this.letterboxBottom = this.scene.add.rectangle(400, 640, 800, 80, 0x000000).setDepth(2000).setScrollFactor(0);
        this.scene.tweens.add({ targets: this.letterboxTop, y: 40, duration, ease: 'Cubic.easeOut' });
        this.scene.tweens.add({ targets: this.letterboxBottom, y: 560, duration, ease: 'Cubic.easeOut' });
    }

    exit(duration = 500) {
        if (!this.isActive) return;
        this.scene.tweens.add({ targets: this.letterboxTop, y: -40, duration, ease: 'Cubic.easeIn', onComplete: () => { if (this.letterboxTop) this.letterboxTop.destroy(); } });
        this.scene.tweens.add({ targets: this.letterboxBottom, y: 640, duration, ease: 'Cubic.easeIn', onComplete: () => { if (this.letterboxBottom) this.letterboxBottom.destroy(); this.isActive = false; } });
    }

    async showDialogue(speaker, text, options = {}) {
        const { duration = 3000, color = '#ffffff', speakerColor = '#f59e0b', position = 'bottom' } = options;
        return new Promise((resolve) => {
            const y = position === 'bottom' ? 480 : 120;
            const container = this.scene.add.container(400, y).setDepth(2001);
            const bg = this.scene.add.graphics();
            bg.fillStyle(0x0f172a, 0.95);
            bg.fillRoundedRect(-380, -50, 760, 100, 12);
            bg.lineStyle(3, Phaser.Display.Color.HexStringToColor(speakerColor).color);
            bg.strokeRoundedRect(-380, -50, 760, 100, 12);
            const speakerText = this.scene.add.text(-360, -35, speaker, { fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: speakerColor });
            const dialogueText = this.scene.add.text(-360, -5, '', { fontFamily: 'Nunito', fontSize: '14px', color: color, wordWrap: { width: 700 } });
            container.add([bg, speakerText, dialogueText]);
            container.setAlpha(0);
            container.y += 30;
            this.scene.tweens.add({ targets: container, alpha: 1, y: y, duration: 300, ease: 'Back.easeOut' });
            let charIndex = 0;
            const typewriter = this.scene.time.addEvent({
                delay: 25, callback: () => {
                    if (charIndex < text.length) { dialogueText.setText(text.substring(0, charIndex + 1)); charIndex++; if (charIndex % 3 === 0) audioManager.playDialogueBeep && audioManager.playDialogueBeep(); }
                    else typewriter.destroy();
                }, loop: true
            });
            const clickHandler = () => {
                if (charIndex < text.length) { typewriter.destroy(); dialogueText.setText(text); charIndex = text.length; }
                else {
                    this.scene.input.off('pointerdown', clickHandler);
                    this.scene.tweens.add({ targets: container, alpha: 0, y: y + 30, duration: 200, onComplete: () => { container.destroy(); resolve(); } });
                }
            };
            this.scene.time.delayedCall(400, () => { this.scene.input.on('pointerdown', clickHandler); });
            this.scene.time.delayedCall(duration, () => { if (charIndex >= text.length) clickHandler(); });
        });
    }

    async fadeToBlack(duration = 500) {
        return new Promise((resolve) => { this.scene.cameras.main.fadeOut(duration, 0, 0, 0); this.scene.time.delayedCall(duration, resolve); });
    }

    async fadeFromBlack(duration = 500) {
        return new Promise((resolve) => { this.scene.cameras.main.fadeIn(duration, 0, 0, 0); this.scene.time.delayedCall(duration, resolve); });
    }
}

window.EffectsManager = EffectsManager;
window.CinematicManager = CinematicManager;
