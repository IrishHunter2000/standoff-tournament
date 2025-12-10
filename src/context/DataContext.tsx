import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { Player, Team, Tournament, Game, GamePlayer, DataContextType } from "../types/types";

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [gamePlayers, setGamePlayers] = useState<GamePlayer[]>([]);

    useEffect(() => {
        loadPlayers();
        loadTeams();
        loadUpdatedTables();
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
    
    const loadUpdatedTables = async () => {
        loadTournaments();
        loadGames();
        loadStandings();
    }

    const loadTournaments = async () => {
        const { data, error } = await supabase
            .from("tournament")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) return console.error(error);
        setTournaments([{ id: "all", name: "All Time" }, ...data]);
    };

    const loadGames = async () => {
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
                round: round_id!inner (
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

    const loadStandings = async () => {
        const { data, error } = await supabase
            .from("game_player")
            .select(`
                player_id,
                player ( first_name, last_name ),
                points,
                remaining_health,
                game ( tournament_id ),
                team_id,
                team ( name, color )
            `)
    
        if (error) console.error("Error fetching game players:", error);
        setGamePlayers(data as any);
    }

    return (
        <DataContext.Provider value={{ players, teams, games, gamePlayers, tournaments, loadUpdatedTables }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error("useData must be used inside <DataProvider>");
    return ctx;
};
