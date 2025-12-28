import { GameCard } from "../components/GameCard";
import { useData } from "../context/DataContext";
import { motion } from "framer-motion";
import { home_cards } from "../helpers/home_cards";
import HomeCard from "../components/HomeCard";

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export default function RecentGame({ setPage }: { setPage: (p: string) => void }) {
	const { games, players, tournaments, achievements } = useData();
	const numAchievements = achievements.reduce((total, item) => total + item.players.reduce((sum, player) => sum + player.count, 0), 0)

	return (
		<div className="flex flex-col justify-center items-center">
			{/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                    Standoff Tournament Analytics
                </h1>
                <p className="text-gray-400">
                    Track games, view standings, analyze player performance, and earn achievements across tournaments.
                </p>
            </div>

            {/* Stats */}
			<div className="h-[56px] flex justify-center items-center mb-8">
				{(tournaments.length > 1 && players.length !== 0 && games.length !== 0 && numAchievements !== 0) ?
					<div className="flex gap-6">
						<HomeStat label="Tournaments" value={tournaments.length - 1} />
						<HomeStat label="Players" value={players.length} />
						<HomeStat label="Games" value={games.length} />
						<HomeStat label="Achievements" value={numAchievements} />
					</div>
					: <div>Retrieving statistics...</div>
				}
			</div>
			
            {/* Card Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl"
            >
                {home_cards.map((card, index) => (
					<HomeCard key={index} card={card} setPage={setPage} />
                ))}
            </motion.div>

			<h2 className="text-2xl font-bold mt-8 mb-4 text-center">Most Recent Game</h2>
			{games.length !== 0 ? <GameCard gameMeta={games[0]} players={games[0].players} /> : <p>Retrieving most recent game...</p>}
		</div>
	);
}

function HomeStat({ label, value }: { label: string; value: number }) {
    return (
        <div className="text-center">
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-sm text-gray-400">{label}</div>
        </div>
    );
}