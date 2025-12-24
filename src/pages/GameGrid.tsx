import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import { GameCard } from "../components/GameCard";
import { filterGames } from "../helpers/alter_data";
import type { Game, Player, Team, Filter } from "../types/types";

export default function GameGrid() {
    const { tournaments, games, players, teams } = useData();
    const [selectedPlayerId, setSelectedPlayerId] = useState<string>("all");
    const [selectedTeamId, setSelectedTeamId] = useState<string>("all");
    const [currentFilters, setCurrentFilters] = useState<Filter>({ tournament: "all", player: "all", team: "all" });
    const [filteredGames, setFilteredGames] = useState<Game[]>([]);
    const [playerOptions, setPlayerOptions] = useState<Player[]>([]);
    const [teamOptions, setTeamOptions] = useState<Team[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (tournaments.length === 0) return;
        setLoading(true);
        setPlayerOptions([{ id: "all", first_name: "All", last_name: "Players" }, ...players])
        setTeamOptions([{ id: "all", name: "All Teams", color: "None" }, ...teams])
        changeFilters("tournament", tournaments[1].id)
        setLoading(false);
    }, [games]);

    const changeFilters = (filterToChange: keyof Filter, newSelection: string) => {
        if (filterToChange === "player" as keyof Filter) setSelectedPlayerId(newSelection);
        else if (filterToChange === "team" as keyof Filter) setSelectedTeamId(newSelection);

        const copy = {...currentFilters};
        copy[filterToChange] = newSelection;
        setCurrentFilters(copy);

        const tournamentFilter = filterToChange === "tournament" ? newSelection : currentFilters.tournament;
        const filteredByTournament = filterGames("tournament", tournamentFilter, games)
        
        const playerFilter = filterToChange === "player" ? newSelection : currentFilters.player;
        const filteredByPlayer = filterGames("player", playerFilter, filteredByTournament)
        
        const teamFilter = filterToChange === "team" ? newSelection : currentFilters.team;
        const filteredByTeam = filterGames("team", teamFilter, filteredByPlayer)
            
        setFilteredGames(filteredByTeam);
    }

	if (loading) return <p>Loading games...</p>;
	if (!filteredGames || filteredGames.length === 0) return <p>No games found.</p>;

    return (
		<div className="flex flex-col justify-center items-center">
		    <div className="flex gap-4 mb-4">
                <div className="flex items-center uppercase font-semibold text-gray-500">
                    Filters:
                </div>
                {/* Tournament Filter */}
                <div className="flex flex-col text-left">
                    <label className="text-sm text-gray-700">Tournaments</label>
                    <select
                        className="border p-2 rounded bg-neutral-700"
                        value={currentFilters.tournament}
                        onChange={(e) => changeFilters("tournament", e.target.value)}
                    >
                        {tournaments.map((tournament) => (
                            <option key={tournament.id} value={tournament.id}>
                                {tournament.name}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Player Filter */}
                <div className="flex flex-col text-left">
                    <label className="text-sm text-gray-700">Players</label>
                    <select
                        className="border p-2 rounded bg-neutral-700"
                        value={currentFilters.player}
                        onChange={(e) => changeFilters("player", e.target.value)}
                    >
                        {playerOptions.map((player) => (
                            <option key={player.id} value={player.id}>
                                {player.first_name} {player.last_name}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Team Filter */}
                <div className="flex flex-col text-left">
                    <label className="text-sm text-gray-700">Teams</label>
                    <select
                        className="border p-2 rounded bg-neutral-700"
                        value={currentFilters.team}
                        onChange={(e) => changeFilters("team", e.target.value)}
                    >
                        {teamOptions.map((team) => (
                            <option key={team.id} value={team.id}>
                                {team.name} {team.color !== "None" ? "(" + team.color + ")" : ""}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Games List */}
            <div className="flex flex-wrap justify-center space-x-4 space-y-4">
				{filteredGames.map((g, idx) => (
					<div key={idx} className="w-[380px]">
						<GameCard gameMeta={g} players={g.players} selectedId={selectedPlayerId} secondarySelectedId={selectedTeamId} />
					</div>
				))}
			</div>
        </div>
    );
}
