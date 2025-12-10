import type { GamePlayer, Game } from "../types/types";
import { formatUTCDate } from "../helpers/data_analysis";
import { getTeamStyle } from "../helpers/team_styles";

export const GameCard = ({ gameMeta, players, selectedId, isPlayers }: {
        gameMeta: Game, players: GamePlayer[], selectedId?: string, isPlayers?: boolean
    }) => {

    return (
        <div className="w-[380px] flex flex-col p-2 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-2">
                {gameMeta.tournament?.name} - Game #{gameMeta.game_number} - {formatUTCDate(gameMeta.created_at)}
            </p>

            <div className="w-full">
                {players.map((p: GamePlayer, i: number) => {
                    const teamName = p.team?.name ?? "Unknown";
                    const style = getTeamStyle(teamName);
                    const highlightName = (selectedId && selectedId === (isPlayers ? p.player.id : p.team.id))
                    
                    return (
                        <div
                            key={i}
                            className={`flex justify-around items-center text-left py-1 rounded ${highlightName && 'bg-red-500/20 border border-red-900'}`}
                        >
                            <img className="w-1/12" src={style.icon} alt={`Image for Team ${teamName}`} />
                            <p className="w-1/3 font-semibold">
                                {p.player?.first_name} {p.player?.last_name}
                            </p>
                            <p className={`w-1/6 font-bold place ${i === 0 && "first"} ${i === 1 && "second"} ${i === 2 && "third"}`}>+{p.points} pt{p.points !== 1 ? "s" : ""}</p>
                            <p className="w-1/8 text-sm text-gray-600">
                                HP: {p.remaining_health}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}