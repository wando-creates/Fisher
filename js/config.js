const FISH_TYPES = [
    {
        id: "minnow",
        name: "Minnow",
        rarity: "common",
        value: 2,
        colour: "#c0c0c0",
        sprite: "images/minnow.png"
    },
    {
        id:"bass",
        name: "Bass",
        rarity: "uncommon",
        value: 5,
        colour: "#4a7c3a",
        sprite: "images/bass.png"
    },
    {
        id: "trout",
        name: "Trout",
        rarity: "rare",
        value: 12,
        colour: "#e07a5f",
        sprite: "images/trout.png"
    },
    {
        id: "pike",
        name: "Pike",
        rarity: "rare",
        value: 15,
        colour: "#24410b",
        sprite: null
    },
    {
        id: "catfish",
        name: "Catfish",
        rarity: "epic",
        value: 20,
        colour: "#49818b",
        sprite: null
    },
    {
        id: "goldfish",
        name: "Goldfish",
        rarity: "rare",
        value: 20,
        colour: "#ad853a",
        sprite: null
    },
    {
        id: "koi",
        name: "Koi Fish",
        rarity: "epic",
        value: 25,
        colour: "#792626",
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
    {
        id: "carbon",
        name: "Carbon Rod",
        cost: 100,
        rareBonus: 0.3
    },
    {
        id: "epicrod",
        name: "Epic Rod",
        cost: 150,
        rareBonus: 0.4
    }
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
        fishIds: ["bass", "trout", "pike", "catfish"],
        bgColour: "#07ae9d"       
    },
    {
        id: "bigpond",
        name: "Large Pond",
        unlockCost: 300,
        fishIds: ["pike", "catfish", "goldfish", "koi"],
        bgColour: "#172aa6"
    }
]

const RARITY_COLOURS = {
    common: "#ffffff",
    uncommon: "#4ade80",
    rare: "#008cff",
    epic: "#a913bc"
}
