

import { useProductStore } from "../store/useProductStore";
import type { SortOption } from "../types";
import { COLORS } from "../constants/theme";
import { Search, X, Undo2, Redo2 } from "lucide-react";


const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "none", label: "Default" },
    { value: "price_asc", label: "Price: Low -> High" },
    { value: "price_desc", label: "Price: High -> Low" },
    { value: "rating_desc", label: "Rating: Best First" },
    { value: "rating_asc", label: "Rating: Lowest First" },
];

//    { label: 'Price: Low -> High', value: 'price_asc', icon: 'arrow-up-outline' },
//     { label: 'Price: High -> Low', value: 'price_desc', icon: 'arrow-down-outline' },
//     { label: 'Rating: Best First', value: 'rating_desc', icon: 'star' },
//     { label: 'Rating: Lowest First', 

export function CategoryFilter() {
    const {
        searchQuery,
        selectedCategory,
        sortOption,
        categories,
        history,
        future,
        setSearchQuery,
        setSelectedCategory,
        setSortOption,
        undo,
        redo,
    } = useProductStore();

    const allCategories = ["all", ...categories];

    return (
        <div
            className="rounded-xl p-4 flex flex-col gap-4 border"
            style={{ background: "#fff", borderColor: COLORS.border }}
        >
            <div className="flex flex-col md:flex-row gap-3">

                <div
                    className="flex items-center gap-2 px-3 rounded-lg border flex-1 min-w-[200px]"
                    style={{ background: COLORS.bg, borderColor: COLORS.border }}
                >
                    <Search className="w-4 h-4" style={{ color: COLORS.icon }} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products by title…"
                        className="bg-transparent outline-none py-2.5 text-sm flex-1"
                        style={{ color: COLORS.text }}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} aria-label="Clear search">
                            <X className="w-4 h-4" style={{ color: COLORS.clear }} />
                        </button>
                    )}
                </div>


                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="rounded-lg border px-3 py-2.5 text-sm outline-none cursor-pointer"
                    style={{ background: COLORS.bg, borderColor: COLORS.border, color: COLORS.text }}
                >
                    {SORT_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                            Sort: {s.label}
                        </option>
                    ))}
                </select>


                <div className="flex gap-2">
                    <button
                        onClick={undo}
                        disabled={history.length === 0}
                        className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80"
                        style={{
                            background: COLORS.inactiveBg,
                            borderColor: COLORS.border,
                            color: COLORS.label,
                        }}
                    >
                        <Undo2 className="w-4 h-4" />
                        Undo {history.length > 0 && `(${history.length})`}
                    </button>
                    <button
                        onClick={redo}
                        disabled={future.length === 0}
                        className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80"
                        style={{
                            background: COLORS.inactiveBg,
                            borderColor: COLORS.border,
                            color: COLORS.label,
                        }}
                    >
                        <Redo2 className="w-4 h-4" />
                        Redo {future.length > 0 && `(${future.length})`}
                    </button>
                </div>
            </div>
 
            <div className="flex flex-wrap gap-2">
                {allCategories.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className="px-3.5 py-1.5 rounded-full text-xs font-medium capitalize border transition"
                            style={{
                                background: isActive ? COLORS.surface : COLORS.inactiveBg,
                                borderColor: isActive ? COLORS.active : COLORS.border,
                                color: isActive ? COLORS.active : COLORS.inactive,
                            }}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
