// ===== LUMI - UI SYSTEM =====
// Quản lý tất cả giao diện: Menu, HUD, Settings, v.v.

export class UI {
    constructor() {
        // DOM Elements
        this.elements = {
            loadingScreen: document.getElementById('loading-screen'),
            mainMenu: document.getElementById('main-menu'),
            settingsMenu: document.getElementById('settings-menu'),
            tutorialOverlay: document.getElementById('tutorial-overlay'),
            pauseMenu: document.getElementById('pause-menu'),
            saveConfirmation: document.getElementById('save-confirmation'),
            decorationPanel: document.getElementById('decoration-panel'),
            errorOverlay: document.getElementById('error-message'),
            orientationPrompt: document.getElementById('orientation-prompt'),
            hud: document.getElementById('hud'),
            touchControls: document.getElementById('touch-controls'),
            timeDisplay: document.getElementById('time-display'),
            energyBar: document.getElementById('energy-bar'),
            hungerBar: document.getElementById('hunger-bar'),
            happinessBar: document.getElementById('happiness-bar'),
            graphicsPreset: document.getElementById('graphics-preset'),
            soundToggle: document.getElementById('sound-toggle'),
            languageSelect: document.getElementById('language-select'),
            saveMessage: document.getElementById('save-message-text'),
            errorText: document.getElementById('error-text')
        };

        // State
        this.isPaused = true;
        this.currentMenu = 'main';
        this.messageTimeout = null;

        // Khởi tạo
        this.init();
    }

    // ===== INITIALIZATION =====
    init() {
        // Ẩn tất cả overlay ban đầu
        this.hideAllOverlays();

        // Thiết lập event listeners
        this.setupEventListeners();

        // Kiểm tra hướng thiết bị
        this.checkOrientation();
    }

    setupEventListeners() {
        // Main menu buttons
        document.getElementById('start-game-btn')?.addEventListener('click', () => this.startNewGame());
        document.getElementById('continue-game-btn')?.addEventListener('click', () => this.continueGame());
        document.getElementById('settings-btn')?.addEventListener('click', () => this.showSettings());
        document.getElementById('back-to-main-btn')?.addEventListener('click', () => this.showMainMenu());
        document.getElementById('retry-btn')?.addEventListener('click', () => this.retryInit());

        // Pause menu buttons
        document.getElementById('resume-btn')?.addEventListener('click', () => this.resumeGame());
        document.getElementById('save-btn')?.addEventListener('click', () => this.saveGame());
        document.getElementById('load-btn')?.addEventListener('click', () => this.loadGame());
        document.getElementById('restart-btn')?.addEventListener('click', () => this.restartGame());
        document.getElementById('exit-to-menu-btn')?.addEventListener('click', () => this.exitToMenu());

        // Settings
        this.elements.graphicsPreset?.addEventListener('change', (e) => {
            window.LUMI.currentGraphicsPreset = e.target.value;
            this.applyGraphicsPreset(e.target.value);
            if (window.LUMI.saveSystem) {
                window.LUMI.saveSystem.saveSettings();
            }
        });

        this.elements.soundToggle?.addEventListener('change', (e) => {
            window.LUMI.settings.soundEnabled = e.target.checked;
            if (window.LUMI.audio) {
                window.LUMI.audio.setEnabled(e.target.checked);
            }
            if (window.LUMI.saveSystem) {
                window.LUMI.saveSystem.saveSettings();
            }
        });

        // Tutorial
        document.getElementById('skip-tutorial-btn')?.addEventListener('click', () => this.hideTutorial());

        // Decoration panel
        document.getElementById('close-decoration-btn')?.addEventListener('click', () => this.hideDecorationPanel());

        // Decoration tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchDecorationTab(e.target.dataset.tab));
        });

        // Decoration items
        document.querySelectorAll('.decoration-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                const color = e.currentTarget.dataset.color;
                this.selectDecorationItem(type, color);
            });
        });
    }

    // ===== GAME FLOW =====
    startNewGame() {
        this.hideAllOverlays();
        this.showHUD(true);
        this.updateControlsVisibility();
        this.showTutorial();

        window.LUMI.isPaused = false;
        this.isPaused = false;

        // Bắt đầu trò chơi mới
        if (window.LUMI && window.LUMI.player) {
            window.LUMI.player.setPosition(0, window.LUMI.player.height, -5);
        }

        // Khởi tạo thời gian
        if (window.LUMI.simulation) {
            window.LUMI.simulation.time = { hours: 8, minutes: 0 };
        }

        // Bắt đầu autosave
        if (window.LUMI.saveSystem) {
            window.LUMI.saveSystem.startAutosave();
        }

        // Ẩn loading screen nếu còn
        this.elements.loadingScreen?.classList.add('hidden');
    }

    continueGame() {
        if (!window.LUMI.saveSystem || !window.LUMI.saveSystem.hasSaveData()) {
            this.showError('Không có dữ liệu lưu trò chơi!');
            return;
        }

        this.hideAllOverlays();
        this.showHUD(true);
        this.updateControlsVisibility();

        window.LUMI.isPaused = false;
        this.isPaused = false;

        // Tải trò chơi
        window.LUMI.saveSystem.loadGame().then(() => {
            // Bắt đầu autosave
            if (window.LUMI.saveSystem) {
                window.LUMI.saveSystem.startAutosave();
            }
        });

        // Ẩn loading screen
        this.elements.loadingScreen?.classList.add('hidden');
    }

    showTutorial() {
        this.elements.tutorialOverlay?.classList.remove('hidden');
        this.elements.tutorialOverlay?.classList.add('active');
        window.LUMI.isPaused = true;
        this.isPaused = true;
    }

    hideTutorial() {
        this.elements.tutorialOverlay?.classList.add('hidden');
        this.elements.tutorialOverlay?.classList.remove('active');
        window.LUMI.isPaused = false;
        this.isPaused = false;
    }

    resumeGame() {
        this.elements.pauseMenu?.classList.add('hidden');
        window.LUMI.isPaused = false;
        this.isPaused = false;
    }

    pauseGame() {
        this.elements.pauseMenu?.classList.remove('hidden');
        window.LUMI.isPaused = true;
        this.isPaused = true;

        // Dừng âm thanh đi kèm
        if (window.LUMI.audio) {
            window.LUMI.audio.pauseAll();
        }
    }

    togglePauseMenu() {
        if (this.isPaused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }

    saveGame() {
        if (window.LUMI.saveSystem) {
            window.LUMI.saveSystem.saveGame();
        }
    }

    loadGame() {
        if (window.LUMI.saveSystem) {
            window.LUMI.saveSystem.loadGame().then(() => {
                this.showMessage('Đã tải trò chơi!');
                this.resumeGame();
            });
        }
    }

    restartGame() {
        if (window.LUMI.saveSystem) {
            window.LUMI.saveSystem.deleteSave();
        }

        // Khởi tạo lại trò chơi
        this.startNewGame();

        // Hiển thị message
        this.showMessage('Đã bắt đầu lại trò chơi!');
    }

    exitToMenu() {
        // Dừng autosave
        if (window.LUMI.saveSystem) {
            window.LUMI.saveSystem.stopAutosave();
        }

        // Ẩn tất cả
        this.hideAllOverlays();

        // Hiển thị menu chính
        this.showMainMenu();

        window.LUMI.isPaused = true;
        this.isPaused = true;

        // Cập nhật UI
        this.updateContinueButton();
    }

    retryInit() {
        this.elements.errorOverlay?.classList.add('hidden');
        this.showMainMenu();
    }

    // ===== MENU CONTROLS =====
    showMainMenu() {
        this.hideAllOverlays();
        this.elements.mainMenu?.classList.remove('hidden');
        this.currentMenu = 'main';
        this.updateContinueButton();
    }

    showSettings() {
        this.elements.settingsMenu?.classList.remove('hidden');
        this.elements.mainMenu?.classList.add('hidden');
        this.currentMenu = 'settings';

        // Load current settings
        if (this.elements.graphicsPreset) {
            this.elements.graphicsPreset.value = window.LUMI.currentGraphicsPreset || 'balanced';
        }

        if (this.elements.soundToggle) {
            this.elements.soundToggle.checked = window.LUMI.settings.soundEnabled;
        }
    }

    showContinueButton(show) {
        const continueBtn = document.getElementById('continue-game-btn');
        if (continueBtn) {
            if (show) {
                continueBtn.style.display = 'block';
            } else {
                continueBtn.style.display = 'none';
            }
        }
    }

    updateContinueButton() {
        if (window.LUMI.saveSystem) {
            this.showContinueButton(window.LUMI.saveSystem.hasSaveData());
        }
    }

    // ===== HUD =====
    showHUD(show) {
        if (show) {
            this.elements.hud?.classList.add('active');
            this.elements.hud?.classList.remove('hidden');
            this.elements.touchControls?.classList.add('active');
            this.elements.touchControls?.classList.remove('hidden');
        } else {
            this.elements.hud?.classList.remove('active');
            this.elements.hud?.classList.add('hidden');
            this.elements.touchControls?.classList.remove('active');
            this.elements.touchControls?.classList.add('hidden');
        }
    }

    updateHUD(stats) {
        if (!stats) return;

        // Cập nhật thời gian
        if (this.elements.timeDisplay) {
            this.elements.timeDisplay.textContent = stats.time || '00:00';
        }

        // Cập nhật thanh năng lượng
        if (this.elements.energyBar) {
            this.elements.energyBar.style.width = `${stats.energy}%`;
        }

        // Cập nhật thanh đói
        if (this.elements.hungerBar) {
            this.elements.hungerBar.style.width = `${stats.hunger}%`;
        }

        // Cập nhật thanh hạnh phúc
        if (this.elements.happinessBar) {
            this.elements.happinessBar.style.width = `${stats.happiness}%`;
        }
    }

    // ===== MESSAGES =====
    showMessage(message, duration = 2000) {
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }

        if (this.elements.saveMessage) {
            this.elements.saveMessage.textContent = message;
        }

        if (this.elements.saveConfirmation) {
            this.elements.saveConfirmation.classList.remove('hidden');

            this.messageTimeout = setTimeout(() => {
                this.elements.saveConfirmation?.classList.add('hidden');
                this.messageTimeout = null;
            }, duration);
        }
    }

    showSaveConfirmation() {
        this.showMessage('✅ Trò chơi đã được lưu!');
    }

    showError(message) {
        if (this.elements.errorText) {
            this.elements.errorText.textContent = message;
        }
        this.elements.errorOverlay?.classList.remove('hidden');
        this.elements.errorOverlay?.classList.add('active');

        // Ẩn sau 5 giây
        setTimeout(() => {
            this.elements.errorOverlay?.classList.add('hidden');
            this.elements.errorOverlay?.classList.remove('active');
        }, 5000);
    }

    // ===== DECORATION PANEL =====
    showDecorationPanel() {
        this.elements.decorationPanel?.classList.remove('hidden');
        this.elements.decorationPanel?.classList.add('active');
        window.LUMI.isPaused = true;
    }

    hideDecorationPanel() {
        this.elements.decorationPanel?.classList.add('hidden');
        this.elements.decorationPanel?.classList.remove('active');
        window.LUMI.isPaused = false;
    }

    switchDecorationTab(tabName) {
        // Ẩn tất cả tab
        document.querySelectorAll('.decoration-tab').forEach(tab => {
            tab.classList.add('hidden');
            tab.classList.remove('active');
        });

        // Hiện tab được chọn
        const tabToShow = document.getElementById(`${tabName}-tab`);
        if (tabToShow) {
            tabToShow.classList.remove('hidden');
            tabToShow.classList.add('active');
        }

        // Cập nhật button active
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
    }

    selectDecorationItem(type, color) {
        if (window.LUMI && window.LUMI.world) {
            // Trong phiên bản này, chúng ta chỉ hiển thị message
            this.showMessage(`Đã chọn ${type} màu ${color}`);
        }
    }

    // ===== GRAPHICS PRESETS =====
    applyGraphicsPreset(preset) {
        window.LUMI.currentGraphicsPreset = preset;

        if (!window.LUMI.renderer) return;

        // Cập nhật cài đặt renderer dựa trên preset
        switch (preset) {
            case 'performance':
                window.LUMI.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0));
                window.LUMI.renderer.shadowMap.enabled = false;
                if (window.LUMI.sunLight) window.LUMI.sunLight.castShadow = false;
                break;

            case 'balanced':
                window.LUMI.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
                window.LUMI.renderer.shadowMap.enabled = true;
                if (window.LUMI.sunLight) window.LUMI.sunLight.castShadow = true;
                break;

            case 'quality':
                window.LUMI.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                window.LUMI.renderer.shadowMap.enabled = true;
                if (window.LUMI.sunLight) window.LUMI.sunLight.castShadow = true;
                break;
        }

        // Cập nhật world quality
        if (window.LUMI.world) {
            window.LUMI.world.applyQualitySettings(preset);
        }
    }

    setGraphicsPreset(preset) {
        if (this.elements.graphicsPreset) {
            this.elements.graphicsPreset.value = preset;
            this.applyGraphicsPreset(preset);
        }
    }

    // ===== ORIENTATION =====
    checkOrientation() {
        const isPortrait = window.matchMedia("(max-aspect-ratio: 1/1)").matches;

        if (isPortrait && (window.LUMI?.isMobile || window.LUMI?.isTouchDevice)) {
            this.elements.orientationPrompt?.classList.remove('hidden');
            this.elements.orientationPrompt?.classList.add('active');
        } else {
            this.elements.orientationPrompt?.classList.add('hidden');
            this.elements.orientationPrompt?.classList.remove('active');
        }
    }

    // ===== CONTROLS VISIBILITY =====
    updateControlsVisibility() {
        if (!window.LUMI) return;

        const isMobile = window.LUMI.isMobile || window.LUMI.isTouchDevice;

        if (this.elements.touchControls) {
            if (isMobile && !this.isPaused) {
                this.elements.touchControls.classList.remove('hidden');
                this.elements.touchControls.classList.add('active');
            } else {
                this.elements.touchControls.classList.add('hidden');
                this.elements.touchControls.classList.remove('active');
            }
        }
    }

    // ===== UPDATE =====
    update(delta) {
        // Cập nhật interaction prompt
        if (window.LUMI && window.LUMI.player && window.LUMI.interactions) {
            const playerPos = window.LUMI.player.getPosition();
            const interactive = window.LUMI.interactions.checkForInteractions(playerPos);

            if (!interactive) {
                window.LUMI.interactions.hideInteractionPrompt();
            }
        }
    }

    onResize() {
        this.checkOrientation();
        this.updateControlsVisibility();
    }

    // ===== UTILITY =====
    hideAllOverlays() {
        const overlays = [
            'main-menu', 'settings-menu', 'tutorial-overlay',
            'pause-menu', 'decoration-panel', 'save-confirmation',
            'orientation-prompt'
        ];

        overlays.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('hidden');
                element.classList.remove('active');
            }
        });
    }
}