import { useState } from "react";
import { PlayerGamesModal } from "./PlayerGamesModal";
import { useData } from "../context/DataContext";

export default function StandingsPage() {
    const { tournaments, selectedTournament, standings, setSelectedTournament, games } = useData();

    const [modalPlayerId, setModalPlayerId] = useState<number | null>(null);
    const [modalPlayerName, setModalPlayerName] = useState<string>("");
    const [playerGames, setPlayerGames] = useState<any[]>([]);

    const medalForIndex = (index: number) => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return null;
    };

    const openPlayerModal = async (playerId: number, playerName: string) => {
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
