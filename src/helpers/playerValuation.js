export const ADVANCEMENT_COSTS = {
    RANDOM_PRIMARY: 10000,
    CHOSEN_PRIMARY: 20000,
    RANDOM_SECONDARY: 20000,
    CHOSEN_SECONDARY: 40000,
    AV: 10000,
    MA: 20000,
    PA: 20000,
    AG: 40000,
    ST: 80000,
};

export const LEVELS = [
    {
        level: 1,
        label: "Experienced",
    },
    {
        level: 2,
        label: "Veteran",
    },
    {
        level: 3,
        label: "Emerging Star",
    },
    {
        level: 4,
        label: "Star",
    },
    {
        level: 5,
        label: "Super Star",
    },
    {
        level: 6,
        label: "Legend",
    },
];

export default function updatePlayer(player, advance) {
    const playerSkillsArr = player.skills.split(",") || [];
    const currentPlayerLevel = player.hasOwnProperty("advancements")
        ? player.advancements.reduce(
              (acc, adv) => (adv.level > acc ? adv.level : acc),
              0
          )
        : 0;
    const level =
        advance.level > currentPlayerLevel ? advance.level : currentPlayerLevel;
    const skills = advance.name
        ? [...playerSkillsArr, advance.name].join(",")
        : player.skills;
    const advancements = [
        ...player.advancements.filter((adv) => adv.level !== advance.level),
        advance,
    ];
    const cost = player.missNextGame
        ? 0
        : parseInt(player.cost) +
          advancements.reduce((acc, adv) => adv.cost + acc, 0);
    const SPP = player.hasOwnProperty("SPP")
        ? parseInt(player.SPP) - parseInt(advance.sppCost)
        : undefined;
    return {
        ...player,
        level,
        skills,
        cost,
        advancements,
        SPP,
    };
}
