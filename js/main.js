const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d')

let lastTime = 0;
function gameLoop(timestamp) {
    const dt = (timestamp - lastTime) / 1000; //seconds since last frame
    lastTime = timestamp;

    update(dt);
    renderWater();
    render(ctx, canvas);
    requestAnimationFrame(gameLoop);

}

function update(dt) {
    updateFishing(dt);
}
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    castLine(x,y);
});

requestAnimationFrame(gameLoop)


