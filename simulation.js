// ===== LUMI - SIMULATION SYSTEM =====
// Quản lý trạng thái player, thời gian, và các hoạt động

export class Simulation {
    constructor(player) {
        this.player = player;

        // Trạng thái Player
        this.playerState = {
            energy: 100,
            hunger: 0,
            happiness: 100,
            maxEnergy: 100,
            maxHunger: 100
        };

        // Thời gian
        this.time = {
            hours: 8,
            minutes: 0,
            speed: 1 // 1 = thời gian thực, 10 = nhanh gấp 10 lần
        };

        // Tốc độ thay đổi trạng thái
        this.rates = {
            energy: {
                walk: -0.05,
                run: -0.1,
                rest: 0.2,
                sleep: 0.5
            },
            hunger: 0.03,
            happiness: {
                idle: -0.01,
                interact: 0.1,
                rest: 0.05
            }
        };

        // Trạng thái hoạt động
        this.currentActivity = 'idle';
        this.lastActivityTime = 0;

        // Update timer
        this.lastUpdate = Date.now();
    }

    // ===== UPDATE =====
    update(delta) {
        const now = Date.now();
        const elapsed = (now - this.lastUpdate) / 1000; // Chuyển sang giây
        this.lastUpdate = now;

        // Cập nhật thời gian
        this.updateTime(elapsed);

        // Cập nhật trạng thái player
        this.updatePlayerState(elapsed);

        // Cập nhật UI
        this.updateUI();
    }

    // ===== TIME SYSTEM =====
    updateTime(elapsed) {
        const totalMinutes = elapsed * this.time.speed * 0.1; // 1 giây = 0.1 phút trò chơi
        this.time.minutes += totalMinutes;

        while (this.time.minutes >= 60) {
            this.time.minutes -= 60;
            this.time.hours += 1;
        }

        while (this.time.hours >= 24) {
            this.time.hours -= 24;
        }
    }

    getTimeOfDay() {
        return this.time.hours + (this.time.minutes / 60);
    }

    getFormattedTime() {
        const hours = Math.floor(this.time.hours).toString().padStart(2, '0');
        const minutes = Math.floor(this.time.minutes).toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    isDay() {
        const time = this.getTimeOfDay();
        return time >= 6 && time <= 18;
    }

    // ===== PLAYER STATE =====
    updatePlayerState(elapsed) {
        // Cập nhật dựa trên hoạt động hiện tại
        switch (this.currentActivity) {
            case 'walking':
                this.playerState.energy += this.rates.energy.walk * elapsed;
                this.playerState.happiness += this.rates.happiness.idle * elapsed;
                break;
            case 'running':
                this.playerState.energy += this.rates.energy.run * elapsed;
                this.playerState.happiness += this.rates.happiness.idle * elapsed;
                break;
            case 'resting':
                this.playerState.energy += this.rates.energy.rest * elapsed;
                this.playerState.happiness += this.rates.happiness.rest * elapsed;
                break;
            case 'sleeping':
                this.playerState.energy += this.rates.energy.sleep * elapsed;
                this.playerState.happiness += this.rates.happiness.rest * elapsed;
                break;
            default:
                this.playerState.energy += this.rates.energy.rest * 0.5 * elapsed;
                this.playerState.happiness += this.rates.happiness.idle * elapsed;
        }

        // Đói tăng theo thời gian
        this.playerState.hunger += this.rates.hunger * elapsed;

        // Giới hạn trạng thái
        this.playerState.energy = Math.max(0, Math.min(this.playerState.maxEnergy, this.playerState.energy));
        this.playerState.hunger = Math.max(0, Math.min(this.playerState.maxHunger, this.playerState.hunger));
        this.playerState.happiness = Math.max(0, Math.min(100, this.playerState.happiness));

        // Nếu đói quá, hạnh phúc giảm
        if (this.playerState.hunger > 80) {
            this.playerState.happiness -= elapsed * 0.1;
        }
    }

    setActivity(activity) {
        this.currentActivity = activity;
        this.lastActivityTime = Date.now();
    }

    // ===== STATE MODIFIERS =====
    increaseEnergy(amount) {
        this.playerState.energy = Math.min(this.playerState.maxEnergy, this.playerState.energy + amount);
        this.updateUI();
    }

    decreaseEnergy(amount) {
        this.playerState.energy = Math.max(0, this.playerState.energy - amount);
        this.updateUI();
    }

    increaseHunger(amount) {
        this.playerState.hunger = Math.min(this.playerState.maxHunger, this.playerState.hunger + amount);
        this.updateUI();
    }

    decreaseHunger(amount) {
        this.playerState.hunger = Math.max(0, this.playerState.hunger - amount);
        this.updateUI();
    }

    increaseHappiness(amount) {
        this.playerState.happiness = Math.min(100, this.playerState.happiness + amount);
        this.updateUI();
    }

    decreaseHappiness(amount) {
        this.playerState.happiness = Math.max(0, this.playerState.happiness - amount);
        this.updateUI();
    }

    // ===== UI UPDATE =====
    updateUI() {
        if (window.LUMI && window.LUMI.ui) {
            window.LUMI.ui.updateHUD({
                energy: this.playerState.energy,
                hunger: this.playerState.hunger,
                happiness: this.playerState.happiness,
                time: this.getFormattedTime()
            });
        }
    }

    // ===== SAVE/LOAD =====
    getState() {
        return {
            player: this.playerState,
            time: {
                hours: this.time.hours,
                minutes: this.time.minutes
            },
            activity: this.currentActivity
        };
    }

    setState(state) {
        if (state.player) {
            this.playerState = state.player;
        }
        if (state.time) {
            this.time = state.time;
        }
        if (state.activity) {
            this.currentActivity = state.activity;
        }
        this.updateUI();
    }

    // ===== GETTERS =====
    getPlayerState() {
        return { ...this.playerState };
    }

    getTime() {
        return { ...this.time };
    }
}