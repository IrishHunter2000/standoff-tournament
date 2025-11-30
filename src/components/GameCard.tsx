import black from "../assets/black.png";
import red from "../assets/red.png";
import orange from "../assets/orange.png";
import yellow from "../assets/yellow.png";
import green from "../assets/green.png";
import blue from "../assets/blue.png";
import white from "../assets/white.png";
import purple from "../assets/purple.png";
import type { GamePlayer, Game } from "../types/types";

export const GameCard = ({ gameMeta, players, name }: {
        gameMeta: Game, players: GamePlayer[], name?: string
    }) => {

    // Map team name to color + icon. Edit or replace icons with SVGs later if desired.
	const teamStyles: Record<
		string,
		{ bg: string; text: string; ring: string; icon: string }
	> = {
		"Shadow Trackers": { bg: "bg-blue-50", text: "text-blue-800", ring: "ring-blue-300", icon: yellow },
		"ATLAS": { bg: "bg-purple-50", text: "text-purple-800", ring: "ring-purple-300", icon: red },
		"CROSS": { bg: "bg-red-50", text: "text-red-800", ring: "ring-red-300", icon: orange },
		"BLADE": { bg: "bg-yellow-50", text: "text-yellow-800", ring: "ring-yellow-300", icon: black },
		"Keepers of the Nexus": { bg: "bg-blue-50", text: "text-blue-800", ring: "ring-blue-300", icon: green },
		"Galactic Corps": { bg: "bg-purple-50", text: "text-purple-800", ring: "ring-purple-300", icon: blue },
		"Fusion Factor": { bg: "bg-red-50", text: "text-red-800", ring: "ring-red-300", icon: white },
		"Royal Guardians": { bg: "bg-yellow-50", text: "text-yellow-800", ring: "ring-yellow-300", icon: purple },
	};

    function getTeamStyle(name?: string) {
		if (!name) return teamStyles.Default;
		return teamStyles[name] ?? teamStyles.Default;
	}

    function formatUTCDate(dateString: string) {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            timeZone: "UTC", // stays in UTC
        }).format(new Date(dateString));
    }

    return (
        <div className="w-[380px] flex flex-col p-2 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-2">
                {gameMeta.tournament?.name} - Game #{gameMeta.game_number} - {formatUTCDate(gameMeta.created_at)}
            </p>

            <div className="w-full space-y-3">
                {players.map((p: GamePlayer, i: number) => {
                    const teamName = p.team?.name ?? "Unknown";
                    const style = getTeamStyle(teamName);
                    const highlightName = (name && name === p.player?.first_name + " " + p.player?.last_name)
                    
                    return (
                        <div
                            key={i}
                            className={`flex justify-around items-center text-left rounded ${highlightName && 'bg-red-500/20'}`}
                        >
                            <img className="w-1/12" src={style.icon} alt="Description of my image" />
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