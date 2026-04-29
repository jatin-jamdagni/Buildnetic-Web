import type { Product } from "../types";
import { COLORS, CATEGORY_COLORS, CATEGORY_TEXT } from "../constants/theme";
import { Star, X, Pencil } from "lucide-react";

interface Props {
    product: Product;
    onClose: () => void;
    onEdit: (p: Product) => void;
}

export function ProductDetailsModal({ product, onClose, onEdit }: Props) {
    const catBg = CATEGORY_COLORS[product.category] ?? COLORS.bg;
    const catText = CATEGORY_TEXT[product.category] ?? COLORS.label;

    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
            style={{ background: `#${COLORS.bgModal}` }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                style={{ background: "#fff" }}
                onClick={(e) => e.stopPropagation()}
            >

                <div
                    className="md:w-2/5 flex items-center justify-center p-6 shrink-0"
                    style={{ background: COLORS.bg }}
                >
                    <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-[280px] md:max-h-full max-w-full object-contain"
                    />
                </div>


                <div className="flex-1 p-5 flex flex-col gap-3 overflow-y-auto">
                    <div className="flex items-start justify-between gap-2">
                        <span
                            className="text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded-full capitalize"
                            style={{ background: catBg, color: catText }}
                        >
                            {product.category}
                        </span>
                        <button onClick={onClose} aria-label="Close">
                            <X className="w-5 h-5" style={{ color: COLORS.clear }} />
                        </button>
                    </div>

                    <h2 className="text-base font-bold leading-snug" style={{ color: COLORS.text }}>
                        {product.title}
                    </h2>

                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold" style={{ color: COLORS.text }}>
                            ${product.price.toFixed(2)}
                        </span>
                        <div
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold"
                            style={{ background: COLORS.surface, color: COLORS.darkYellow }}
                        >
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {product.rating.rate.toFixed(1)}
                            <span className="font-normal" style={{ color: COLORS.inactive }}>
                                ({product.rating.count})
                            </span>
                        </div>
                    </div>

                    <div className="mt-1">
                        <h3
                            className="text-[11px] uppercase font-semibold tracking-wide mb-1"
                            style={{ color: COLORS.inactive }}
                        >
                            Description
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: COLORS.label }}>
                            {product.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <DetailItem label="Product ID" value={`#${product.id}`} />
                        <DetailItem
                            label="Last Updated"
                            value={
                                product.lastUpdated
                                    ? new Date(product.lastUpdated).toLocaleTimeString()
                                    : "—"
                            }
                        />
                    </div>

                    <div className="flex gap-2 justify-end mt-auto pt-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border text-sm font-medium"
                            style={{ borderColor: COLORS.border, color: COLORS.label, background: "#fff" }}
                        >
                            Close
                        </button>
                        <button
                            onClick={() => onEdit(product)}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2"
                            style={{ background: COLORS.active }}
                        >
                            <Pencil className="w-4 h-4" />
                            Change Category
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <div
            className="rounded-lg border px-3 py-2"
            style={{ borderColor: COLORS.border, background: COLORS.bg }}
        >
            <p
                className="text-[10px] uppercase font-semibold tracking-wide"
                style={{ color: COLORS.inactive }}
            >
                {label}
            </p>
            <p className="text-xs font-medium mt-0.5" style={{ color: COLORS.text }}>
                {value}
            </p>
        </div>
    );
}
