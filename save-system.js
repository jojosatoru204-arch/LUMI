// ===== LUMI - SAVE SYSTEM =====
// Lưu và tải trạng thái trò chơi sử dụng LocalStorage

const SAVE_KEY = 'LUMI_SAVE_GAME';
const SETTINGS_KEY = 'LUMI_SETTINGS';

export class SaveSystem {
    constructor() {
        this.saveData = null;
        this.hasSave = false;
    }

    // ===== INITIALIZATION =====
    async init() {
        await this.loadSettings();
        this.checkExistingSave();
    }

    checkExistingSave() {
        const saveData = localStorage.getItem(SAVE_KEY);
        this.hasSave = saveData !== null;

        if (this.hasSave) {
            window.LUMI.ui?.showContinueButton(true);
        } else {
            window.LUMI.ui?.showContinueButton(false);
        }
    }

    // ===== SAVE =====
    async saveGame() {
        if (!window.LUMI || !window.LUMI.player || !window.LUMI.simulation) return false;

        try {
            const saveData = {
                version: '1.0.0',
                timestamp: Date.now(),
                player: {
                    position: {
                        x: window.LUMI.player.group.position.x,
                        y: window.LUMI.player.group.position.y,
                        z: window.LUMI.player.group.position.z
                    },
                    rotation: {
                        x: window.LUMI.player.group.rotation.x,
                        y: window.LUMI.player.group.rotation.y,
                        z: window.LUMI.player.group.rotation.z
                    }
                },
                simulation: window.LUMI.simulation.getState(),
                world: this.saveWorldState(),
                graphicsPreset: window.LUMI.currentGraphicsPreset
            };

            // Lưu vào LocalStorage
            localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
            this.saveData = saveData;
            this.hasSave = true;

            // Hiển thị thông báo
            window.LUMI.ui?.showSaveConfirmation();

            // Cập nhật UI
            window.LUMI.ui?.showContinueButton(true);

            console.log('💾 [SaveSystem] Game saved successfully');
            return true;

        } catch (error) {
            console.error('❌ [SaveSystem] Failed to save game:', error);
            window.LUMI.ui?.showError('Không thể lưu trò chơi: ' + error.message);
            return false;
        }
    }

    saveWorldState() {
        if (!window.LUMI || !window.LUMI.world) return null;

        const worldState = {
            furniture: {},
            decorations: []
        };

        // Lưu trạng thái đồ nội thất
        for (const key in window.LUMI.world.objects.furniture) {
            const obj = window.LUMI.world.objects.furniture[key];
            if (obj && obj.userData) {
                worldState.furniture[key] = obj.userData;
            }
        }

        // Lưu trạng thái các vật thể tương tác
        window.LUMI.world.objects.interactive.forEach(interactive => {
            if (interactive.object.userData) {
                worldState.decorations.push({
                    name: interactive.name,
                    type: interactive.type,
                    state: interactive.object.userData
                });
            }
        });

        return worldState;
    }

    // ===== LOAD =====
    async loadGame() {
        const saveData = localStorage.getItem(SAVE_KEY);
        if (!saveData) {
            console.log('ℹ️ [SaveSystem] No save data found');
            return false;
        }

        try {
            this.saveData = JSON.parse(saveData);
            this.hasSave = true;

            // Load player
            if (this.saveData.player && window.LUMI.player) {
                window.LUMI.player.teleportTo(this.saveData.player.position);
                window.LUMI.player.group.rotation.set(
                    this.saveData.player.rotation.x,
                    this.saveData.player.rotation.y,
                    this.saveData.player.rotation.z
                );
            }

            // Load simulation
            if (this.saveData.simulation && window.LUMI.simulation) {
                window.LUMI.simulation.setState(this.saveData.simulation);
            }

            // Load world
            if (this.saveData.world && window.LUMI.world) {
                this.loadWorldState(this.saveData.world);
            }

            // Load graphics preset
            if (this.saveData.graphicsPreset && window.LUMI.ui) {
                window.LUMI.currentGraphicsPreset = this.saveData.graphicsPreset;
                window.LUMI.ui.setGraphicsPreset(this.saveData.graphicsPreset);
            }

            console.log('📂 [SaveSystem] Game loaded successfully');
            return true;

        } catch (error) {
            console.error('❌ [SaveSystem] Failed to load game:', error);
            window.LUMI.ui?.showError('Không thể tải trò chơi: ' + error.message);
            return false;
        }
    }

    loadWorldState(worldState) {
        if (!window.LUMI || !window.LUMI.world) return;

        // Load furniture state
        for (const key in worldState.furniture) {
            if (window.LUMI.world.objects.furniture[key]) {
                window.LUMI.world.objects.furniture[key].userData = worldState.furniture[key];
            }
        }

        // Load decorations state
        worldState.decorations?.forEach(decoration => {
            const interactive = window.LUMI.world.objects.interactive.find(
                item => item.type === decoration.type && item.name === decoration.name
            );

            if (interactive) {
                interactive.object.userData = decoration.state;

                // Cập nhật trạng thái hiển thị
                if (interactive.type === 'door' && interactive.object.userData.isOpen) {
                    interactive.object.rotation.y = Math.PI / 2;
                } else if (interactive.type === 'lamp' && interactive.object.userData.isOn) {
                    const light = interactive.light;
                    const bulb = interactive.object.children.find(child => child.name === 'bulb');

                    if (light) light.intensity = 1;
                    if (bulb) bulb.material.emissiveIntensity = 0.5;
                }
            }
        });
    }

    // ===== DELETE =====
    deleteSave() {
        try {
            localStorage.removeItem(SAVE_KEY);
            this.saveData = null;
            this.hasSave = false;
            window.LUMI.ui?.showContinueButton(false);
            return true;
        } catch (error) {
            console.error('❌ [SaveSystem] Failed to delete save:', error);
            return false;
        }
    }

    // =====cze SETTINGS =====
    async loadSettings() {
        const settingsData = localStorage.getItem(SETTINGS_KEY);
        if (settingsData) {
            try {
                const settings = JSON.parse(settingsData);

                if (settings.graphicsPreset) {
                    window.LUMI.currentGraphicsPreset = settings.graphicsPreset;
                }

                if (settings.soundEnabled !== undefined) {
                    window.LUMI.settings.soundEnabled = settings.soundEnabled;
                }

                if (settings.language) {
                    window.LUMI.settings.language = settings.language;
                }
            } catch (error) {
                console.error('❌ [SaveSystem] Failed to load settings:', error);
            }
        }
    }

    saveSettings() {
        try {
            const settings = {
                graphicsPreset: window.LUMI.currentGraphicsPreset,
                soundEnabled: window.LUMI.settings.soundEnabled,
                language: window.LUMI.settings.language
            };

            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('❌ [SaveSystem] Failed to save settings:', error);
            return false;
        }
    }

    // ===== AUTOSAVE =====
    startAutosave(interval = 30000) {
        this.autosaveInterval = setInterval(() => {
            if (!window.LUMI.isPaused) {
                this.saveGame();
            }
        }, interval);
    }

    stopAutosave() {
        if (this.autosaveInterval) {
            clearInterval(this.autosaveInterval);
            this.autosaveInterval = null;
        }
    }

    // ===== GETTERS =====
    hasSaveData() {
        return this.hasSave;
    }

    getSaveData() {
        return this.saveData;
    }
}