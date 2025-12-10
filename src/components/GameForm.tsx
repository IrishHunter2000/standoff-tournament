import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import { validateForm } from "../context/validation";
import type { GamePlayerInput, Tournament } from "../types/types";

const createEmptyEntries = () => ([
  { player_id: null, team_id: null, health: null },
  { player_id: null, team_id: null, health: null },
  { player_id: null, team_id: null, health: null },
  { player_id: null, team_id: null, health: null },
]);

export default function GameForm() {
    const { players, teams, tournaments, loadUpdatedTables } = useData();
    const { showToast } = useToast();

    const [formData, setFormData] = useState<GamePlayerInput[]>([
        { player_id: null, team_id: null, health: null },
        { player_id: null, team_id: null, health: null },
        { player_id: null, team_id: null, health: null },
        { player_id: null, team_id: null, health: null },
    ]);
    const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    useEffect(() => {
        if (tournaments.length === 0) return;
        setCurrentTournament(tournaments[1])
    }, [tournaments]);

    const updateField = (
        index: number,
        field: keyof GamePlayerInput,
        value: string | number
    ) => {
        if (value == null) return;
        const copy = [...formData];
        copy[index][field] = value as any;
        setFormData(copy);
    };

    const handleSubmit = async () => {
        if (!currentTournament) return showToast("No tournament found.", "error");
        const { valid, errors } = validateForm(formData);

        if (!valid) {
            setErrorMessages(errors); // state holding validation errors
            return; // stop submission
        }
        setErrorMessages([]);

        // determine new game number
        const newGameNumber = currentTournament.number_of_games + 1;

        // 1. Create the game
        const { data: gameData, error: gameError } = await supabase
            .from("game")
            .insert([
                {
                tournament_id: currentTournament.id,
                game_number: newGameNumber,
                },
            ])
            .select()
            .single();

        if (gameError) {
            console.error(gameError);
            showToast("Error creating game.", "error");
            return;
        }

        // 2. Insert game_players rows
        const rows = formData.map((player, index) => ({
            game_id: gameData.id,
            player_id: player.player_id,
            team_id: player.team_id,
            place: index + 1,
            remaining_health: player.health,
            points: 4 - (index)
        }));

        const { error: gpError } = await supabase.from("game_player").insert(rows);

        if (gpError) {
            console.error(gpError);
            showToast("Error creating game players.", "error");
            return;
        }

        // 3. Update tournament number_of_games
        const { error: tError } = await supabase
            .from("tournament")
            .update({ number_of_games: newGameNumber })
            .eq("id", currentTournament.id)
            .select()
            .single();

        if (tError) {
            console.error(tError);
            showToast("Error updating tournament.", "error");
            return;
        }

        showToast("Game submitted successfully!", "success");
        resetForm();
        loadUpdatedTables();
    };
    
    const resetForm = () => {
        setFormData(createEmptyEntries());
        setErrorMessages([]); // if you are storing validation errors
    };

    return (
        <div className="mx-auto max-w-3xl p-6 bg-neutral-900 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">
                Enter New Game Results
            </h2>

            {errorMessages.length > 0 && (
                <div className="flex justify-between bg-red-900 text-red-200 p-2 rounded-lg mb-4">
                    <ul className="flex-2 list-disc ml-6 space-y-1">
                        {errorMessages.map((err, i) => (
                            <li key={i}>{err}</li>
                        ))}
                    </ul>
                    <button
                        onClick={() => setErrorMessages([])}
                        className="w-1/10 h-1/10 float-right p-3"
                    >
                        Clear
                    </button>
                </div>
            )}
            {formData.map((entry, i) => {
                const selectedPlayerIds = formData.map((p) => p.player_id)
                const selectedTeamIds = formData.map((p) => p.team_id)

                return (
                    <div key={i} className="h-15 flex justify-center gap-6 bg-neutral-800 p-2 mb-2 rounded-xl border border-neutral-700">
                        <h3 className={
                            `w-1/15 place text-md font-semibold ${i === 0 && "first"} ${i === 1 && "second"} ${i === 2 && "third"}`
                        }>
                            {i+1}{i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"} Place
                        </h3>

                        {/* PLAYER SELECT */}
                        <select
                            className="w-1/4 p-2 rounded bg-neutral-700 text-white"
                            value={entry.player_id ?? ""}
                            onChange={(e) => updateField(i, "player_id", String(e.target.value))}
                        >
                            <option value="">Select player</option>
                            {players.map((player) => {
                                const isSelectedElsewhere =
                                    selectedPlayerIds.includes(player.id) &&
                                    formData[i].player_id !== player.id;

                                return (
                                    <option
                                        key={player.id}
                                        value={player.id}
                                        disabled={isSelectedElsewhere}
                                        className={isSelectedElsewhere ? "text-gray-500" : ""}
                                    >
                                        {player.first_name} {player.last_name}
                                    </option>
                                );
                            })}
                        </select>

                        {/* TEAM SELECT */}
                        <select
                            className="w-1/3 p-2 rounded bg-neutral-700 text-white"
                            value={entry.team_id ?? ""}
                            onChange={(e) => updateField(i, "team_id", String(e.target.value))}
                        >
                            <option value="">Select team</option>
                            {teams.map((team) => {
                                const isSelectedElsewhere =
                                    selectedTeamIds.includes(team.id) &&
                                    formData[i].team_id !== team.id;

                                return (
                                    <option
                                        key={team.id}
                                        value={team.id}
                                        disabled={isSelectedElsewhere}
                                        className={isSelectedElsewhere ? "text-gray-500" : ""}
                                    >
                                        {team.name} ({team.color})
                                    </option>
                                );
                            })}
                        </select>

                        {/* HEALTH */}
                        <input
                            type="number"
                            className="w-1/5 p-2 rounded bg-neutral-700 text-white"
                            placeholder="Health (0–20)"
                            min={0}
                            max={20}
                            value={entry.health ?? ""}
                            onChange={(e) => updateField(i, "health", Number(e.target.value))}
                        />
                    </div>
                )
            })}

            <button
                onClick={resetForm}
                className="w-1/5 mt-2 mr-4 p-3 reset-form-button"
            >
                Reset Form
            </button>
            <button
                onClick={handleSubmit}
                className="w-1/5 mt-2 p-3"
            >
                Submit Game
            </button>
        </div>
    );
}
