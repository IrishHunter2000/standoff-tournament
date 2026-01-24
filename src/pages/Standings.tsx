import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlayerGamesModal } from "../components/PlayerGamesModal";
import { PlayerStatsModal } from "../components/PlayerStatsModal";
import { useData } from "../context/DataContext";
import type { Game, Standings } from "../types/types";
import { filterGamePlayers, totalStandings, sortStandings } from "../helpers/alter_data";
import { FilterDropdown } from "../components/FilterDropdown";
import { StandingsCard } from "../components/StandingsCard";

export default function StandingsPage() {
    const { games, gamePlayers, tournaments } = useData();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedName, setSelectedName] = useState<string>("");
    const [modalType, setModalType] = useState("");
    const [playerGames, setPlayerGames] = useState<Game[]>([]);
    const [playerStandings, setPlayerStandings] = useState<Standings[]>([]);
    const [teamStandings, setTeamStandings] = useState<Standings[]>([]);
    const [playerTotals, setPlayerTotals] = useState<any>({});
    const [teamTotals, setTeamTotals] = useState<any>({});
    const [standings, setStandings] = useState<Standings[]>([]);
    const [tournamentFilter, setTournamentFilter] = useState("all");
	const [subPage, setSubPage] = useState("players");
    const [isPlayers, setIsPlayers] = useState(true);
	const tabs = [{ id: "players", label: "Players" }, { id: "teams", label: "Teams" }];
    const orderOptions = [{ id: "points", name: "Total Points" }, { id: "place", name: "Average Placement" }];
    const [orderByMetric, setOrderByMetric] = useState("points");

    useEffect(() => {
        if (gamePlayers.length === 0) return;
        calculateStandings(tournaments[1]?.id)
    }, [gamePlayers]);

    useEffect(() => {
        const overflowStyle = selectedId ? "hidden" : "";
        document.body.style.overflow = overflowStyle;
        return () => { document.body.style.overflow = "" };
    }, [selectedId]);

    const calculateStandings = (selectedTournament: string) => {
        const filtered = filterGamePlayers(selectedTournament, gamePlayers)
        const { player_totals, team_totals } = totalStandings(filtered);
        setPlayerTotals(player_totals);
        setTeamTotals(team_totals);
        const player_sorted = sortStandings(player_totals, orderByMetric);
        setPlayerStandings(player_sorted);
        const team_sorted = sortStandings(team_totals, orderByMetric);
        setTeamStandings(team_sorted);
        setStandings(isPlayers ? player_sorted : team_sorted)
        setTournamentFilter(selectedTournament);
    }

    const calculateOrdering = (selectedOrdering: string) => {
        const player_sorted = sortStandings(playerTotals, selectedOrdering);
        setPlayerStandings(player_sorted);
        const team_sorted = sortStandings(teamTotals, selectedOrdering);
        setTeamStandings(team_sorted);
        setStandings(isPlayers ? player_sorted : team_sorted)
        setOrderByMetric(selectedOrdering);
    }

    const handleSubPage = (tabId: string) => {
        const isPagePlayers = tabId === "players"
        setSubPage(tabId);
        setIsPlayers(isPagePlayers);
        setStandings(isPagePlayers ? playerStandings : teamStandings)
    }

    const openModal = async (id: string, type: string, name: string) => {
        setSelectedId(id);
        setSelectedName(name);
        setModalType(type);
        const filteredGames = games.filter((game) =>
            game.players.some((p: any) => (isPlayers ? p.player.id : p.team.id) === id)
        );
        setPlayerGames(filteredGames);
    };

    const closeModal = () => {
        setSelectedId(null);
        setSelectedName("");
        setModalType("");

        setPlayerGames([]);
    };

    if (!gamePlayers || gamePlayers.length === 0) return <p>Retrieving standings now...</p>;

    return (
		<div className="flex flex-col justify-center items-center">
		    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:gap-4 mb-4">
                {/* TABS */}
                <div className="flex justify-center items-center gap-3 mr-3 md:gap-4 md:mr-4 text-lg font-medium">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleSubPage(tab.id)}
                            className={`px-1 pb-2 relative transition-colors
                                ${subPage === tab.id ? "text-red-500" : "text-gray-400 hover:text-gray-200"}
                            `}
                        >
                            {tab.label}

                            {/* Animated Underline */}
                            {subPage === tab.id && (
                                <motion.div
                                    layoutId="sub_underline"
                                    className="absolute left-0 right-0 -bottom-[2px] h-[3px] bg-red-500 rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
                <div className="flex gap-4">
                    {/* Tournament Filter */}
                    <FilterDropdown
                        filterTitle="Tournament Filter"
                        filterValue={tournamentFilter}
                        filterOptions={tournaments}
                        changeFilter={calculateStandings}
                    />
                    {/* Metric Ordering */}
                    <FilterDropdown
                        filterTitle="Order By Metric"
                        filterValue={orderByMetric}
                        filterOptions={orderOptions}
                        changeFilter={calculateOrdering}
                    />
                </div>
            </div>

            {/* Standings List */}
            {!standings?.length
                ? <p>No standings found.</p>
                : <div className="space-y-2">
                    {standings.map((standing, index) => (
                        <StandingsCard
                            key={index}
                            standing={standing}
                            index={index}
                            isPlayers={isPlayers}
                            orderByMetric={orderByMetric}
                            openModal={openModal}
                        />
                    ))}
                </div>
            }
            {selectedId && modalType === "games" && (
                <PlayerGamesModal
                    selectedId={selectedId}
                    selectedName={selectedName}
                    games={playerGames}
                    onClose={closeModal}
                />
            )}
            {selectedId && modalType === "stats" && (
                <PlayerStatsModal
                    selectedId={selectedId}
                    selectedName={selectedName}
                    isPlayers={isPlayers}
                    games={playerGames}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}
