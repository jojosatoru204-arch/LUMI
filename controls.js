// ===== LUMI - CONTROLS SYSTEM =====
// Xử lý đầu vào từ bàn phím, chuột, và touch

export class Controls {
    constructor(player) {
        this.player = player;
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            space: false,
            shift: false
        };

        // Touch controls
        this.joystick = {
            active: false,
            base: null,
            stick: null,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            radius: 0
        };

        this.cameraControl = {
            active: false,
            startX: 0,
            startY: 0,
            startRotationX: 0,
            startRotationY: 0
        };

        this.touchStartTime = 0;
        this.lastTapTime = 0;
        this.tapCount = 0;

        // Khởi tạo UI controls
        this.initTouchControls();

        // Khởi tạo event listeners
        this.initEventListeners();
    }

    // ===== INITIALIZATION =====
    initTouchControls() {
        // Joystick base
        this.joystick.base = document.getElementById('joystick-base');
        this.joystick.stick = document.getElementById('joystick-stick');

        if (this.joystick.base && this.joystick.stick) {
            const size = parseInt(window.getComputedStyle(this.joystick.base).width);
            this.joystick.radius = size * 0.4;
        }

        // Camera rotate zone
        this.cameraRotateZone = document.getElementById('camera-rotate-zone');

        // Action buttons
        this.interactBtn = document.getElementById('interact-btn');
        this.jumpBtn = document.getElementById('jump-btn');

        // Ẩn/hiện controls dựa trên thiết bị
        this.updateControlsVisibility();
    }

    initEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

        // Touch events
        this.joystick.base?.addEventListener('touchstart', this.onJoystickStart.bind(this), { passive: false });
        this.cameraRotateZone?.addEventListener('touchstart', this.onCameraRotateStart.bind(this), { passive: false });

        // Global touch events
        document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.onTouchEnd.bind(this));

        // Button events
        this.interactBtn?.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.onInteract();
        });

        this.interactBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.onInteract();
        });

        this.jumpBtn?.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.player.jump();
        });

        this.jumpBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.player.jump();
        });

        // Window resize
        window.addEventListener('resize', this.onResize.bind(this));
    }

    // ===== KEYBOARD CONTROLS =====
    onKeyDown(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return; // Không xử lý nếu đang focus vào form
        }

        switch (event.code) {
            case 'KeyW':
                this.keys.w = true;
                event.preventDefault();
                break;
            case 'KeyA':
                this.keys.a = true;
                event.preventDefault();
                break;
            case 'KeyS':
                this.keys.s = true;
                event.preventDefault();
                break;
            case 'KeyD':
                this.keys.d = true;
                event.preventDefault();
                break;
            case 'Space':
                this.keys.space = true;
                this.player.jump();
                event.preventDefault();
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.keys.shift = true;
                this.player.moveSpeed.current = this.player.moveSpeed.run;
                event.preventDefault();
                break;
            case 'Escape':
                this.onEscape();
                event.preventDefault();
                break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
                this.keys.w = false;
                break;
            case 'KeyA':
                this.keys.a = false;
                break;
            case 'KeyS':
                this.keys.s = false;
                break;
            case 'KeyD':
                this.keys.d = false;
                break;
            case 'Space':
                this.keys.space = false;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.keys.shift = false;
                this.player.moveSpeed.current = this.player.moveSpeed.walk;
                break;
        }

        // Kiểm tra nếu không có phím di chuyển nào
        if (!this.keys.w && !this.keys.a && !this.keys.s && !this.keys.d) {
            this.player.stopMovement();
        }
    }

    // ===== TOUCH CONTROLS =====
    onJoystickStart(event) {
        if (!this.joystick.base || !this.joystick.stick) return;

        event.preventDefault();
        this.joystick.active = true;

        const rect = this.joystick.base.getBoundingClientRect();
        const touch = event.touches[0];

        this.joystick.startX = touch.clientX - rect.left - rect.width / 2;
        this.joystick.startY = touch.clientY - rect.top - rect.height / 2;
        this.joystick.radius = rect.width * 0.4;

        // Thiết lập vị trí stick ban đầu
        this.joystick.stick.style.left = '50%';
        this.joystick.stick.style.top = '50%';
        this.joystick.stick.style.transform = 'translate(-50%, -50%)';
    }

    onTouchMove(event) {
        if (!this.joystick.active) return;

        event.preventDefault();
        const touch = event.touches[0];

        const rect = this.joystick.base.getBoundingClientRect();
        let x = touch.clientX - rect.left - rect.width / 2;
        let y = touch.clientY - rect.top - rect.height / 2;

        // Giới hạn stick trong vòng tròn
        const distance = Math.sqrt(x * x + y * y);
        if (distance > this.joystick.radius) {
            x = (x / distance) * this.joystick.radius;
            y = (y / distance) * this.joystick.radius;
        }

        this.joystick.currentX = x;
        this.joystick.currentY = y;

        // Cập nhật vị trí stick
        this.updateJoystickVisual();

        // Cập nhật player movement
        const moveX = x / this.joystick.radius;
        const moveZ = y / this.joystick.radius;
        this.player.move(moveX, -moveZ);
    }

    onTouchEnd(event) {
        if (this.joystick.active) {
            event.preventDefault();
            this.joystick.active = false;
            this.player.stopMovement();
            this.resetJoystick();
        }

        if (this.cameraControl.active) {
            event.preventDefault();
            this.cameraControl.active = false;
        }
    }

    onCameraRotateStart(event) {
        event.preventDefault();
        this.cameraControl.active = true;

        const touch = event.touches[0];
        this.cameraControl.startX = touch.clientX;
        this.cameraControl.startY = touch.clientY;

        if (this.player.cameraPivot) {
            this.cameraControl.startRotationX = this.player.cameraPivot.rotation.x;
            this.cameraControl.startRotationY = this.player.cameraPivot.rotation.y;
        }
    }

    updateJoystickVisual() {
        if (!this.joystick.stick) return;

        const stickSize = parseInt(window.getComputedStyle(this.joystick.stick).width) / 2;
        this.joystick.stick.style.left = `calc(50% + ${this.joystick.currentX}px)`;
        this.joystick.stick.style.top = `calc(50% + ${this.joystick.currentY}px)`;
    }

    resetJoystick() {
        if (this.joystick.stick) {
            this.joystick.stick.style.left = '50%';
            this.joystick.stick.style.top = '50%';
            this.joystick.stick.style.transform = 'translate(-50%, -50%)';
        }
    }

    onInteract() {
        if (window.LUMI && window.LUMI.world && window.LUMI.interactions) {
            const playerPos = this.player.getPosition();
            const interactive = window.LUMI.world.getInteractiveObjectAt(playerPos);

            if (interactive) {
                window.LUMI.interactions.triggerInteraction(interactive);
            }
        }
    }

    onEscape() {
        if (window.LUMI && window.LUMI.ui) {
            window.LUMI.ui.togglePauseMenu();
        }
    }

    // ===== UPDATE =====
    update(delta) {
        // Xử lý điều khiển bàn phím
        if (this.keys.w || this.keys.a || this.keys.s || this.keys.d) {
            let directionX = 0;
            let directionZ = 0;

            if (this.keys.w) directionZ -= 1;
            if (this.keys.s) directionZ += 1;
            if (this.keys.a) directionX -= 1;
            if (this.keys.d) directionX += 1;

            // Chuẩn hóa vector
            const length = Math.sqrt(directionX * directionX + directionZ * directionZ);
            if (length > 0) {
                directionX /= length;
                directionZ /= length;
            }

            this.player.move(directionX, directionZ);
        }
    }

    // ===== UTILITY =====
    updateControlsVisibility() {
        const isMobile = window.LUMI?.isMobile || false;
        const touchControls = document.getElementById('touch-controls');

        if (touchControls) {
            if (isMobile) {
                touchControls.classList.add('active');
                touchControls.classList.remove('hidden');
            } else {
                touchControls.classList.remove('active');
                touchControls.classList.add('hidden');
            }
        }
    }

    onResize() {
        this.updateControlsVisibility();
    }
}