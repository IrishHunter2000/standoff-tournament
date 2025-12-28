import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { computePlayerStats } from "../helpers/calculate_stats";
import { getTeamStyle } from "../helpers/team_styles";

export const PlayerStatsModal = ({ selectedId, selectedName, isPlayers, games, onClose }: {
        selectedId: string, selectedName: string, isPlayers: boolean, games: any[], onClose: () => void
    }) => {

    const stats: any = computePlayerStats(games, selectedId, isPlayers);

	if (!games || games.length === 0 || !stats || stats.length === 0) return <p>No games found.</p>;

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="flex flex-col w-[920px] max-h-[90vh] bg-black rounded-lg py-6 shadow-xl border border-red-900">
                <h2 className="text-xl font-bold mb-4">{selectedName} — Stats</h2>

                <div className="overflow-y-auto md:overflow-visible space-y-6">
                    {/* Summary Stats */}
                    <div className="md:flex columns-3 md:flex-row space-y-3">
                        <Stat title="Games" title2="Played" value={stats.totalGames} />
                        <StatWithPCT title="Games" title2="Won" value={stats.placements[1]} pct={stats.winPct} />
                        <StatWithPCT title="Usually" title2="Placing" value={stats.commonPlace.placement} pct={stats.commonPlace.percent} />
                        <StatWithPCT title="Placing" title2="Top 2" value={stats.placements[1] + stats.placements[2]} pct={stats.top2Pct} />
                        <Stat title="Average" title2="Points" value={stats.avgPoints} />
                        <Stat title="Tournaments" title2="Played In" value={stats.numTournaments} />
                        <StatWithPCT title="Advanced to" title2="Semifinals" value={stats.semifinals} pct={stats.semifinalsPCT} />
                        <StatWithPCT title="Advanced to" title2="Finals" value={stats.finals} pct={stats.finalsPCT} />
                        <Stat title="Tournaments" title2="Won" value={stats.finalsWins} />
                    </div>

                    {/* Summary Stats */}
                    <div className="flex flex-wrap md:flex-row justify-around items-start space-y-4">
                        <StatWithTeam title="Most Played As" value={stats.mostPlayedTeam} />
                        <StatWithTeam title="Most Top 2 As" value={stats.top2ByTeam} />
                        <StatWithTeam title="Most Bottom 2 As" value={stats.bottom2ByTeam} />
                        <StatWithTeam title="Nemesis Team" value={stats.lossesByTeam} />
                        <StatWithTeam title="Nemesis Player" value={stats.lossesByPlayer} isTeam={false} />
                    </div>

                    {/* Progression Chart */}
                    <div className="mb-4 mr-6 h-[200px]">
                        <h3 className="font-semibold text-center mb-2">Points per Game Progression</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.progression}>
                                <XAxis dataKey="game_number" />
                                <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} allowDecimals={false} />
                                <Line type="monotone" dataKey="points" stroke="#10b981" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="mt-2">
                    <button className="w-20 clear-button" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

function Stat({ title, title2, value }: { title: string; title2?: string, value: string }) {
    return (
        <div className="md:w-1/9 flex flex-col items-center text-sm/4">
            <p className="mb-1">{title}<br/>{title2}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}

function StatWithPCT({ title, title2, value, pct }: { title: string; title2?: string, value: string, pct: string }) {
    return (
        <div className="md:w-1/9 flex flex-col items-center text-sm/4">
            <p className="mb-1">{title}<br/>{title2}</p>
            <div className="text-xl font-bold flex justify-center items-center space-x-2">
                <p>{value}</p>
                <p className="text-sm font-normal">({pct}%)</p>
            </div>
        </div>
    );
}

function StatWithTeam({ title, value, isTeam = true }: { title: string; value: { name: string, count: number, percent: number }, isTeam?: boolean }) {
    return (
        <div className="w-1/2 md:w-1/6 flex flex-col items-center text-sm/4">
            <p className="mb-1">{title}</p>
            {value === null ? <p className="text-xl font-bold">NONE</p> : (
                <div className="flex flex-col h-[80px] space-y-1 text-xl font-bold">
                    <div className="flex justify-center items-center gap-2">
                        <p className="max-w-[100px]">{value.name}</p>
                        {isTeam && <img className="w-8" src={getTeamStyle(value.name).icon} alt={`Image for Team ${value.name}`} />}
                    </div>
                    <div className="flex justify-center items-center gap-2">
                        <p className="text-sm">{value.count}</p>
                        <p className="text-xs font-normal">({value.percent}%)</p>
                    </div>
                </div>
            )}
        </div>
    );
}
