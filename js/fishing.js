let isCasting = false;
let castTimer = 0;
const CAST_DURATION = 1.5;

function castLine() {
    if (isCasting) return;
    isCasting = true;
    castTimer = 0;
}

function updateFishing(dt) {
    if (!isCasting) return;
    castTimer += dt;
    if (castTimer >= CAST_DURATION) {
        isCasting = false;
        const caught = pickCatch();
        console.log("caught: ", caught.name);
        catchFish(caught);
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