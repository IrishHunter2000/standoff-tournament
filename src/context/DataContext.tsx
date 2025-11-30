import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { Player, Team, Tournament, Game, GamePlayer, Standings, DataContextType } from "../types/types";

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [selectedTournament, setSelectedTournament] = useState("all");
    const [games, setGames] = useState<Game[]>([]);
    const [gamePlayers, setGamePlayers] = useState<GamePlayer[]>([]);
    const [standings, setStandings] = useState<Standings[]>([]);
    // .eq("game.tournament_id", tournamentId);
    useEffect(() => {
        loadPlayers();
        loadTeams();
        refreshTournament();
        fetchGames();
        fetchStandings();
    }, []);

    const loadPlayers = async () => {
        const { data: playerData } = await supabase
            .from("player")
            .select("*")
            .order("first_name");
        setPlayers(playerData || []);
    }

    const loadTeams = async () => {
        const { data: teamData } = await supabase
            .from("team")
            .select("*")
            .order("name");
        setTeams(teamData || []);
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

        if (error) {
            console.error("Error fetching games:", error);
            setGames([]);
        }
        setGames(data as any);
    }

    const fetchStandings = async () => {
        const { data } = await supabase
            .from("game_player")
            .select(`
                player_id,
                player ( first_name, last_name ),
                points,
                remaining_health,
                game ( tournament_id )
            `)
    
        setGamePlayers(data as any);
        const totals = totalStandings(data);
        const sorted = sortStandings(totals);
        setStandings(sorted);
    }

    const totalStandings = (data: any) => {
        const totals = new Map();
        data?.forEach((row: any) => {
            const id = row.player_id;
            const first_name = row.player.first_name;
            const last_name = row.player.last_name;

            if (!totals.has(id)) totals.set(id, { first_name, last_name, points: 0, health: 0 });
            totals.get(id).health += row.remaining_health;
            totals.get(id).points += row.points;
        });
        return totals;
    }

    const sortStandings = (totals: any) => {
        const sorted = Array.from(totals, ([id, info]) => ({
            id,
            ...info,
        })).sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points; // primary sort
            }
            return b.health - a.health; // secondary sort
        });
        return sorted;
    };

    return (
        <DataContext.Provider value={{ players, teams, games, currentTournament, tournaments, selectedTournament, setSelectedTournament, refreshTournament, standings }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error("useData must be used inside <DataProvider>");
    return ctx;
};
