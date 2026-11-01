import { GameCard } from "./GameCard";

export const PlayerGamesModal = ({ selectedId, selectedName, games, onClose }: {
        selectedId: string, selectedName: string, games: any[], onClose: () => void
    }) => {

	if (!games || games.length === 0) return <p>No games found.</p>;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-2">
            <div className="flex max-h-[calc(100dvh-1rem)] w-full max-w-[820px] flex-col overflow-hidden rounded-lg border border-red-900 bg-black py-4 shadow-xl">
                <h2 className="mb-4 shrink-0 px-4 text-xl font-bold">
                    {selectedName} — Games
                </h2>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="flex flex-col items-center gap-6 px-3 sm:flex-row sm:flex-wrap sm:justify-center">
                        {games.map((g, idx) => (
                            <div key={idx} className="h-[200px] w-full shrink-0 sm:w-[380px] [&>*]:h-full">
                                <GameCard gameMeta={g} players={g.players} selectedId={selectedId} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="shrink-0 px-4">
                    <button className="mt-4 p-3 clear-button" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
