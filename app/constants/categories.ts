
export const categoryColors: Record<string, string> = {
    CHEST: "from-red-500/20 to-red-600/10 border-red-500/20",
    BACK: "from-blue-500/20 to-blue-600/10 border-blue-500/20",
    LEGS: "from-violet-500/20 to-violet-600/10 border-violet-500/20",
    SHOULDERS: "from-amber-500/20 to-amber-600/10 border-amber-500/20",
    ARMS: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/20",
    ABS: "from-pink-500/20 to-pink-600/10 border-pink-500/20",
};


export const getCategoryColor = (category: string) => {
    return categoryColors[category] || "bg-slate-500/15 text-slate-400 border-slate-500/20";
};


export const categoryColorsAndIcons: Record<string, { bg: string; text: string; icon: string; border: string }> = {
    CHEST: { bg: "from-red-500/15 to-red-600/5", text: "text-red-400", icon: "🫁", border: "border-red-500/20" },
    BACK: { bg: "from-blue-500/15 to-blue-600/5", text: "text-blue-400", icon: "🔙", border: "border-blue-500/20" },
    LEGS: { bg: "from-violet-500/15 to-violet-600/5", text: "text-violet-400", icon: "🦵", border: "border-violet-500/20" },
    SHOULDERS: { bg: "from-amber-500/15 to-amber-600/5", text: "text-amber-400", icon: "💪", border: "border-amber-500/20" },
    ARMS: { bg: "from-emerald-500/15 to-emerald-600/5", text: "text-emerald-400", icon: "🦾", border: "border-emerald-500/20" },
    ABS: { bg: "from-pink-500/15 to-pink-600/5", text: "text-pink-400", icon: "🧱", border: "border-pink-500/20" },
};

export const categoryIcons: Record<string, string> = {
    CHEST: "🫁",
    BACK: "🔙",
    LEGS: "🦵",
    SHOULDERS: "💪",
    ARMS: "🦾",
    ABS: "🧱",
};


export const categoryTextColors: Record<string, string> = {
    CHEST: "text-red-400",
    BACK: "text-blue-400",
    LEGS: "text-violet-400",
    SHOULDERS: "text-amber-400",
    ARMS: "text-emerald-400",
    ABS: "text-pink-400",
};

export const categories = ["CHEST", "BACK", "LEGS", "SHOULDERS", "ARMS", "ABS"]