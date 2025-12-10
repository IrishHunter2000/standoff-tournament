import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type { Game } from "../types/types";
import { getTeamStyle } from "../helpers/team_styles";

export const PlayerStatsModal = ({ selectedId, selectedName, isPlayers, games, computePlayerStats, onClose }: {
        selectedId: string, selectedName: string, isPlayers: boolean, games: any[], computePlayerStats: (games: Game[], selectedId: string) => any, onClose: () => void
    }) => {

    const stats = computePlayerStats(games, selectedId);

	if (!games || games.length === 0 || !stats || stats.length === 0) return <p>No games found.</p>;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div className="bg-black rounded-lg py-6 w-[920px] shadow-xl border border-red-900 space-y-6">
                <h2 className="text-xl font-bold">{selectedName} — Stats</h2>

                {/* Summary Stats */}
                <div>
                    <div className="flex justify-around items-center text-sm/4 mb-1">
                        <p className="w-1/9">Games<br/>Played</p>
                        <p className="w-1/9">Games<br/>Won</p>
                        <p className="w-1/9">Usually<br/>Placing</p>
                        <p className="w-1/9">Placing<br/>Top 2</p>
                        <p className="w-1/9">Average<br/>Points</p>
                        <p className="w-1/9">Tournaments Played In</p>
                        <p className="w-1/9">Advanced to Semifinals</p>
                        <p className="w-1/9">Advanced to Finals</p>
                        <p className="w-1/9">Tournaments<br/>Won</p>
                    </div>
                    <div className="flex justify-around text-xl font-bold">
                        <p className="w-1/9">{stats.totalGames}</p>
                        <div className="w-1/9 flex justify-center items-center space-x-2">
                            <p>{stats.placements[1]}</p>
                            <p className="text-sm font-normal">({stats.winPct}%)</p>
                        </div>
                        <div className="w-1/9 flex justify-center items-center space-x-2">
                            <p>{stats.commonPlace.placement}</p>
                            <p className="text-sm font-normal">({stats.commonPlace.percent}%)</p>
                        </div>
                        <div className="w-1/9 flex justify-center items-center space-x-2">
                            <p>{stats.placements[1] + stats.placements[2]}</p>
                            <p className="text-sm font-normal">({stats.top2Pct}%)</p>
                        </div>
                        <p className="w-1/9">{stats.avgPoints}</p>
                        <p className="w-1/9">{stats.numTournaments}</p>
                        <div className="w-1/9 flex justify-center items-center space-x-2">
                            <p>{stats.semifinals}</p>
                            <p className="text-sm font-normal">({stats.semifinalsPCT}%)</p>
                        </div>
                        <div className="w-1/9 flex justify-center items-center space-x-2">
                            <p>{stats.finals}</p>
                            <p className="text-sm font-normal">({stats.finalsPCT}%)</p>
                        </div>
                        <p className="w-1/9">{stats.finalsWins}</p>
                    </div>
                </div>

                {/* Summary Stats */}
                <div>
                    <div className="flex justify-around items-center text-sm mb-1">
                        <p className="w-1/5">Most Played As</p>
                        <p className="w-1/5">Most Top 2 As</p>
                        <p className="w-1/5">Most Bottom 2 As</p>
                        <p className="w-1/5">Nemesis Team</p>
                        <p className="w-1/5">Nemesis Player</p>
                    </div>
                    <div className="flex justify-around items-center text-lg/5 font-bold">
                        <div className="w-1/6 space-y-1">
                            <div className="flex justify-center items-center space-x-2">
                                <p>{stats.mostPlayedTeam.name}</p>
                                <img className="w-1/7" src={getTeamStyle(stats.mostPlayedTeam.name).icon} alt={`Image for Team ${stats.mostPlayedTeam.name}`} />
                            </div>
                            <div className="flex justify-center items-center space-x-2">
                                <p className="text-sm">{stats.top2ByTeam?.count}</p>
                                <p className="text-xs font-normal">({stats.top2ByTeam?.percent}%)</p>
                            </div>
                        </div>
                        <div className="w-1/6 space-y-1">
                            {stats.top2ByTeam === null ? <p className="h-full flex justify-center items-center">NONE</p> : (
                                <>
                                    <div className="flex justify-center items-center space-x-2">
                                        <p>{stats.top2ByTeam?.name}</p>
                                        <img className="w-1/7" src={getTeamStyle(stats.top2ByTeam?.name).icon} alt={`Image for Team ${stats.top2ByTeam?.name}`} />
                                    </div>
                                    <div className="flex justify-center items-center space-x-2">
                                        <p className="text-sm">{stats.top2ByTeam?.count}</p>
                                        <p className="text-xs font-normal">({stats.top2ByTeam?.percent}%)</p>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="w-1/6 space-y-1">
                            {stats.bottom2ByTeam === null ? <p className="h-full flex justify-center items-center">NONE</p> : (
                                <>
                                    <div className="flex justify-center items-center space-x-2">
                                        <p>{stats.bottom2ByTeam?.name}</p>
                                        <img className="w-1/7" src={getTeamStyle(stats.bottom2ByTeam?.name).icon} alt={`Image for Team ${stats.bottom2ByTeam?.name}`} />
                                    </div>
                                    <div className="flex justify-center items-center space-x-2">
                                        <p className="text-sm">{stats.bottom2ByTeam?.count}</p>
                                        <p className="text-xs font-normal">({stats.bottom2ByTeam?.percent}%)</p>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="w-1/6 space-y-1">
                            <div className="flex justify-center items-center space-x-2">
                                <p>{stats.lossesByTeam?.name}</p>
                                <img className="w-1/7" src={getTeamStyle(stats.lossesByTeam?.name).icon} alt={`Image for Team ${stats.lossesByTeam?.name}`} />
                            </div>
                            <div className="flex justify-center items-center space-x-2">
                                <p className="text-sm">{stats.lossesByTeam?.count}</p>
                                <p className="text-xs font-normal">({stats.lossesByTeam?.percent}%)</p>
                            </div>
                        </div>
                        <div className="w-1/6 space-y-1">
                            <div className="flex justify-center items-center">
                                <p>{stats.lossesByPlayer?.name}</p>
                            </div>
                            <div className="flex justify-center items-center space-x-2">
                                <p className="text-sm">{stats.lossesByPlayer?.count}</p>
                                <p className="text-xs font-normal">({stats.lossesByPlayer?.percent}%)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Placement Breakdown */}
                {/* <div>
                    <h3 className="font-semibold">Placements</h3>
                    <div className="grid grid-cols-4 gap-2 text-center mt-1">
                        <div>1st: {stats.placements[1]}</div>
                        <div>2nd: {stats.placements[2]}</div>
                        <div>3rd: {stats.placements[3]}</div>
                        <div>4th: {stats.placements[4]}</div>
                    </div>
                </div> */}

                {/* Progression Chart */}
                <div className="mb-4 mr-4 h-[200px]">
                    <h3 className="font-semibold text-center mb-2">Points per Game Progression</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.progression}>
                            <XAxis dataKey="game_number" />
                            <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} allowDecimals={false} />
                            <Line type="monotone" dataKey="points" stroke="#10b981" />
                        </LineChart>
                    </ResponsiveContainer>
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
}
