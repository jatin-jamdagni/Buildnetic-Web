 
import { Star, Pencil, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "../types";
import { CATEGORY_COLORS, CATEGORY_TEXT, COLORS } from "../constants/theme";

interface Props {
  product: Product;
  onEdit: (p: Product) => void;
  onOpen: (p: Product) => void;
}

export function ProductCard({ product, onEdit, onOpen }: Props) {
  const catBg = CATEGORY_COLORS[product.category] ?? COLORS.bg;
  const catText = CATEGORY_TEXT[product.category] ?? COLORS.label;

  const [imgLoaded, setImgLoaded] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!product.lastUpdated) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 900);
    return () => clearTimeout(t);
  }, [product.lastUpdated, product.price, product.rating.rate, product.category]);

  return (
    <div
      onClick={() => onOpen(product)}
      className="group rounded-lg border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md cursor-pointer"
      style={{
        background: "#fff",
        borderColor: flash ? COLORS.yellow : COLORS.border,
        boxShadow: flash ? `0 0 0 2px ${COLORS.yellow}33` : undefined,
      }}
    >
      <div
        className="relative aspect-square flex items-center justify-center p-2 overflow-hidden"
        style={{ background: COLORS.bg }}
      >
        {!imgLoaded && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background: `linear-gradient(110deg, ${COLORS.bg} 30%, #e7ecf0 50%, ${COLORS.bg} 70%)`,
              backgroundSize: "200% 100%",
            }}
          />
        )}
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(true)}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          style={{ opacity: imgLoaded ? 1 : 0 }}
        />

        <div
          className="absolute top-1.5 right-1.5 flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-semibold backdrop-blur"
          style={{ background: "#ffffffd9", color: COLORS.darkYellow }}
        >
          <Star className="w-2.5 h-2.5 fill-current" />
          {product.rating.rate.toFixed(1)}
        </div>

        {product.pendingUpdate && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "#ffffffb3" }}
          >
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: COLORS.active }} />
          </div>
        )}
      </div>

      <div className="p-2 flex flex-col gap-1 flex-1">
        <span
          className="text-[8px] uppercase tracking-wide font-semibold capitalize w-fit px-1.5 py-0.5 rounded"
          style={{ background: catBg, color: catText }}
        >
          {product.category}
        </span>

        <h3
          className="text-[11px] font-semibold line-clamp-2 leading-tight min-h-[1.8rem]"
          style={{ color: COLORS.text }}
        >
          {product.title}
        </h3>

        <div className="flex items-center justify-between gap-1 mt-auto pt-0.5">
          <span className="text-xs font-bold" style={{ color: COLORS.text }}>
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product);
            }}
            disabled={product.pendingUpdate}
            className="flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded border transition hover:opacity-80 disabled:opacity-50"
            style={{ borderColor: COLORS.border, color: COLORS.label }}
          >
            <Pencil className="w-2.5 h-2.5" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
