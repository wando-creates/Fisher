const fishImages = {};

FISH_TYPES.forEach(fish => {
    if (fish.sprite) {
        const img = new Image();
        img.src = fish.sprite;
        fishImages[fish.id] = img;
    }
});