export const LEVELS = [
    {
        level: 0,
        label: "Novice",
        randomPrimary: 3,
        chosenPrimary: 6,
        randomSecondary: 6,
        chosenSecondary: 12,
        randomCharacteristic: 18,
    },
    {
        level: 1,
        label: "Experienced",
        randomPrimary: 4,
        chosenPrimary: 8,
        randomSecondary: 8,
        chosenSecondary: 14,
        randomCharacteristic: 20,
    },
    {
        level: 2,
        label: "Veteran",
        randomPrimary: 5,
        chosenPrimary: 10,
        randomSecondary: 10,
        chosenSecondary: 14,
        randomCharacteristic: 20,
    },
    {
        level: 3,
        label: "Emerging Star",
        randomPrimary: 6,
        chosenPrimary: 12,
        randomSecondary: 12,
        chosenSecondary: 18,
        randomCharacteristic: 24,
    },
    {
        level: 4,
        label: "Star",
        randomPrimary: 8,
        chosenPrimary: 16,
        randomSecondary: 16,
        chosenSecondary: 22,
        randomCharacteristic: 28,
    },
    {
        level: 5,
        label: "Super Star",
        randomPrimary: 10,
        chosenPrimary: 20,
        randomSecondary: 20,
        chosenSecondary: 26,
        randomCharacteristic: 32,
    },
    {
        level: 6,
        label: "Legend",
        randomPrimary: 15,
        chosenPrimary: 30,
        randomSecondary: 30,
        chosenSecondary: 40,
        randomCharacteristic: 50,
    },
];

export const STATS = [
    {
        name: "PAS",
        label: "Passing Completion",
        SPP: 1,
    },
    {
        name: "THR",
        label: "Superb Throw Teammate",
        SPP: 1,
    },
    {
        name: "DEF",
        label: "Deflection",
        SPP: 1,
    },
    {
        name: "INT",
        label: "Interception",
        SPP: 1,
    },
    {
        name: "CAS",
        label: "Casualty",
        SPP: 2,
    },
    {
        name: "TD",
        label: "Touchdown",
        SPP: 3,
    },
    {
        name: "MVP",
        label: "Most Valuable Player (MVP)",
        SPP: 4,
    },
];

export default function PlayerStatsUpdate(player, stat) {
    const playerHasSPP = player.hasOwnProperty("SPP");

    const playerHasStats = player.hasOwnProperty("stats");
    const currentStats = {};
    STATS.forEach((stat) => {
        currentStats[stat.name] = playerHasStats ? player.stats[stat.name] : 0;
    });

    return {
        ...player,
        SPP: playerHasSPP
            ? parseInt(player.SPP) + parseInt(stat.SPP)
            : parseInt(stat.SPP),
        stats: {
            ...currentStats,
            [stat.name]: parseInt(currentStats[stat.name]) + 1,
        },
    };
}
