import { GameCard } from "./GameCard";
import { useData } from "../context/DataContext";

export default function RecentGame() {
	const { games } = useData();

	if (!games) return <p>No recent game found.</p>;
	console.log(games)

	return (
		<div className="flex flex-col justify-center items-center">
			<h2 className="text-2xl font-bold mb-4 text-center">Most Recent Game</h2>
			<GameCard gameMeta={games[0]} players={games[0].players} />
		</div>
	);
}
