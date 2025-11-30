import { useData } from "../context/DataContext";
import { GameCard } from "./GameCard";

export default function GameGrid() {
    const { tournaments, selectedTournament, games, setSelectedTournament } = useData();

	if (!games || games.length === 0) return <p>No games found.</p>;

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

            {/* Games List */}
            <div className="flex flex-wrap justify-center space-x-4 space-y-4">
				{games.map((g, idx) => (
					<div key={idx} className="w-[380px]">
						<GameCard gameMeta={g} players={g.players} />
					</div>
				))}
			</div>
        </div>
    );
}
