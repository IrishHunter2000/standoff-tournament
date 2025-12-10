import { GameCard } from "./GameCard";

export const PlayerGamesModal = ({ selectedId, selectedName, isPlayers, games, onClose }: {
        selectedId: string, selectedName: string, isPlayers: boolean, games: any[], onClose: () => void
    }) => {

	if (!games || games.length === 0) return <p>No games found.</p>;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div className="bg-black rounded-lg py-6 w-[820px] shadow-xl border border-red-900">
                <h2 className="text-xl font-bold mb-4">{selectedName} — Games</h2>

                <div className="max-h-[640px] flex flex-wrap justify-center gap-4 overflow-auto">
                    {games.map((g, idx) => (
                        <div key={idx} className="w-[380px] h-[200px]">
                            <GameCard gameMeta={g} players={g.players} selectedId={selectedId} isPlayers={isPlayers} />
                        </div>
                    ))}
                </div>

                <button
                    className="w-1/5 mt-4 p-3 clear-button"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};
