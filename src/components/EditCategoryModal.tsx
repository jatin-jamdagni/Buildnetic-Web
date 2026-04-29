

import { useState } from "react";


import { Loader2, Check, X } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import type { Product } from "../types";
import { updateProductApi } from "../services/api";
import { COLORS } from "../constants/theme";

interface Props {
  product: Product;
  onClose: () => void;
}

export function EditCategoryModal({ product, onClose }: Props) {
  const { categories, updateProductCategory, rollbackChange, setPendingUpdate, setEditingProductId, addToast } =
    useProductStore();
  const [selected, setSelected] = useState(product.category);
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    if (selected === product.category) {
      onClose();
      return;
    }
    const oldCategory = product.category;

    updateProductCategory(product.id, selected);
    setPendingUpdate(product.id, true);
    setSubmitting(true);

    try {
      await updateProductApi(product.id, { category: selected });
      addToast(`Category updated for "${product.title.slice(0, 24)}…"`, "success");
      setPendingUpdate(product.id, false);
      setEditingProductId(null);
      onClose();
    } catch (err) {
 
      rollbackChange({
        productId: product.id,
        field: "category",
        oldValue: oldCategory,
        newValue: selected,
        timestamp: Date.now(),
      });
       const { history } = useProductStore.getState();
      useProductStore.setState({
        history: history.filter(
          (h:any) => !(h.productId === product.id && h.field === "category" && h.newValue === selected)
        ),
      });
      setPendingUpdate(product.id, false);
      addToast(
        `Update failed: ${(err as Error).message}. Rolled back.`,
        "error"
      );
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ background: `#${COLORS.bgModal}` }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-xl"
        style={{ background: "#fff" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>
              Change Category
            </h3>
            <p className="text-xs mt-1 line-clamp-2" style={{ color: COLORS.inactive }}>
              {product.title}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close">
            <X className="w-5 h-5" style={{ color: COLORS.clear }} />
          </button>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          {categories.map((cat: any) => {
            const isSelected = selected === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelected(cat)}
                className="flex items-center justify-between px-4 py-3 rounded-lg border text-sm capitalize transition"
                style={{
                  background: isSelected ? COLORS.surface : COLORS.inactiveBg,
                  borderColor: isSelected ? COLORS.active : COLORS.border,
                  color: isSelected ? COLORS.active : COLORS.label,
                }}
              >
                <span className="font-medium">{cat}</span>
                {isSelected && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2.5 rounded-lg border text-sm font-medium disabled:opacity-50"
            style={{ borderColor: COLORS.border, color: COLORS.label, background: "#fff" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={submitting}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50"
            style={{ background: COLORS.active }}
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
