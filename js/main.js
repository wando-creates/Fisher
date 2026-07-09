const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d')

function resizeCanvas() {
    const width = window.innerWidth * 0.5;
    const height = width * (500/800)
    canvas.width = width;
    canvas.height = height;
    waterCanvas.width = width;
    waterCanvas.height = height;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let lastTime = 0;
let fishSpawnTimer = 0;

function gameLoop(timestamp) {
    const dt = (timestamp - lastTime) / 1000; //seconds since last frame
    lastTime = timestamp;

    update(dt);
    renderWater();
    render(ctx, canvas);
    requestAnimationFrame(gameLoop);

}

function update(dt) {
    fishSpawnTimer += dt

    if (fishSpawnTimer > 10) {
        fishSpawnTimer = 0;
        spawnFishShadows();
    }

    for (let i =fishShadows.length - 1; i >= 0; i--) {
        const fish=fishShadows[i];
        fish.x += fish.speed * fish.direction * dt;
        fish.bob +=dt * 2;

        if (
            fish.x < -150 || fish.x > canvas.width + 150
        ) {
            fishShadows.splice(i,1);
        }
    }

    updateFishing(dt);
}
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    castLine(x,y);
});

requestAnimationFrame(gameLoop)


