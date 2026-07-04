function renderInventory() {
    const list = document.getElementById("inventory");
    list.innerHTML = player.inventory
        .map(id => FISH_TYPES.find(f => f.id === id).name)
        .join(', ') || "Empty - Go Catch Something!"
}

function renderCoins() {
    document.getElementById("coins").textContent = `Coins: ${player.coins}`;
}

function renderRodShop() {
    const panel = document.getElementById("shop-rods");
    panel.innerHTML = "";

    RODS.forEach(rod => {
        const btn = document.createElement("button");
        const owned = player.rodID === rod.id;
        btn.textContent = owned
            ? `${rod.name} (equipped)`
            : `${rod.name} - ${rod.cost} coins`;
        btn.disabled = owned;
        btn.onclick = () => {
            if (buyRod(rod.id)) {
                renderRodShop();
            } else {
                alert("Not Enough Coins")
            }
        };
        panel.appendChild(btn);
    })
}

function renderLakeShop() {
    const panel = document.getElementById("shop-lakes");
    panel.innerHTML = "";

    LAKES.forEach(lake => {
        const btn = document.createElement("button");
        const unlocked = player.unlockedLakes.includes(lake.id);
        const current = player.currentLakeId === lake.id;

        btn.textContent = current
            ? `${lake.name} (here)`
            : unlocked
                ? `Travel To ${lake.name}`
                : `Unlock ${lake.name} - ${lake.unlockCost} coins`;
        btn.disabled = current;

        btn.onclick = () => {
            if (unlocked) {
                travelTo(lake.id);
                renderLakeShop();
            } else {
                if (player.coins < lake.unlockCost) {
                    alert("Not enough coins!");
                    return;
                }
                player.coins -= lake.unlockCost;
                player.unlockedLakes.push(lake.id);
                travelTo(lake.id);
                renderCoins();
                renderLakeShop();
            }
        };
        panel.appendChild(btn);
    })
}

document.getElementById("sellBtn").onclick = sellAllFish;

document.getElementById("shopToggleBtn").onclick = () => {
    document.getElementById("shop-modal").classList.remove("hidden")
}

document.getElementById("closeShopBtn").onclick = () => {
    document.getElementById("shop-modal").classList.add("hidden")
}

document.getElementById("tabRods").onclick = () => switchTab("rods");
document.getElementById("tabLakes").onclick = () => switchTab("lakes");

function switchTab(tab) {
    document.getElementById("shop-rods").classList.toggle("hidden", tab !== "rods");
    document.getElementById("shop-lakes").classList.toggle("hidden", tab !== "lakes");
    document.getElementById("tabRods").classList.toggle("active", tab === "rods");
    document.getElementById("tabLakes").classList.toggle("active", tab === "lakes")
}

renderCoins();
renderInventory();
renderRodShop();
renderLakeShop();