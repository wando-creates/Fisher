function renderInventory() {
    let list = document.getElementById("inventory");
    if (!list) {
        list = document.createElement("div");
        list.id = "inventory";
        document.body.appendChild(list);
    }
    list.innerHTML = player.inventory
        .map(id => FISH_TYPES.find(f => f.id === id).name)
        .join(', ')
}

function renderCoins() {
    let el = document.getElementById("coins");
    if (!el) {
        el = document.createElement("div");
        el.id = "coins";
        document.body.appendChild(el);
    }
    el.textContent = `Coins: ${player.coins}`;
}

const sellBtn = document.createElement("button");
sellBtn.textContent = "Sell All Fish";
sellBtn.onclick = sellAllFish;
document.body.appendChild(sellBtn);



