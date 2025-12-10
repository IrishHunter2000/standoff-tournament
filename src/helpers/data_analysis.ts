import type { GamePlayer } from "../types/types";

export const filterStandings = (selectedTournament: string, gamePlayers: GamePlayer[]) => {
    const filtered = selectedTournament === "all"
        ? gamePlayers
        : gamePlayers.filter((gp) => gp.game?.tournament_id === selectedTournament);
    return filtered
}

export const totalStandings = (data: any) => {
    const player_totals = new Map();
    const team_totals = new Map();
    data?.forEach((row: any) => {
        const player_id = row.player_id;
        const first_name = row.player.first_name;
        const last_name = row.player.last_name;

        const team_id = row.team_id;
        const team_name = row.team.name;
        const team_color = row.team.color;

        if (!player_totals.has(player_id)) player_totals.set(player_id, { first_name, last_name, points: 0, health: 0 });
        if (!team_totals.has(team_id)) team_totals.set(team_id, { team_name, team_color, points: 0, health: 0 });
        player_totals.get(player_id).health += row.remaining_health;
        player_totals.get(player_id).points += row.points;
        team_totals.get(team_id).health += row.remaining_health;
        team_totals.get(team_id).points += row.points;
    });
    return { player_totals, team_totals };
}

export const sortStandings = (totals: any) => {
    const sorted = Array.from(totals, ([id, info]) => ({
        id,
        ...info,
    })).sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points; // primary sort
        }
        return b.health - a.health; // secondary sort
    });
    return sorted;
};

export const formatUTCDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC", // stays in UTC
    }).format(new Date(dateString));
}