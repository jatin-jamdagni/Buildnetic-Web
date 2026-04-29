import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
 
import { Loader2, ShoppingBag } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import { usePeriodicUpdates } from "../hooks/usePeriodicUpdates";
import { fetchCategories, fetchProducts } from "../services/api";
import { COLORS } from "../constants/theme";
import { ProductGrid } from "../components/ProductGrid";
import { Toasts } from "../components/Toast";
import { CategoryFilter } from "../components/CategoryFilter";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Smart Product Grid" },
      { name: "description", content: "Manage products with search, filter, sort, edit, undo/redo and live updates." },
    ],
  }),
});

function Index() {
  const { isLoading, error, products, setProducts, setCategories, setLoading, setError } =
    useProductStore();

  usePeriodicUpdates();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
        if (cancelled) return;
        setProducts(prods);
        setCategories(cats);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setProducts, setCategories, setLoading, setError]);

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      <header
        className="border-b sticky top-0 z-30 backdrop-blur"
        style={{ background: "#ffffffcc", borderColor: COLORS.border }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: COLORS.surface }}
            >
              <ShoppingBag className="w-5 h-5" style={{ color: COLORS.active }} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none" style={{ color: COLORS.text }}>
                Smart Product Grid
              </h1>
              <p className="text-xs mt-1" style={{ color: COLORS.inactive }}>
                {products.length} products · live updates every 10s
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
        <CategoryFilter />

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: COLORS.active }} />
          </div>
        )}

        {error && (
          <div
            className="rounded-xl border p-4 text-sm"
            style={{ background: "#FEF2F2", borderColor: "#FCA5A5", color: "#B91C1C" }}
          >
            {error}
          </div>
        )}

        {!isLoading && !error && <ProductGrid />}
      </main>

      <Toasts />
    </div>
  );
}
