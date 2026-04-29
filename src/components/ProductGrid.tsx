import { useState } from "react";
 
import { PackageX, LayoutGrid, Rows3 } from "lucide-react";
import { useFilteredProducts } from "../hooks/useFilteredProducts";
import { useProductStore } from "../store/useProductStore";
import type { Product } from "../types";
import { COLORS } from "../constants/theme";
import { ProductCard } from "./ProductCard";
import { ProductDetailsModal } from "./ProductDetailModal";
import { EditCategoryModal } from "./EditCategoryModal";
import { ProductTable } from "./ProductTable";

type View = "grid" | "table";

export function ProductGrid() {
  const products = useFilteredProducts();
  const setEditingProductId = useProductStore((s: any) => s.setEditingProductId);
  const [editing, setEditing] = useState<Product | null>(null);
  const [viewing, setViewing] = useState<Product | null>(null);
  const [view, setView] = useState<View>("grid");

  const handleEdit = (p: Product) => {
    setViewing(null);
    setEditing(p);
    setEditingProductId(p.id);
  };

  const handleCloseEdit = () => {
    setEditing(null);
    setEditingProductId(null);
  };

  const handleOpen = (p: Product) => setViewing(p);
  const handleCloseView = () => setViewing(null);

  return (
    <>
      {/* View toggle */}
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: COLORS.inactive }}>
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
        <div
          className="flex rounded-lg border p-0.5"
          style={{ borderColor: COLORS.border, background: "#fff" }}
        >
          <ToggleBtn active={view === "grid"} onClick={() => setView("grid")}>
            <LayoutGrid className="w-3.5 h-3.5" /> Grid
          </ToggleBtn>
          <ToggleBtn active={view === "table"} onClick={() => setView("table")}>
            <Rows3 className="w-3.5 h-3.5" /> Table
          </ToggleBtn>
        </div>
      </div>

      {products.length === 0 ? (
        <div
          className="rounded-xl border py-16 text-center"
          style={{ background: "#fff", borderColor: COLORS.border }}
        >
          <PackageX className="w-10 h-10 mx-auto mb-3" style={{ color: COLORS.icon }} />
          <p className="text-sm font-medium" style={{ color: COLORS.label }}>
            No products match your filters
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2.5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onEdit={handleEdit} onOpen={handleOpen} />
          ))}
        </div>
      ) : (
        <ProductTable products={products} onEdit={handleEdit} onOpen={handleOpen} />
      )}

      {viewing && (
        <ProductDetailsModal
          product={viewing}
          onClose={handleCloseView}
          onEdit={handleEdit}
        />
      )}
      {editing && <EditCategoryModal product={editing} onClose={handleCloseEdit} />}
    </>
  );
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition"
      style={{
        background: active ? COLORS.surface : "transparent",
        color: active ? COLORS.active : COLORS.inactive,
      }}
    >
      {children}
    </button>
  );
}
