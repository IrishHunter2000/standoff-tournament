import type { Dispatch, SetStateAction } from "react";

export type Player = {
    id: string;
    first_name: string;
    last_name: string;
};

export type Team = {
    id: string;
    name: string;
    color: string;
};

export type Game = {
    id: string;
    created_at: string;
    game_number: number;
    tournament: Tournament;
    players: GamePlayer[];
};

export type GamePlayer = {
    player: Player;
    points: number;
    remaining_health: number;
    team: Team;
};

export type Tournament = {
    id: string;
    name: string;
    number_of_games: number;
    created_at: string;
};

export type Standings = {
    first_name: string;
    last_name: string;
    points: number;
    health: number;
}

export type DataContextType = {
    players: Player[];
    teams: Team[];
    games: any[];
    currentTournament: Tournament | null;
    tournaments: Tournament[];
    selectedTournament: string;
    setSelectedTournament: Dispatch<SetStateAction<string>>;
    refreshTournament: () => Promise<void>;
    standings: any[];
};

export type GamePlayerInput = {
    player_id: string | null;
    team_id: string | null;
    health: number | null;
};

export type ValidationResult = {
    valid: boolean;
    errors: string[];
};

export type ToastType = "success" | "error";

export type Toast = {
    id: number;
    message: string;
    type: ToastType;
};

export type ToastContextType = {
    showToast: (message: string, type: ToastType) => void;
};