import { motion } from "framer-motion";

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
        <nav className="max-w-5xl mx-auto px-6 py-4">
            {/* Title */}
            <div className="text-2xl font-bold mb-3 text-white">
                Tournament Dashboard
            </div>

            {/* TABS */}
            <div className="relative justify-center flex gap-6 text-lg font-medium">
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
