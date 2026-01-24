import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import { GameCard } from "../components/GameCard";
import { filterGames } from "../helpers/alter_data";
import type { Game, Player, Team, Filter } from "../types/types";
import { FilterDropdown } from "../components/FilterDropdown";

export default function GameGrid() {
    const { tournaments, games, players, teams } = useData();
    const [selectedPlayerId, setSelectedPlayerId] = useState<string>("all");
    const [selectedTeamId, setSelectedTeamId] = useState<string>("all");
    const [currentFilters, setCurrentFilters] = useState<Filter>({ tournament: "all", player: "all", team: "all" });
    const [filteredGames, setFilteredGames] = useState<Game[]>([]);
    const [playerOptions, setPlayerOptions] = useState<Player[]>([]);
    const [teamOptions, setTeamOptions] = useState<Team[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        if (tournaments.length === 0) return;
        setLoading(true);
        setPlayerOptions([{ id: "all", first_name: "All", last_name: "Players" }, ...players])
        setTeamOptions([{ id: "all", name: "All Teams", color: "None" }, ...teams])
        changeTournamentFilter(tournaments[1].id)
        setLoading(false);
    }, [games]);

    const changeTournamentFilter = (newSelection: string) => {
        changeFilters("tournament", newSelection);
    }

    const changePlayerFilter = (newSelection: string) => {
        changeFilters("player", newSelection);
    }
    
    const changeTeamFilter = (newSelection: string) => {
        changeFilters("team", newSelection);
    }

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
        
        if (window.innerWidth < 768) setFiltersOpen(false);
        setFilteredGames(filteredByTeam);
    }

	if (loading) return <p>Loading games...</p>;

    return (
		<div className="flex flex-col justify-center items-center">
            <button
                className="md:hidden flex items-center justify-between w-full text-white"
                onClick={() => setFiltersOpen(!filtersOpen)}
            >
                <span className="font-semibold">Filters</span>
                <span>{filtersOpen ? "▲" : "▼"}</span>
            </button>
            <div
                className={`
                    overflow-hidden transition-all duration-300 mb-4 bg-black w-full
                    ${filtersOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
                    md:max-h-none md:opacity-100 md:bg-transparent md:w-auto
                `}
            >
                <div className="flex flex-col md:flex-row gap-x-4 gap-y-2 mt-2 px-4 pb-4 md:mt-0 md:p-0">
                    <div className="hidden md:flex items-center uppercase font-semibold text-gray-500">
                        Filters:
                    </div>
                    {/* Tournament Filter */}
                    <FilterDropdown
                        filterTitle="Tournaments"
                        filterValue={currentFilters.tournament}
                        filterOptions={tournaments}
                        changeFilter={changeTournamentFilter}
                    />
                    {/* Player Filter */}
                    <FilterDropdown
                        filterTitle="Players"
                        filterValue={currentFilters.player}
                        filterOptions={playerOptions}
                        changeFilter={changePlayerFilter}
                    />
                    {/* Team Filter */}
                    <FilterDropdown
                        filterTitle="Teams"
                        filterValue={currentFilters.team}
                        filterOptions={teamOptions}
                        changeFilter={changeTeamFilter}
                    />
                </div>
            </div>

            {/* Games List */}
            {!filteredGames?.length
                ? <p>No games found.</p>
                : <div className="flex flex-wrap justify-center gap-4">
                    {filteredGames.map((g, idx) => (
                        <div key={idx}>
                            <GameCard gameMeta={g} players={g.players} selectedId={selectedPlayerId} secondarySelectedId={selectedTeamId} />
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}
