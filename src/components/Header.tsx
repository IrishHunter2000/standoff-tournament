import { motion } from "framer-motion";
import standoff_logo from "../assets/standoff_logo.png"

export default function Header({ page, setPage }: {
        page: string, setPage: React.Dispatch<React.SetStateAction<string>>
    }) {
	const tabs = [
		{ id: "home", label: "Home" },
		{ id: "grid", label: "Games" },
		{ id: "standings", label: "Standings" },
		{ id: "form", label: "Submit a Game" }
	];

	return (
        <nav className="w-full flex relative items-center px-6 py-4 bg-black">
            <img className="w-1/12 left-0" src={standoff_logo} alt="Standoff Logo" />

            {/* TABS */}
            <div className="h-full absolute inset-0 flex justify-center items-center gap-6 text-lg font-medium">
                {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setPage(tab.id)}
                    className={`px-1 pb-2 relative transition-colors
                        ${page === tab.id ? "text-red-500" : "text-gray-400 hover:text-gray-200"}
                    `}
                >
                    {tab.label}

                    {/* Animated Underline */}
                    {page === tab.id && (
                        <motion.div
                            layoutId="underline"
                            className="absolute left-0 right-0 -bottom-[2px] h-[3px] bg-red-500 rounded-full"
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                    )}
                </button>
                ))}
            </div>
        </nav>
	)
}
