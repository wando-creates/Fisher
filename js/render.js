function render(ctx,canvas) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawFishShadows(ctx);
    if (isCasting) {
        drawBobber(ctx, canvas);
    }
}

function drawFishShadows(ctx) {
    fishShadows.forEach(fish => {
        const y = fish.y + Math.sin(fish.bob)*6;
        ctx.save();
        ctx.translate(fish.x,y);
        if(fish.direction===1) {
            ctx.scale(-1,1)
        }
        ctx.globalAlpha = 0.15;
        ctx.drawImage(
            fish.image,
            -fish.size,
            -fish.size/2,
            fish.size*2,
            fish.size
        );

        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = "#10243d";
        ctx.fillRect(
            -fish.size,
            -fish.size,
            fish.size*2,
            fish.size*2
        );
        ctx.restore();
    })
}

function drawBobber(ctx, canvas) {
    const x = bobberX;
    const bobOffset = Math.sin(castTimer * 8) * 6;
    const y = bobberY + bobOffset;

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
