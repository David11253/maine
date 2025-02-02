const scene = document.getElementById("scene");
let isMouseDown = false;
let lastX, lastY;
let rotateX = 0, rotateY = 0;
let distance = 5;

// Функция для создания блоков
function createBlock(type, x, y, z, s) {
    if (!blocks[type]) return;

    const block = document.createElement("div");
    block.classList.add("block");

    // Устанавливаем позицию блока
    block.style.transform = `translate3d(${x * 100}px, ${-y * 100}px, ${z * 100}px)`;

    // Устанавливаем поворот блока в зависимости от s
    let rotation = "";
    switch (s) {
        case 1: rotation = "rotateY(0deg)"; break;
        case 2: rotation = "rotateY(90deg)"; break;
        case 3: rotation = "rotateY(180deg)"; break;
        case 4: rotation = "rotateY(-90deg)"; break;
        case 5: rotation = "rotateX(90deg)"; break;
        case 6: rotation = "rotateX(-90deg)"; break;
        default: rotation = "rotateY(0deg)"; break;
    }
    block.style.transform += ` ${rotation}`;

    // Создаём грани блока
    for (let i = 1; i <= 6; i++) {
        const face = document.createElement("div");
        face.classList.add("face", `face-${i}`);
        face.style.backgroundImage = `url(${blocks[type].textures[i]})`;
        block.appendChild(face);
    }

    scene.appendChild(block);
}

// Создаём все блоки из sborka.js
blocksData.forEach(block => {
    createBlock(block.type, block.position.x, block.position.y, block.position.z, block.position.s);
});

// Управление камерой для мыши
const mouseHandler = {
    onMouseDown: (e) => {
        if (e.button === 0) {
            isMouseDown = true;
            lastX = e.clientX;
            lastY = e.clientY;
        }
    },

    onMouseUp: () => {
        isMouseDown = false;
    },

    onMouseMove: (e) => {
        if (!isMouseDown) return;

        let deltaX = e.clientX - lastX;
        let deltaY = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;

        rotateY += deltaX * 0.3;
        rotateX -= deltaY * 0.3;

        scene.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${distance * -100}px)`;
    },

    onWheel: (e) => {
        distance += e.deltaY * 0.01;
        distance = Math.max(2, Math.min(10, distance));
        scene.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${distance * -100}px)`;
    }
};

// Поддержка мыши
document.addEventListener("mousedown", mouseHandler.onMouseDown);
document.addEventListener("mouseup", mouseHandler.onMouseUp);
document.addEventListener("mousemove", mouseHandler.onMouseMove);
document.addEventListener("wheel", mouseHandler.onWheel);

// Поддержка мобильных устройств (тач-события)
const touchHandler = {
    onTouchStart: (e) => {
        if (e.touches.length === 1) {
            isMouseDown = true;
            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;
        }
    },

    onTouchEnd: () => {
        isMouseDown = false;
    },

    onTouchMove: (e) => {
        if (!isMouseDown || e.touches.length !== 1) return;

        let deltaX = e.touches[0].clientX - lastX;
        let deltaY = e.touches[0].clientY - lastY;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;

        rotateY += deltaX * 0.3;
        rotateX -= deltaY * 0.3;

        scene.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${distance * -100}px)`;
    },

    onTouchMoveZoom: (e) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            distance = Math.max(2, Math.min(10, dist * 0.01));
            scene.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${distance * -100}px)`;
        }
    }
};

// Подключаем обработчики тач-событий
document.addEventListener("touchstart", touchHandler.onTouchStart);
document.addEventListener("touchend", touchHandler.onTouchEnd);
document.addEventListener("touchmove", touchHandler.onTouchMove);
document.addEventListener("touchmove", touchHandler.onTouchMoveZoom, { passive: false });
