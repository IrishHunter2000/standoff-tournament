import type { Achievement } from "../types/types";

export const AchievementCard = ({ achievement, selectedPlayer }: {
        achievement: Achievement, selectedPlayer?: string
    }) => {

    return (
        <div
            key={achievement.name}
            className={`w-[250px] break-inside-avoid mb-2 p-2 rounded-xl shadow ${achievement.rarity === 1 && "first-border"} ${achievement.rarity === 2 && "second-border"} ${achievement.rarity === 3 && "third-border"} ${achievement.rarity === 4 && "fourth-border"}`}
        >
            <div className="flex justify-left items-center">
                <span className="w-[40px] text-2xl">
                    {achievement.icon}
                </span>
                <span className="text-left font-semibold underline">
                    {achievement.name}
                </span>
            </div>
            <div className="text-left mb-1 text-sm/4 text-gray-600">
                {achievement.description}
            </div>
            {achievement.players.sort((a, b) => b.count - a.count).map((player) => (
                <div key={player.player.id} className={`flex items-center text-left pl-5 ${selectedPlayer === player.player.id && "rounded-md bg-red-500/20 border border-red-900"}`}>
                    <span>{player.player.first_name} {player.player.last_name}</span>
                    {player.count > 1 && <span className="ml-2 text-sm text-gray-600">
                        x{player.count}
                    </span>}
                </div>
            ))}
        </div>
    );
}
