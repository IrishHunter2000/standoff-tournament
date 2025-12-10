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
    round: Round;
    players: GamePlayer[];
};

export type GamePlayer = {
    player: Player;
    points: number;
    remaining_health: number;
    team: Team;
    game?: {
        tournament_id: string;
    }
};

export type Tournament = {
    id: string;
    name: string;
    number_of_games: number;
    created_at: string;
};

export type Round = {
    id: string;
    name: string;
    created_at: string;
};

export type Standings = {
    id: string;
    first_name?: string;
    last_name?: string;
    team_name?: string;
    team_color?: string;
    points: number;
    health: number;
}

export type DataContextType = {
    players: Player[];
    teams: Team[];
    games: Game[];
    gamePlayers: GamePlayer[];
    tournaments: Tournament[];
    loadUpdatedTables: () => Promise<void>;
};

export type GamePlayerInput = {
    player_id: string | null;
    team_id: string | null;
    health: number | null;
};

export type Filter = {
    tournament: string;
    player: string;
    team: string;
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