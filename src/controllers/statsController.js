const kayn = require("../infra/kaynAPI");
const { parseSecToMin, parseSpellIds, parseChampionId, handleStats } = require("../utils/helpers");

const getSummonerByName = async (name) => {
    // Grab Necessary info from summoner Info
    try {
        const { accountId, summonerLevel } = await kayn.Summoner.by.name(name);
        return { accountId, summonerLevel, name };
    } catch (e) {
        throw new Error(`Error Finding Summoner by Name: ${name}`)
    }
}

const getMatchHistory = async (id) => {
    // Seriazlie data for only necessary info
    let serialized = [];

    try {
        // Grab Last 5 matches of summoner
        const { matches } = await kayn.Matchlist.by.accountID(id).query({
            endIndex: 5
        })

        // Serialize
        matches.map((match) => {
            const { gameId } = match;
            serialized.push(gameId);
        });

        return serialized;
    } catch (e) {
        throw new Error(`Error finding Last 5 Matches of accountId ${id}`);
    }
}

const getMatchInfo = async (gameId, accountId) => {
    let friendlyId = 0;
    let player = {};
    try {
        const { gameDuration, participantIdentities = [], participants = [] } = await kayn.Match.get(gameId);

        // turns Miliseconds into minutes and seconds
        const gameTime = parseSecToMin(gameDuration * 1000);

        // Label Id with friendly ParticipantId
        // Using For loop to break in the middle
        for (const identity of participantIdentities) {
            if (identity.player.accountId === accountId) {
                friendlyId = identity.participantId;
                break;
            }
        }

        // Find Player Info with FriendlId
        for (const participant of participants) {
            if (participant.participantId === friendlyId) {
                player = participant;
                break;
            }
        }

        const { championId, spell1Id, spell2Id, stats } = player;

        // Parse Necessary Info
        const champ = await parseChampionId(championId);
        const spells = await parseSpellIds(spell1Id, spell2Id);

        const { win, champLevel, kda, totalMinionsKilled, minionsPerMin, perks, items } = await handleStats(stats, gameDuration);
        return { gameTime, kda, win, champLevel, totalMinionsKilled, minionsPerMin, spells, champ, perks, items };
    } catch (e) {
        throw new Error(e);
    }
}

const mainController = async (name) => {
    try {
        let matchInfo = [];
        const summoner = await getSummonerByName(name);
        const matchHistory = await getMatchHistory(summoner.accountId);

        for (const match of matchHistory) {
            await matchInfo.push(await getMatchInfo(match, summoner.accountId));
        };

        for (const info of matchInfo) {
            info.summonerName = name;
        }

        return await matchInfo;
    } catch (e) {
        throw new Error(e.message);
    }
};

module.exports = mainController;