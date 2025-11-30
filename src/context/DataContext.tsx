import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { Player, Team, Tournament, Game, GamePlayer, DataContextType } from "../types/types";

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [selectedTournament, setSelectedTournament] = useState("all");
    const [games, setGames] = useState<Game[]>([]);
    const [gamePlayers, setGamePlayers] = useState<GamePlayer[]>([]);
    // .eq("game.tournament_id", tournamentId);
    useEffect(() => {
        loadPlayers();
        loadTeams();
        refreshTournament();
        fetchGames();
        fetchStandings();
    }, []);

    const loadPlayers = async () => {
        const { data } = await supabase
            .from("player")
            .select("*")
            .order("first_name");
        setPlayers(data || []);
    }

    const loadTeams = async () => {
        const { data } = await supabase
            .from("team")
            .select("*")
            .order("name");
        setTeams(data || []);
    };

    const refreshTournament = async () => {
        const { data, error } = await supabase
            .from("tournament")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) return console.error(error);
        setTournaments([{ id: "all", name: "All Time" }, ...data]);
        setSelectedTournament(data[0]?.id);
        setCurrentTournament(data[0]);
    };

    const fetchGames = async () => {
        const { data, error } = await supabase
            .from("game")
            .select(
                `
                id,
                created_at,
                game_number,
                tournament: tournament_id!inner (
                    id,
                    name
                ),
                players: game_player!inner (
                    points,
                    remaining_health,
                    team: team_id!inner (
                        id,
                        name,
                        color
                    ),
                    player: player_id!inner (
                        id,
                        first_name,
                        last_name
                    )
                )
            `
            )
            .order("created_at", { ascending: false });

        if (error) console.error("Error fetching games:", error);
        setGames(data as any);
    }

    const fetchStandings = async () => {
        const { data, error } = await supabase
            .from("game_player")
            .select(`
                player_id,
                player ( first_name, last_name ),
                points,
                remaining_health,
                game ( tournament_id )
            `)
    
        if (error) console.error("Error fetching game players:", error);
        setGamePlayers(data as any);
    }

    return (
        <DataContext.Provider value={{ players, teams, games, gamePlayers, currentTournament, tournaments, selectedTournament, setSelectedTournament, refreshTournament }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error("useData must be used inside <DataProvider>");
    return ctx;
};
