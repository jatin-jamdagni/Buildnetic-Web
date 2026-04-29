import { useEffect, useRef } from 'react';
import { useProductStore } from '../store/useProductStore';

const INTERVAL_MS = 10_000;

export const usePeriodicUpdates = () => {
  const store = useProductStore();

  const productsRef = useRef(store.products);
  const editingIdRef = useRef(store.editingProductId);

  useEffect(() => {
    productsRef.current = store.products;
  }, [store.products]);

  useEffect(() => {
    editingIdRef.current = store.editingProductId;
  }, [store.editingProductId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const products = productsRef.current;
      if (products.length === 0) return;


      const target = products[Math.floor(Math.random() * products.length)];
      const isBeingEdited = target.id === editingIdRef.current;
      const updateType = Math.random() > 0.5 ? 'price' : 'rating';
      const shortTitle =
        target.title.length > 22
          ? target.title.slice(0, 22) + '…'
          : target.title;

      if (updateType === 'price') {
        const delta = parseFloat(((Math.random() - 0.5) * 8).toFixed(2));
        const newPrice = parseFloat(
          Math.max(1, target.price + delta).toFixed(2)
        );
        useProductStore.getState().updateProductData(target.id, {
          price: newPrice,
        });

        if (isBeingEdited) {
          useProductStore
            .getState()
            .addToast(
              `Conflict: '${shortTitle}' price changed in background`,
              'warning'
            );
        } else {
          useProductStore
            .getState()
            .addToast(`Price updated: "${shortTitle}"`, 'info');
        }
      } else {
        const delta = parseFloat(((Math.random() - 0.5) * 0.4).toFixed(1));
        const newRate = parseFloat(
          Math.min(5, Math.max(1, target.rating.rate + delta)).toFixed(1)
        );
        useProductStore.getState().updateProductData(target.id, {
          rating: { ...target.rating, rate: newRate },
        });

        if (isBeingEdited) {
          useProductStore
            .getState()
            .addToast(
              `Conflict: '${shortTitle}' rating changed in background`,
              'warning'
            );
        } else {
          useProductStore
            .getState()
            .addToast(`Rating updated: "${shortTitle}"`, 'info');
        }
      }
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);  
};