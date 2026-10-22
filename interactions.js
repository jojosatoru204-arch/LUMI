// ===== LUMI - INTERACTIONS SYSTEM =====
// Xử lý tất cả tương tác giữa player và vật thể trong thế giới

export class Interactions {
    constructor() {
        this.currentPrompt = null;
        this.interacting = false;
        this.cooldown = 0;
        this.cooldownTime = 1; // 1 giây cooldown giữa các lần tương tác
    }

    // ===== INITIALIZATION =====
    init() {
        this.updatePromptVisibility();
        window.addEventListener('resize', this.updatePromptVisibility.bind(this));
    }

    // ===== UPDATE =====
    update(delta) {
        if (this.interacting) {
            this.cooldown -= delta;
            if (this.cooldown <= 0) {
                this.interacting = false;
            }
        }
    }

    // ===== PROMPT SYSTEM =====
    showInteractionPrompt(text) {
        const promptElement = document.getElementById('interaction-prompt');
        if (!promptElement) return;

        promptElement.textContent = text;
        promptElement.classList.remove('hidden');

        this.currentPrompt = text;
        this.updatePromptVisibility();
    }

    hideInteractionPrompt() {
        const promptElement = document.getElementById('interaction-prompt');
        if (promptElement) {
            promptElement.classList.add('hidden');
        }
        this.currentPrompt = null;
    }

    updatePromptVisibility() {
        const promptElement = document.getElementById('interaction-prompt');
        if (!promptElement) return;

        // Bản sungिछ đơn giản để hiển thị đúng vị trí
        const isMobile = window.LUMI?.isMobile || false;
    }

    // ===== INTERACTION TRIGGERING =====
    checkForInteractions(playerPosition) {
        if (window.LUMI && window.LUMI.world) {
            const interactive = window.LUMI.world.getInteractiveObjectAt(playerPosition);

            if (interactive) {
                this.showInteractionPrompt(`Nhấn 🔍 để ${interactive.name}`);
                return interactive;
            } else {
                this.hideInteractionPrompt();
                return null;
            }
        }
        return null;
    }

    triggerInteraction(interactiveObject) {
        if (this.interacting || this.cooldown > 0) return;

        const result = interactiveObject.action(interactiveObject);

        if (result) {
            this.showFeedback(result);
            this.interacting = true;
            this.cooldown = this.cooldownTime;
        }
    }

    // ===== INTERACTION TYPES =====
    // Những「** honesty」 này sẽ được định nghĩa trong world.js
    // Ở đây chỉ là các method helper

    static sitOnFurniture(furnitureType) {
        if (window.LUMI && window.LUMI.player) {
            window.LUMI.player.sit();
            window.LUMI.simulation.increaseEnergy(10);
            window.LUMI.simulation.increaseHappiness(5);

            if (window.LUMI.audio) {
                window.LUMI.audio.playSound('interact');
            }

            // Tự động đứng dậy sau 3 giây
            setTimeout(() => {
                if (window.LUMI.player) {
                    window.LUMI.player.standUp();
                }
            }, 3000);

            return true;
        }
        return false;
    }

    static sleepOnBed() {
        if (window.LUMI && window.LUMI.player) {
            window.LUMI.player.sit(); // Sử dụng sit làm tạm thời
            window.LUMI.simulation.increaseEnergy(30);
            window.LUMI.simulation.increaseHappiness(15);

            if (window.LUMI.audio) {
                window.LUMI.audio.playSound('interact');
            }

            // Tự động thức dậy sau 5 giây
            setTimeout(() => {
                if (window.LUMI.player) {
                    window.LUMI.player.standUp();
                }
            }, 5000);

            return true;
        }
        return false;
    }

    static toggleDoor(doorObject) {
        if (!doorObject.userData) {
            doorObject.userData = { isOpen: false };
        }

        doorObject.userData.isOpen = !doorObject.userData.isOpen;
        doorObject.rotation.y = doorObject.userData.isOpen ? Math.PI / 2 : 0;

        if (window.LUMI.audio) {
            window.LUMI.audio.playSound('door');
        }

        return true;
    }

    static toggleLamp(lampObject) {
        if (!lampObject.userData) {
            lampObject.userData = { isOn: false };
        }

        const light = lampObject.userData.light;
        const bulb = lampObject.children.find(child => child.name === 'bulb');

        lampObject.userData.isOn = !lampObject.userData.isOn;

        if (light) {
            light.intensity = lampObject.userData.isOn ? 1 : 0;
        }

        if (bulb) {
            bulb.material.emissiveIntensity = lampObject.userData.isOn ? 0.5 : 0;
        }

        if (window.LUMI.audio) {
            window.LUMI.audio.playSound('interact');
        }

        return true;
    }

    // ===== FEEDBACK =====
    showFeedback(message) {
        if (window.LUMI && window.LUMI.ui) {
            window.LUMI.ui.showMessage(message);
        }
    }

    // ===== GETTERS =====
    getCurrentInteraction() {
        return this.currentPrompt;
    }

    isInteracting() {
        return this.interacting;
    }
}