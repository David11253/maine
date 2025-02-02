const scene = document.getElementById("scene");
let isMouseDown = false;
let lastX, lastY;
let rotateX = 0, rotateY = 0;
let distance = 5;

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

// Управление камерой
document.addEventListener("mousedown", (e) => {
    if (e.button === 0) {
        isMouseDown = true;
        lastX = e.clientX;
        lastY = e.clientY;
    }
});

document.addEventListener("mouseup", () => {
    isMouseDown = false;
});

document.addEventListener("mousemove", (e) => {
    if (!isMouseDown) return;

    let deltaX = e.clientX - lastX;
    let deltaY = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    rotateY += deltaX * 0.3;
    rotateX -= deltaY * 0.3;

    scene.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${distance * -100}px)`;
});

// Зум колёсиком
document.addEventListener("wheel", (e) => {
    distance += e.deltaY * 0.01;
    distance = Math.max(2, Math.min(10, distance));
    scene.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${distance * -100}px)`;
});
