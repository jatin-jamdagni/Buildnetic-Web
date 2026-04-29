import { useMemo } from 'react';
import { useProductStore } from '../store/useProductStore';
import type { Product, SortOption } from '../types';

const applySort = (products: Product[], sort: SortOption): Product[] => {
  const arr = [...products];
  switch (sort) {
    case 'price_asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'rating_asc':
      return arr.sort((a, b) => a.rating.rate - b.rating.rate);
    case 'rating_desc':
      return arr.sort((a, b) => b.rating.rate - a.rating.rate);
    default:
      return arr;
  }
};

export const useFilteredProducts = () => {
  const { products, searchQuery, selectedCategory, sortOption } =
    useProductStore();

  return useMemo(() => {
    let filtered = products;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    return applySort(filtered, sortOption);
  }, [products, searchQuery, selectedCategory, sortOption]);
};

export const useFeaturedProducts = () => {
  const { products } = useProductStore();
  return useMemo(
    () =>
      [...products]
        .sort((a, b) => b.rating.rate - a.rating.rate)
        .slice(0, 8),
    [products]
  );
};
