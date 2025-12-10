import type { Game, GamePlayer } from "../types/types";

export const computePlayerStats = (games: Game[], playerId: string) => {
    let totalGames = games.length;
    let placements: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    let totalPoints = 0;
    let totalHP = 0;
    let teamCount: Record<string, number> = {};
    const top2ByTeam: Record<string, number> = {};
    const top2Order: string[] = [];
    const bottom2ByTeam: Record<string, number> = {};
    const bottom2Order: string[] = [];
    const lossesByTeam: Record<string, number> = {};
    const teamMatchupCount: Record<string, number> = {};
    const lossesTeamOrder: string[] = [];
    const lossesByPlayer: Record<string, { name: string; count: number; }> = {};
    const playerMatchupCount: Record<string, number> = {};
    const lossesPlayerOrder: string[] = [];
    const tournaments_played: string[] = [];
    let semifinalsCount = 0;
    let finalsCount = 0;
    let finalsWins = 0;

    const progression: { game_number: number, points: number }[] = [];

    games.slice().reverse().forEach((game, index) => {
        const playerEntry = game.players.find(p => p.player.id === playerId) as GamePlayer;
        const placement = 5 - playerEntry.points;
        const roundName = game.round?.name;
        if (!tournaments_played.includes(game.tournament.id)) tournaments_played.push(game.tournament.id)

        placements[placement]++;
        totalPoints += playerEntry.points;
        totalHP += playerEntry.remaining_health;

        const teamName = playerEntry.team.name;
        teamCount[teamName] = (teamCount[teamName] || 0) + 1;
        if (placement <= 2) {
            const t = playerEntry.team.name;
            top2ByTeam[t] = (top2ByTeam[t] || 0) + 1;
            top2Order.push(t);
        } else {
            const t = playerEntry.team.name;
            bottom2ByTeam[t] = (bottom2ByTeam[t] || 0) + 1;
            bottom2Order.push(t);
        }
        game.players.forEach(opponent => {
            if (opponent.player.id !== playerId) {
                const t = opponent.team.name;
                teamMatchupCount[t] = (teamMatchupCount[t] || 0) + 1;
                if (opponent.points > playerEntry.points) {
                    lossesByTeam[t] = (lossesByTeam[t] || 0) + 1;
                    lossesTeamOrder.push(t);
                }
            }
        });
        game.players.forEach(opponent => {
            if (opponent.player.id !== playerId) {
                const name = opponent.player.first_name + " " + opponent.player.last_name;
                playerMatchupCount[name] = (playerMatchupCount[name] || 0) + 1;
                if (opponent.points > playerEntry.points) {
                    const id = opponent.player.id;

                    lossesByPlayer[id] = lossesByPlayer[id] || { name, count: 0 };
                    lossesByPlayer[id].count++;
                    lossesPlayerOrder.push(name);
                }
            }
        });
        if (roundName?.toLowerCase() === "semifinals") {
            semifinalsCount++;
        } else if (roundName?.toLowerCase() === "finals") {
            finalsCount++;
        }
        if (roundName?.toLowerCase() === "finals" && placement === 1) {
            finalsWins++;
        }

        progression.push({
            game_number: index + 1,
            points: playerEntry.points
        });
    });

    const winPct = (placements[1] / totalGames) * 100;
    const top2Pct = ((placements[1] + placements[2]) / totalGames) * 100;
    const commonPlace = getMostCommonPlacementWithPercent(placements);

    const mostPlayedTeam = Object.entries(teamCount)
        .sort((a, b) => b[1] - a[1])[0];

    return {
        totalGames,
        placements,
        winPct: Math.round(winPct),
        top2Pct: Math.round(top2Pct),
        commonPlace: commonPlace,
        avgPoints: Math.round((totalPoints / totalGames) * 100) / 100,
        avgHealth: Math.round((totalHP / totalGames) * 100) / 100,
        mostPlayedTeam: { name: mostPlayedTeam[0], count: mostPlayedTeam[1] },
        semifinals: semifinalsCount,
        semifinalsPCT: Math.round((semifinalsCount / tournaments_played.length) * 100),
        finals: finalsCount,
        finalsPCT: Math.round((finalsCount / tournaments_played.length) * 100),
        finalsWins: finalsWins,
        numTournaments: tournaments_played.length,
        top2ByTeam: getWinner(top2ByTeam, top2Order, totalGames, {}),
        bottom2ByTeam: getWinner(bottom2ByTeam, bottom2Order, totalGames, {}),
        lossesByTeam: getWinner(lossesByTeam, lossesTeamOrder, 0, teamMatchupCount),
        lossesByPlayer: getLossesByPlayerWinner(lossesByPlayer, lossesPlayerOrder, playerMatchupCount),
        progression
    };
}

const getMostCommonPlacementWithPercent = (placementCounts: Record<number, number>) => {
    const total = Object.values(placementCounts).reduce((a, b) => a + b, 0);

    const { placement, count } = getMostCommonPlacement(placementCounts);

    return {
        placement,
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0
    };
}

const getMostCommonPlacement = (placementCounts: Record<number, number>) => {
    let bestPlacement = null;
    let bestCount = -1;
    const placeSuffix: Record<number, string> = { 1: "st", 2: "nd", 3: "rd", 4: "th" }

    for (const place of [1, 2, 3, 4]) {
        const count = placementCounts[place] ?? 0;

        // If higher count OR tie but better placement (lower number)
        if (count > bestCount || (count === bestCount && bestPlacement !== null && place < bestPlacement)) {
            bestPlacement = place;
            bestCount = count;
        }
    }

    return {
        placement: bestPlacement + placeSuffix[bestPlacement || 1],
        count: bestCount
    };
}

const getWinner = (map: Record<string, number>, order: string[], totalGames: number, matchupCounts: Record<string, number>) => {
    if (!map || Object.keys(map).length === 0) return null;

    let winnerName = null;
    let winnerCount = -1;

    for (const [name, count] of Object.entries(map)) {
        if (count > winnerCount || (count === winnerCount && order.lastIndexOf(name) > order.lastIndexOf(winnerName!))) {
            winnerName = name;
            winnerCount = count;
        }
    }

    const basePercentCount = totalGames | matchupCounts[winnerName || ""]

    return {
        name: winnerName,
        count: winnerCount,
        percent: Math.round((winnerCount / basePercentCount) * 100),
    };
}

const getLossesByPlayerWinner = (map: Record<string, { name: string; count: number }>, order: string[], matchupCounts: Record<string, number>) => {
    if (!map || Object.keys(map).length === 0) return null;

    let winner: { name: string; count: number } | null = null;

    for (const entry of Object.values(map)) {
        if (!winner || entry.count > winner.count || (entry.count === winner.count && order.lastIndexOf(entry.name) > order.lastIndexOf(winner.name))) {
            winner = entry;
        }
    }

    return {
        name: winner!.name,
        count: winner!.count,
        percent: Math.round((winner!.count / matchupCounts[winner!.name || ""]) * 100),
    };
}