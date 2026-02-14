// ============================================================
// GENERADOR DE SPRITES FLAT DESIGN
// Profe Alvaro cartoon + iconos energia + fondos
// ============================================================

const SpriteGenerator = {
    colors: {
        skin: '#f0c4a8',
        skinLight: '#f7dcc8',
        skinDark: '#d4a080',
        hair: '#3d2914',
        hairDark: '#2d1f0f',
        coat: '#2563eb',
        coatDark: '#1d4ed8',
        coatAccent: '#f59e0b',
        white: '#ffffff',
        black: '#1e293b',
        red: '#ef4444',
        green: '#22c55e',
        amber: '#f59e0b',
        blue: '#3b82f6'
    },

    // ==================== PROFESOR FLAT DESIGN ====================
    createProfessor(state = 'idle', frame = 0) {
        const canvas = document.createElement('canvas');
        canvas.width = 96;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const c = this.colors;

        let eyeOffsetX = 0, eyeOffsetY = 0;
        let mouthOpen = false, mouthBig = false, eyesClosed = false, eyebrowsAngry = false;
        let armLeftAngle = 0, armRightAngle = 0, bodyOffsetY = 0;

        switch (state) {
            case 'idle': eyeOffsetX = frame % 2 === 0 ? 0 : 1; break;
            case 'talk': mouthOpen = frame % 2 === 0; eyeOffsetX = Math.sin(frame * 0.5) * 2; break;
            case 'laugh': mouthOpen = true; mouthBig = true; eyesClosed = true; bodyOffsetY = frame % 2 === 0 ? -2 : 2; armLeftAngle = frame % 2 === 0 ? -10 : 10; armRightAngle = frame % 2 === 0 ? 10 : -10; break;
            case 'angry': eyebrowsAngry = true; mouthOpen = frame % 2 === 0; bodyOffsetY = frame % 2 === 0 ? -1 : 1; break;
            case 'shock': mouthOpen = true; mouthBig = true; eyeOffsetY = -2; break;
            case 'point': armRightAngle = -45; eyeOffsetX = 3; break;
            case 'victory': mouthOpen = true; eyesClosed = true; armLeftAngle = -60; armRightAngle = -60; bodyOffsetY = frame % 2 === 0 ? -3 : 0; break;
            case 'defeat': eyesClosed = true; bodyOffsetY = 5; armLeftAngle = 20; armRightAngle = 20; break;
            case 'walk': eyeOffsetX = frame % 2 === 0 ? -1 : 1; armLeftAngle = frame % 2 === 0 ? 20 : -20; armRightAngle = frame % 2 === 0 ? -20 : 20; break;
        }

        const cx = 48;
        const baseY = 20 + bodyOffsetY;

        // CUERPO - Bata azul electrico
        ctx.fillStyle = c.coat;
        this.roundRect(ctx, cx - 24, baseY + 55, 48, 50, 6);

        // Cuello de la bata
        ctx.fillStyle = c.coatDark;
        this.roundRect(ctx, cx - 20, baseY + 55, 10, 14, 3);
        this.roundRect(ctx, cx + 10, baseY + 55, 10, 14, 3);

        // Logo rayo en la bata
        ctx.fillStyle = c.coatAccent;
        ctx.beginPath();
        ctx.moveTo(cx + 2, baseY + 68);
        ctx.lineTo(cx - 3, baseY + 78);
        ctx.lineTo(cx + 1, baseY + 78);
        ctx.lineTo(cx - 2, baseY + 88);
        ctx.lineTo(cx + 5, baseY + 76);
        ctx.lineTo(cx + 1, baseY + 76);
        ctx.lineTo(cx + 4, baseY + 68);
        ctx.closePath();
        ctx.fill();

        // PIERNAS
        ctx.fillStyle = '#334155';
        this.roundRect(ctx, cx - 14, baseY + 100, 12, 20, 4);
        this.roundRect(ctx, cx + 2, baseY + 100, 12, 20, 4);

        // Zapatos
        ctx.fillStyle = '#1e293b';
        this.roundRect(ctx, cx - 16, baseY + 118, 15, 7, 3);
        this.roundRect(ctx, cx + 1, baseY + 118, 15, 7, 3);

        // BRAZOS
        this.drawArm(ctx, cx - 24, baseY + 58, armLeftAngle, true);
        this.drawArm(ctx, cx + 24, baseY + 58, armRightAngle, false);

        // CABEZA
        ctx.fillStyle = c.skin;
        this.roundRect(ctx, cx - 20, baseY + 8, 40, 46, 12);

        // Calva (highlight within head shape)
        ctx.fillStyle = c.skinLight;
        ctx.beginPath();
        ctx.ellipse(cx, baseY + 16, 15, 6, 0, Math.PI, 0);
        ctx.fill();

        // Brillo calva
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.beginPath();
        ctx.ellipse(cx - 3, baseY + 13, 6, 3, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Pelo a los lados
        ctx.fillStyle = c.hair;
        this.roundRect(ctx, cx - 23, baseY + 14, 8, 26, 4);
        this.roundRect(ctx, cx + 15, baseY + 14, 8, 26, 4);

        // Orejas
        ctx.fillStyle = c.skin;
        ctx.beginPath();
        ctx.ellipse(cx - 22, baseY + 28, 5, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 22, baseY + 28, 5, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // CARA - Cejas
        ctx.fillStyle = c.hair;
        if (eyebrowsAngry) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = c.hair;
            ctx.beginPath(); ctx.moveTo(cx - 14, baseY + 22); ctx.lineTo(cx - 5, baseY + 19); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx + 5, baseY + 19); ctx.lineTo(cx + 14, baseY + 22); ctx.stroke();
        } else {
            this.roundRect(ctx, cx - 14, baseY + 20, 10, 3, 1);
            this.roundRect(ctx, cx + 4, baseY + 20, 10, 3, 1);
        }

        // Ojos
        if (eyesClosed) {
            ctx.strokeStyle = c.hair;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(cx - 13, baseY + 29); ctx.lineTo(cx - 5, baseY + 29); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx + 5, baseY + 29); ctx.lineTo(cx + 13, baseY + 29); ctx.stroke();
        } else {
            ctx.fillStyle = c.white;
            ctx.beginPath(); ctx.ellipse(cx - 9 + eyeOffsetX * 0.3, baseY + 28 + eyeOffsetY, 6, 6, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(cx + 9 + eyeOffsetX * 0.3, baseY + 28 + eyeOffsetY, 6, 6, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = c.black;
            ctx.beginPath(); ctx.ellipse(cx - 8 + eyeOffsetX, baseY + 29 + eyeOffsetY, 3, 3.5, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(cx + 10 + eyeOffsetX, baseY + 29 + eyeOffsetY, 3, 3.5, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = c.white;
            ctx.beginPath(); ctx.arc(cx - 7 + eyeOffsetX, baseY + 27 + eyeOffsetY, 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(cx + 11 + eyeOffsetX, baseY + 27 + eyeOffsetY, 1.5, 0, Math.PI * 2); ctx.fill();
        }

        // Nariz
        ctx.fillStyle = c.skinDark;
        ctx.beginPath();
        ctx.ellipse(cx, baseY + 37, 4, 5, 0, 0, Math.PI);
        ctx.fill();

        // BARBA
        ctx.fillStyle = c.hair;
        this.roundRect(ctx, cx - 16, baseY + 42, 32, 14, 6);
        ctx.fillStyle = c.hairDark;
        this.roundRect(ctx, cx - 12, baseY + 48, 24, 10, 5);

        // Boca
        if (mouthOpen) {
            ctx.fillStyle = '#991b1b';
            const mh = mouthBig ? 8 : 5;
            this.roundRect(ctx, cx - 7, baseY + 44, 14, mh, 3);
            ctx.fillStyle = c.white;
            this.roundRect(ctx, cx - 5, baseY + 44, 10, 2, 1);
        }

        return canvas;
    },

    drawArm(ctx, x, y, angle, isLeft) {
        const c = this.colors;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);
        ctx.fillStyle = c.coat;
        if (isLeft) { this.roundRect(ctx, -12, 0, 12, 32, 5); }
        else { this.roundRect(ctx, 0, 0, 12, 32, 5); }
        ctx.fillStyle = c.skin;
        if (isLeft) { ctx.beginPath(); ctx.ellipse(-6, 36, 6, 7, 0, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.beginPath(); ctx.ellipse(6, 36, 6, 7, 0, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
    },

    roundRect(ctx, x, y, w, h, r) {
        r = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
    },

    // ==================== ICONOS DE ENERGIA ====================
    createEnergyIcon(type, size = 64) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const cx = size / 2, cy = size / 2, r = size * 0.4;

        switch (type) {
            case 'solar':
                // Sol con rayos
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath(); ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 3;
                for (let i = 0; i < 8; i++) {
                    const a = (Math.PI * 2 * i) / 8;
                    ctx.beginPath();
                    ctx.moveTo(cx + Math.cos(a) * r * 0.6, cy + Math.sin(a) * r * 0.6);
                    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
                    ctx.stroke();
                }
                // Panel
                ctx.fillStyle = '#1e40af';
                this.roundRect(ctx, cx - r * 0.6, cy + r * 0.1, r * 1.2, r * 0.7, 3);
                ctx.strokeStyle = '#93c5fd';
                ctx.lineWidth = 1;
                ctx.strokeRect(cx - r * 0.5, cy + r * 0.2, r * 0.45, r * 0.2);
                ctx.strokeRect(cx + r * 0.05, cy + r * 0.2, r * 0.45, r * 0.2);
                ctx.strokeRect(cx - r * 0.5, cy + r * 0.45, r * 0.45, r * 0.2);
                ctx.strokeRect(cx + r * 0.05, cy + r * 0.45, r * 0.45, r * 0.2);
                break;

            case 'wind':
                // Aerogenerador
                ctx.fillStyle = '#94a3b8';
                ctx.fillRect(cx - 2, cy, 4, r);
                // Nacelle
                ctx.fillStyle = '#e2e8f0';
                this.roundRect(ctx, cx - 5, cy - 3, 10, 8, 3);
                // Aspas
                ctx.fillStyle = '#f8fafc';
                ctx.lineWidth = 1;
                for (let i = 0; i < 3; i++) {
                    ctx.save();
                    ctx.translate(cx, cy);
                    ctx.rotate((Math.PI * 2 * i) / 3);
                    ctx.beginPath();
                    ctx.ellipse(0, -r * 0.7, 3, r * 0.7, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
                // Base
                ctx.fillStyle = '#64748b';
                this.roundRect(ctx, cx - 8, cy + r - 4, 16, 6, 2);
                break;

            case 'hydro':
                // Presa
                ctx.fillStyle = '#64748b';
                ctx.beginPath();
                ctx.moveTo(cx - r, cy - r * 0.3);
                ctx.lineTo(cx - r * 0.7, cy + r * 0.5);
                ctx.lineTo(cx + r * 0.7, cy + r * 0.5);
                ctx.lineTo(cx + r, cy - r * 0.3);
                ctx.closePath();
                ctx.fill();
                // Agua
                ctx.fillStyle = '#3b82f6';
                ctx.beginPath();
                ctx.moveTo(cx - r, cy - r * 0.3);
                ctx.lineTo(cx + r, cy - r * 0.3);
                ctx.lineTo(cx + r, cy - r);
                ctx.lineTo(cx - r, cy - r);
                ctx.closePath();
                ctx.fill();
                // Caida de agua
                ctx.fillStyle = '#93c5fd';
                ctx.fillRect(cx - 3, cy + r * 0.2, 6, r * 0.5);
                // Olas
                ctx.strokeStyle = '#60a5fa';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let x = cx - r * 0.8; x < cx + r * 0.8; x += 8) {
                    ctx.moveTo(x, cy + r * 0.7);
                    ctx.quadraticCurveTo(x + 4, cy + r * 0.6, x + 8, cy + r * 0.7);
                }
                ctx.stroke();
                break;

            case 'coal':
                // Chimenea
                ctx.fillStyle = '#78716c';
                this.roundRect(ctx, cx - r * 0.3, cy - r * 0.8, r * 0.3, r * 1.2, 3);
                this.roundRect(ctx, cx + r * 0.1, cy - r * 0.6, r * 0.25, r, 3);
                // Edificio
                ctx.fillStyle = '#57534e';
                this.roundRect(ctx, cx - r * 0.7, cy + r * 0.1, r * 1.4, r * 0.7, 4);
                // Humo
                ctx.fillStyle = 'rgba(100,100,100,0.6)';
                ctx.beginPath(); ctx.arc(cx - r * 0.15, cy - r * 0.9, 5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx - r * 0.05, cy - r, 7, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx + r * 0.1, cy - r * 0.95, 6, 0, Math.PI * 2); ctx.fill();
                break;

            case 'gas':
                // Llama
                ctx.fillStyle = '#f97316';
                ctx.beginPath();
                ctx.moveTo(cx, cy - r * 0.6);
                ctx.quadraticCurveTo(cx + r * 0.5, cy - r * 0.2, cx + r * 0.3, cy + r * 0.2);
                ctx.quadraticCurveTo(cx, cy, cx - r * 0.3, cy + r * 0.2);
                ctx.quadraticCurveTo(cx - r * 0.5, cy - r * 0.2, cx, cy - r * 0.6);
                ctx.fill();
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.moveTo(cx, cy - r * 0.3);
                ctx.quadraticCurveTo(cx + r * 0.25, cy, cx + r * 0.15, cy + r * 0.2);
                ctx.quadraticCurveTo(cx, cy + r * 0.1, cx - r * 0.15, cy + r * 0.2);
                ctx.quadraticCurveTo(cx - r * 0.25, cy, cx, cy - r * 0.3);
                ctx.fill();
                // Tuberia
                ctx.fillStyle = '#6b7280';
                this.roundRect(ctx, cx - r * 0.6, cy + r * 0.3, r * 1.2, r * 0.2, 3);
                ctx.fillStyle = '#9ca3af';
                ctx.beginPath(); ctx.arc(cx, cy + r * 0.3, r * 0.15, 0, Math.PI * 2); ctx.fill();
                break;

            case 'nuclear':
                // Simbolo radiacion simplificado
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath(); ctx.arc(cx, cy, r * 0.2, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#f59e0b';
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    const startA = (Math.PI * 2 * i) / 3 - 0.4;
                    const endA = startA + 0.8;
                    ctx.arc(cx, cy, r * 0.8, startA, endA);
                    ctx.arc(cx, cy, r * 0.35, endA, startA, true);
                    ctx.closePath();
                    ctx.fill();
                }
                // Torre refrigeracion
                ctx.fillStyle = '#d1d5db';
                ctx.beginPath();
                ctx.moveTo(cx - r * 0.4, cy + r);
                ctx.quadraticCurveTo(cx - r * 0.2, cy + r * 0.5, cx - r * 0.3, cy + r * 0.2);
                ctx.lineTo(cx + r * 0.3, cy + r * 0.2);
                ctx.quadraticCurveTo(cx + r * 0.2, cy + r * 0.5, cx + r * 0.4, cy + r);
                ctx.closePath();
                ctx.fill();
                break;

            case 'oil':
                // Barril
                ctx.fillStyle = '#1e293b';
                this.roundRect(ctx, cx - r * 0.4, cy - r * 0.5, r * 0.8, r * 1.2, 5);
                // Bandas
                ctx.fillStyle = '#475569';
                this.roundRect(ctx, cx - r * 0.4, cy - r * 0.4, r * 0.8, 4, 2);
                this.roundRect(ctx, cx - r * 0.4, cy + r * 0.4, r * 0.8, 4, 2);
                // Gota
                ctx.fillStyle = '#0f172a';
                ctx.beginPath();
                ctx.moveTo(cx, cy - r * 0.1);
                ctx.quadraticCurveTo(cx + r * 0.2, cy + r * 0.1, cx, cy + r * 0.25);
                ctx.quadraticCurveTo(cx - r * 0.2, cy + r * 0.1, cx, cy - r * 0.1);
                ctx.fill();
                break;

            case 'biomass':
                // Arbol/hoja
                ctx.fillStyle = '#16a34a';
                ctx.beginPath(); ctx.arc(cx, cy - r * 0.2, r * 0.45, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx - r * 0.25, cy, r * 0.35, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx + r * 0.25, cy, r * 0.35, 0, Math.PI * 2); ctx.fill();
                // Tronco
                ctx.fillStyle = '#92400e';
                this.roundRect(ctx, cx - 4, cy + r * 0.15, 8, r * 0.6, 3);
                // Flecha reciclaje
                ctx.strokeStyle = '#22c55e';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(cx, cy + r * 0.8, 6, 0, Math.PI * 1.5);
                ctx.stroke();
                break;

            case 'geothermal':
                // Tierra con calor
                ctx.fillStyle = '#92400e';
                ctx.beginPath();
                ctx.moveTo(cx - r, cy + r * 0.2);
                ctx.lineTo(cx + r, cy + r * 0.2);
                ctx.lineTo(cx + r, cy + r);
                ctx.lineTo(cx - r, cy + r);
                ctx.closePath();
                ctx.fill();
                // Superficie verde
                ctx.fillStyle = '#22c55e';
                ctx.fillRect(cx - r, cy + r * 0.15, r * 2, 6);
                // Magma
                ctx.fillStyle = '#ef4444';
                ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.7, r * 0.5, r * 0.2, 0, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#f97316';
                ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.65, r * 0.3, r * 0.12, 0, 0, Math.PI * 2); ctx.fill();
                // Vapor
                ctx.strokeStyle = 'rgba(200,200,200,0.7)';
                ctx.lineWidth = 2;
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(cx - 8 + i * 8, cy + r * 0.1);
                    ctx.quadraticCurveTo(cx - 4 + i * 8, cy - r * 0.2, cx - 8 + i * 8, cy - r * 0.4);
                    ctx.stroke();
                }
                break;
        }
        return canvas;
    },

    // ==================== FONDOS DE NIVEL ====================
    createCityBackground(level) {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        const levelData = GAME_DATA.niveles[level - 1];
        const colors = this.getLevelColors(level);

        // Cielo
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 350);
        skyGrad.addColorStop(0, colors.skyTop);
        skyGrad.addColorStop(1, colors.skyBottom);
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 800, 350);

        // Sol o luna segun nivel
        if (level === 4) {
            // Luna roja (desastre)
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(680, 80, 35, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = colors.skyTop;
            ctx.beginPath(); ctx.arc(690, 75, 30, 0, Math.PI * 2); ctx.fill();
        } else {
            // Sol
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(680, 80, 30, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fde68a';
            ctx.beginPath(); ctx.arc(680, 80, 22, 0, Math.PI * 2); ctx.fill();
        }

        // Nubes
        if (level !== 4) {
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            this.drawCloud(ctx, 100, 60, 60);
            this.drawCloud(ctx, 350, 90, 45);
            this.drawCloud(ctx, 550, 50, 55);
        } else {
            // Nubes contaminadas
            ctx.fillStyle = 'rgba(100,80,60,0.7)';
            this.drawCloud(ctx, 100, 60, 70);
            this.drawCloud(ctx, 300, 40, 80);
            this.drawCloud(ctx, 500, 70, 65);
            this.drawCloud(ctx, 650, 50, 75);
        }

        // Colinas
        ctx.fillStyle = colors.hills;
        ctx.beginPath();
        ctx.moveTo(0, 350);
        ctx.quadraticCurveTo(200, 280, 400, 320);
        ctx.quadraticCurveTo(600, 290, 800, 340);
        ctx.lineTo(800, 380);
        ctx.lineTo(0, 380);
        ctx.closePath();
        ctx.fill();

        // Edificios de la ciudad
        this.drawCityBuildings(ctx, colors, level);

        // Suelo
        ctx.fillStyle = colors.ground;
        ctx.fillRect(0, 450, 800, 150);

        // Carretera
        ctx.fillStyle = '#374151';
        ctx.fillRect(0, 445, 800, 25);
        // Linea discontinua
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.setLineDash([20, 15]);
        ctx.beginPath(); ctx.moveTo(0, 457); ctx.lineTo(800, 457); ctx.stroke();
        ctx.setLineDash([]);

        // Arboles si no es desastre
        if (level !== 4) {
            this.drawTree(ctx, 50, 430, colors.tree);
            this.drawTree(ctx, 750, 435, colors.tree);
            this.drawTree(ctx, 200, 440, colors.tree);
            this.drawTree(ctx, 600, 438, colors.tree);
        } else {
            // Arboles secos
            this.drawDeadTree(ctx, 50, 430);
            this.drawDeadTree(ctx, 750, 435);
        }

        return canvas;
    },

    getLevelColors(level) {
        switch (level) {
            case 1: return { skyTop: '#1e3a5f', skyBottom: '#3b82f6', hills: '#1e40af', ground: '#334155', tree: '#22c55e', buildings: '#1e293b' };
            case 2: return { skyTop: '#064e3b', skyBottom: '#059669', hills: '#047857', ground: '#1e3a2e', tree: '#16a34a', buildings: '#1e293b' };
            case 3: return { skyTop: '#78350f', skyBottom: '#d97706', hills: '#92400e', ground: '#451a03', tree: '#65a30d', buildings: '#292524' };
            case 4: return { skyTop: '#450a0a', skyBottom: '#991b1b', hills: '#7f1d1d', ground: '#292524', tree: '#4b5563', buildings: '#1c1917' };
            case 5: return { skyTop: '#064e3b', skyBottom: '#10b981', hills: '#059669', ground: '#1e3a2e', tree: '#22c55e', buildings: '#1e293b' };
            default: return this.getLevelColors(1);
        }
    },

    drawCloud(ctx, x, y, size) {
        ctx.beginPath();
        ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
        ctx.arc(x + size * 0.3, y - size * 0.15, size * 0.35, 0, Math.PI * 2);
        ctx.arc(x + size * 0.6, y, size * 0.3, 0, Math.PI * 2);
        ctx.arc(x + size * 0.3, y + size * 0.1, size * 0.25, 0, Math.PI * 2);
        ctx.fill();
    },

    drawCityBuildings(ctx, colors, level) {
        const buildings = [
            { x: 80, w: 50, h: 120 }, { x: 140, w: 40, h: 90 }, { x: 190, w: 60, h: 150 },
            { x: 280, w: 45, h: 100 }, { x: 340, w: 55, h: 130 }, { x: 410, w: 50, h: 110 },
            { x: 480, w: 65, h: 160 }, { x: 560, w: 40, h: 85 }, { x: 620, w: 50, h: 120 },
            { x: 690, w: 45, h: 95 }
        ];

        buildings.forEach(b => {
            const baseY = 445 - b.h;
            // Edificio
            ctx.fillStyle = colors.buildings;
            this.roundRect(ctx, b.x, baseY, b.w, b.h, 3);
            // Ventanas
            const windowColor = level === 1 ? '#0f172a' : '#fbbf24';
            ctx.fillStyle = windowColor;
            for (let wy = baseY + 10; wy < 445 - 15; wy += 18) {
                for (let wx = b.x + 6; wx < b.x + b.w - 8; wx += 14) {
                    ctx.fillRect(wx, wy, 8, 10);
                }
            }
        });

        // Energia renovable en edificios (niveles 2+)
        if (level >= 2) {
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(195, 445 - 155, 50, 5);
            // Aerogenerador en edificio alto
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(510, 445 - 175, 3, 15);
            ctx.fillStyle = '#f8fafc';
            for (let i = 0; i < 3; i++) {
                ctx.save();
                ctx.translate(511, 445 - 175);
                ctx.rotate((Math.PI * 2 * i) / 3);
                ctx.fillRect(-1, -12, 2, 12);
                ctx.restore();
            }
        }
    },

    drawTree(ctx, x, y, color) {
        ctx.fillStyle = '#92400e';
        this.roundRect(ctx, x - 3, y, 6, 18, 2);
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(x, y - 5, 12, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x - 6, y, 9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + 6, y, 9, 0, Math.PI * 2); ctx.fill();
    },

    drawDeadTree(ctx, x, y) {
        ctx.strokeStyle = '#78716c';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x, y + 15); ctx.lineTo(x, y - 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.lineTo(x - 10, y - 15); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 8, y - 10); ctx.stroke();
    },

    // ==================== PARTICULAS ====================
    createParticle(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');

        switch (type) {
            case 'star':
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                    const ra = a + Math.PI / 5;
                    ctx.lineTo(8 + Math.cos(a) * 7, 8 + Math.sin(a) * 7);
                    ctx.lineTo(8 + Math.cos(ra) * 3, 8 + Math.sin(ra) * 3);
                }
                ctx.closePath();
                ctx.fill();
                break;
            case 'spark':
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath(); ctx.arc(8, 8, 4, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#fef3c7';
                ctx.beginPath(); ctx.arc(8, 8, 2, 0, Math.PI * 2); ctx.fill();
                break;
            case 'smoke':
                ctx.fillStyle = 'rgba(100,100,100,0.5)';
                ctx.beginPath(); ctx.arc(8, 8, 6, 0, Math.PI * 2); ctx.fill();
                break;
            case 'leaf':
                ctx.fillStyle = '#22c55e';
                ctx.beginPath();
                ctx.ellipse(8, 8, 3, 6, 0.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#16a34a';
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(8, 3); ctx.lineTo(8, 13); ctx.stroke();
                break;
            case 'heart':
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.moveTo(8, 14);
                ctx.bezierCurveTo(2, 9, 0, 5, 4, 3);
                ctx.bezierCurveTo(6, 2, 8, 4, 8, 6);
                ctx.bezierCurveTo(8, 4, 10, 2, 12, 3);
                ctx.bezierCurveTo(16, 5, 14, 9, 8, 14);
                ctx.fill();
                break;
            case 'heartEmpty':
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(8, 13);
                ctx.bezierCurveTo(3, 9, 1, 5, 4, 3);
                ctx.bezierCurveTo(6, 2, 8, 4, 8, 6);
                ctx.bezierCurveTo(8, 4, 10, 2, 12, 3);
                ctx.bezierCurveTo(15, 5, 13, 9, 8, 13);
                ctx.stroke();
                break;
            case 'lightning':
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.moveTo(10, 0); ctx.lineTo(4, 7); ctx.lineTo(8, 7);
                ctx.lineTo(6, 16); ctx.lineTo(12, 8); ctx.lineTo(8, 8); ctx.lineTo(10, 0);
                ctx.fill();
                break;
            case 'confetti':
                const confettiColors = ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#a855f7'];
                ctx.fillStyle = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                this.roundRect(ctx, 4, 4, 8, 8, 2);
                break;
            case 'drop':
                ctx.fillStyle = '#3b82f6';
                ctx.beginPath();
                ctx.moveTo(8, 2);
                ctx.quadraticCurveTo(14, 10, 8, 14);
                ctx.quadraticCurveTo(2, 10, 8, 2);
                ctx.fill();
                break;
        }
        return canvas;
    },

    // ==================== ICONOS DE ESCENARIOS (Nivel 1) ====================
    createScenarioIcon(type, size = 80) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const cx = size / 2, cy = size / 2, r = size * 0.38;

        switch (type) {
            case 'ball':
                // Pelota roja rodando
                ctx.fillStyle = '#ef4444';
                ctx.beginPath(); ctx.arc(cx, cy - 2, r * 0.6, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#dc2626';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(cx, cy - 2, r * 0.6, 0, Math.PI * 2); ctx.stroke();
                // Linea decorativa
                ctx.beginPath();
                ctx.ellipse(cx, cy - 2, r * 0.6, r * 0.15, 0.3, 0, Math.PI * 2);
                ctx.stroke();
                // Brillo
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.beginPath(); ctx.arc(cx - 5, cy - 9, r * 0.2, 0, Math.PI * 2); ctx.fill();
                // Superficie inclinada
                ctx.strokeStyle = '#64748b';
                ctx.lineWidth = 3;
                ctx.beginPath(); ctx.moveTo(cx - r, cy + r * 0.5); ctx.lineTo(cx + r, cy + r * 0.8); ctx.stroke();
                // Flechita movimiento
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(cx + r * 0.2, cy - 4); ctx.lineTo(cx + r * 0.7, cy + 2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + r * 0.7, cy + 2); ctx.lineTo(cx + r * 0.5, cy - 2); ctx.stroke();
                break;

            case 'lightbulb':
                // Bombilla
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath(); ctx.arc(cx, cy - r * 0.15, r * 0.45, 0, Math.PI * 2); ctx.fill();
                // Brillo
                ctx.fillStyle = '#fef3c7';
                ctx.beginPath(); ctx.arc(cx, cy - r * 0.15, r * 0.3, 0, Math.PI * 2); ctx.fill();
                // Rayos de luz
                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 2;
                for (let i = 0; i < 6; i++) {
                    const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                    ctx.beginPath();
                    ctx.moveTo(cx + Math.cos(a) * r * 0.55, cy - r * 0.15 + Math.sin(a) * r * 0.55);
                    ctx.lineTo(cx + Math.cos(a) * r * 0.75, cy - r * 0.15 + Math.sin(a) * r * 0.75);
                    ctx.stroke();
                }
                // Base
                ctx.fillStyle = '#9ca3af';
                this.roundRect(ctx, cx - 7, cy + r * 0.25, 14, 10, 2);
                ctx.fillStyle = '#6b7280';
                this.roundRect(ctx, cx - 5, cy + r * 0.55, 10, 6, 2);
                break;

            case 'spring':
                // Muelle comprimido
                ctx.strokeStyle = '#6b7280';
                ctx.lineWidth = 3;
                const springY = cy - r * 0.4;
                const springH = r * 0.8;
                const coils = 5;
                for (let i = 0; i < coils; i++) {
                    const y1 = springY + (i * springH) / coils;
                    const y2 = y1 + springH / coils * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(cx - r * 0.3, y1);
                    ctx.lineTo(cx + r * 0.3, y2);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(cx + r * 0.3, y2);
                    ctx.lineTo(cx - r * 0.3, y2 + springH / coils * 0.5);
                    ctx.stroke();
                }
                // Flechas compresion
                ctx.fillStyle = '#ef4444';
                ctx.beginPath(); ctx.moveTo(cx, springY - 8); ctx.lineTo(cx - 5, springY - 14); ctx.lineTo(cx + 5, springY - 14); ctx.fill();
                ctx.beginPath(); ctx.moveTo(cx, cy + r * 0.5); ctx.lineTo(cx - 5, cy + r * 0.5 + 6); ctx.lineTo(cx + 5, cy + r * 0.5 + 6); ctx.fill();
                break;

            case 'pot':
                // Olla con vapor
                ctx.fillStyle = '#78716c';
                this.roundRect(ctx, cx - r * 0.5, cy - r * 0.1, r, r * 0.7, 5);
                // Tapa
                ctx.fillStyle = '#a8a29e';
                this.roundRect(ctx, cx - r * 0.55, cy - r * 0.15, r * 1.1, 6, 3);
                // Asa tapa
                ctx.fillStyle = '#57534e';
                ctx.beginPath(); ctx.arc(cx, cy - r * 0.2, 4, 0, Math.PI * 2); ctx.fill();
                // Asas
                ctx.strokeStyle = '#57534e';
                ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(cx - r * 0.55, cy + r * 0.15, 6, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
                ctx.beginPath(); ctx.arc(cx + r * 0.55, cy + r * 0.15, 6, -Math.PI * 0.5, Math.PI * 0.5); ctx.stroke();
                // Vapor
                ctx.strokeStyle = 'rgba(200,200,200,0.6)';
                ctx.lineWidth = 2;
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(cx - 8 + i * 8, cy - r * 0.3);
                    ctx.quadraticCurveTo(cx - 4 + i * 8, cy - r * 0.6, cx - 8 + i * 8, cy - r * 0.8);
                    ctx.stroke();
                }
                // Fuego debajo
                ctx.fillStyle = '#f97316';
                ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.65, r * 0.3, 5, 0, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.63, r * 0.15, 3, 0, 0, Math.PI * 2); ctx.fill();
                break;

            case 'food':
                // Bocadillo / sandwich
                ctx.fillStyle = '#d97706';
                ctx.beginPath();
                ctx.ellipse(cx, cy - 4, r * 0.6, r * 0.2, 0, Math.PI, 0);
                ctx.fill();
                // Pan superior con textura
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.ellipse(cx, cy - 6, r * 0.55, r * 0.25, 0, Math.PI, 0);
                ctx.fill();
                // Semillas
                ctx.fillStyle = '#fef3c7';
                ctx.beginPath(); ctx.arc(cx - 6, cy - 14, 1.5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx + 4, cy - 12, 1.5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx - 2, cy - 16, 1.5, 0, Math.PI * 2); ctx.fill();
                // Relleno
                ctx.fillStyle = '#22c55e';
                this.roundRect(ctx, cx - r * 0.5, cy - 5, r, 4, 1); // lechuga
                ctx.fillStyle = '#ef4444';
                this.roundRect(ctx, cx - r * 0.45, cy - 2, r * 0.9, 3, 1); // tomate
                ctx.fillStyle = '#fbbf24';
                this.roundRect(ctx, cx - r * 0.4, cy + 1, r * 0.8, 3, 1); // queso
                // Pan inferior
                ctx.fillStyle = '#d97706';
                ctx.beginPath();
                ctx.ellipse(cx, cy + 6, r * 0.55, r * 0.15, 0, 0, Math.PI);
                ctx.fill();
                break;

            case 'book':
                // Libro en estanteria
                // Estanteria
                ctx.fillStyle = '#78350f';
                this.roundRect(ctx, cx - r * 0.8, cy + r * 0.3, r * 1.6, 5, 2);
                // Libro
                ctx.fillStyle = '#2563eb';
                this.roundRect(ctx, cx - r * 0.25, cy - r * 0.4, r * 0.5, r * 0.7, 3);
                // Lomo
                ctx.fillStyle = '#1d4ed8';
                this.roundRect(ctx, cx - r * 0.25, cy - r * 0.4, 5, r * 0.7, 2);
                // Titulo
                ctx.fillStyle = '#93c5fd';
                this.roundRect(ctx, cx - r * 0.1, cy - r * 0.2, r * 0.25, 3, 1);
                this.roundRect(ctx, cx - r * 0.1, cy - r * 0.05, r * 0.2, 3, 1);
                // Flecha mostrando altura
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(cx + r * 0.5, cy + r * 0.25); ctx.lineTo(cx + r * 0.5, cy - r * 0.6); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + r * 0.5, cy - r * 0.6); ctx.lineTo(cx + r * 0.4, cy - r * 0.45); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + r * 0.5, cy - r * 0.6); ctx.lineTo(cx + r * 0.6, cy - r * 0.45); ctx.stroke();
                break;

            case 'drum':
                // Tambor
                ctx.fillStyle = '#dc2626';
                ctx.beginPath();
                ctx.ellipse(cx, cy + r * 0.15, r * 0.5, r * 0.3, 0, 0, Math.PI);
                ctx.fill();
                this.roundRect(ctx, cx - r * 0.5, cy - r * 0.15, r, r * 0.3, 0);
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.ellipse(cx, cy - r * 0.15, r * 0.5, r * 0.2, 0, 0, Math.PI * 2);
                ctx.fill();
                // Decoracion zigzag
                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const xp = cx - r * 0.4 + i * r * 0.2;
                    ctx.lineTo(xp, i % 2 === 0 ? cy - r * 0.05 : cy + r * 0.1);
                }
                ctx.stroke();
                // Baquetas
                ctx.strokeStyle = '#d97706';
                ctx.lineWidth = 3;
                ctx.beginPath(); ctx.moveTo(cx - r * 0.6, cy - r * 0.6); ctx.lineTo(cx - r * 0.1, cy - r * 0.2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + r * 0.6, cy - r * 0.6); ctx.lineTo(cx + r * 0.1, cy - r * 0.2); ctx.stroke();
                // Ondas sonido
                ctx.strokeStyle = 'rgba(251,191,36,0.5)';
                ctx.lineWidth = 1.5;
                for (let i = 1; i <= 3; i++) {
                    ctx.beginPath();
                    ctx.arc(cx + r * 0.5, cy - r * 0.4, i * 5, -0.5, 0.5);
                    ctx.stroke();
                }
                break;

            case 'battery':
                // Pila
                ctx.fillStyle = '#1e293b';
                this.roundRect(ctx, cx - r * 0.3, cy - r * 0.5, r * 0.6, r, 4);
                // Polo positivo
                ctx.fillStyle = '#9ca3af';
                this.roundRect(ctx, cx - r * 0.1, cy - r * 0.6, r * 0.2, r * 0.12, 2);
                // Franja
                ctx.fillStyle = '#22c55e';
                this.roundRect(ctx, cx - r * 0.25, cy - r * 0.25, r * 0.5, r * 0.3, 2);
                // Simbolo +
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(cx - 5, cy - r * 0.15, 10, 3);
                ctx.fillRect(cx - 1.5, cy - r * 0.25, 3, 10);
                // Rayito
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.moveTo(cx + 2, cy + r * 0.15); ctx.lineTo(cx - 2, cy + r * 0.3);
                ctx.lineTo(cx + 1, cy + r * 0.3); ctx.lineTo(cx - 2, cy + r * 0.45);
                ctx.lineTo(cx + 3, cy + r * 0.28); ctx.lineTo(cx, cy + r * 0.28);
                ctx.closePath(); ctx.fill();
                break;

            case 'car':
                // Coche
                ctx.fillStyle = '#3b82f6';
                this.roundRect(ctx, cx - r * 0.7, cy - r * 0.05, r * 1.4, r * 0.45, 5);
                // Techo
                ctx.fillStyle = '#2563eb';
                this.roundRect(ctx, cx - r * 0.35, cy - r * 0.4, r * 0.8, r * 0.4, 5);
                // Ventanas
                ctx.fillStyle = '#93c5fd';
                this.roundRect(ctx, cx - r * 0.25, cy - r * 0.32, r * 0.3, r * 0.22, 3);
                this.roundRect(ctx, cx + r * 0.1, cy - r * 0.32, r * 0.25, r * 0.22, 3);
                // Ruedas
                ctx.fillStyle = '#1e293b';
                ctx.beginPath(); ctx.arc(cx - r * 0.35, cy + r * 0.4, r * 0.15, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx + r * 0.35, cy + r * 0.4, r * 0.15, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#9ca3af';
                ctx.beginPath(); ctx.arc(cx - r * 0.35, cy + r * 0.4, r * 0.07, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx + r * 0.35, cy + r * 0.4, r * 0.07, 0, Math.PI * 2); ctx.fill();
                // Lineas velocidad
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(cx - r * 0.8, cy - r * 0.1); ctx.lineTo(cx - r, cy - r * 0.1); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx - r * 0.85, cy + r * 0.1); ctx.lineTo(cx - r, cy + r * 0.1); ctx.stroke();
                break;

            case 'sun':
                // Sol grande
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath(); ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#fef3c7';
                ctx.beginPath(); ctx.arc(cx, cy, r * 0.25, 0, Math.PI * 2); ctx.fill();
                // Rayos
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 3;
                for (let i = 0; i < 8; i++) {
                    const a = (Math.PI * 2 * i) / 8;
                    ctx.beginPath();
                    ctx.moveTo(cx + Math.cos(a) * r * 0.5, cy + Math.sin(a) * r * 0.5);
                    ctx.lineTo(cx + Math.cos(a) * r * 0.8, cy + Math.sin(a) * r * 0.8);
                    ctx.stroke();
                }
                // Ondas calor
                ctx.strokeStyle = 'rgba(249,115,22,0.4)';
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.arc(cx, cy, r * 0.9, 0, Math.PI * 2); ctx.stroke();
                break;

            case 'rubber':
                // Goma elastica estirada
                ctx.strokeStyle = '#a855f7';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(cx - r * 0.6, cy - r * 0.2);
                ctx.quadraticCurveTo(cx, cy + r * 0.4, cx + r * 0.6, cy - r * 0.2);
                ctx.stroke();
                // Dedos sujetando
                ctx.fillStyle = '#f0c4a8';
                ctx.beginPath(); ctx.arc(cx - r * 0.6, cy - r * 0.2, 5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx + r * 0.6, cy - r * 0.2, 5, 0, Math.PI * 2); ctx.fill();
                // Flechas de tension
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(cx - r * 0.3, cy - r * 0.3); ctx.lineTo(cx - r * 0.6, cy - r * 0.3); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + r * 0.3, cy - r * 0.3); ctx.lineTo(cx + r * 0.6, cy - r * 0.3); ctx.stroke();
                // Flechitas
                ctx.beginPath(); ctx.moveTo(cx - r * 0.6, cy - r * 0.3); ctx.lineTo(cx - r * 0.5, cy - r * 0.38); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx - r * 0.6, cy - r * 0.3); ctx.lineTo(cx - r * 0.5, cy - r * 0.22); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + r * 0.6, cy - r * 0.3); ctx.lineTo(cx + r * 0.5, cy - r * 0.38); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + r * 0.6, cy - r * 0.3); ctx.lineTo(cx + r * 0.5, cy - r * 0.22); ctx.stroke();
                break;

            case 'fire':
                // Hoguera
                // Lenos
                ctx.fillStyle = '#92400e';
                ctx.save(); ctx.translate(cx, cy + r * 0.3); ctx.rotate(-0.3);
                this.roundRect(ctx, -r * 0.4, -3, r * 0.8, 6, 3); ctx.restore();
                ctx.save(); ctx.translate(cx, cy + r * 0.3); ctx.rotate(0.3);
                this.roundRect(ctx, -r * 0.4, -3, r * 0.8, 6, 3); ctx.restore();
                // Llama exterior
                ctx.fillStyle = '#f97316';
                ctx.beginPath();
                ctx.moveTo(cx, cy - r * 0.7);
                ctx.quadraticCurveTo(cx + r * 0.5, cy - r * 0.2, cx + r * 0.35, cy + r * 0.2);
                ctx.quadraticCurveTo(cx, cy + r * 0.1, cx - r * 0.35, cy + r * 0.2);
                ctx.quadraticCurveTo(cx - r * 0.5, cy - r * 0.2, cx, cy - r * 0.7);
                ctx.fill();
                // Llama interior
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.moveTo(cx, cy - r * 0.35);
                ctx.quadraticCurveTo(cx + r * 0.25, cy, cx + r * 0.15, cy + r * 0.15);
                ctx.quadraticCurveTo(cx, cy + r * 0.1, cx - r * 0.15, cy + r * 0.15);
                ctx.quadraticCurveTo(cx - r * 0.25, cy, cx, cy - r * 0.35);
                ctx.fill();
                // Chispas
                ctx.fillStyle = '#fef3c7';
                ctx.beginPath(); ctx.arc(cx - r * 0.2, cy - r * 0.5, 2, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx + r * 0.15, cy - r * 0.6, 1.5, 0, Math.PI * 2); ctx.fill();
                break;

            case 'plane':
                // Avion
                ctx.fillStyle = '#e2e8f0';
                // Fuselaje
                ctx.beginPath();
                ctx.ellipse(cx, cy, r * 0.7, r * 0.15, -0.1, 0, Math.PI * 2);
                ctx.fill();
                // Alas
                ctx.fillStyle = '#94a3b8';
                ctx.beginPath();
                ctx.moveTo(cx - r * 0.1, cy);
                ctx.lineTo(cx - r * 0.15, cy + r * 0.55);
                ctx.lineTo(cx + r * 0.2, cy);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(cx - r * 0.1, cy);
                ctx.lineTo(cx - r * 0.15, cy - r * 0.55);
                ctx.lineTo(cx + r * 0.2, cy);
                ctx.closePath();
                ctx.fill();
                // Cola
                ctx.fillStyle = '#94a3b8';
                ctx.beginPath();
                ctx.moveTo(cx - r * 0.6, cy);
                ctx.lineTo(cx - r * 0.7, cy - r * 0.3);
                ctx.lineTo(cx - r * 0.4, cy);
                ctx.closePath();
                ctx.fill();
                // Ventanas
                ctx.fillStyle = '#3b82f6';
                for (let i = 0; i < 4; i++) {
                    ctx.beginPath(); ctx.arc(cx - r * 0.2 + i * r * 0.15, cy - 1, 2, 0, Math.PI * 2); ctx.fill();
                }
                // Flecha altura
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([3, 3]);
                ctx.beginPath(); ctx.moveTo(cx + r * 0.5, cy + r * 0.7); ctx.lineTo(cx + r * 0.5, cy + r * 0.2); ctx.stroke();
                ctx.setLineDash([]);
                // Texto altura
                ctx.fillStyle = '#f59e0b';
                ctx.font = 'bold 8px Nunito';
                ctx.textAlign = 'center';
                ctx.fillText('10km', cx + r * 0.5, cy + r * 0.85);
                break;

            default:
                // Icono generico - signo de interrogacion
                ctx.fillStyle = 'rgba(100,116,139,0.3)';
                ctx.beginPath(); ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#94a3b8';
                ctx.font = `bold ${size * 0.4}px Nunito`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('?', cx, cy);
                break;
        }
        return canvas;
    },

    // ==================== ICONOS EXTRA ENERGIA (Nivel 2 cartas adicionales) ====================
    createEnergyIconExtra(type, size = 64) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const cx = size / 2, cy = size / 2, r = size * 0.4;

        switch (type) {
            case 'wave':
            case 'wave2':
                // Energia de mareas/olas
                ctx.fillStyle = '#1e40af';
                ctx.fillRect(0, cy, size, size / 2);
                // Olas
                ctx.fillStyle = '#3b82f6';
                ctx.beginPath();
                ctx.moveTo(0, cy);
                for (let x = 0; x <= size; x += 4) {
                    ctx.lineTo(x, cy - Math.sin(x * 0.12) * 8 - 4);
                }
                ctx.lineTo(size, cy + 10); ctx.lineTo(0, cy + 10);
                ctx.fill();
                ctx.fillStyle = '#60a5fa';
                ctx.beginPath();
                ctx.moveTo(0, cy + 5);
                for (let x = 0; x <= size; x += 4) {
                    ctx.lineTo(x, cy + 5 - Math.sin(x * 0.1 + 1) * 6);
                }
                ctx.lineTo(size, cy + 15); ctx.lineTo(0, cy + 15);
                ctx.fill();
                // Turbina submarina
                ctx.fillStyle = '#64748b';
                ctx.fillRect(cx - 2, cy + 5, 4, 15);
                ctx.fillStyle = '#94a3b8';
                for (let i = 0; i < 3; i++) {
                    ctx.save(); ctx.translate(cx, cy + 5);
                    ctx.rotate((Math.PI * 2 * i) / 3);
                    ctx.fillRect(-2, -10, 4, 10);
                    ctx.restore();
                }
                break;

            case 'solar_thermal':
                // Solar termica (espejos concentradores)
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath(); ctx.arc(cx, cy - r * 0.3, r * 0.2, 0, Math.PI * 2); ctx.fill();
                // Torre
                ctx.fillStyle = '#6b7280';
                ctx.fillRect(cx - 3, cy - r * 0.1, 6, r * 0.8);
                // Espejos
                ctx.fillStyle = '#93c5fd';
                for (let i = -2; i <= 2; i++) {
                    if (i === 0) continue;
                    ctx.save(); ctx.translate(cx + i * 12, cy + r * 0.5);
                    ctx.rotate(i * 0.2);
                    this.roundRect(ctx, -5, -2, 10, 4, 1);
                    ctx.restore();
                }
                // Rayos hacia torre
                ctx.strokeStyle = 'rgba(251,191,36,0.4)';
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(cx - 24, cy + r * 0.5); ctx.lineTo(cx, cy - r * 0.2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + 24, cy + r * 0.5); ctx.lineTo(cx, cy - r * 0.2); ctx.stroke();
                break;

            case 'wind_offshore':
                // Eolica marina
                ctx.fillStyle = '#3b82f6';
                ctx.fillRect(0, cy + r * 0.2, size, size / 2);
                // Base en agua
                ctx.fillStyle = '#94a3b8';
                ctx.fillRect(cx - 3, cy - r * 0.3, 6, r * 1);
                // Nacelle
                ctx.fillStyle = '#e2e8f0';
                this.roundRect(ctx, cx - 5, cy - r * 0.35, 10, 8, 3);
                // Aspas
                ctx.fillStyle = '#f8fafc';
                for (let i = 0; i < 3; i++) {
                    ctx.save(); ctx.translate(cx, cy - r * 0.3);
                    ctx.rotate((Math.PI * 2 * i) / 3);
                    ctx.beginPath(); ctx.ellipse(0, -r * 0.5, 3, r * 0.5, 0, 0, Math.PI * 2); ctx.fill();
                    ctx.restore();
                }
                // Olas
                ctx.strokeStyle = '#60a5fa';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let x = 0; x < size; x += 10) {
                    ctx.moveTo(x, cy + r * 0.2); ctx.quadraticCurveTo(x + 5, cy + r * 0.1, x + 10, cy + r * 0.2);
                }
                ctx.stroke();
                break;

            case 'hydro_small':
                // Mini hidraulica
                ctx.fillStyle = '#3b82f6';
                ctx.beginPath();
                ctx.moveTo(0, cy - r * 0.3);
                ctx.quadraticCurveTo(cx * 0.5, cy - r * 0.4, cx - 5, cy);
                ctx.lineTo(cx + 5, cy);
                ctx.quadraticCurveTo(cx * 1.5, cy + r * 0.2, size, cy + r * 0.1);
                ctx.lineTo(size, cy + r * 0.5);
                ctx.lineTo(0, cy + r * 0.5);
                ctx.fill();
                // Pequena rueda
                ctx.strokeStyle = '#78716c';
                ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(cx, cy, r * 0.25, 0, Math.PI * 2); ctx.stroke();
                ctx.strokeStyle = '#64748b';
                ctx.lineWidth = 2;
                for (let i = 0; i < 4; i++) {
                    const a = (Math.PI * 2 * i) / 4;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(cx + Math.cos(a) * r * 0.25, cy + Math.sin(a) * r * 0.25);
                    ctx.stroke();
                }
                break;

            case 'biogas':
                // Biogas (digestor)
                ctx.fillStyle = '#16a34a';
                ctx.beginPath();
                ctx.arc(cx, cy + r * 0.1, r * 0.45, Math.PI, 0);
                ctx.lineTo(cx + r * 0.45, cy + r * 0.5);
                ctx.lineTo(cx - r * 0.45, cy + r * 0.5);
                ctx.fill();
                // Cupula
                ctx.fillStyle = '#22c55e';
                ctx.beginPath(); ctx.arc(cx, cy + r * 0.1, r * 0.45, Math.PI, 0); ctx.fill();
                // Tuberia salida gas
                ctx.fillStyle = '#6b7280';
                ctx.fillRect(cx + r * 0.2, cy - r * 0.5, 4, r * 0.5);
                // Burbuja gas
                ctx.fillStyle = 'rgba(134,239,172,0.5)';
                ctx.beginPath(); ctx.arc(cx + r * 0.22, cy - r * 0.6, 5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx + r * 0.35, cy - r * 0.55, 3, 0, Math.PI * 2); ctx.fill();
                break;

            case 'solar_passive':
                // Solar pasiva (edificio con ventanas orientadas)
                ctx.fillStyle = '#64748b';
                this.roundRect(ctx, cx - r * 0.5, cy - r * 0.4, r, r * 0.9, 3);
                // Ventanas grandes (orientacion solar)
                ctx.fillStyle = '#93c5fd';
                this.roundRect(ctx, cx - r * 0.35, cy - r * 0.3, r * 0.7, r * 0.25, 2);
                this.roundRect(ctx, cx - r * 0.35, cy + r * 0.05, r * 0.7, r * 0.25, 2);
                // Sol con flechas
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath(); ctx.arc(cx + r * 0.6, cy - r * 0.6, 6, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(cx + r * 0.5, cy - r * 0.5); ctx.lineTo(cx + r * 0.2, cy - r * 0.25); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + r * 0.45, cy - r * 0.4); ctx.lineTo(cx + r * 0.1, cy); ctx.stroke();
                break;

            case 'fuel':
                // Fuel oil (similar a oil pero con F)
                ctx.fillStyle = '#1e293b';
                this.roundRect(ctx, cx - r * 0.4, cy - r * 0.5, r * 0.8, r * 1.2, 5);
                ctx.fillStyle = '#475569';
                this.roundRect(ctx, cx - r * 0.4, cy - r * 0.4, r * 0.8, 4, 2);
                this.roundRect(ctx, cx - r * 0.4, cy + r * 0.4, r * 0.8, 4, 2);
                ctx.fillStyle = '#ef4444';
                ctx.font = `bold ${size * 0.25}px Nunito`;
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText('F', cx, cy);
                break;

            case 'fracking':
                // Fracking (torre perforacion)
                ctx.fillStyle = '#92400e';
                ctx.fillRect(0, cy + r * 0.3, size, 4);
                // Torre
                ctx.strokeStyle = '#78716c';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(cx - r * 0.3, cy + r * 0.3); ctx.lineTo(cx, cy - r * 0.6); ctx.lineTo(cx + r * 0.3, cy + r * 0.3); ctx.stroke();
                // Cruce
                ctx.beginPath(); ctx.moveTo(cx - r * 0.2, cy); ctx.lineTo(cx + r * 0.2, cy); ctx.stroke();
                // Grietas en el suelo
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(cx, cy + r * 0.4); ctx.lineTo(cx - 8, cy + r * 0.7); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx, cy + r * 0.4); ctx.lineTo(cx + 10, cy + r * 0.8); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + 2, cy + r * 0.5); ctx.lineTo(cx - 5, cy + r * 0.9); ctx.stroke();
                break;

            case 'peat':
                // Turba
                ctx.fillStyle = '#451a03';
                this.roundRect(ctx, cx - r * 0.6, cy - r * 0.2, r * 1.2, r * 0.8, 5);
                ctx.fillStyle = '#78350f';
                this.roundRect(ctx, cx - r * 0.5, cy - r * 0.1, r, r * 0.5, 3);
                // Textura materia organica
                ctx.fillStyle = 'rgba(146,64,14,0.5)';
                ctx.beginPath(); ctx.arc(cx - 8, cy + 2, 3, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx + 6, cy - 2, 2, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx + 2, cy + 8, 2.5, 0, Math.PI * 2); ctx.fill();
                // Hoja descompuesta
                ctx.fillStyle = '#92400e';
                ctx.beginPath();
                ctx.ellipse(cx - 5, cy + r * 0.3, 4, 2, 0.3, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'combined':
                // Ciclo combinado (dos turbinas)
                ctx.fillStyle = '#6b7280';
                this.roundRect(ctx, cx - r * 0.7, cy, r * 0.6, r * 0.5, 3);
                this.roundRect(ctx, cx + r * 0.1, cy, r * 0.6, r * 0.5, 3);
                // Chimenea
                ctx.fillStyle = '#78716c';
                ctx.fillRect(cx - r * 0.5, cy - r * 0.5, 5, r * 0.5);
                ctx.fillRect(cx + r * 0.3, cy - r * 0.3, 5, r * 0.3);
                // Flecha conectora
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(cx - r * 0.1, cy + r * 0.25); ctx.lineTo(cx + r * 0.1, cy + r * 0.25); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + r * 0.1, cy + r * 0.25); ctx.lineTo(cx + r * 0.02, cy + r * 0.18); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + r * 0.1, cy + r * 0.25); ctx.lineTo(cx + r * 0.02, cy + r * 0.32); ctx.stroke();
                // Humo leve
                ctx.fillStyle = 'rgba(100,100,100,0.4)';
                ctx.beginPath(); ctx.arc(cx - r * 0.48, cy - r * 0.6, 4, 0, Math.PI * 2); ctx.fill();
                break;

            default:
                // Usa el icono de energia base si existe
                return this.createEnergyIcon(type, size);
        }
        return canvas;
    },

    // ==================== CARD (para nivel 2) ====================
    createCard(width = 140, height = 90) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        // Fondo carta
        ctx.fillStyle = 'rgba(30,41,59,0.95)';
        this.roundRect(ctx, 0, 0, width, height, 10);
        // Borde sutil
        ctx.strokeStyle = 'rgba(148,163,184,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        this.roundRectPath(ctx, 1, 1, width - 2, height - 2, 9);
        ctx.stroke();
        return canvas;
    },

    // Helper para path de rect redondeado sin fill
    roundRectPath(ctx, x, y, w, h, r) {
        r = Math.min(r, w / 2, h / 2);
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
    },

    // ==================== POLLUTION METER (para nivel 4) ====================
    createPollutionMeter(width = 200, height = 30) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        // Fondo
        ctx.fillStyle = '#1e293b';
        this.roundRect(ctx, 0, 0, width, height, height / 2);
        // Gradiente verde->rojo
        const grad = ctx.createLinearGradient(2, 0, width - 2, 0);
        grad.addColorStop(0, '#22c55e');
        grad.addColorStop(0.5, '#f59e0b');
        grad.addColorStop(1, '#ef4444');
        ctx.fillStyle = grad;
        this.roundRect(ctx, 2, 2, width - 4, height - 4, (height - 4) / 2);
        return canvas;
    },

    // ==================== GRID CELL ====================
    createGridCell(size = 80) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(30,41,59,0.8)';
        this.roundRect(ctx, 2, 2, size - 4, size - 4, 6);
        ctx.strokeStyle = 'rgba(59,130,246,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(6, 2); ctx.lineTo(size - 6, 2);
        ctx.quadraticCurveTo(size - 2, 2, size - 2, 6);
        ctx.lineTo(size - 2, size - 6);
        ctx.quadraticCurveTo(size - 2, size - 2, size - 6, size - 2);
        ctx.lineTo(6, size - 2);
        ctx.quadraticCurveTo(2, size - 2, 2, size - 6);
        ctx.lineTo(2, 6);
        ctx.quadraticCurveTo(2, 2, 6, 2);
        ctx.stroke();
        return canvas;
    },

    // ==================== UI ELEMENTS ====================
    createMeterBar(width, height, fillColor, bgColor = '#1e293b') {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = bgColor;
        this.roundRect(ctx, 0, 0, width, height, height / 2);
        ctx.fillStyle = fillColor;
        this.roundRect(ctx, 2, 2, width - 4, height - 4, (height - 4) / 2);
        return canvas;
    },

    // Chain block para puzzle
    createChainBlock(text, color, size = 120) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        this.roundRect(ctx, 0, 0, size, 50, 10);
        // Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        this.roundRect(ctx, 0, 42, size, 8, 4);
        // Texto
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Nunito';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, size / 2, 22);
        return canvas;
    }
};

window.SpriteGenerator = SpriteGenerator;
