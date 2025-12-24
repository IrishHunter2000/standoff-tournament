import { motion } from "framer-motion";
import type { HomeCard } from "../types/types";

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function HomeCard({ card, setPage }: { card: HomeCard, setPage: (page: string) => void }) {
    return (
        <motion.button
            key={card.id}
            variants={cardVariants}
            whileHover={{
                scale: 1.04,
                boxShadow:
                    "0px 0px 25px rgba(255,0,0,0.35)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPage(card.id)}
            className={`relative p-6 rounded-xl shadow-lg text-left
            bg-gradient-to-br`}
        >
            {/* Badges */}
            <div className="absolute top-2 right-2 flex gap-2">
                {card.isNew && (
                    <Badge text="NEW" color="bg-emerald-500" />
                )}
                {card.isAdminOnly && (
                    <Badge
                        text="ADMIN"
                        color="bg-red-600"
                    />
                )}
            </div>

            <div className="flex justify-left items-center gap-4 mb-2">
                <span className="w-[40px] text-4xl">
                    {card.icon}
                </span>
                <span className="text-xl text-left font-semibold">
                    {card.title}
                </span>
            </div>
            <p className="text-sm text-white/80">
                {card.description}
            </p>
        </motion.button>
    )
}

function Badge({
    text,
    color,
}: {
    text: string;
    color: string;
}) {
    return (
        <span
            className={`text-xs px-2 py-0.5 rounded-full text-white font-semibold ${color}`}
        >
            {text}
        </span>
    );
}