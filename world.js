// ===== LUMI - WORLD SYSTEM =====
// Xây dựng toàn bộ thế giới: Nhà, vườn, môi trường xung quanh

export class World {
    constructor(scene) {
        this.scene = scene;
        this.objects = {
            house: null,
            garden: null,
            furniture: {},
            environment: {},
            interactive: []
        };
        this.materials = {};
        this.textures = {};
        this.clock = new THREE.Clock();
    }

    async init() {
        console.log("🌍 [World] Bắt đầu xây dựng thế giới...");

        // 1. Khởi tạo materials
        this.initMaterials();

        // 2. Xây dựng đất nền
        this.buildGround();

        // 3. Xây dựng ngôi nhà
        await this.buildHouse();

        // 4. Xây dựng khu vườn
        this.buildGarden();

        // 5. Xây dựng môi trường xung quanh
        this.buildEnvironment();

        // 6. Thêm các vật thể tương tác
        this.addInteractiveObjects();

        // 7. Thêm ánh sáng ban đêm
        this.addNightLights();

        console.log("✅ [World] Thế giới đã được xây dựng hoàn tất!");
        window.LUMI.isLoaded = true;
    }

    // ===== MATERIALS =====
    initMaterials() {
        // Soil material (đất)
        this.materials.soil = new THREE.MeshStandardMaterial({
            color: 0x5D4037,
            roughness: 0.9,
            metalness: 0.1
        });

        // Grass material (cỏ)
        this.materials.grass = new THREE.MeshStandardMaterial({
            color: 0x4CAF50,
            roughness: 0.8,
            metalness: 0.05
        });

        // Wood material (gỗ)
        this.materials.wood = new THREE.MeshStandardMaterial({
            color: 0x8D6E63,
            roughness: 0.7,
            metalness: 0.1
        });

        // Stone material (đá)
        this.materials.stone = new THREE.MeshStandardMaterial({
            color: 0x795548,
            roughness: 0.85,
            metalness: 0.15
        });

        // Roof material (mái nhà)
        this.materials.roof = new THREE.MeshStandardMaterial({
            color: 0x3E2723,
            roughness: 0.7,
            metalness: 0.2
        });

        // Wall material (tường)
        this.materials.wall = new THREE.MeshStandardMaterial({
            color: 0xEFEBE9,
            roughness: 0.5,
            metalness: 0.05
        });

        // Window material (cửa sổ)
        this.materials.window = new THREE.MeshStandardMaterial({
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.3,
            roughness: 0.1,
            metalness: 0.0
        });

        // Fabric material (vải)
        this.materials.fabric = new THREE.MeshStandardMaterial({
            color: 0xFFB74D,
            roughness: 0.6,
            metalness: 0.0
        });

        // Metal material (kim loại)
        this.materials.metal = new THREE.MeshStandardMaterial({
            color: 0xB0BEC5,
            roughness: 0.3,
            metalness: 0.8
        });

        // Glass material (thủy tinh)
        this.materials.glass = new THREE.MeshStandardMaterial({
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.5,
            roughness: 0.1,
            metalness: 0.1
        });
    }

    // ===== GROUND =====
    buildGround() {
        // Tạo mặt đất hình chữ nhật lớn
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x4CAF50,
            roughness: 0.9,
            metalness: 0.05
        });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        this.objects.environment.ground = ground;

        // Thêm texture đất (sử dụng noise cho biến thể)
        this.addGroundTexture(ground);
    }

    addGroundTexture(ground) {
        // Tạo texture procedural cho đất
        const textureSize = 512;
        const canvas = document.createElement('canvas');
        canvas.width = textureSize;
        canvas.height = textureSize;
        const ctx = canvas.getContext('2d');

        // Vẽ background
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(0, 0, textureSize, textureSize);

        // Vẽ các đường viền đất
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * textureSize;
            const y = Math.random() * textureSize;
            const size = Math.random() * 20 + 10;
            const darkness = Math.random() * 0.2;
            ctx.fillStyle = `rgba(76, 175, 80, ${1 - darkness})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 4;
        ground.material.map = texture;
        ground.material.needsUpdate = true;
    }

    // ===== HOUSE =====
    async buildHouse() {
        this.objects.house = new THREE.Group();
        this.scene.add(this.objects.house);

        // 1. Móng nhà
        this.buildFoundation();

        // 2. Tường
        this.buildWalls();

        // 3. Mái nhà
        this.buildRoof();

        // 4. Cửa ra vào
        this.buildDoor();

        // 5. Cửa sổ
        this.buildWindows();

        // 6. Nội thất
        await this.buildInterior();

        // Thiết lập collision cho ngôi nhà
        this.setupHouseCollision();
    }

    buildFoundation() {
        // Móng nhà (hình chữ nhật 12x8)
        const foundationGeometry = new THREE.BoxGeometry(12, 0.5, 8);
        const foundation = new THREE.Mesh(foundationGeometry, this.materials.stone);
        foundation.position.y = 0.25;
        foundation.castShadow = true;
        foundation.receiveShadow = true;
        this.objects.house.add(foundation);
        this.objects.environment.foundation = foundation;
    }

    buildWalls() {
        // Tường trước
        const wallGeometry = new THREE.BoxGeometry(12, 3, 0.3);
        const frontWall = new THREE.Mesh(wallGeometry, this.materials.wall);
        frontWall.position.set(0, 1.5, -4);
        frontWall.castShadow = true;
        frontWall.receiveShadow = true;
        this.objects.house.add(frontWall);

        // Tường sau
        const backWall = frontWall.clone();
        backWall.position.z = 4;
        this.objects.house.add(backWall);

        // Tường trái
        const sideWallGeometry = new THREE.BoxGeometry(0.3, 3, 8);
        const leftWall = new THREE.Mesh(sideWallGeometry, this.materials.wall);
        leftWall.position.set(-6, 1.5, 0);
        leftWall.castShadow = true;
        this.objects.house.add(leftWall);

        // Tường phải
        const rightWall = leftWall.clone();
        rightWall.position.x = 6;
        this.objects.house.add(rightWall);
    }

    buildRoof() {
        // Mái nhà (hình chóp)
        const roofGeometry = new THREE.ConeGeometry(7, 4, 4);
        roofGeometry.rotateX(Math.PI / 2);
        roofGeometry.translate(0, 3, 0);

        const roof = new THREE.Mesh(roofGeometry, this.materials.roof);
        roof.position.y = 4;
        roof.castShadow = true;
        this.objects.house.add(roof);

        //Deux prisms
        const roofSideGeometry = new THREE.BoxGeometry(12, 0.3, 1);
        const roofSide1 = new THREE.Mesh(roofSideGeometry, this.materials.roof);
        roofSide1.position.set(0, 5, -4.5);
        roofSide1.rotation.x = Math.PI / 4;
        this.objects.house.add(roofSide1);

        const roofSide2 = roofSide1.clone();
        roofSide2.position.z = 4.5;
        roofSide2.rotation.x = -Math.PI / 4;
        this.objects.house.add(roofSide2);
    }

    buildDoor() {
        // Khung cửa
        const doorFrameGeometry = new THREE.BoxGeometry(2.5, 2.5, 0.3);
        const doorFrame = new THREE.Mesh(doorFrameGeometry, this.materials.wood);
        doorFrame.position.set(0, 1.25, -4);
        doorFrame.castShadow = true;
        this.objects.house.add(doorFrame);

        // Cửa (có thể mở/đóng)
        this.objects.furniture.door = new THREE.Group();
        const doorGeometry = new THREE.BoxGeometry(2.2, 2.2, 0.1);
        const door = new THREE.Mesh(doorGeometry, this.materials.wood);
        door.position.z = 0.05;
        door.castShadow = true;
        this.objects.furniture.door.add(door);

        // Tay nắm cửa
        const handleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16);
        const handle = new THREE.Mesh(handleGeometry, this.materials.metal);
        handle.rotation.x = Math.PI / 2;
        handle.position.set(1, 0, 0.1);
        door.add(handle);

        this.objects.furniture.door.position.set(0, 1.25, -4);
        this.objects.house.add(this.objects.furniture.door);
        this.objects.interactive.push({
            object: this.objects.furniture.door,
            type: 'door',
            name: 'Cửa ra vào',
            action: this.toggleDoor.bind(this)
        });
    }

    buildWindows() {
        // Cửa sổ trưởng
        const windowGeometry = new THREE.BoxGeometry(2, 1.5, 0.1);
        const windowFrame = new THREE.Mesh(windowGeometry, this.materials.wood);
        windowFrame.position.set(-3, 2, -4);
        windowFrame.castShadow = true;
        this.objects.house.add(windowFrame);

        // Kính cửa sổ
        const glassGeometry = new THREE.BoxGeometry(1.8, 1.3, 0.05);
        const windowGlass = new THREE.Mesh(glassGeometry, this.materials.window);
        windowGlass.position.z = 0.05;
        windowFrame.add(windowGlass);

        // Cửa sổ phía sau
        const backWindow = windowFrame.clone();
        backWindow.position.z = 4;
        this.objects.house.add(backWindow);

        // Cửa sổ bên trái
        const sideWindow = windowFrame.clone();
        sideWindow.rotation.y = Math.PI / 2;
        sideWindow.position.set(-6, 2, 2);
        this.objects.house.add(sideWindow);

        // Cửa sổ bên phải
        const rightWindow = sideWindow.clone();
        rightWindow.position.x = 6;
        this.objects.house.add(rightWindow);
    }

    async buildInterior() {
        // Sàn nhà
        const floorGeometry = new THREE.BoxGeometry(11.5, 0.2, 7.5);
        const floor = new THREE.Mesh(floorGeometry, this.materials.wood);
        floor.position.y = 0.5;
        floor.receiveShadow = true;
        this.objects.house.add(floor);

        // Ghế sofa
        await this.buildSofa();

        // Bàn cà phê
        this.buildCoffeeTable();

        // Giường
        this.buildBed();

        // Đèn
        this.buildLamp();

        // Kệ sách
        this.buildBookshelf();

        // Tủ lạnh
        this.buildFridge();

        // Bếp
        this.buildStove();

        // Cây cảnh
        this.buildIndoorPlants();
    }

    buildSofa() {
        // Ghế sofa L-shape
        const sofaGroup = new THREE.Group();

        // Phần dài
        const sofaBaseGeometry = new THREE.BoxGeometry(2.5, 0.5, 1);
        const sofaBase = new THREE.Mesh(sofaBaseGeometry, this.materials.wood);
        sofaBase.castShadow = true;
        sofaGroup.add(sofaBase);

        // Đệm
        const cushionGeometry = new THREE.BoxGeometry(2.4, 0.4, 0.9);
        const cushion = new THREE.Mesh(cushionGeometry, this.materials.fabric);
        cushion.position.y = 0.5 + 0.2;
        sofaGroup.add(cushion);

        // Lưng ghế
        const backrestGeometry = new THREE.BoxGeometry(2.4, 0.6, 0.1);
        const backrest = new THREE.Mesh(backrestGeometry, this.materials.fabric);
        backrest.position.set(0, 0.5 + 0.5, -0.4);
        sofaGroup.add(backrest);

        // Phần ngắn
        const shortBase = sofaBase.clone();
        shortBase.scale.x = 0.8;
        shortBase.position.x = 1.25;
        sofaGroup.add(shortBase);

        const shortCushion = cushion.clone();
        shortCushion.scale.x = 0.8;
        shortCushion.position.x = 1.25;
        sofaGroup.add(shortCushion);

        const shortBackrest = backrest.clone();
        shortBackrest.scale.x = 0.8;
        shortBackrest.position.x = 1.25;
        sofaGroup.add(shortBackrest);

        sofaGroup.position.set(-3, 0.5, 1);
        sofaGroup.name = 'sofa';
        this.objects.house.add(sofaGroup);
        this.objects.furniture.sofa = sofaGroup;
        this.objects.interactive.push({
            object: sofaGroup,
            type: 'sofa',
            name: 'Ghế Sofa',
            action: this.sitOnFurniture.bind(this)
        });
    }

    buildCoffeeTable() {
        // Bàn cà phê
        const tableGroup = new THREE.Group();

        // Mặt bàn
        const tableTopGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32);
        const tableTop = new THREE.Mesh(tableTopGeometry, this.materials.wood);
        tableTop.position.y = 0.75;
        tableTop.castShadow = true;
        tableGroup.add(tableTop);

        // Chân bàn
        const legGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 16);
        const leg1 = new THREE.Mesh(legGeometry, this.materials.wood);
        leg1.position.set(0.5, 0.35, 0.5);
        tableGroup.add(leg1);

        const leg2 = leg1.clone();
        leg2.position.x = -0.5;
        tableGroup.add(leg2);

        const leg3 = leg1.clone();
        leg3.position.z = -0.5;
        tableGroup.add(leg3);

        const leg4 = leg2.clone();
        leg4.position.z = -0.5;
        tableGroup.add(leg4);

        tableGroup.position.set(-3, 0, 0.5);
        tableGroup.name = 'coffee_table';
        this.objects.house.add(tableGroup);
        this.objects.furniture.coffeeTable = tableGroup;
    }

    buildBed() {
        // Giường ngủ
        const bedGroup = new THREE.Group();

        // Khung giường
        const frameGeometry = new THREE.BoxGeometry(2, 0.3, 1.5);
        const frame = new THREE.Mesh(frameGeometry, this.materials.wood);
        frame.position.y = 0.5;
        bedGroup.add(frame);

        // Đệm
        const mattressGeometry = new THREE.BoxGeometry(1.8, 0.2, 1.3);
        const mattress = new THREE.Mesh(mattressGeometry, new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0.8
        }));
        mattress.position.y = 0.5 + 0.15;
        bedGroup.add(mattress);

        // Gối
        const pillowGeometry = new THREE.BoxGeometry(0.5, 0.15, 0.4);
        const pillow = new THREE.Mesh(pillowGeometry, this.materials.fabric);
        pillow.position.set(0, 0.5 + 0.3, 0.4);
        bedGroup.add(pillow);

        // Chăn
        const blanketGeometry = new THREE.BoxGeometry(1.6, 0.05, 1.1);
        const blanket = new THREE.Mesh(blanketGeometry, new THREE.MeshStandardMaterial({
            color: 0xFFB74D,
            roughness: 0.7
        }));
        blanket.position.y = 0.5 + 0.18;
        bedGroup.add(blanket);

        bedGroup.position.set(3, 0, -1);
        bedGroup.name = 'bed';
        this.objects.house.add(bedGroup);
        this.objects.furniture.bed = bedGroup;
        this.objects.interactive.push({
            object: bedGroup,
            type: 'bed',
            name: 'Giường ngủ',
            action: this.sleepOnBed.bind(this)
        });
    }

    buildLamp() {
        // Đèn đứng
        const lampGroup = new THREE.Group();

        // Cột đèn
        const poleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 16);
        const pole = new THREE.Mesh(poleGeometry, this.materials.metal);
        pole.position.y = 0.75;
        lampGroup.add(pole);

        // Đèn
        const lightBulbGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const lightBulb = new THREE.Mesh(lightBulbGeometry, new THREE.MeshStandardMaterial({
            color: 0xFFEB3B,
            emissive: 0xFFEB3B,
            emissiveIntensity: 0.5
        }));
        lightBulb.position.y = 1.5;
        lampGroup.add(lightBulb);

        // Mừng đèn
        const shadeGeometry = new THREE.ConeGeometry(0.15, 0.2, 16);
        shadeGeometry.rotateX(Math.PI);
        const shade = new THREE.Mesh(shadeGeometry, this.materials.metal);
        shade.position.y = 1.4;
        lampGroup.add(shade);

        // Ánh sáng
        const lampLight = new THREE.PointLight(0xFFEB3B, 0, 10);
        lampLight.position.y = 1.5;
        lampGroup.add(lampLight);

        lampGroup.position.set(0, 0, 2);
        lampGroup.name = 'lamp';
        this.objects.house.add(lampGroup);
        this.objects.furniture.lamp = lampGroup;
        this.objects.interactive.push({
            object: lampGroup,
            type: 'lamp',
            name: 'Đèn',
            action: this.toggleLamp.bind(this),
            light: lampLight
        });
    }

    buildBookshelf() {
        // Kệ sách
        const shelfGroup = new THREE.Group();

        // Khung kệ
        const frameGeometry = new THREE.BoxGeometry(1.2, 1.5, 0.3);
        const frame = new THREE.Mesh(frameGeometry, this.materials.wood);
        shelfGroup.add(frame);

        // Các ngăn kệ
        for (let i = 0; i < 3; i++) {
            const shelfGeometry = new THREE.BoxGeometry(1, 0.1, 0.25);
            const shelf = new THREE.Mesh(shelfGeometry, this.materials.wood);
            shelf.position.y = 0.5 - 0.5 + i * 0.5;
            shelfGroup.add(shelf);

            // Sách
            for (let j = 0; j < 3; j++) {
                const bookGeometry = new THREE.BoxGeometry(0.15, 0.12, 0.2);
                const book = new THREE.Mesh(bookGeometry, new THREE.MeshStandardMaterial({
                    color: Math.random() * 0xFFFFFF
                }));
                book.position.set(-0.35 + j * 0.2, 0.5 - 0.5 + i * 0.5 + 0.05, 0.1);
                shelfGroup.add(book);
            }
        }

        shelfGroup.position.set(4, 0.75, -2);
        this.objects.house.add(shelfGroup);
        this.objects.furniture.bookshelf = shelfGroup;
    }

    buildFridge() {
        // Tủ lạnh
        const fridgeGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.6);
        const fridge = new THREE.Mesh(fridgeGeometry, new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0.3,
            metalness: 0.2
        }));
        fridge.position.set(5, 0.75, -2);
        fridge.castShadow = true;
        this.objects.house.add(fridge);
        this.objects.furniture.fridge = fridge;
    }

    buildStove() {
        // Bếp
        const stoveGroup = new THREE.Group();

        // Mặt bếp
        const stoveTopGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.5);
        const stoveTop = new THREE.Mesh(stoveTopGeometry, this.materials.metal);
        stoveGroup.add(stoveTop);

        // Nồi
        const potGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
        const pot = new THREE.Mesh(potGeometry, this.materials.metal);
        pot.position.y = 0.05;
        stoveGroup.add(pot);

        // Lò
        const ovenGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.5);
        const oven = new THREE.Mesh(ovenGeometry, new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0.5
        }));
        oven.position.y = -0.25;
        stoveGroup.add(oven);

        stoveGroup.position.set(5, 0, -3);
        this.objects.house.add(stoveGroup);
        this.objects.furniture.stove = stoveGroup;
    }

    buildIndoorPlants() {
        // Cây cảnh trong nhà
        for (let i = 0; i < 2; i++) {
            const plantGroup = new THREE.Group();

            // Chậu cây
            const potGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.2, 16);
            const pot = new THREE.Mesh(potGeometry, new THREE.MeshStandardMaterial({
                color: 0x8D6E63
            }));
            plantGroup.add(pot);

            // Thân cây
            const stemGeometry = new THREE.CylinderGeometry(0.03, 0.05, 0.3, 8);
            const stem = new THREE.Mesh(stemGeometry, new THREE.MeshStandardMaterial({
                color: 0x8B4513
            }));
            stem.position.y = 0.2;
            plantGroup.add(stem);

            // Lá cây
            const leafGeometry = new THREE.ConeGeometry(0.08, 0.15, 8);
            leafGeometry.rotateX(Math.PI / 4);
            const leaf1 = new THREE.Mesh(leafGeometry, new THREE.MeshStandardMaterial({
                color: 0x228B22
            }));
            leaf1.position.set(0, 0.35, 0);
            plantGroup.add(leaf1);

            const leaf2 = leaf1.clone();
            leaf2.rotation.z = Math.PI / 2;
            plantGroup.add(leaf2);

            const leaf3 = leaf1.clone();
            leaf3.rotation.z = Math.PI;
            plantGroup.add(leaf3);

            const leaf4 = leaf1.clone();
            leaf4.rotation.z = Math.PI * 1.5;
            plantGroup.add(leaf4);

            plantGroup.position.set(-4 + i * 3, 0, -2);
            this.objects.house.add(plantGroup);
        }
    }

    setupHouseCollision() {
        // Thêm collision box cho ngôi nhà
        // Sẽ được xử lý trong player.js
    }

    // ===== GARDEN =====
    buildGarden() {
        this.objects.garden = new THREE.Group();
        this.scene.add(this.objects.garden);

        // 1. Đường đi
        this.buildPath();

        // 2. Cỏ
        this.buildGrass();

        // 3. Cây
        this.buildTrees();

        // 4. Hoa
        this.buildFlowers();

        // 5. Đá cuội
        this.buildRocks();

        // 6. Hàng rào
        this.buildFence();

        // 7. Đèn vườn
        this.buildGardenLights();
    }

    buildPath() {
        // Đường đi dẫn tới cửa nhà
        const pathGeometry = new THREE.BoxGeometry(3, 0.1, 8);
        const path = new THREE.Mesh(pathGeometry, new THREE.MeshStandardMaterial({
            color: 0x8D6E63,
            roughness: 0.9
        }));

        path.position.set(0, 0.05, -10);
        path.rotation.x = -Math.PI / 4 * 0.1;
        path.receiveShadow = true;
        this.objects.garden.add(path);
    }

    buildGrass() {
        // Cỏ bao phủ khu vườn
        for (let i = 0; i < 50; i++) {
            const x = (Math.random() - 0.5) * 40;
            const z = -15 - Math.random() * 10;

            const bladeGeometry = new THREE.BoxGeometry(0.05, Math.random() * 0.3 + 0.1, 0.05);
            const blade = new THREE.Mesh(bladeGeometry, new THREE.MeshStandardMaterial({
                color: 0x228B22 + Math.random() * 0x336633,
                roughness: 0.8
            }));

            blade.position.set(x, 0.05, z);
            blade.rotation.x = Math.random() * Math.PI * 0.2;
            blade.rotation.z = Math.random() * Math.PI * 0.2;

            // Animation cho cỏ
            blade.userData = {
                swaySpeed: Math.random() * 0.5 + 0.2,
                swayAmount: Math.random() * 0.1 + 0.05,
                originalY: blade.position.y
            };

            this.objects.garden.add(blade);
        }
    }

    buildTrees() {
        // Cây lớn
        for (let i = 0; i < 5; i++) {
            const treeGroup = new THREE.Group();

            // Thân cây
            const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2 + Math.random() * 1, 16);
            const trunk = new THREE.Mesh(trunkGeometry, new THREE.MeshStandardMaterial({
                color: 0x8B4513,
                roughness: 0.7
            }));
            trunk.castShadow = true;
            treeGroup.add(trunk);

            // Tán cây (sử dụng cone stack)
            for (let j = 0; j < 3; j++) {
                const leavesGeometry = new THREE.ConeGeometry(
                    0.8 - j * 0.2,
                    0.5,
                    16,
                    1
                );
                leavesGeometry.rotateX(Math.PI / 4 * (1 + Math.random() * 0.2));
                const leaves = new THREE.Mesh(leavesGeometry, new THREE.MeshStandardMaterial({
                    color: 0x228B22 + Math.random() * 0x224422,
                    roughness: 0.8
                }));
                leaves.position.y = 1.5 + j * 0.5;
                leaves.castShadow = true;
                treeGroup.add(leaves);
            }

            treeGroup.position.set(
                (Math.random() - 0.5) * 40,
                0,
                -15 - Math.random() * 10
            );

            this.objects.garden.add(treeGroup);
        }
    }

    buildFlowers() {
        // Hoa
        for (let i = 0; i < 20; i++) {
            const flowerGroup = new THREE.Group();

            // Thân hoa
            const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.2 + Math.random() * 0.2, 8);
            const stem = new THREE.Mesh(stemGeometry, new THREE.MeshStandardMaterial({
                color: 0x228B22
            }));
            flowerGroup.add(stem);

            // Hoa
            const flowerGeometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.03, 8, 8);
            const colors = [0xFF69B4, 0xFFD700, 0x9370DB, 0xFF6347];
            const flower = new THREE.Mesh(flowerGeometry, new THREE.MeshStandardMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                roughness: 0.5
            }));
            flower.position.y = 0.2 + Math.random() * 0.2;
            flowerGroup.add(flower);

            flowerGroup.position.set(
                (Math.random() - 0.5) * 30,
                0.01,
                -15 - Math.random() * 8
            );

            this.objects.garden.add(flowerGroup);
        }
    }

    buildRocks() {
        // Đá cuội
        for (let i = 0; i < 15; i++) {
            const rockGeometry = new THREE.DodecahedronGeometry(0.1 + Math.random() * 0.15, 0);
            const rock = new THREE.Mesh(rockGeometry, new THREE.MeshStandardMaterial({
                color: 0x808080 + Math.random() * 0x404040,
                roughness: 0.9
            }));
            rock.position.set(
                (Math.random() - 0.5) * 40,
                0.05,
                -15 - Math.random() * 10
            );
            rock.rotation.x = Math.random() * Math.PI;
            rock.rotation.y = Math.random() * Math.PI;
            rock.rotation.z = Math.random() * Math.PI;
            rock.castShadow = true;
            this.objects.garden.add(rock);
        }
    }

    buildFence() {
        // Hàng rào bằng gỗ
        for (let i = 0; i < 10; i++) {
            const postGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
            const post = new THREE.Mesh(postGeometry, this.materials.wood);
            post.position.set(
                -10 + i * 2.5,
                0.5,
                -18
            );
            post.castShadow = true;
            this.objects.garden.add(post);

            if (i < 9) {
                // Thanh ngang
                const railGeometry = new THREE.BoxGeometry(2.3, 0.1, 0.05);
                const rail = new THREE.Mesh(railGeometry, this.materials.wood);
                rail.position.set(
                    -9.5 + i * 2.5,
                    0.75,
                    -18
                );
                this.objects.garden.add(rail);

                const rail2 = rail.clone();
                rail2.position.y = 0.5;
                this.objects.garden.add(rail2);
            }
        }
    }

    buildGardenLights() {
        // Đèn vườn
        for (let i = 0; i < 2; i++) {
            const lightGroup = new THREE.Group();

            // Cột đèn
            const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16);
            const pole = new THREE.Mesh(poleGeometry, this.materials.metal);
            lightGroup.add(pole);

            // Đèn
            const lightBulbGeometry = new THREE.SphereGeometry(0.08, 16, 16);
            const lightBulb = new THREE.Mesh(lightBulbGeometry, new THREE.MeshStandardMaterial({
                color: 0xFFEB3B,
                emissive: 0xFFEB3B,
                emissiveIntensity: 0
            }));
            lightBulb.position.y = 1.5;
            lightGroup.add(lightBulb);

            // Ánh sáng
            const gardenLight = new THREE.PointLight(0xFFEB3B, 0, 15);
            gardenLight.position.y = 1.5;
            lightGroup.add(gardenLight);

            lightGroup.position.set(
                -7 + i * 14,
                0,
                -12
            );

            this.objects.garden.add(lightGroup);
            LUMI.gardenLights.push({
                group: lightGroup,
                light: gardenLight,
                bulb: lightBulb,
                isOn: false
            });
        }
    }

    // ===== ENVIRONMENT =====
    buildEnvironment() {
        // 1. Bầu trời
        this.buildSky();

        // 2. Núi xa
        this.buildDistantMountains();

        // 3. Mặt trời
        this.buildSun();

        // 4. Mây
        this.buildClouds();
    }

    buildSky() {
        // Sử dụng hemisphere light để mô phỏng bầu trời
        // Đã được thêm trong initLighting()
    }

    buildDistantMountains() {
        // Núi xa xăm
        for (let i = 0; i < 3; i++) {
            const mountainGeometry = new THREE.ConeGeometry(
                10 - i * 3,
                5 + i * 2,
                16,
                1
            );
            mountainGeometry.rotateX(Math.PI / 2);
            const mountain = new THREE.Mesh(mountainGeometry, new THREE.MeshStandardMaterial({
                color: 0x5D4037 + i * 0x111111,
                roughness: 0.9
            }));
            mountain.position.set(
                -20 + i * 20,
                0,
                -20 - i * 5
            );
            this.scene.add(mountain);
        }
    }

    buildSun() {
        // Mặt trời
        LUMI.sun = new THREE.Mesh(
            new THREE.SphereGeometry(1, 16, 16),
            new THREE.MeshBasicMaterial({
                color: 0xFFFF00,
                emissive: 0xFFFF00
            })
        );
        LUMI.sun.position.set(50, 30, 50);
        LUMI.sun.visible = false; // KhONG hiển thị mặt trời vật lý
        this.scene.add(LUMI.sun);
    }

    buildClouds() {
        // Mây
        for (let i = 0; i < 5; i++) {
            const cloudGroup = new THREE.Group();

            for (let j = 0; j < 5; j++) {
                const cloudGeometry = new THREE.DodecahedronGeometry(0.5 + Math.random() * 0.3, 0);
                const cloud = new THREE.Mesh(cloudGeometry, new THREE.MeshStandardMaterial({
                    color: 0xFFFFFF,
                    roughness: 1.0
                }));
                cloud.position.set(
                    (Math.random() - 0.5) * 3,
                    0,
                    (Math.random() - 0.5) * 3
                );
                cloudGroup.add(cloud);
            }

            cloudGroup.position.set(
                (Math.random() - 0.5) * 50,
                15 + Math.random() * 5,
                -10 - Math.random() * 10
            );

            this.scene.add(cloudGroup);
        }
    }

    // ===== INTERACTIVE OBJECTS =====
    addInteractiveObjects() {
        // Đã thêm trong quá trình xây dựng ngôi nhà
    }

    // ===== NIGHT LIGHTS =====
    addNightLights() {
        // Đã thêm trong buildGardenLights()
        // Sẽ được bật/tắt tự động trong simulation.js
    }

    // ===== INTERACTION METHODS =====
    toggleDoor() {
        const door = this.objects.furniture.door;
        const doorMesh = door.children[0];

        if (door.userData.isOpen) {
            // Đóng cửa
            door.rotation.y = 0;
            door.userData.isOpen = false;
            if (window.LUMI.audio) window.LUMI.audio.playSound('door');
            return "Đã đóng cửa";
        } else {
            // Mở cửa
            door.rotation.y = Math.PI / 2;
            door.userData.isOpen = true;
            if (window.LUMI.audio) window.LUMI.audio.playSound('door');
            return "Đã mở cửa";
        }
    }

    sitOnFurniture(furnitureType) {
        if (window.LUMI.player) {
            window.LUMI.player.stopMovement();
            window.LUMI.simulation.increaseEnergy(10);
            window.LUMI.simulation.increaseHappiness(5);
            if (window.LUMI.audio) window.LUMI.audio.playSound('interact');
            return `Đang ngồi trên ${furnitureType === 'sofa' ? 'ghế sofa' : furnitureType}`;
        }
        return "";
    }

    sleepOnBed() {
        if (window.LUMI.player) {
            window.LUMI.player.stopMovement();
            window.LUMI.simulation.increaseEnergy(30);
            window.LUMI.simulation.increaseHappiness(15);
            if (window.LUMI.audio) window.LUMI.audio.playSound('interact');
            return "Đang ngủ trên giường... Năng lượng +30%";
        }
        return "";
    }

    toggleLamp(interactiveObject) {
        const lamp = interactiveObject.object;
        const light = interactiveObject.light;

        if (lamp.userData.isOn) {
            // Tắt đèn
            light.intensity = 0;
            lamp.children[1].material.emissiveIntensity = 0;
            lamp.userData.isOn = false;
            if (window.LUMI.audio) window.LUMI.audio.playSound('interact');
            return "Đã tắt đèn";
        } else {
            // Bật đèn
            light.intensity = 1;
            lamp.children[1].material.emissiveIntensity = 0.5;
            lamp.userData.isOn = true;
            if (window.LUMI.audio) window.LUMI.audio.playSound('interact');
            return "Đã bật đèn";
        }
    }

    waterPlant() {
        if (window.LUMI.player) {
            window.LUMI.simulation.increaseHappiness(3);
            if (window.LUMI.audio) window.LUMI.audio.playSound('water');
            return "Đã tưới nước cho cây";
        }
        return "";
    }

    // ===== UPDATE =====
    update(delta) {
        // Animation cho cỏ
        this.updateGrass(delta);

        // Animation cho mây
        this.updateClouds(delta);

        // Cập nhật/day night cycle
        this.updateDayNightCycle();
    }

    updateGrass(delta) {
        const time = this.clock.getElapsedTime();
        this.objects.garden.children.forEach(child => {
            if (child.userData && child.userData.swaySpeed) {
                const sway = Math.sin(time * child.userData.swaySpeed) * child.userData.swayAmount;
                child.position.y = child.userData.originalY + sway;
                child.rotation.x = sway * 0.5;
                child.rotation.z = sway * 0.3;
            }
        });
    }

    updateClouds(delta) {
        this.scene.children.forEach(child => {
            if (child.userData && child.userData.isCloud) {
                child.position.x += delta * 0.05;
                if (child.position.x > 30) {
                    child.position.x = -50;
                }
            }
        });
    }

    updateDayNightCycle() {
        if (!window.LUMI.simulation) return;

        const timeOfDay = window.LUMI.simulation.getTimeOfDay();
        const isDay = timeOfDay >= 6 && timeOfDay <= 18;

        // Cập nhật ánh sáng mặt trời
        if (LUMI.sunLight) {
            LUMI.sunLight.intensity = isDay ? 0.8 : 0.1;

            // Thay đổi vị trí mặt trời
            const sunAngle = ((timeOfDay - 6) / 12) * Math.PI;
            LUMI.sunLight.position.x = Math.cos(sunAngle) * 30;
            LUMI.sunLight.position.y = Math.sin(sunAngle) * 20 + 15;
            LUMI.sunLight.position.z = Math.cos(sunAngle) * 10;
            LUMI.sunLight.castShadow = isDay;
        }

        // Cập nhật màu bầu trời
        if (isDay) {
            const dayColor = 0x87CEEB;
            this.scene.background = new THREE.Color(dayColor);
            this.scene.fog.color = new THREE.Color(dayColor);
        } else {
            const nightColor = 0x0A1A2A;
            this.scene.background = new THREE.Color(nightColor);
            this.scene.fog.color = new THREE.Color(nightColor);

            // Bật đèn vườn vào ban đêm
            LUMI.gardenLights.forEach(light => {
                light.light.intensity = light.isOn ? 1 : 0.5;
                light.bulb.material.emissiveIntensity = light.isOn ? 0.5 : 0.1;
            });
        }

        // Cập nhật màu ánh sáng môi trường
        const ambientLight = this.scene.children.find(child => child instanceof THREE.AmbientLight);
        if (ambientLight) {
            ambientLight.intensity = isDay ? 0.4 : 0.1;
            ambientLight.color.setHex(isDay ? 0x404040 : 0x2A2A3A);
        }
    }

    // ===== UTILITY METHODS =====
    getInteractiveObjectAt(position) {
        for (const interactive of this.objects.interactive) {
            const distance = interactive.object.position.distanceTo(position);
            if (distance < 2) { // Khoảng cách tương tác
                return interactive;
            }
        }
        return null;
    }
}