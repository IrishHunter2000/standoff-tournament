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
    place: number;
    games: number;
    health: number;
}

export type Achievement = {
    id: string;
    name: string;
    icon: string;
    rarity: number;
    description: string;
    players: PlayerAchievement[];
}

export type PlayerAchievement = {
    player: Player;
    count: number;
}

export type AchievementFunction = (games: Game[]) => PlayerAchievement[]

export type HomeCard = {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    isNew?: boolean;
    isAdminOnly?: boolean;
}

export type ConsistencyRule = (
    playerEntry: any,
    game: any
) => boolean; // return TRUE if player FAILS the rule

export type DataContextType = {
    user: any;
    loadingAuth: boolean;
    players: Player[];
    teams: Team[];
    games: Game[];
    gamePlayers: GamePlayer[];
    tournaments: Tournament[];
    currentTournament: Tournament;
    currentRound: Round;
    achievements: Achievement[];
    loadUpdatedTables: () => Promise<void>;
    loadTournaments: () => Promise<void>;
    loadCurrentRound: () => Promise<void>;
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