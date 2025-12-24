import type { HomeCard } from "../types/types";

export const home_cards: HomeCard[] = [
	{
		id: "grid",
		title: "Game History",
		description: "Browse every game for placements and outcomes.",
		icon: "📜",
		color: "from-blue-500 to-blue-700",
        isNew: true,
	},
	{
		id: "standings",
		title: "Standings",
		description: "See player and team rankings and view detailed stats.",
		icon: "🏆",
		color: "from-yellow-500 to-yellow-700",
        isNew: true,
	},
	{
		id: "achieve",
		title: "Achievements",
		description: "Discover records, feats, and special accomplishments.",
		icon: "🏅",
		color: "from-purple-500 to-purple-700",
        isNew: true,
	},
	{
		id: "form",
		title: "Submit Game",
		description: "Enter results for a new game.",
		icon: "🗳️",
		color: "from-green-500 to-green-700",
	},
	{
		id: "admin",
		title: "Admin Console",
		description: "Manage tournaments, rounds, and system state.",
		icon: "🛠️",
		color: "from-red-500 to-red-700",
        isAdminOnly: true,
	},
];