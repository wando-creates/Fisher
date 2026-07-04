const player = {
    coins: 0,
    inventory: [], //fish caught
};

function catchFish(fishType) {
    player.inventory.push(fishType.id);
    renderInventory();
}

function sellAllFish() {
    player.inventory.forEach(id => {
        player.coins += FISH_TYPES.find(f => f.id === id).value;
    });
    player.inventory = [];
    renderInventory();
    renderCoins();
}

player.rodID = "stick";

function getCurrentRod() {
    return RODS.find(r => r.id === player.rodID);
}

function buyRod(rodID) {
    const rod = RODS.find(r => r.id === rodID);
    if (player.coins < rod.cost) return false;
    player.coins -= rod.cost;
    player.rodID = rodID;
    renderCoins();
    return true;
}

player.currentLakeId = "pond";
player.unlockedLakes = ["pond"];

function travelTo(lakeID) {
    if (!player.unlockedLakes.includes(lakeID)) return false;
    player.currentLakeId = lakeID;
    return true;
}

