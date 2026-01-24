import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { Player, Team, Tournament, Game, GamePlayer, DataContextType, Achievement, Round } from "../types/types";

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [players, setPlayers] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [currentTournament, setCurrentTournament] = useState<Tournament>({} as Tournament);
    const [currentRound, setCurrentRound] = useState<Round>({} as Round);
    const [games, setGames] = useState<Game[]>([]);
    const [gamePlayers, setGamePlayers] = useState<GamePlayer[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);

    useEffect(() => {
        loadPlayers();
        loadTeams();
        loadUpdatedTables();

        // Initial load
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
            setLoadingAuth(false);
        });

        // Listen for login/logout
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
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
        loadCurrentRound();
        loadGames();
        loadGamePlayers();
        loadAchievements();
    }

    const loadTournaments = async () => {
        const { data, error } = await supabase
            .from("tournament")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) return console.error(error);
        setTournaments([{ id: "all", name: "All Time" }, ...data]);
        setCurrentTournament(data[0].ended_at === null ? data[0] : {});
    };
    
    const loadCurrentRound = async () => {
        const { data } = await supabase
            .from("round")
            .select("*")
            .is("ended_at", null)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        setCurrentRound(data);
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
                    place,
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

    const loadGamePlayers = async () => {
        const { data, error } = await supabase
            .from("game_player")
            .select(`
                player_id,
                player ( first_name, last_name ),
                place,
                points,
                remaining_health,
                game ( tournament_id ),
                team_id,
                team ( name, color )
            `)
    
        if (error) console.error("Error fetching game players:", error);
        setGamePlayers(data as any);
    }

    const loadAchievements = async () => {
        const { data, error } = await supabase
            .from("achievement")
            .select(`
                id,
                name,
                icon,
                rarity,
                description,
                players: achievement_player (
                    count,
                    player: player_id!inner (
                        id,
                        first_name,
                        last_name
                    )
                )
            `)
            .order("rarity", { ascending: true });

        if (error) console.error("Error fetching achievement players:", error);
        setAchievements(data as any);
    }

    return (
        <DataContext.Provider value={{ user, loadingAuth, players, teams, games, gamePlayers, tournaments, currentTournament, currentRound, achievements, loadUpdatedTables, loadTournaments, loadCurrentRound }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error("useData must be used inside <DataProvider>");
    return ctx;
};
