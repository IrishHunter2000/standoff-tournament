import { useState } from 'react'
import './App.css'
import Header from "./components/Header.tsx";
import Home from "./components/Home.tsx";
import GameGrid from "./components/GameGrid.tsx";
import GameForm from "./components/GameForm.tsx";
import Standings from "./components/Standings.tsx";

function App() {
	const [page, setPage] = useState("standings");

	return (
		<div className="min-h-screen w-full flex flex-col">
			<header className="sticky top-0 z-10 border-b border-gray-700 backdrop-blur">
				<Header page={page} setPage={setPage} />
			</header>
			<main className="flex-1 p-4">
				{page === "home" && <Home />}
				{page === "grid" && <GameGrid />}
				{page === "form" && <GameForm />}
				{page === "standings" && <Standings />}
			</main>
		</div>
	)
}

export default App
