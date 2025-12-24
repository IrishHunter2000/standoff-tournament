import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import type { Achievement, Player } from "../types/types";
import { AchievementCard } from "../components/AchievementCard";
import { filterAchievements } from "../helpers/alter_data";

export default function Achievements() {
    const { achievements, players } = useData();
    const [playerOptions, setPlayerOptions] = useState<Player[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState("all");
    const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>([]);

    useEffect(() => {
        setPlayerOptions([{ id: "all", first_name: "All", last_name: "Players" }, ...players])
        setFilteredAchievements(achievements);
    }, [achievements]);

    const changeFilter = (newSelection: string) => {
        setCurrentPlayer(newSelection)
        
        const filteredByPlayer = filterAchievements(newSelection, achievements)
            
        setFilteredAchievements(filteredByPlayer);
    }

	if (!players) return <p>Retrieving achievements now...</p>;
    if (!achievements || achievements.length === 0) return <p>No achievements found.</p>;

    return (
		<div className="flex justify-center items-center gap-8">
            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                    <div className="flex items-center uppercase font-semibold text-gray-500">
                        Filters:
                    </div>
                    {/* Tournament Filter */}
                    <div className="flex flex-col text-left">
                        <label className="text-sm text-gray-700">Players</label>
                        <select
                            className="border p-2 rounded bg-neutral-700"
                            value={currentPlayer}
                            onChange={(e) => changeFilter(e.target.value)}
                        >
                            {playerOptions.map((player) => (
                                <option key={player.id} value={player.id}>
                                    {player.first_name} {player.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Achievements List */}
                {filteredAchievements.length !== 0 ?
                    <div className="columns-5 gap-3 w-[1270px]">
                        {filteredAchievements.map((achievement) => {
                            if (achievement.players.length === 0) return null;
                            else return <AchievementCard key={achievement.name} achievement={achievement} selectedPlayer={currentPlayer} />
                        })}
                    </div>
                    : <p>No achievements found in that filter.</p>
                }
            </div>

            <div className="flex flex-col items-center p-3 gap-4 bg-black rounded-lg">
                <h2 className="text-xl">Achievements not yet earned</h2>
                <div className="gap-3">
                    {filteredAchievements.map((achievement) => {
                        if (achievement.players.length !== 0) return null;
                        else return <AchievementCard key={achievement.name} achievement={achievement} selectedPlayer={currentPlayer} />
                    })}
                </div>
            </div>
        </div>
    );
}
