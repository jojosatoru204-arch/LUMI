// ===== LUMI - AUDIO SYSTEM =====
// Quản lý tất cả âm thanh trong trò chơi

export class AudioSystem {
    constructor() {
        this.context = null;
        this.sounds = {};
        this.enabled = true;
        this.initialized = false;

        // Danh sách âm thanh
        this.soundFiles = {
            ambience: this.createOscillatorSound('sine', 150, 0.1),
            bird: this.createOscillatorSound('sine', 800, 0.2),
            wind: this.createNoiseSound(),
            footprint: this.createOscillatorSound('sine', 200, 0.1),
            door: this.createOscillatorSound('sine', 300, 0.2),
            jump: this.createOscillatorSound('sine', 400, 0.15),
            interact: this.createOscillatorSound('sine', 600, 0.1),
            water: this.createOscillatorSound('sine', 700, 0.1)
        };

        // Tạo audio context khi có tương tác đầu tiên
        this.initAudioContext();
    }

    // ===== INITIALIZATION =====
    initAudioContext() {
        //tritt Web Audio API
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            console.log('🔊 [Audio] AudioContext initialized');
        } catch (e) {
            console.warn('⚠️ [Audio] Web Audio API not supported:', e);
            this.initialized = false;
        }

        // Thêm event listener để khởi tạo khi có tương tác
        document.addEventListener('click', this.initOnInteraction.bind(this), { once: true });
        document.addEventListener('touchstart', this.initOnInteraction.bind(this), { once: true });
    }

    initOnInteraction() {
        if (!this.initialized && !this.context) {
            try {
                this.context = new (window.AudioContext || window.webkitAudioContext)();
                this.initialized = true;
                console.log('🔊 [Audio] AudioContext initialized on interaction');
            } catch (e) {
                console.warn('⚠️ [Audio] Failed to initialize on interaction:', e);
            }
        }
    }

    // ===== SOUND GENERATION =====
    createOscillatorSound(type = 'sine', frequency = 440, gainValue = 0.1) {
        if (!this.context) return null;

        return () => {
            if (!this.enabled || !this.initialized) return null;

            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.type = type;
            oscillator.frequency.value = frequency;

            gainNode.gain.value = gainValue;

            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);

            oscillator.start();
            oscillator.stop(this.context.currentTime + 0.2);

            return {
                oscillator,
                gainNode,
                stop: () => {
                    oscillator.stop();
                }
            };
        };
    }

    createNoiseSound() {
        if (!this.context) return null;

        return () => {
            if (!this.enabled || !this.initialized) return null;

            const bufferSize = 2 * this.context.sampleRate;
            const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.context.createBufferSource();
            const gainNode = this.context.createGain();

            noise.buffer = buffer;
            noise.loop = true;

            gainNode.gain.value = 0.05;

            noise.connect(gainNode);
            gainNode.connect(this.context.destination);

            noise.start();

            return {
                noise,
                gainNode,
                stop: () => {
                    noise.stop();
                }
            };
        };
    }

    // ===== PLAY SOUNDS =====
    playSound(name, volume = 1) {
        if (!this.enabled || !this.soundFiles[name]) return null;

        try {
            return this.soundFiles[name]();
        } catch (e) {
            console.warn(`⚠️ [Audio] Failed to play sound: ${name}`, e);
            return null;
        }
    }

    playAmbient() {
        if (!this.enabled) return;

        // Phát âm thanh môi trường
        this.ambientSound = this.playSound('ambience');
        this.birdSound = this.playSound('bird');
        this.windSound = this.playSound('wind');

        // Lặp lại âm thanh chim
        setInterval(() => {
            this.birdSound = this.playSound('bird');
        }, 5000 + Math.random() * 5000);
    }

    // ===== CONTROL =====
    setEnabled(enabled) {
        this.enabled = enabled;

        if (!enabled && this.ambientSound) {
            this.pauseAll();
        } else if (enabled && !this.ambientSound && window.LUMI && !window.LUMI.isPaused) {
            this.playAmbient();
        }
    }

    pauseAll() {
        // Trên Web Audio API, không thể tạm dừng tất cả
        // Chúng ta sẽ dừng âm thanh ambient
        if (this.ambientSound) {
            this.ambientSound.stop();
            this.ambientSound = null;
        }
    }

    // ===== UPDATE =====
    update(delta) {
        // Cập nhật âm lượng dựa trên trạng thái trò chơi
        if (window.LUMI && window.LUMI.isPaused) {
            if (this.ambientSound) {
                this.pauseAll();
            }
        } else if (this.enabled && !this.ambientSound) {
            this.playAmbient();
        }
    }
}