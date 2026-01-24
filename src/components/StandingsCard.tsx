import type { Standings } from "../types/types";

export const StandingsCard = ({ standing, index, isPlayers, orderByMetric, openModal }: {
        standing: Standings, index: number, isPlayers: boolean, orderByMetric: string, openModal: (id: string, type: string, value: string) => void
    }) => {

    const medalIcons = ["🥇", "🥈", "🥉"];
    const medalBorders = ["first-border", "second-border", "third-border"];

    const medal = medalIcons[index] || null;
    const standingName = isPlayers ? standing.first_name + " " + standing.last_name : standing.team_name + " " + "(" + standing.team_color + ")"
    const cardBorder = medalBorders[index] || "";
    const cardMaxWidth = isPlayers ? "max-w-[390px]" : "max-w-[440px]"
    const nameMaxWidth = isPlayers ? "" : "md:max-w-[220px]"
    
    return (
        <div
            key={standing.id}
            className={`flex w-full ${cardMaxWidth} justify-between items-center p-2 rounded-xl shadow ${cardBorder}`}
        >
            {medal && <span className="w-[40px] text-2xl">
                {medal}
            </span>}
            {!medal && <span className="w-[40px] font-medium">
                {index + 1}
            </span>}
            <span className={`w-full max-w-[170px] ${nameMaxWidth} ml-[10px] text-left font-semibold`}>
                {standingName}
            </span>
            <span className="w-[80px] font-bold">
                {orderByMetric === "points" ? `${standing.points} pts` : `${(standing.place / standing.games).toFixed(2)}`}
            </span>
            <p
                className="w-1/8 cursor-pointer text-xs text-gray-600"
                onClick={() => openModal(standing.id, "games", standingName)}
            >
                View Games
            </p>
            <p
                className="w-1/8 cursor-pointer text-xs text-gray-600"
                onClick={() => openModal(standing.id, "stats", standingName)}
            >
                View Stats
            </p>
        </div>
    );
}