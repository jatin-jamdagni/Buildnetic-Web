
import { create } from 'zustand';
import type { Change, Product, SortOption, ToastItem, ToastType } from '../types';

interface ProductStore {
    products: Product[];
    categories: string[];
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    selectedCategory: string;
    sortOption: SortOption;
    history: Change[];
    future: Change[];
    toasts: ToastItem[];
    editingProductId: number | null;
    setProducts: (products: Product[]) => void;
    setCategories: (categories: string[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    setSearchQuery: (query: string) => void;
    setSelectedCategory: (category: string) => void;
    setSortOption: (sort: SortOption) => void;
    updateProductCategory: (productId: number, newCategory: string) => void;

    updateProductData: (productId: number, updates: Partial<Product>) => void;

    setPendingUpdate: (productId: number, pending: boolean) => void;
    rollbackChange: (change: Change) => void;

    undo: () => void;
    redo: () => void;

    addToast: (message: string, type: ToastType) => void;
    removeToast: (id: string) => void;

    setEditingProductId: (id: number | null) => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    categories: [],
    isLoading: false,
    error: null,

    searchQuery: '',
    selectedCategory: 'all',
    sortOption: 'none',

    history: [],
    future: [],
    toasts: [],
    editingProductId: null,

    setProducts: (products) => set({ products }),
    setCategories: (categories) => set({ categories }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
    setSortOption: (sortOption) => set({ sortOption }),

    updateProductCategory: (productId, newCategory) => {
        const { products, history } = get();
        const product = products.find((p) => p.id === productId);
        if (!product) return;

        const change: Change = {
            productId,
            field: 'category',
            oldValue: product.category,
            newValue: newCategory,
            timestamp: Date.now(),
        };

        set({
            products: products.map((p) =>
                p.id === productId
                    ? { ...p, category: newCategory, lastUpdated: Date.now() }
                    : p
            ),
            history: [...history, change],
            future: [],
        });
    },

    updateProductData: (productId, updates) => {
        const { products } = get();
        set({
            products: products.map((p) =>
                p.id === productId
                    ? { ...p, ...updates, lastUpdated: Date.now() }
                    : p
            ),
        });
    },

    setPendingUpdate: (productId, pending) => {
        const { products } = get();
        set({
            products: products.map((p) =>
                p.id === productId ? { ...p, pendingUpdate: pending } : p
            ),
        });
    },

    rollbackChange: (change) => {
        const { products } = get();
        set({
            products: products.map((p) =>
                p.id === change.productId
                    ? { ...p, [change.field]: change.oldValue }
                    : p
            ),
        });
    },

    undo: () => {
        const { history, future, products } = get();
        if (history.length === 0) return;

        const last = history[history.length - 1];

        set({
            products: products.map((p) =>
                p.id === last.productId
                    ? { ...p, [last.field]: last.oldValue, lastUpdated: Date.now() }
                    : p
            ),
            history: history.slice(0, -1),
            future: [last, ...future],
        });
    },

    redo: () => {
        const { history, future, products } = get();
        if (future.length === 0) return;

        const next = future[0];

        set({
            products: products.map((p) =>
                p.id === next.productId
                    ? { ...p, [next.field]: next.newValue, lastUpdated: Date.now() }
                    : p
            ),
            history: [...history, next],
            future: future.slice(1),
        });
    },

    addToast: (message, type) => {
        const id = `toast_${Date.now()}_${Math.random()}`;
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
        setTimeout(() => get().removeToast(id), 3500);
    },

    removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

    setEditingProductId: (editingProductId) => set({ editingProductId }),
}));
