import { useState, useEffect } from 'react'
import './App.css'
import { supabase } from "./supabaseClient";
import Header from "./components/Header.tsx";
import Home from "./pages/Home.tsx";
import GameGrid from "./pages/GameGrid.tsx";
import GameForm from "./pages/GameForm.tsx";
import Standings from "./pages/Standings.tsx";
import AchievementsList from "./pages/AchievementsList.tsx"
import AdminControlPanel from './pages/AdminControlPanel.tsx';
import { Unauthorized } from './pages/Unauthorized.tsx';
import { AdminLogin } from './pages/AdminLogin.tsx';
import { useData } from './context/DataContext.tsx';

const titles: Record<string, string> = {
	home: "Home | Standoff",
	grid: "Games | Standoff",
	standings: "Standings | Standoff",
	achieve: "Achievements | Standoff",
	form: "Submit Game | Standoff",
	admin: "Admin | Standoff",
};

function App() {
	const { user, loadingAuth } = useData();
	const [page, setPage] = useState("home");
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		if (!user) {
			setIsAdmin(false);
			return;
		}

		supabase
			.from("user_profile")
			.select("role")
			.eq("id", user.id)
			.single()
			.then(({ data }) => {
				setIsAdmin(data?.role === "admin");
			});
	}, [user]);

	const updatePage = (event: string) => {
		document.title = titles[event] ?? "Standoff Tournament Analytics";
		setPage(event);
	}

	return (
		<div className="min-h-screen w-full flex flex-col">
			<header className="sticky top-0 z-10 border-b border-gray-700 backdrop-blur">
				<Header page={page} setPage={updatePage} />
			</header>
			<main className="flex-1 p-4">
				{page === "home" && <Home setPage={updatePage} />}
				{page === "grid" && <GameGrid />}
				{page === "standings" && <Standings />}
				{page === "achieve" && <AchievementsList />}
				{page === "form" && <GameForm />}
				{page === "admin" && (
					loadingAuth ? null :
					!user ? (
						<AdminLogin setPage={updatePage} />
					) : !isAdmin ? (
						<Unauthorized />
					) : (
						<AdminControlPanel />
					)
				)}

			</main>
		</div>
	)
}

export default App
