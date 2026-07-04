function render(ctx,canvas) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const lake = LAKES.find(l => l.id === player.currentLakeId);
    //water placeholder
    ctx.fillStyle = lake.bgColour
    ctx.fillRect(0,0,canvas.width,canvas.height);

    if (isCasting) {
        drawBobber(ctx, canvas);
    }
}

function drawBobber(ctx, canvas) {
    const x = canvas.width/2
    const baseY = canvas.height/2



    //bobbing motion
    const bobOffset = Math.sin(castTimer * 8) * 6
    const y = baseY  +bobOffset

    //ripples
    const rippleRadius = (castTimer % 1)*25;
    ctx.beginPath();
    ctx.arc(x,y+10,rippleRadius,0,Math.PI*2);
    ctx.strokeStyle = `rgba(255,255,255,${1-rippleRadius/25})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    //fishingline
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x,0)
    ctx.lineTo(x,y)
    ctx.stroke();

    //bobber
    ctx.beginPath();
    ctx.arc(x,y,10,0,Math.PI*2);
    ctx.fillStyle = "#e63946"
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x,y,10,Math.PI,Math.PI*2);
    ctx.fillStyle = "#fff"
    ctx.fill();


}
