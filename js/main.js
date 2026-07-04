const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d')

let lastTime = 0;
function gameLoop(timestamp) {
    const dt = (timestamp - lastTime) / 1000; //seconds since last frame
    lastTime = timestamp;

    update(dt);
    render(ctx, canvas);
    requestAnimationFrame(gameLoop);

}

function update(dt) {
    updateFishing(dt);
}
canvas.addEventListener("click", castLine);

requestAnimationFrame(gameLoop)


