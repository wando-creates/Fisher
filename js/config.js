const FISH_TYPES = [
    {
        id: "minnow",
        name: "Minnow",
        rarity: "common",
        value: 2,
        colour: "#c0c0c0",
        sprite: null
    },
    {
        id:"bass",
        name: "Bass",
        rarity: "uncommon",
        value: 5,
        colour: "#4a7c3a",
        sprite: null
    },
    {
        id: "trout",
        name: "Trout",
        rarity: "rare",
        value: 12,
        colour: "#e07a5f",
        sprite: null
    }
]

const RODS = [
    {
        id: "stick",
        name: "Old Stick", 
        cost: 0, 
        rareBonus: 0
    },
    {
        id: "basic", 
        name: "Basic Rod", 
        cost: 20, 
        rareBonus: 0.1
    },
    {
        id: "Steel", 
        name: "Steel Rod", 
        cost: 60, 
        rareBonus: 0.25
    },
];

const LAKES = [
    {
        id: "pond",
        name: "Quiet Pond",
        unlockCost: 0,
        fishIds: ["minnow","bass"],
        bgColour: "#1e7de3"
    },
    {
        id: "river",
        name: "Rapid River",
        unlockCost: 50,
        fishIds: ["bass", "trout"],
        bgColour: "#206a4a"       
    }
]
