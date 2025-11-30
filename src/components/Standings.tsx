import { useEffect, useState } from "react";
import { PlayerGamesModal } from "./PlayerGamesModal";
import { useData } from "../context/DataContext";
import type { Standings } from "../types/types";

export default function StandingsPage() {
    const { games, gamePlayers, tournaments, selectedTournament, setSelectedTournament } = useData();

    const [modalPlayerId, setModalPlayerId] = useState<string | null>(null);
    const [modalPlayerName, setModalPlayerName] = useState<string>("");
    const [playerGames, setPlayerGames] = useState<any[]>([]);
    const [standings, setStandings] = useState<Standings[]>([]);

    useEffect(() => {
        if (gamePlayers.length === 0) return;
        const totals = totalStandings(gamePlayers);
        const sorted = sortStandings(totals);
        setStandings(sorted);
    }, [gamePlayers]);

    const totalStandings = (data: any) => {
        const totals = new Map();
        data?.forEach((row: any) => {
            const id = row.player_id;
            const first_name = row.player.first_name;
            const last_name = row.player.last_name;

            if (!totals.has(id)) totals.set(id, { first_name, last_name, points: 0, health: 0 });
            totals.get(id).health += row.remaining_health;
            totals.get(id).points += row.points;
        });
        return totals;
    }

    const sortStandings = (totals: any) => {
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

    const medalForIndex = (index: number) => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return null;
    };

    const openPlayerModal = async (playerId: string, playerName: string) => {
        setModalPlayerId(playerId);
        setModalPlayerName(playerName);
        const filteredGames = games.filter((game) =>
            game.players.some((p: any) => p.player.id === playerId)
        );
        setPlayerGames(filteredGames);
    };

    const closeModal = () => {
        setModalPlayerId(null);
        setPlayerGames([]);
    };

    if (!gamePlayers || gamePlayers.length === 0) return <p>Retrieving standings now...</p>;
	if (!standings) return <p>No standings found.</p>;

    return (
		<div className="flex flex-col justify-center items-center">
            {/* Tournament Filter */}
            <select
                className="border p-2 rounded my-4 bg-neutral-700"
                value={selectedTournament}
                onChange={(e) => setSelectedTournament(e.target.value)}
            >
                {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                    {t.name}
                </option>
                ))}
            </select>

            {/* Standings List */}
            <div className="w-[350px] space-y-2">
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
                            <span className="w-[170px] ml-[10px] text-left font-semibold">
                                {p.first_name} {p.last_name}
                            </span>
                            <span className="w-[80px] font-bold">{p.points} pts</span>
                            <p className="w-1/8 cursor-pointer text-xs text-gray-600" onClick={() => openPlayerModal(p.id, p.first_name + " " + p.last_name)}>
                                View Games
                            </p>

                        </div>
                    )
                })}
            </div>
            {modalPlayerId && (
                <PlayerGamesModal
                    name={modalPlayerName}
                    games={playerGames}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}
