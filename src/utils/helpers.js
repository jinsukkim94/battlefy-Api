// Static Data from ddragon
const champions = require("../static/championFull.json").keys;
const items = require("../static/item").data;

// Perks
const perks = require("../static/runesReforged"); // AKA Runes

// Load Perks for Individual Rune Ids
let keys = [];
for (const perk of perks) {
    const runes = perk.slots[0].runes;
    for (const rune of runes) {
        keys.push(rune);
    }
}

const spells = require("../static/summoner").data;

// Main Helper Function for Processing Stats.
const handleStats = async (stats, gameDuration) => {
    try {
        // Major Info
        const { win, champLevel, kills, deaths, assists, totalMinionsKilled } = stats;

        // Perks
        const { perk0: keystone, perkSubStyle: secondary } = stats;

        // Parse the Perks
        const perks = await parsePerkIds(keystone, secondary);

        // Parse Item Ids
        let items = [];
        for (let i = 0; i <= 6; i++) {
            // Use Index for fast Ref
            let index = `item${i}`;
            await items.push(await parseItemIds(stats[index]));
        }

        // Calculate minor Logic
        const kda = ((kills + assists) / deaths).toFixed(2)
        const minionsPerMin = totalMinionsKilled / gameDuration * 60;


        // Parse Items here
        return await { win, champLevel, kda, totalMinionsKilled, minionsPerMin, perks, items };
    } catch (e) {
        throw new Error(e.message);
    }
}

const parseSecToMin = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = ((time % 60000) / 1000).toFixed(0);
    return { minutes, seconds }
}

const parseItemIds = async (id) => {
    if (!id) {
        return;
    } else return await items[id].name;
}

const parseSpellIds = async (id1, id2) => {
    // Change to String before Processing
    const idD = id1.toString();
    const idF = id2.toString();

    // Spells D, F
    const spell1 = await Object.keys(spells).filter(spellName =>
        spells[spellName].key === idD
    )[0];
    const spell2 = await Object.keys(spells).filter(spellName =>
        spells[spellName].key === idF
    )[0];

    return [spell1, spell2]
}

const parseChampionId = async (id) => {
    return champions[id];
}

const parsePerkIds = async (id, sub) => {
    let key, second;
    // Keystone
    key = await keys.filter(keystone =>
        keystone.id === id
    )[0].name;
    // Set Secondary Path
    second = await perks.filter(rune =>
        rune.id === sub
    )[0].name;

    return { key, second };
}

module.exports = { handleStats, parseSecToMin, parseChampionId, parseSpellIds };