
export const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
        CHEST: "bg-red-500/15 text-red-400 border-red-500/20",
        BACK: "bg-blue-500/15 text-blue-400 border-blue-500/20",
        LEGS: "bg-violet-500/15 text-violet-400 border-violet-500/20",
        SHOULDERS: "bg-amber-500/15 text-amber-400 border-amber-500/20",
        ARMS: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
        ABS: "bg-pink-500/15 text-pink-400 border-pink-500/20",
    };
    return colors[category] || "bg-slate-500/15 text-slate-400 border-slate-500/20";
};

export const categoryColors: Record<string, { bg: string; text: string; icon: string; border: string }> = {
    CHEST: { bg: "from-red-500/15 to-red-600/5", text: "text-red-400", icon: "🫁", border: "border-red-500/20" },
    BACK: { bg: "from-blue-500/15 to-blue-600/5", text: "text-blue-400", icon: "🔙", border: "border-blue-500/20" },
    LEGS: { bg: "from-violet-500/15 to-violet-600/5", text: "text-violet-400", icon: "🦵", border: "border-violet-500/20" },
    SHOULDERS: { bg: "from-amber-500/15 to-amber-600/5", text: "text-amber-400", icon: "💪", border: "border-amber-500/20" },
    ARMS: { bg: "from-emerald-500/15 to-emerald-600/5", text: "text-emerald-400", icon: "🦾", border: "border-emerald-500/20" },
    ABS: { bg: "from-pink-500/15 to-pink-600/5", text: "text-pink-400", icon: "🧱", border: "border-pink-500/20" },
};

export const categories = ["CHEST", "BACK", "LEGS", "SHOULDERS", "ARMS", "ABS"]