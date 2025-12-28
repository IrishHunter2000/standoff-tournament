import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useToast } from "../context/ToastContext";
import { useData } from "../context/DataContext";
import type { Achievement, Round } from "../types/types";
import { calculateAchievements } from "../helpers/calculate_achievements";
import { filterGames } from "../helpers/alter_data";
import { AchievementCard } from "../components/AchievementCard";
import { motion } from "framer-motion";

export default function AdminControlPanel() {
    const { currentTournament, tournaments, games, achievements, loadTournaments, loadCurrentRound } = useData();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);
    const [currentRound, setCurrentRound] = useState<Round>({} as Round);
    const [newTournamentName, setNewTournamentName] = useState("");
    const [newRoundName, setNewRoundName] = useState("");
    const [calculatedAchievements, setCalculatedAchievements] = useState<Achievement[]>([]);
	const [subPage, setSubPage] = useState("controls");
	const tabs = [
		{ id: "controls", label: "Controls" },
		{ id: "achievements", label: "Achievements" },
		// { id: "statistics", label: "Statistics" }
	];

    
    useEffect(() => {
        if (games.length === 0 || achievements.length === 0) return;
        handleCalculateAchievements();
    }, [games, achievements, tournaments]);

    // ---------------------------
    // TOURNAMENT ACTIONS
    // ---------------------------

    const startNewTournament = async () => {
        if (!newTournamentName.trim()) return;

        setLoading(true);

        const { error } = await supabase.from("tournament").insert({
            name: newTournamentName,
            number_of_games: 0,
        });

        setLoading(false);

        if (error) {
            showToast("Failed to start tournament", "error");
            return;
        }

        showToast("Tournament started", "success");
        setNewTournamentName("");
        loadTournaments();
    };

    const endTournament = async () => {
        if (!currentTournament) return;

        setLoading(true);

        const { error } = await supabase
            .from("tournament")
            .update({ ended_at: new Date().toISOString() })
            .eq("id", currentTournament.id);

        setLoading(false);

        if (error) {
            showToast("Failed to end tournament", "error");
            return;
        }

        showToast("Tournament ended", "success");
        loadTournaments();
    };

    // ---------------------------
    // ROUND ACTIONS
    // ---------------------------

    const startNewRound = async () => {
        if (!currentTournament) return;

        setLoading(true);

        const { error } = await supabase.from("round").insert({
            name: newRoundName,
            tournament_id: currentTournament.id,
        });

        setLoading(false);

        if (error) {
            showToast("Failed to start round", "error");
            return;
        }

        showToast("Round started", "success");
        setNewRoundName("");
        loadCurrentRound();
    };

    const endCurrentRound = async () => {
        if (!currentRound) return;

        setLoading(true);

        const { error } = await supabase
            .from("round")
            .update({ ended_at: new Date().toISOString() })
            .eq("id", currentRound.id);

        setLoading(false);

        if (error) {
            showToast("Failed to end round", "error");
            return;
        }

        showToast("Round ended", "success");
        setCurrentRound({} as Round);
    };

    const handleCalculateAchievements = () => {
        setLoading(true);
        const mostRecentTournament = Object.entries(currentTournament).length !== 0 ? currentTournament : tournaments[1];
        const filteredByTournament = filterGames("tournament", mostRecentTournament.id, games);
        const newAchievements = calculateAchievements(filteredByTournament, achievements);
        const newAchievementsAllTime = calculateAchievements(games, achievements, "all time");
        const newCalculatedAchievements = [...newAchievements, ...newAchievementsAllTime]
        setCalculatedAchievements(newCalculatedAchievements);
        setLoading(false);
    }

    const handleSubmitAchievements = async () => {
        if (!calculatedAchievements.length) {
            showToast("No achievements to submit.", "error");
            return;
        }

        calculatedAchievements.forEach((achievement) => {
            achievement.players.forEach(async (player) => {
                const { data: existing } = await supabase
                    .from("achievement_player")
                    .select("count")
                    .eq("achievement_id", achievement.id)
                    .eq("player_id", player.player.id)
                    .maybeSingle();

                if (existing) {
                    await supabase
                        .from("achievement_player")
                        .update({ count: existing.count + player.count })
                        .eq("achievement_id", achievement.id)
                        .eq("player_id", player.player.id);
                } else {
                    await supabase
                        .from("achievement_player")
                        .insert({
                            achievement_id: achievement.id,
                            player_id: player.player.id,
                            count: player.count,
                        });
                }
            });
        });
        
        showToast("Achievements submitted successfully!", "success");
        setCalculatedAchievements([])
    }

    const handleSubPage = (tabId: string) => {
        setSubPage(tabId);
    }

    return (
        <div className="flex flex-col justify-center items-center">
		    <div className="flex gap-4 mb-4">
                {/* TABS */}
                <div className="flex justify-center items-center gap-4 mr-4 text-lg font-medium">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleSubPage(tab.id)}
                            className={`px-1 pb-2 relative transition-colors
                                ${subPage === tab.id ? "text-red-500" : "text-gray-400 hover:text-gray-200"}
                            `}
                        >
                            {tab.label}

                            {/* Animated Underline */}
                            {subPage === tab.id && (
                                <motion.div
                                    layoutId="sub_underline"
                                    className="absolute left-0 right-0 -bottom-[2px] h-[3px] bg-red-500 rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* CURRENT STATE */}
            <div className="flex flex-cols space-x-6">
                {subPage === "controls" &&
                    <div className="space-y-6">
                        <div className="rounded-xl border p-4 bg-neutral-800">
                            <p>
                                <strong>Current Tournament:</strong>{" "}
                                {currentTournament?.name ?? "None"}
                            </p>
                            <p>
                                <strong>Current Round:</strong>{" "}
                                {currentRound?.name ?? "None"}
                            </p>
                        </div>

                        {/* START TOURNAMENT */}
                        <div className="rounded-xl border p-4 space-y-3">
                            <h2 className="font-semibold">Tournament Controls</h2>

                            <div className="flex justify-around items-center">
                                <input
                                    disabled={loading || Object.entries(currentTournament).length !== 0}
                                    className="md:w-1/3 p-2 rounded bg-neutral-700"
                                    placeholder="Tournament name"
                                    value={newTournamentName}
                                    onChange={(e) => setNewTournamentName(e.target.value)}
                                />
                                <button
                                    disabled={loading || !newTournamentName}
                                    onClick={startNewTournament}
                                    className="rounded-lg bg-green-600 py-2 font-semibold disabled:opacity-50"
                                >
                                    <span className="md:hidden">Start</span>
                                    <span className="hidden md:inline">Start Tournament</span>
                                </button>
                                <button
                                    disabled={loading || Object.entries(currentTournament).length === 0}
                                    onClick={endTournament}
                                    className="rounded-lg bg-red-800! py-2 font-semibold disabled:opacity-50"
                                >
                                    <span className="md:hidden">End</span>
                                    <span className="hidden md:inline">End Tournament</span>
                                </button>
                            </div>
                        </div>

                        {/* ROUND CONTROLS */}
                        <div className="rounded-xl border p-4 space-y-3">
                            <h2 className="font-semibold">Round Controls</h2>

                            <div className="flex justify-around items-center">
                                <input
                                    disabled={loading || Object.entries(currentRound).length !== 0 || Object.entries(currentTournament).length === 0}
                                    className="md:w-1/3 p-2 rounded bg-neutral-700"
                                    placeholder="Round name"
                                    value={newRoundName}
                                    onChange={(e) => setNewRoundName(e.target.value)}
                                />
                                <button
                                    disabled={loading || !newRoundName}
                                    onClick={startNewRound}
                                    className="rounded-lg bg-blue-600 py-2 font-semibold disabled:opacity-50"
                                >
                                    <span className="md:hidden">Start</span>
                                    <span className="hidden md:inline">Start New Round</span>
                                </button>
                                <button
                                    disabled={loading || Object.entries(currentRound).length === 0}
                                    onClick={endCurrentRound}
                                    className="rounded-lg bg-red-800! py-2 font-semibold disabled:opacity-50"
                                >
                                    <span className="md:hidden">End</span>
                                    <span className="hidden md:inline">End Current Round</span>
                                </button>
                            </div>
                        </div>
                    </div>
                }
                {subPage === "achievements" &&
                    <>
                        {calculatedAchievements.length !== 0 && Object.entries(currentTournament).length !== 0 ?
                            <div>
                                {/* Achievements List */}
                                <div className="md:columns-5 md:w-[1270px]">
                                    {calculatedAchievements.map((achievement) => (
                                        <AchievementCard key={achievement.name} achievement={achievement} />
                                    ))}
                                </div>
                                <button
                                    onClick={handleSubmitAchievements}
                                    className="rounded-lg bg-blue-600 py-2 mt-4 font-semibold disabled:opacity-50"
                                >
                                    Submit Calculated Achievements for {currentTournament.name || tournaments[1].name}
                                </button>
                            </div>
                        : <p>No achievements found.</p>}
                    </>
                }
            </div>
        </div>
    );
}
