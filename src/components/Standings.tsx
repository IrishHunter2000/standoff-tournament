import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlayerGamesModal } from "./PlayerGamesModal";
import { PlayerStatsModal } from "./PlayerStatsModal";
import { useData } from "../context/DataContext";
import type { Game, Standings } from "../types/types";
import { filterStandings, totalStandings, sortStandings } from "../helpers/data_analysis";
import { computePlayerStats } from "../helpers/calculate_stats";

export default function StandingsPage() {
    const { games, gamePlayers, tournaments } = useData();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedName, setSelectedName] = useState<string>("");
    const [modalType, setModalType] = useState("");
    const [playerGames, setPlayerGames] = useState<Game[]>([]);
    const [playerStandings, setPlayerStandings] = useState<Standings[]>([]);
    const [teamStandings, setTeamStandings] = useState<Standings[]>([]);
    const [standings, setStandings] = useState<Standings[]>([]);
    const [currentTournament, setCurrentTournament] = useState("all");
	const [subPage, setSubPage] = useState("players");
    const [isPlayers, setIsPlayers] = useState(true);
	const tabs = [
		{ id: "players", label: "Players" },
		{ id: "teams", label: "Teams" }
	];

    useEffect(() => {
        if (gamePlayers.length === 0) return;
        calculateStandings(tournaments[1].id)
    }, [gamePlayers]);

    const calculateStandings = (selectedTournament: string) => {
        const filtered = filterStandings(selectedTournament, gamePlayers)
        const { player_totals, team_totals } = totalStandings(filtered);
        const player_sorted = sortStandings(player_totals);
        setPlayerStandings(player_sorted);
        const team_sorted = sortStandings(team_totals);
        setTeamStandings(team_sorted);
        setStandings(isPlayers ? player_sorted : team_sorted)
        setCurrentTournament(selectedTournament);
    }

    const handleSubPage = (tabId: string) => {
        const isPagePlayers = tabId === "players"
        setSubPage(tabId);
        setIsPlayers(isPagePlayers);
        setStandings(isPagePlayers ? playerStandings : teamStandings)
    }

    const medalForIndex = (index: number) => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return null;
    };

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
	if (!standings) return <p>No standings found.</p>;

    return (
		<div className="flex flex-col justify-center items-center">
		    <div className="flex gap-4 mb-4">
                {/* TABS */}
                <div className="flex justify-center items-center gap-4 mr-4 text-lg font-medium">
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
                <div className="flex items-center uppercase font-semibold text-gray-500">
                    Filters:
                </div>
                {/* Tournament Filter */}
                <div className="flex flex-col text-left">
                    <label className="text-sm text-gray-700">Tournaments</label>
                    <select
                        className="border p-2 rounded bg-neutral-700"
                        value={currentTournament}
                        onChange={(e) => calculateStandings(e.target.value)}
                    >
                        {tournaments.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name}
                        </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Standings List */}
            <div className={`space-y-2 ${isPlayers ? 'w-[390px]' : 'w-[440px]'}`}>
                {standings.map((p, index) => {
                    const medal = medalForIndex(index)
                    
                    return (
                        <div
                            key={p.id}
                            className={`flex justify-between items-center p-2 rounded-xl shadow ${index === 0 && "first-border"} ${index === 1 && "second-border"} ${index === 2 && "third-border"}`}
                        >
                            {medal && <span className="w-[40px] text-2xl">
                                {medal}
                            </span>}
                            {!medal && <span className="w-[40px] font-medium">
                                {index + 1}
                            </span>}
                            {isPlayers ? (
                                <span className="w-[170px] ml-[10px] text-left font-semibold">
                                    {p.first_name} {p.last_name}
                                </span>
                            ) : (
                                <span className="w-[250px] ml-[10px] text-left font-semibold">
                                    {p.team_name} ({p.team_color})
                                </span>
                            )}
                            <span className="w-[80px] font-bold">{p.points} pts</span>
                            <p
                                className="w-1/8 cursor-pointer text-xs text-gray-600"
                                onClick={() => openModal(p.id, "games", isPlayers ? p.first_name + " " + p.last_name : "(" + p.team_color + " Team) " + p.team_name)}
                            >
                                View Games
                            </p>
                            <p
                                className="w-1/8 cursor-pointer text-xs text-gray-600"
                                onClick={() => openModal(p.id, "stats", p.first_name + " " + p.last_name)}
                            >
                                View Stats
                            </p>

                        </div>
                    )
                })}
            </div>
            {selectedId && modalType === "games" && (
                <PlayerGamesModal
                    selectedId={selectedId}
                    selectedName={selectedName}
                    isPlayers={isPlayers}
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
                    computePlayerStats={computePlayerStats}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}
