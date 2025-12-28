import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import type { Achievement, Player } from "../types/types";
import { AchievementCard } from "../components/AchievementCard";
import { filterAchievements } from "../helpers/alter_data";
import { FilterDropdown } from "../components/FilterDropdown";

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
        setCurrentPlayer(newSelection);
        
        const filteredByPlayer = filterAchievements(newSelection, achievements)
            
        setFilteredAchievements(filteredByPlayer);
    }

	if (!players) return <p>Retrieving achievements now...</p>;
    if (!achievements || achievements.length === 0) return <p>No achievements found.</p>;

    return (
		<div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                    <div className="flex items-center uppercase font-semibold text-gray-500">
                        Filters:
                    </div>
                    {/* Player Filter */}
                    <FilterDropdown
                        filterTitle="Players"
                        filterValue={currentPlayer}
                        filterOptions={playerOptions}
                        changeFilter={changeFilter}
                    />
                </div>

                {/* Achievements List */}
                {filteredAchievements.length !== 0 ?
                    <div className="md:columns-5 md:w-[1270px]">
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
                    {achievements.map((achievement) => {
                        if (achievement.players.length !== 0) return null;
                        else return <AchievementCard key={achievement.name} achievement={achievement} selectedPlayer={currentPlayer} />
                    })}
                </div>
            </div>
        </div>
    );
}
