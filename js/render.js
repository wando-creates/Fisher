function render(ctx,canvas) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const lake = LAKES.find(l => l.id === player.currentLakeId);
    //water placeholder
    ctx.fillStyle = lake.bgColour
    ctx.fillRect(0,0,canvas.width,canvas.height);
}
