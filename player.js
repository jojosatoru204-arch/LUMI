// ===== LUMI - PLAYER SYSTEM =====
// Nhân vật 3D với điều khiểnThird-person camera, collision, và physics đơn giản

export class Player {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.group = new THREE.Group();
        this.group.name = "player";

        // Vật lý
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.onGround = false;
        this.jumpForce = 0.15;
        this.moveSpeed = {
            walk: 0.1,
            run: 0.15,
            current: 0.1
        };
        this.rotationSpeed = 0.1;
        this.gravity = 0.02;
        this.height = 1.8;
        this.radius = 0.3;

        // Camera
        this.cameraOffset = new THREE.Vector3(0, 1.5, -3);
        this.cameraTarget = new THREE.Group();
        this.cameraTarget.position.y = this.height;
        this.group.add(this.cameraTarget);

        // Đổi hướng camera
        this.cameraPivot = new THREE.Group();
        this.cameraPivot.position.y = this.height;
        this.group.add(this.cameraPivot);

        // Trạng thái
        this.isMoving = false;
        this.isJumping = false;
        this.isSitting = false;

        // Khởi tạo mesh nhân vật
        this.initMesh();

        // Khởi tạo collision detector
        this.initCollision();

        // Cập nhật camera ban đầu
        this.updateCamera();
    }

    // ===== INITIALIZATION =====
    initMesh() {
        // Thân (Cylinder)
        const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.8, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFB74D,
            roughness: 0.6
        });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.position.y = 0.5;
        this.body.castShadow = true;
        this.body.receiveShadow = true;
        this.group.add(this.body);

        // Đầu (Sphere)
        const headGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFDBCB,
            roughness: 0.7
        });
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.head.position.y = 0.8 + 0.2;
        this.head.castShadow = true;
        this.group.add(this.head);

        // Tay trái
        const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
        this.leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
        this.leftArm.position.set(-0.3, 0.6, 0);
        this.leftArm.rotation.z = Math.PI / 4;
        this.group.add(this.leftArm);

        // Tay phải
        this.rightArm = this.leftArm.clone();
        this.rightArm.position.x = 0.3;
        this.rightArm.rotation.z = -Math.PI / 4;
        this.group.add(this.rightArm);

        // Chân trái
        const legGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8);
        this.leftLeg = new THREE.Mesh(legGeometry, new THREE.MeshStandardMaterial({
            color: 0x4A90E2,
            roughness: 0.6
        }));
        this.leftLeg.position.set(-0.1, -0.2, 0);
        this.group.add(this.leftLeg);

        // Chân phải
        this.rightLeg = this.leftLeg.clone();
        this.rightLeg.position.x = 0.1;
        this.group.add(this.rightLeg);

        // Vị trí ban đầu
        this.group.position.set(0, this.height, -5);
    }

    initCollision() {
        // Collision helper (Box3)
        this.collisionBox = new THREE.Box3(
            new THREE.Vector3(-this.radius, 0, -this.radius),
            new THREE.Vector3(this.radius, this.height, this.radius)
        );
    }

    // ===== UPDATE =====
    update(delta) {
        // Nếu đang ngồi, không di chuyển
        if (this.isSitting) {
            this.velocity.x = 0;
            this.velocity.z = 0;
        } else {
            // Áp dụng gravity
            if (!this.onGround) {
                this.velocity.y -= this.gravity;
            }

            // Cập nhật vị trí
            this.group.position.add(this.velocity);

            // Raycast để kiểm tra va chạm đất
            this.checkGround();
        }

        // Cập nhật animation
        this.updateAnimation(delta);

        // Cập nhật camera
        this.updateCamera();
    }

    // ===== MOVEMENT =====
    move(directionX, directionZ) {
        this.direction.set(directionX, 0, directionZ).normalize();

        //-oxoay nhân vật theo hướng di chuyển
        if (this.direction.length() > 0.1) {
            const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 0, 1),
                this.direction
            );
            this.group.quaternion.slerp(targetQuaternion, this.rotationSpeed * 10);
        }

        // Áp dụng movement
        this.velocity.x = this.direction.x * this.moveSpeed.current;
        this.velocity.z = this.direction.z * this.moveSpeed.current;
        this.isMoving = true;

        // Gửi sự kiện di chuyển (cho footsteps)
        if (window.LUMI.audio && this.onGround && (Math.abs(this.velocity.x) > 0.01 || Math.abs(this.velocity.z) > 0.01)) {
            window.LUMI.audio.playSound('footstep', 0.3);
        }
    }

    stopMovement() {
        this.velocity.x = 0;
        this.velocity.z = 0;
        this.isMoving = false;
    }

    jump() {
        if (this.onGround && !this.isJumping && !this.isSitting) {
            this.velocity.y = this.jumpForce;
            this.onGround = false;
            this.isJumping = true;

            if (window.LUMI.audio) {
                window.LUMI.audio.playSound('jump');
            }
        }
    }

    sit() {
        this.isSitting = true;
        this.moveSpeed.current = 0;
        this.cameraOffset.y = 0.8;
    }

    standUp() {
        this.isSitting = false;
        this.moveSpeed.current = this.moveSpeed.walk;
        this.cameraOffset.y = 1.5;
    }

    // ===== CAMERA =====
    updateCamera() {
        if (!this.camera) return;

        // Vị trí camera theo sau nhân vật
        const cameraPosition = this.group.position.clone()
            .add(this.cameraOffset.clone().applyQuaternion(this.cameraPivot.quaternion));

        this.camera.position.lerp(cameraPosition, 0.1);

        // Camera look at target
        const targetPosition = this.cameraTarget.position.clone();
        this.camera.lookAt(targetPosition);

        // Collision camera (tránh đi xuyên tường)
        this.checkCameraCollision();
    }

    checkCameraCollision() {
        // Raycast từ nhân vật đến camera
        const rayDirection = this.camera.position.clone()
            .sub(this.group.position)
            .normalize();

        const raycaster = new THREE.Raycaster(
            this.group.position,
            rayDirection,
            0.1,
            this.cameraOffset.length() * 1.5
        );

        const intersects = raycaster.intersectObjects(this.getCollidableObjects());

        if (intersects.length > 0) {
            const distance = intersects[0].distance;
            const desiredDistance = this.cameraOffset.length();
            const adjustment = (desiredDistance - distance) * 0.5;

            this.camera.position.add(
                rayDirection.clone().multiplyScalar(adjustment)
            );
        }
    }

    // ===== COLLISION =====
    checkGround() {
        const raycaster = new THREE.Raycaster(
            this.group.position,
            new THREE.Vector3(0, -1, 0),
            0,
            this.height + 0.1
        );

        const intersects = raycaster.intersectObjects(this.getCollidableObjects());

        this.onGround = intersects.length > 0;
        if (this.onGround && this.isJumping) {
            this.isJumping = false;
            this.velocity.y = 0;

            // Đặt nhân vật đúng vị trí trên mặt đất
            if (intersects[0].distance < this.height) {
                this.group.position.y = intersects[0].point.y + this.height - 0.01;
            }
        }
    }

    checkWallCollision() {
        // Kiểm tra va chạm následujících hướng
        const directions = [
            { dir: new THREE.Vector3(1, 0, 0), sign: 1 },
            { dir: new THREE.Vector3(-1, 0, 0), sign: -1 },
            { dir: new THREE.Vector3(0, 0, 1), sign: 1 },
            { dir: new THREE.Vector3(0, 0, -1), sign: -1 }
        ];

        const collidableObjects = this.getCollidableObjects();
        let result = false;

        for (const { dir, sign } of directions) {
            const raycaster = new THREE.Raycaster(
                this.group.position,
                dir,
                0,
                this.radius + 0.2
            );

            const intersects = raycaster.intersectObjects(collidableObjects);

            if (intersects.length > 0 && intersects[0].distance < this.radius + 0.2) {
                // Lùi nhân vật ra khỏi bức tường
                const adjustment = (this.radius + 0.21 - intersects[0].distance) * sign;
                if (Math.abs(dir.x) > 0) {
                    this.group.position.x += adjustment;
                    this.velocity.x = 0;
                }
                if (Math.abs(dir.z) > 0) {
                    this.group.position.z += adjustment;
                    this.velocity.z = 0;
                }
                result = true;
            }
        }

        return result;
    }

    getCollidableObjects() {
        // Lấy tất cả vật thể có thể va chạm
        const collidable = [];

        if (window.LUMI && window.LUMI.world) {
            // Nhà
            if (window.LUMI.world.objects.house) {
                window.LUMI.world.objects.house.traverse(child => {
                    if (child.isMesh && child.visible) {
                        collidable.push(child);
                    }
                });
            }

            // Đồ nội thất
            for (const key in window.LUMI.world.objects.furniture) {
                const obj = window.LUMI.world.objects.furniture[key];
                if (obj && obj.isMesh) {
                    collidable.push(obj);
                } else if (obj && obj.isGroup) {
                    obj.traverse(child => {
                        if (child.isMesh) collidable.push(child);
                    });
                }
            }

            // Mặt đất
            if (window.LUMI.world.objects.environment.ground) {
                collidable.push(window.LUMI.world.objects.environment.ground);
            }
        }

        return collidable;
    }

    // ===== ANIMATION =====
    updateAnimation(delta) {
        const time = Date.now() * 0.001;

        // Di chuyển cánh tay khi đi
        if (this.isMoving) {
            this.leftArm.rotation.x = Math.sin(time * 10) * 0.2;
            this.rightArm.rotation.x = -Math.sin(time * 10) * 0.2;
        } else {
            this.leftArm.rotation.x = 0;
            this.rightArm.rotation.x = 0;
        }

        // Di chuyển chân
        if (this.isMoving) {
            this.leftLeg.rotation.x = Math.sin(time * 10) * 0.3;
            this.rightLeg.rotation.x = -Math.sin(time * 10) * 0.3;
        } else {
            this.leftLeg.rotation.x = 0;
            this.rightLeg.rotation.x = 0;
        }

        // Nhấp nháy đầu nhẹ
        this.head.rotation.y = Math.sin(time * 2) * 0.05;
    }

    // ===== UTILITY =====
    getPosition() {
        return this.group.position.clone();
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y || this.height, z);
        this.cameraTarget.position.set(x, this.height, z);
    }

    teleportTo(position) {
        this.setPosition(position.x, position.y, position.z);
    }
}