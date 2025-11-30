import { GameCard } from "./GameCard";

export const PlayerGamesModal = ({ name, games, onClose }: {
        name: string, games: any[], onClose: () => void
    }) => {

	if (!games || games.length === 0) return <p>No games found.</p>;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div className="bg-black rounded-lg p-6 w-[820px] shadow-xl">
                <h2 className="text-xl font-bold mb-4">{name}'s Games</h2>

                <div className="flex flex-wrap justify-between">
                    {games.map((g, idx) => (
                        <div key={idx} className="w-[380px]">
                            <GameCard gameMeta={g} players={g.players} name={name} />
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
