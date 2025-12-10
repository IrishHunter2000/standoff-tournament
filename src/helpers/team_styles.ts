import black from "../assets/black.png";
import red from "../assets/red.png";
import orange from "../assets/orange.png";
import yellow from "../assets/yellow.png";
import green from "../assets/green.png";
import blue from "../assets/blue.png";
import white from "../assets/white.png";
import purple from "../assets/purple.png";

const teamStyles: Record<
    string,
    { bg: string; text: string; ring: string; icon: string }
> = {
    "Shadow Trackers": { bg: "bg-blue-50", text: "text-blue-800", ring: "ring-blue-300", icon: yellow },
    "ATLAS": { bg: "bg-purple-50", text: "text-purple-800", ring: "ring-purple-300", icon: red },
    "CROSS": { bg: "bg-red-50", text: "text-red-800", ring: "ring-red-300", icon: orange },
    "BLADE": { bg: "bg-yellow-50", text: "text-yellow-800", ring: "ring-yellow-300", icon: black },
    "Keepers of the Nexus": { bg: "bg-blue-50", text: "text-blue-800", ring: "ring-blue-300", icon: green },
    "Galactic Corps": { bg: "bg-purple-50", text: "text-purple-800", ring: "ring-purple-300", icon: blue },
    "Fusion Factor": { bg: "bg-red-50", text: "text-red-800", ring: "ring-red-300", icon: white },
    "Royal Guardians": { bg: "bg-yellow-50", text: "text-yellow-800", ring: "ring-yellow-300", icon: purple },
};


export const getTeamStyle = (name?: string) => {
    if (!name) return teamStyles.Default;
    return teamStyles[name] ?? teamStyles.Default;
}