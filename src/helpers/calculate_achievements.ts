import type { Achievement, AchievementFunction, ConsistencyRule, Game, GamePlayer, Player, PlayerAchievement } from "../types/types";

export const calculateAchievements = (games: Game[], achievementsList: Achievement[], gameFilter?: string): Achievement[] => {
    const calculatedAchievements: Achievement[] = []
    const functions = gameFilter === "all time" ? achievementFunctionsAllTime : achievementFunctions;
    achievementsList.forEach((achievement: Achievement) => {
        const achievementFunction = functions.find((a) => a.id === achievement.id);
        if (!achievementFunction) return null;

        calculatedAchievements.push({
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            rarity: achievement.rarity,
            players: achievementFunction.function(games)
        });        
    })

    return calculatedAchievements.filter((a) => a.players.length > 0); // optional: hide empty achievements
};

const calcWinGame = (games: Game[]): PlayerAchievement[] => {
    const map = new Map();

    games.forEach((game) => {
        const winner = game.players.find((p: GamePlayer) => p.points === 4);
        if (!winner) return;

        incrementPlayer(map, winner.player);
    });

    return Array.from(map.values());
};

const calcWinWith20Health = (games: Game[]): PlayerAchievement[] => {
    return calcWinWithHealth(games, 20)
};

const calcWinWith1Health = (games: Game[]): PlayerAchievement[] => {
    return calcWinWithHealth(games, 1)
};

const calcWinWithHealth = (games: Game[], health: number): PlayerAchievement[] => {
    const map = new Map();

    games.forEach((game) => {
        const winner = game.players.find((p: GamePlayer) => p.points === 4);
        if (!winner) return;

        if (winner.remaining_health == health) {
            incrementPlayer(map, winner.player);
        }
    });

    return Array.from(map.values());
};

const calcWinBy10Health = (games: Game[]): PlayerAchievement[] => {
    const map = new Map();

    games.forEach((game) => {
        const winner = game.players.find((p: GamePlayer) => p.points === 4);
        const second = game.players.find((p: GamePlayer) => p.points === 3);

        if (!winner || !second) return;

        const healthDiff =
            winner.remaining_health - second.remaining_health;

        if (healthDiff >= 10) {
            incrementPlayer(map, winner.player);
        }
    });
    
    return Array.from(map.values());
};

const calcWinByOneHealth = (games: Game[]): PlayerAchievement[] => {
    const map = new Map();

    games.forEach((game) => {
        const winner = game.players.find((p: GamePlayer) => p.points === 4);
        const second = game.players.find((p: GamePlayer) => p.points === 3);

        if (!winner || !second) return;

        const healthDiff =
            winner.remaining_health - second.remaining_health;

        if (healthDiff === 1) {
            incrementPlayer(map, winner.player);
        }
    });
    
    return Array.from(map.values());
};

const calcWinAllOpponentsEliminated = (games: Game[]): PlayerAchievement[] => {
    const map = new Map();

    games.forEach((game) => {
        const winner = game.players.find((p: GamePlayer) => p.points === 4);
        if (!winner) return;

        const opponents = game.players.filter(
            (p: GamePlayer) => p.player.id !== winner.player.id
        );

        const allEliminated = opponents.every(
            (p: GamePlayer) => p.remaining_health === 0
        );

        if (allEliminated) {
            incrementPlayer(map, winner.player);
        }
    });

    return Array.from(map.values());
};

const calcMadeFinals = (games: any[]): PlayerAchievement[] => {
    const map = new Map();

    games.forEach((game) => {
        if (game.round?.name !== "Finals") return;

        game.players.forEach((p: any) => {
            incrementPlayer(map, p.player);
        });
    });

    return Array.from(map.values());
};

const calcWinTournament = (games: any[]): PlayerAchievement[] => {
    const map = new Map();

    games.forEach((game) => {
        if (game.round?.name !== "Finals") return;

        const winner = game.players.find((p: any) => p.points === 4);
        if (!winner) return;

        incrementPlayer(map, winner.player);
    });

    return Array.from(map.values());
};

const incrementPlayer = (
    map: Map<string, any>,
    player: Player
) => {
    const existing = map.get(player.id);
    if (existing) {
        existing.count += 1;
    } else {
        map.set(player.id, {
            player,
            count: 1,
        });
    }
};

const calcTopTwoEveryGamePlayed = (games: any[]): PlayerAchievement[] => {
    return calculateConsistencyAchievement(games, (player, _game) => player.points < 3);
}

const calcNeverPlacedLast = (games: any[]): PlayerAchievement[] => {
    return calculateConsistencyAchievement(
        games,
        (player, game) => {
            const minPoints = Math.min(
                ...game.players.map((p: any) => p.points)
            );
            return player.points === minPoints;
        },
    );
}

const calculateConsistencyAchievement = (games: Game[], failureRule: ConsistencyRule): PlayerAchievement[] => {
    const appearances = new Map<
        string,
        { player: any; valid: boolean }
    >();

    games.forEach((game) => {
        game.players.forEach((p: any) => {
            if (!appearances.has(p.player.id)) {
                appearances.set(p.player.id, {
                    player: p.player,
                    valid: true,
                });
            }

            if (failureRule(p, game)) {
                appearances.get(p.player.id)!.valid = false;
            }
        });
    });

    return Array.from(appearances.values())
        .filter((entry) => entry.valid)
        .map((entry) => ({
            player: entry.player,
            count: 1,
        }))
};

const calcMostFirstPlaces = (games: any[]) => {
    return calcMostPlacement(games, 4);
}

const calcMostSecondPlaces = (games: any[]) => {
    return calcMostPlacement(games, 3);
}

const calcMostThirdPlaces = (games: any[]) => {
    return calcMostPlacement(games, 2);
}

const calcMostFourthPlaces = (games: any[]) => {
    return calcMostPlacement(games, 1);
}

const calcMostPlacement = (games: any[], pointsValue: number): PlayerAchievement[] => {
    const counts: Record<string, PlayerAchievement> = {};
    let totalGamesWithPlacement = 0;

    games.forEach((game) => {
        game.players.forEach((gp: any) => {
            if (gp.points === pointsValue) {
                totalGamesWithPlacement++;

                const id = gp.player.id;

                if (!counts[id]) {
                    counts[id] = { player: gp.player, count: 0 };
                }

                counts[id].count++;
            }
        });
    });

    const entries = Object.values(counts);
    if (entries.length === 0) return [];

    const maxCount = Math.max(...entries.map(e => e.count));

    const winners = entries
        .filter(e => e.count === maxCount)
        .map(e => ({
            player: e.player,
            count: 1
        }));

    return winners;
};

const calcPlayedMostTeams = (games: any[]) => {
    return calcTeamCoverageAchievement(games, () => true, true);
}

const calcWonWithMostTeams = (games: any[]) => {
    return calcTeamCoverageAchievement(games, (gp) => gp.points === 4, true);
}

const achievementFunctions: {id: string, function: AchievementFunction}[] = [
    { id: "bd093392-c4fd-481c-b7bb-e675b620b061", function: calcWinGame },
    { id: "1b9aad77-8aeb-4f9f-a39e-3cc4ccc1c06c", function: calcWinWith20Health },
    { id: "f2f085e9-d4b2-4491-903a-06700e5e37cc", function: calcWinWith1Health },
    { id: "6154a745-4544-4329-9b28-e278e675b3b4", function: calcWinBy10Health },
    { id: "12fc9a80-ffbd-4be7-a794-f39f90fbd522", function: calcWinByOneHealth },
    { id: "c883d925-3268-4d32-b364-25b28a69d64f", function: calcWinAllOpponentsEliminated },
    { id: "72bdf4eb-ad3f-4400-a612-aabcf2b9674f", function: calcMadeFinals },
    { id: "c81d518a-d538-442c-88a7-ebb29106e8a2", function: calcWinTournament },
    { id: "67d5554b-093a-474e-bb3d-83f9cf93184c", function: calcTopTwoEveryGamePlayed },
    { id: "3f2e8b59-46e5-42df-8873-21b90409acc8", function: calcNeverPlacedLast },
    { id: "6dfb0078-88a5-4f2e-a44a-7c799f2fed46", function: calcMostFirstPlaces },
    { id: "987ce6a6-667e-41fa-a913-d34f907f7887", function: calcMostSecondPlaces },
    { id: "768d7673-1d49-4a10-96a8-27600ed68fac", function: calcMostThirdPlaces },
    { id: "9d60c9d4-3942-4529-bfb4-4638d2941606", function: calcMostFourthPlaces },
    { id: "2a85a0f5-5d08-4ebf-a738-a9d07f0b2815", function: calcPlayedMostTeams },
    { id: "2d560c7b-70fe-4a28-9dfb-8af332415709", function: calcWonWithMostTeams },
]

const TOTAL_TEAMS = 8;

const calcPlayedAllTeams = (games: any[]) => {
    return calcTeamCoverageAchievement(games, () => true);
}

const calcTop2AllTeams = (games: any[]) => {
    return calcTeamCoverageAchievement(games, (gp) => gp.points >= 3);
}

const calcWonAllTeams = (games: any[]) => {
    return calcTeamCoverageAchievement(games, (gp) => gp.points === 4);
}

const calcTeamCoverageAchievement = (games: any[], qualifies: (gp: any) => boolean, findMostTeams?: boolean): PlayerAchievement[] => {
    const playerTeams: Record<string, { player: Player; teams: Set<string> }> = {};

    games.forEach((game) => {
        game.players.forEach((gp: any) => {
            if (!qualifies(gp)) return;

            const id = gp.player.id;
            const teamId = gp.team.id;

            if (!playerTeams[id]) {
                playerTeams[id] = {
                    player: gp.player,
                    teams: new Set(),
                };
            }

            playerTeams[id].teams.add(teamId);
        });
    });

    let winners: PlayerAchievement[] = [];
    if (findMostTeams) {
        let max = 0;

        for (const [, data] of Object.entries(playerTeams)) {
            const count = data.teams.size;

            if (count > max) {
                max = count;
                winners.length = 0;
                winners.push({ player: data.player, count: 1 });
            } else if (count === max) {
                winners.push({ player: data.player, count: 1 });
            }
        }
    } else {
        winners = Object.values(playerTeams)
            .filter(p => p.teams.size === TOTAL_TEAMS)
            .map(p => ({
                player: p.player,
                count: 1,
            }));
    }

    return winners;
};

const achievementFunctionsAllTime: {id: string, function: AchievementFunction}[] = [
    { id: "992d516d-511e-42a3-a2bd-d20168af6466", function: calcPlayedAllTeams },
    { id: "1b9aad77-8aeb-4f9f-a39e-3cc4ccc1c06c", function: calcTop2AllTeams },
    { id: "862f352c-c10a-4e1a-84a9-0b676d6006e7", function: calcWonAllTeams },
]