function renderInventory() {
    const list = document.getElementById("inventory");
    if (player.inventory.length === 0) {
        list.innerHTML = "Empty"
        return;
    }
    list.innerHTML = player.inventory.map(id => {
        const fish = FISH_TYPES.find(f => f.id === id);
        const colour = RARITY_COLOURS?.[fish.rarity] || "#fff";
              const visual = fish.sprite
            ? `<img src="${fish.sprite}" alt="${fish.name}" class=fish-icon>`
            : fish.name;
        return `<span class="fish-slot" style="--glow:${colour}">${visual}</span>`;
    }).join('');
}

function renderCoins() {
    document.getElementById("coin-text").textContent = player.coins;
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

function flyCoinsToDisplay(count) {
    const startRect = document.getElementById("sellBtn").getBoundingClientRect();
    const endRec = document.getElementById("coins").getBoundingClientRect();

    const startX = startRect.left + startRect.width /2;
    const startY = startRect.top + startRect.height/2;
    const endX = endRec.left + endRec.width/2;
    const endY = endRec.top + endRec.height/2;

    const num = Math.min(count, 8);

    for (let i=0; i < num; i ++) {
        setTimeout(() => spawnCoin(startX, startY, endX, endY), i * 60);
    }
}

function spawnCoin(x1,y1,x2,y2) {
    const coin = document.createElement("div");
    coin.className = "flying-coin";
    coin.style.left = `${x1-8}px`;
    coin.style.top = `${y1-8}px`;
    document.body.appendChild(coin);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            coin.style.left = `${x2 - 8}px`;
            coin.style.top = `${y2-8}px`;
            coin.style.transform = "scale(0.4)";
            coin.style.opacity = "0.3";
        });
    });
    setTimeout(() => coin.remove(), 650)
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

document.getElementById("sellBtn").onclick = () => {
    const fishCount = player.inventory.length;
    if (fishCount === 0) return;
    flyCoinsToDisplay(fishCount);
    sellAllFish();
}

document.getElementById("shopToggleBtn").onclick = () => {
    document.getElementById("shop-panel").classList.remove("hidden")
}

document.getElementById("closeShopBtn").onclick = () => {
    document.getElementById("shop-panel").classList.add("hidden")
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