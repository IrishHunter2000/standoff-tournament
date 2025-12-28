import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import standoff_logo from "../assets/standoff_logo.png"
import { Menu, X } from "lucide-react";

export default function Header({ page, setPage }: { page: string, setPage: (page: string) => void }) {
    const [open, setOpen] = useState(false);
    const menuRef: any = useRef(null);
    const buttonRef: any = useRef(null);

	const tabs = [
		{ id: "home", label: "Home" },
		{ id: "grid", label: "Games" },
		{ id: "standings", label: "Standings" },
		{ id: "achieve", label: "Achievements" },
		{ id: "form", label: "Submit Game" },
		{ id: "admin", label: "Admin Console" }
	];

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = "" };
    }, [open]);

    useEffect(() => {
        function handleClickOutside(e: Event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside) };
    }, [open]);

    useEffect(() => {
        function onEsc(e: any) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, []);

    const handleSetPage = (page: string) => {
        setOpen(!open);
        setPage(page);
    }

	return (
        <nav className="w-full flex relative items-center px-6 py-4 bg-black">
            <img className="w-1/12 min-w-[100px] left-0" src={standoff_logo} alt="Standoff Logo" />

            {/* DESKTOP TABS */}
            <div className="h-full hidden md:flex absolute inset-0 flex justify-center items-center gap-6 text-lg font-medium">
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

            
            {/* Hamburger Button (mobile only) */}
            <button
                ref={buttonRef}
                onClick={() => setOpen(!open)}
                className="md:hidden ml-auto"
            >
                {open ? <X /> : <Menu />}
            </button>
            
            {/* Mobile Menu */}
            <AnimatePresence>
                {open && (
                    <>
                    {/* Backdrop */}
                    <motion.div
                        className="flex flex-col absolute top-full inset-0 bg-black/70 z-40 h-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onClick={() => setOpen(false)}
                    />
                    <motion.nav
                        ref={menuRef}
                        initial={{ clipPath: "inset(0 0 100% 0)" }}
                        animate={{ clipPath: "inset(0 0 0% 0)" }}
                        exit={{ clipPath: "inset(0 0 100% 0)" }}
                        className="md:hidden flex flex-col absolute top-full left-0 w-full gap-2 py-2 bg-black border-y border-zinc-700 z-50"
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleSetPage(tab.id)}
                                className={`${page === tab.id ? "text-red-500" : "text-white"}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </nav>
	)
}
