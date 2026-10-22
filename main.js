// ===== LUMI - Living World 3D =====
// Main Entry Point - Khởi tạo toàn bộ trò chơi
// Phát triển bởi: [Your Name]
// Ngày: 22/10/2026

// ===== CONSTANTS =====
const GAME_VERSION = "1.0.0";
const APP_NAME = "LUMI-Living-World";

// ===== GLOBAL STATE =====
window.LUMI = {
    scene: null,
    camera: null,
    renderer: null,
    world: null,
    player: null,
    controls: null,
    simulation: null,
    saveSystem: null,
    ui: null,
    audio: null,
    clock: new THREE.Clock(),
    isPaused: true,
    isLoaded: false,
    currentGraphicsPreset: 'balanced',
    settings: {
        soundEnabled: true,
        language: 'vi'
    },
    // device detection
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0
};

// ===== INITIALIZATION =====
async function init() {
    try {
        console.log(`🎮 [LUMI ${GAME_VERSION}] Khởi tăng...`);

        // 1. Khởi tạo renderer
        initRenderer();

        // 2. Khởi tạo scene
        initScene();

        // 3. Khởi tạo camera
        initCamera();

        // 4. Khởi tạo lighting
        initLighting();

        // 5. Khởi tạo world
        await initWorld();

        // 6. Khởi tạo player
        initPlayer();

        // 7. Khởi tạo controls
        initControls();

        // 8. Khởi tạo simulation system
        initSimulation();

        // 9. Khởi tăng save system
        initSaveSystem();

        // 10. Khởi tạo UI
        initUI();

        // 11. Khởi tạo audio
        initAudio();

        // 12. Thiết lập event listeners
        setupEventListeners();

        // 13. Kiểm tra WebGL
        if (!detectWebGL()) {
            LUMI.ui.showError("WebGL không được hỗ trợ trên thiết bị của bạn. Vui lòng cập nhật trình duyệt.");
            return;
        }

        // 14. Khởi tạo game state
        await LUMI.saveSystem.loadGame();

        // 15. Ẩn loading screen
        hideLoadingScreen();

        // 16. Bắt đầu game loop
        animate();

        console.log(`✅ [LUMI] Khởi tạo hoàn tất!`);

    } catch (error) {
        console.error("❌ [LUMI] Lỗi khởi tạo:", error);
        document.getElementById('loading-screen').style.display = 'none';
        LUMI.ui?.showError(`Lỗi khởi tạo: ${error.message}`);
    }
}

// ===== RENDERER SETUP =====
function initRenderer() {
    const canvas = document.getElementById('game-canvas');

    // Tạo renderer
    LUMI.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });

    // Cấu hình renderer
    LUMI.renderer.setSize(window.innerWidth, window.innerHeight);
    LUMI.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Giới hạn DPR cho mobile
    LUMI.renderer.shadowMap.enabled = true;
    LUMI.renderer.shadowMap.type = THREE.BasicShadowMap; // Tối ưu cho mobile
    LUMI.renderer.physicallyCorrectLights = true;
    LUMI.renderer.outputEncoding = THREE.sRGBEncoding;
    LUMI.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    LUMI.renderer.toneMappingExposure = 1.0;

    // Background color
    LUMI.renderer.setClearColor(0x87CEEB); // Sky blue

    // Xử lý window resize
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    if (!LUMI.camera || !LUMI.renderer) return;

    LUMI.camera.aspect = window.innerWidth / window.innerHeight;
    LUMI.camera.updateProjectionMatrix();

    LUMI.renderer.setSize(window.innerWidth, window.innerHeight);
    LUMI.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Cập nhật UI
    LUMI.ui?.onResize();
}

// ===== SCENE SETUP =====
function initScene() {
    LUMI.scene = new THREE.Scene();
    LUMI.scene.background = new THREE.Color(0x87CEEB);
    LUMI.scene.fog = new THREE.Fog(0x87CEEB, 50, 200); // Sương mù nhẹ
}

// ===== CAMERA SETUP =====
function initCamera() {
    LUMI.camera = new THREE.PerspectiveCamera(
        60, // FOV
        window.innerWidth / window.innerHeight,
        0.1, // Near
        1000 // Far
    );

    // Vị trí camera ban đầu
    LUMI.camera.position.set(0, 5, 10);

    // OrbitControls cho desktop debugging
    if (!LUMI.isMobile) {
        LUMI.orbitControls = new THREE.OrbitControls(
            LUMI.camera,
            document.getElementById('game-canvas')
        );
        LUMI.orbitControls.enableDamping = true;
        LUMI.orbitControls.dampingFactor = 0.1;
        LUMI.orbitControls.screenSpacePanning = false;
        LUMI.orbitControls.maxPolarAngle = Math.PI / 2 - 0.1;
        LUMI.orbitControls.minDistance = 2;
        LUMI.orbitControls.maxDistance = 50;
    }
}

// ===== LIGHTING SETUP =====
function initLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    LUMI.scene.add(ambientLight);

    // Directional light (Sun)
    LUMI.sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    LUMI.sunLight.position.set(10, 20, 10);
    LUMI.sunLight.castShadow = true;
    LUMI.sunLight.shadow.mapSize.width = 1024;
    LUMI.sunLight.shadow.mapSize.height = 1024;
    LUMI.sunLight.shadow.camera.near = 0.5;
    LUMI.sunLight.shadow.camera.far = 100;
    LUMI.sunLight.shadow.camera.left = -50;
    LUMI.sunLight.shadow.camera.right = 50;
    LUMI.sunLight.shadow.camera.top = 50;
    LUMI.sunLight.shadow.camera.bottom = -50;
    LUMI.scene.add(LUMI.sunLight);

    // Hemisphere light cho bầu không khí
    const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.3);
    LUMI.scene.add(hemiLight);

    // Đèn vườn (sẽ được thêm sau)
    LUMI.gardenLights = [];
}

// ===== WORLD INITIALIZATION =====
async function initWorld() {
    // Import world module
    const worldModule = await import('./world.js');
    LUMI.world = new worldModule.World(LUMI.scene);
    await LUMI.world.init();

    console.log("🌍 [LUMI] World loaded");
}

// ===== PLAYER INITIALIZATION =====
function initPlayer() {
    const playerModule = new URL('./player.js', import.meta.url).href;
    import(playerModule).then(module => {
        LUMI.player = new module.Player(LUMI.scene, LUMI.camera);
        LUMI.scene.add(LUMI.player.group);

        // Cập nhật camera target
        if (LUMI.player.cameraTarget) {
            LUMI.camera.lookAt(LUMI.player.cameraTarget.position);
        }

        console.log("👤 [LUMI] Player loaded");
    });
}

// ===== CONTROLS INITIALIZATION =====
function initControls() {
    const controlsModule = new URL('./controls.js', import.meta.url).href;
    import(controlsModule).then(module => {
        LUMI.controls = new module.Controls(LUMI.player);
        console.log("🎮 [LUMI] Controls loaded");
    });
}

// ===== SIMULATION INITIALIZATION =====
function initSimulation() {
    const simulationModule = new URL('./simulation.js', import.meta.url).href;
    import(simulationModule).then(module => {
        LUMI.simulation = new module.Simulation(LUMI.player);
        console.log("🔄 [LUMI] Simulation loaded");
    });
}

// ===== SAVE SYSTEM INITIALIZATION =====
function initSaveSystem() {
    const saveSystemModule = new URL('./save-system.js', import.meta.url).href;
    import(saveSystemModule).then(module => {
        LUMI.saveSystem = new module.SaveSystem();
        console.log("💾 [LUMI] Save System loaded");
    });
}

// ===== UI INITIALIZATION =====
function initUI() {
    const uiModule = new URL('./ui.js', import.meta.url).href;
    import(uiModule).then(module => {
        LUMI.ui = new module.UI();
        console.log("🎨 [LUMI] UI loaded");
    });
}

// ===== AUDIO INITIALIZATION =====
function initAudio() {
    const audioModule = new URL('./audio.js', import.meta.url).href;
    import(audioModule).then(module => {
        LUMI.audio = new module.AudioSystem();
        console.log("🔊 [LUMI] Audio loaded");
    });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Visibility change (tạm dừng khi tab không hoạt động)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            LUMI.isPaused = true;
        } else {
            LUMI.isPaused = false;
        }
    });

    // Keyboard events
    document.addEventListener('keydown', (event) => {
        if (LUMI.controls) {
            LUMI.controls.onKeyDown(event);
        }
    });

    document.addEventListener('keyup', (event) => {
        if (LUMI.controls) {
            LUMI.controls.onKeyUp(event);
        }
    });

    // Prevent context menu on touch devices
    document.addEventListener('contextmenu', (e) => {
        if (LUMI.isTouchDevice) {
            e.preventDefault();
        }
    });

    // orientation change
    window.addEventListener('orientationchange', () => {
        if (LUMI.ui) {
            LUMI.ui.checkOrientation();
        }
    });
}

// ===== WEBGL DETECTION =====
function detectWebGL() {
    try {
        const canvas = document.createElement('canvas');
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
    } catch (e) {
        return false;
    }
}

// ===== LOADING SCREEN =====
function updateLoadingProgress(progress) {
    const progressBar = document.getElementById('loading-progress');
    if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ===== MAIN GAME LOOP =====
function animate() {
    requestAnimationFrame(animate);

    if (LUMI.isPaused || !LUMI.isLoaded) {
        if (LUMI.orbitControls) LUMI.orbitControls.update();
        return;
    }

    // Update delta time
    const delta = LUMI.clock.getDelta();

    // Update systems
    if (LUMI controls) LUMI.controls.update(delta);
    if (LUMI.player) LUMI.player.update(delta);
    if (LUMI.world) LUMI.world.update(delta);
    if (LUMI.simulation) LUMI.simulation.update(delta);
    if (LUMI.ui) LUMI.ui.update(delta);
    if (LUMI.audio) LUMI.audio.update(delta);

    if (LUMI.orbitControls) LUMI.orbitControls.update();

    // Render
    if (LUMI.renderer) LUMI.renderer.render(LUMI.scene, LUMI.camera);
}

// ===== START GAME =====
window.addEventListener('load', init);