import type{ Product } from "../types/";
import { COLORS, CATEGORY_COLORS, CATEGORY_TEXT } from "../constants/theme";
import { Star, Pencil, Loader2 } from "lucide-react";

interface Props {
  products: Product[];
  onEdit: (p: Product) => void;
  onOpen: (p: Product) => void;
}

export function ProductTable({ products, onEdit, onOpen }: Props) {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ background: "#fff", borderColor: COLORS.border }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr
              className="text-left"
              style={{ background: COLORS.bg, color: COLORS.inactive }}
            >
              <th className="px-3 py-2 font-semibold uppercase tracking-wide text-[10px]">Product</th>
              <th className="px-3 py-2 font-semibold uppercase tracking-wide text-[10px]">Category</th>
              <th className="px-3 py-2 font-semibold uppercase tracking-wide text-[10px] text-right">Price</th>
              <th className="px-3 py-2 font-semibold uppercase tracking-wide text-[10px]">Rating</th>
              <th className="px-3 py-2 font-semibold uppercase tracking-wide text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const catBg = CATEGORY_COLORS[p.category] ?? COLORS.bg;
              const catText = CATEGORY_TEXT[p.category] ?? COLORS.label;
              return (
                <tr
                  key={p.id}
                  onClick={() => onOpen(p)}
                  className="border-t cursor-pointer transition hover:bg-[var(--hover)]"
                  style={
                    {
                      borderColor: COLORS.border,
                      ["--hover" as string]: COLORS.bg,
                    } as React.CSSProperties
                  }
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2.5 max-w-md">
                      <div
                        className="w-9 h-9 rounded flex items-center justify-center shrink-0 p-1"
                        style={{ background: COLORS.bg }}
                      >
                        <img
                          src={p.image}
                          alt={p.title}
                          loading="lazy"
                          decoding="async"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <span
                        className="font-medium line-clamp-1"
                        style={{ color: COLORS.text }}
                      >
                        {p.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className="text-[10px] uppercase tracking-wide font-semibold capitalize px-1.5 py-0.5 rounded"
                      style={{ background: catBg, color: catText }}
                    >
                      {p.category}
                    </span>
                  </td>
                  <td
                    className="px-3 py-2 text-right font-bold"
                    style={{ color: COLORS.text }}
                  >
                    ${p.price.toFixed(2)}
                  </td>
                  <td className="px-3 py-2">
                    <div
                      className="flex items-center gap-1"
                      style={{ color: COLORS.darkYellow }}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-semibold">{p.rating.rate.toFixed(1)}</span>
                      <span style={{ color: COLORS.inactive }}>
                        ({p.rating.count})
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(p);
                      }}
                      disabled={p.pendingUpdate}
                      className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded border transition hover:opacity-80 disabled:opacity-50"
                      style={{ borderColor: COLORS.border, color: COLORS.label }}
                    >
                      {p.pendingUpdate ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Pencil className="w-3 h-3" />
                      )}
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
