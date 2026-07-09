let isCasting = false;
let castTimer = 0;
const CAST_DURATION = 1.5;
let rippleTimer = 0;

let bobberX = 0;
let bobberY = 0;

let fishShadows = [];

function spawnFishShadows() {
    const side = Math.random() < 0.5 ? "left" : "right";
    const available = getAvailableFish();
    const type = available[Math.floor(Math.random() * available.length)];

    fishShadows.push({
        x: side==="right" ? -80 : canvas.width + 80,
        y: 120 + Math.random() * 220,

        speed: 20 + Math.random() * 30,
        size: 30 + Math.random() * 50,
        direction: side==="right" ? 1 : -1,
        bob:Math.random() * Math.PI*2,
        image: fishImages[type.id]
    });
}

function castLine(x,y) {
    if (isCasting) return;
    isCasting = true;
    castTimer = 0;
    rippleTimer =0;

    bobberX = x;
    bobberY = y;
    spawnRipple(bobberX,bobberY, 2.0);
}

function updateFishing(dt) {
    if (!isCasting) return;
    castTimer += dt;
    rippleTimer +=dt;

    const bobOffset = Math.sin(castTimer * 8) * 6;
    const currentY = bobberY + bobOffset;

    if (rippleTimer > 0.3) {
        spawnRipple(bobberX, bobberY, 0.3);
        rippleTimer = 0;
    }

    const effectiveDuration = CAST_DURATION * getCurrentRod().castSpeed;

    if (castTimer >= effectiveDuration) {
        isCasting = false;
        const caught = pickCatch();
        console.log("caught: ", caught.name);
        catchFish(caught);
        spawnRipple(bobberX, bobberY, 1.5);
    }
}

function pickCatch() {
    const bonus = getCurrentRod().rareBonus;
    const available = getAvailableFish();
    console.log("available fish:", available);
    const weights = available.map( f =>
        f.rarity === "common" ? 1:
        f.rarity === "uncommon" ? 1 + bonus :
        1 + bonus * 2
    );
    const total = weights.reduce((a, b) => a+b,0);
    let roll = Math.random() * total;
    for (let i = 0; i < available.length; i++) {
        if (roll < weights[i]) return available[i];
        roll -= weights[i];
    }
}

function getAvailableFish() {
    const lake = LAKES.find(l => l.id === player.currentLakeId);
    return FISH_TYPES.filter(f => lake.fishIds.includes(f.id));
}