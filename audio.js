// ============================================================
// SISTEMA DE AUDIO - Energia tematica
// ============================================================

class AudioManager {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.isPlaying = false;
        this.currentTrack = null;
        this.oscillators = [];
        this.volume = 0.5;
        this.musicVolume = 0.35;
        this.sfxVolume = 0.6;
    }

    init() {
        if (this.context) return;
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.context.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.context.destination);
        this.musicGain = this.context.createGain();
        this.musicGain.gain.value = this.musicVolume;
        this.musicGain.connect(this.masterGain);
        this.sfxGain = this.context.createGain();
        this.sfxGain.gain.value = this.sfxVolume;
        this.sfxGain.connect(this.masterGain);
    }

    resume() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    playNote(frequency, duration, type = 'square', gain = this.sfxGain, delay = 0, volume = 0.3) {
        if (!this.context) this.init();
        const osc = this.context.createOscillator();
        const gainNode = this.context.createGain();
        osc.type = type;
        osc.frequency.value = frequency;
        const startTime = this.context.currentTime + delay;
        gainNode.gain.setValueAtTime(volume, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.connect(gainNode);
        gainNode.connect(gain);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.1);
        return osc;
    }

    // ==================== SFX ====================
    playCorrect() {
        if (!this.context) this.init();
        this.playNote(523, 0.1, 'sine', this.sfxGain, 0, 0.3);
        this.playNote(659, 0.1, 'sine', this.sfxGain, 0.1, 0.3);
        this.playNote(784, 0.15, 'sine', this.sfxGain, 0.2, 0.35);
        this.playNote(1047, 0.2, 'sine', this.sfxGain, 0.35, 0.3);
    }

    playWrong() {
        if (!this.context) this.init();
        this.playNote(250, 0.15, 'sawtooth', this.sfxGain, 0, 0.35);
        this.playNote(200, 0.15, 'sawtooth', this.sfxGain, 0.1, 0.35);
        this.playNote(150, 0.3, 'sawtooth', this.sfxGain, 0.2, 0.4);
    }

    playError() { this.playWrong(); }

    playCombo(level) {
        if (!this.context) this.init();
        const baseFreq = 500 + level * 60;
        for (let i = 0; i < 4; i++) {
            this.playNote(baseFreq + i * 120, 0.08, 'sine', this.sfxGain, i * 0.05, 0.25);
        }
    }

    playPlace() {
        if (!this.context) this.init();
        this.playNote(440, 0.08, 'sine', this.sfxGain, 0, 0.2);
        this.playNote(660, 0.08, 'sine', this.sfxGain, 0.05, 0.2);
    }

    playRemove() {
        if (!this.context) this.init();
        this.playNote(400, 0.08, 'sine', this.sfxGain, 0, 0.15);
        this.playNote(300, 0.08, 'sine', this.sfxGain, 0.05, 0.15);
    }

    playElectricBuzz() {
        if (!this.context) this.init();
        for (let i = 0; i < 5; i++) {
            this.playNote(60 + Math.random() * 40, 0.04, 'sawtooth', this.sfxGain, i * 0.03, 0.15);
        }
    }

    playPowerUp() {
        if (!this.context) this.init();
        const notes = [440, 554, 659, 880, 1108];
        notes.forEach((n, i) => {
            this.playNote(n, 0.1, 'sine', this.sfxGain, i * 0.07, 0.25);
        });
    }

    playChainComplete() {
        if (!this.context) this.init();
        const notes = [523, 659, 784, 1047, 784, 1047, 1319];
        notes.forEach((n, i) => {
            this.playNote(n, 0.12, 'sine', this.sfxGain, i * 0.08, 0.25);
            this.playNote(n / 2, 0.12, 'triangle', this.sfxGain, i * 0.08, 0.15);
        });
    }

    playLoseLife() {
        if (!this.context) this.init();
        this.playNote(400, 0.1, 'square', this.sfxGain, 0, 0.35);
        this.playNote(300, 0.1, 'square', this.sfxGain, 0.1, 0.35);
        this.playNote(200, 0.2, 'square', this.sfxGain, 0.2, 0.4);
        this.playNote(150, 0.3, 'sawtooth', this.sfxGain, 0.4, 0.25);
    }

    playLevelVictory() {
        if (!this.context) this.init();
        const melody = [523, 587, 659, 698, 784, 880, 988, 1047];
        melody.forEach((n, i) => {
            this.playNote(n, 0.12, 'sine', this.sfxGain, i * 0.1, 0.3);
            this.playNote(n / 2, 0.12, 'triangle', this.sfxGain, i * 0.1, 0.2);
        });
    }

    playLevelDefeat() {
        if (!this.context) this.init();
        const melody = [400, 380, 350, 320, 280, 240, 200, 150];
        melody.forEach((n, i) => {
            this.playNote(n, 0.15, 'sawtooth', this.sfxGain, i * 0.12, 0.25);
        });
    }

    playVictory() {
        if (!this.context) this.init();
        const fanfare = [
            { note: 523, dur: 0.15 }, { note: 523, dur: 0.15 }, { note: 523, dur: 0.15 },
            { note: 523, dur: 0.3 }, { note: 415, dur: 0.3 }, { note: 466, dur: 0.3 },
            { note: 523, dur: 0.15 }, { note: 466, dur: 0.1 }, { note: 523, dur: 0.5 }
        ];
        let time = 0;
        fanfare.forEach(({ note, dur }) => {
            this.playNote(note, dur * 0.9, 'sine', this.sfxGain, time, 0.3);
            this.playNote(note / 2, dur * 0.9, 'triangle', this.sfxGain, time, 0.2);
            time += dur;
        });
    }

    playDefeat() {
        if (!this.context) this.init();
        const doom = [300, 280, 260, 240, 220, 200, 180, 160, 140, 120, 100];
        doom.forEach((n, i) => {
            this.playNote(n, 0.2, 'sawtooth', this.sfxGain, i * 0.15, 0.2 + i * 0.015);
        });
    }

    playLaugh() {
        if (!this.context) this.init();
        for (let i = 0; i < 6; i++) {
            this.playNote(150 + (i % 2) * 50, 0.12, 'square', this.sfxGain, i * 0.15, 0.25);
        }
    }

    playClick() {
        if (!this.context) this.init();
        this.playNote(800, 0.04, 'sine', this.sfxGain, 0, 0.15);
    }

    playHover() {
        if (!this.context) this.init();
        this.playNote(600, 0.03, 'sine', this.sfxGain, 0, 0.08);
    }

    playTick() {
        if (!this.context) this.init();
        this.playNote(1000, 0.04, 'sine', this.sfxGain, 0, 0.12);
    }

    playTimeUp() {
        if (!this.context) this.init();
        for (let i = 0; i < 3; i++) {
            this.playNote(600, 0.1, 'square', this.sfxGain, i * 0.15, 0.3);
        }
        this.playNote(200, 0.4, 'sawtooth', this.sfxGain, 0.45, 0.35);
    }

    playDialogueBeep() {
        if (!this.context) this.init();
        this.playNote(200 + Math.random() * 100, 0.03, 'sine', this.sfxGain, 0, 0.08);
    }

    playExplosion() {
        if (!this.context) this.init();
        for (let i = 0; i < 8; i++) {
            this.playNote(80 + Math.random() * 150, 0.05, 'sawtooth', this.sfxGain, i * 0.02, 0.12 - i * 0.01);
        }
        for (let i = 0; i < 15; i++) {
            this.playNote(1000 + Math.random() * 3000, 0.02, 'square', this.sfxGain, 0.1 + i * 0.03, 0.04);
        }
    }

    playAchievement() {
        if (!this.context) this.init();
        const melody = [523, 659, 784, 1047, 784, 1047, 1319];
        melody.forEach((n, i) => {
            this.playNote(n, 0.15, 'sine', this.sfxGain, i * 0.1, 0.25);
            this.playNote(n / 2, 0.15, 'triangle', this.sfxGain, i * 0.1, 0.18);
        });
    }

    playDramatic() {
        if (!this.context) this.init();
        this.playNote(110, 0.5, 'sawtooth', this.sfxGain, 0, 0.25);
        this.playNote(165, 0.5, 'sawtooth', this.sfxGain, 0.2, 0.2);
        this.playNote(220, 0.5, 'sawtooth', this.sfxGain, 0.4, 0.15);
    }

    playWhoosh() {
        if (!this.context) this.init();
        for (let i = 0; i < 10; i++) {
            this.playNote(200 + i * 100, 0.05, 'sine', this.sfxGain, i * 0.02, 0.08);
        }
    }

    playFlip() {
        if (!this.context) this.init();
        this.playNote(400, 0.05, 'sine', this.sfxGain, 0, 0.12);
        this.playNote(600, 0.05, 'sine', this.sfxGain, 0.05, 0.12);
    }

    playAlarm() {
        if (!this.context) this.init();
        for (let i = 0; i < 4; i++) {
            this.playNote(800, 0.15, 'square', this.sfxGain, i * 0.3, 0.2);
            this.playNote(600, 0.15, 'square', this.sfxGain, i * 0.3 + 0.15, 0.2);
        }
    }

    playGridWave() {
        if (!this.context) this.init();
        this.playNote(220, 0.3, 'sine', this.sfxGain, 0, 0.2);
        this.playNote(330, 0.3, 'sine', this.sfxGain, 0.1, 0.15);
        this.playNote(440, 0.4, 'sine', this.sfxGain, 0.2, 0.2);
    }

    // ==================== MUSICA ====================
    stopMusic() {
        this.isPlaying = false;
        this.oscillators.forEach(osc => { try { osc.stop(); } catch (e) {} });
        this.oscillators = [];
        this.currentTrack = null;
    }

    playMenuMusic() {
        if (this.isPlaying && this.currentTrack === 'menu') return;
        this.stopMusic();
        if (!this.context) this.init();
        this.isPlaying = true;
        this.currentTrack = 'menu';

        const melody = [
            { note: 330, dur: 0.4 }, { note: 392, dur: 0.4 },
            { note: 440, dur: 0.4 }, { note: 392, dur: 0.4 },
            { note: 349, dur: 0.4 }, { note: 330, dur: 0.4 },
            { note: 294, dur: 0.8 }, { note: 330, dur: 0.8 }
        ];
        const bass = [165, 196, 220, 196];
        let mIdx = 0, bIdx = 0;

        const playMel = () => {
            if (!this.isPlaying || this.currentTrack !== 'menu') return;
            const m = melody[mIdx];
            this.playNote(m.note, m.dur * 0.7, 'triangle', this.musicGain, 0, 0.15);
            mIdx = (mIdx + 1) % melody.length;
            setTimeout(playMel, m.dur * 1000);
        };
        const playBas = () => {
            if (!this.isPlaying || this.currentTrack !== 'menu') return;
            this.playNote(bass[bIdx], 0.3, 'triangle', this.musicGain, 0, 0.1);
            bIdx = (bIdx + 1) % bass.length;
            setTimeout(playBas, 400);
        };
        playMel();
        playBas();
    }

    playLevel1Music() {
        if (this.isPlaying && this.currentTrack === 'level1') return;
        this.stopMusic();
        if (!this.context) this.init();
        this.isPlaying = true;
        this.currentTrack = 'level1';

        const melody = [330, 392, 440, 392, 349, 330, 294, 330, 392, 440, 494, 440, 392, 349, 330, 294];
        const bass = [165, 196, 220, 196];
        let mIdx = 0, bIdx = 0;

        const playMel = () => {
            if (!this.isPlaying || this.currentTrack !== 'level1') return;
            this.playNote(melody[mIdx], 0.18, 'triangle', this.musicGain, 0, 0.12);
            mIdx = (mIdx + 1) % melody.length;
            setTimeout(playMel, 220);
        };
        const playBas = () => {
            if (!this.isPlaying || this.currentTrack !== 'level1') return;
            this.playNote(bass[bIdx], 0.35, 'triangle', this.musicGain, 0, 0.1);
            bIdx = (bIdx + 1) % bass.length;
            setTimeout(playBas, 440);
        };
        playMel(); playBas();
    }

    playLevel2Music() {
        if (this.isPlaying && this.currentTrack === 'level2') return;
        this.stopMusic();
        if (!this.context) this.init();
        this.isPlaying = true;
        this.currentTrack = 'level2';

        const melody = [392, 440, 494, 440, 392, 349, 330, 294, 330, 349, 392, 440, 494, 523, 494, 440];
        const bass = [196, 220, 247, 220];
        let mIdx = 0, bIdx = 0;

        const playMel = () => {
            if (!this.isPlaying || this.currentTrack !== 'level2') return;
            this.playNote(melody[mIdx], 0.15, 'triangle', this.musicGain, 0, 0.12);
            mIdx = (mIdx + 1) % melody.length;
            setTimeout(playMel, 190);
        };
        const playBas = () => {
            if (!this.isPlaying || this.currentTrack !== 'level2') return;
            this.playNote(bass[bIdx], 0.3, 'triangle', this.musicGain, 0, 0.1);
            bIdx = (bIdx + 1) % bass.length;
            setTimeout(playBas, 380);
        };
        playMel(); playBas();
    }

    playLevel3Music() {
        if (this.isPlaying && this.currentTrack === 'level3') return;
        this.stopMusic();
        if (!this.context) this.init();
        this.isPlaying = true;
        this.currentTrack = 'level3';

        const arp = [262, 330, 392, 523, 392, 330, 262, 196];
        const bass = [131, 165, 196, 165];
        let aIdx = 0, bIdx = 0;

        const playArp = () => {
            if (!this.isPlaying || this.currentTrack !== 'level3') return;
            this.playNote(arp[aIdx], 0.1, 'triangle', this.musicGain, 0, 0.1);
            aIdx = (aIdx + 1) % arp.length;
            setTimeout(playArp, 140);
        };
        const playBas = () => {
            if (!this.isPlaying || this.currentTrack !== 'level3') return;
            this.playNote(bass[bIdx], 0.35, 'triangle', this.musicGain, 0, 0.12);
            bIdx = (bIdx + 1) % bass.length;
            setTimeout(playBas, 560);
        };
        playArp(); playBas();
    }

    playLevel4Music() {
        if (this.isPlaying && this.currentTrack === 'level4') return;
        this.stopMusic();
        if (!this.context) this.init();
        this.isPlaying = true;
        this.currentTrack = 'level4';

        const melody = [220, 262, 220, 196, 175, 196, 220, 262, 294, 262, 220, 196, 175, 165, 175, 196];
        const bass = [110, 131, 147, 131];
        let mIdx = 0, bIdx = 0;

        const playMel = () => {
            if (!this.isPlaying || this.currentTrack !== 'level4') return;
            this.playNote(melody[mIdx], 0.12, 'sawtooth', this.musicGain, 0, 0.1);
            mIdx = (mIdx + 1) % melody.length;
            setTimeout(playMel, 160);
        };
        const playBas = () => {
            if (!this.isPlaying || this.currentTrack !== 'level4') return;
            this.playNote(bass[bIdx], 0.3, 'sawtooth', this.musicGain, 0, 0.08);
            bIdx = (bIdx + 1) % bass.length;
            setTimeout(playBas, 320);
        };
        playMel(); playBas();
    }

    playBossMusic() {
        if (this.isPlaying && this.currentTrack === 'boss') return;
        this.stopMusic();
        if (!this.context) this.init();
        this.isPlaying = true;
        this.currentTrack = 'boss';

        const melody = [440, 523, 587, 523, 440, 392, 440, 523, 587, 659, 587, 523, 440, 392, 349, 392];
        const bass = [110, 131, 147, 165, 147, 131];
        let mIdx = 0, bIdx = 0;

        const playMel = () => {
            if (!this.isPlaying || this.currentTrack !== 'boss') return;
            this.playNote(melody[mIdx], 0.12, 'triangle', this.musicGain, 0, 0.15);
            this.playNote(melody[mIdx] * 2, 0.12, 'sine', this.musicGain, 0, 0.06);
            mIdx = (mIdx + 1) % melody.length;
            setTimeout(playMel, 160);
        };
        const playBas = () => {
            if (!this.isPlaying || this.currentTrack !== 'boss') return;
            this.playNote(bass[bIdx], 0.25, 'triangle', this.musicGain, 0, 0.1);
            bIdx = (bIdx + 1) % bass.length;
            setTimeout(playBas, 320);
        };
        playMel(); playBas();
    }

    playVictoryMusic() {
        if (this.isPlaying && this.currentTrack === 'victory') return;
        this.stopMusic();
        if (!this.context) this.init();
        this.isPlaying = true;
        this.currentTrack = 'victory';

        const melody = [523, 587, 659, 784, 659, 784, 880, 784, 880, 988, 880, 784, 659, 784, 659, 523];
        let idx = 0;
        const play = () => {
            if (!this.isPlaying || this.currentTrack !== 'victory') return;
            this.playNote(melody[idx], 0.2, 'sine', this.musicGain, 0, 0.18);
            this.playNote(melody[idx] / 2, 0.2, 'triangle', this.musicGain, 0, 0.12);
            idx = (idx + 1) % melody.length;
            setTimeout(play, 250);
        };
        play();
    }

    playDefeatMusic() {
        if (this.isPlaying && this.currentTrack === 'defeat') return;
        this.stopMusic();
        if (!this.context) this.init();
        this.isPlaying = true;
        this.currentTrack = 'defeat';

        const melody = [220, 196, 175, 165, 147, 131, 117, 110];
        let idx = 0;
        const play = () => {
            if (!this.isPlaying || this.currentTrack !== 'defeat') return;
            this.playNote(melody[idx % melody.length], 0.4, 'sawtooth', this.musicGain, 0, 0.12);
            idx++;
            if (idx < melody.length * 2) setTimeout(play, 500);
        };
        play();
    }

    playLevelMusic(level) {
        switch(level) {
            case 1: this.playLevel1Music(); break;
            case 2: this.playLevel2Music(); break;
            case 3: this.playLevel3Music(); break;
            case 4: this.playLevel4Music(); break;
            case 5: this.playBossMusic(); break;
            default: this.playLevel1Music(); break;
        }
    }

    // ==================== VOLUME CONTROLS ====================
    setMasterVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        if (this.masterGain) this.masterGain.gain.value = this.volume;
    }
    setMusicVolume(vol) {
        this.musicVolume = Math.max(0, Math.min(1, vol));
        if (this.musicGain) this.musicGain.gain.value = this.musicVolume;
    }
    setSfxVolume(vol) {
        this.sfxVolume = Math.max(0, Math.min(1, vol));
        if (this.sfxGain) this.sfxGain.gain.value = this.sfxVolume;
    }
    toggleMute() {
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterGain.gain.value > 0 ? 0 : this.volume;
        }
    }
}

window.audioManager = new AudioManager();
