import type { Product } from "../types";

const BASE_URL = 'https://fakestoreapi.com';
const FAILURE_RATE = 0.3;


const delay = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

const randomDelay = () => delay(800 + Math.random() * 1200);

const shouldFail = () => Math.random() < FAILURE_RATE; //30% chance


export const fetchProducts = async (): Promise<Product[]> => {
    const res = await fetch(`${BASE_URL}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
};

export const fetchCategories = async (): Promise<string[]> => {
    const res = await fetch(`${BASE_URL}/products/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
};

export const updateProductApi = async (
    productId: number,
    updates: Partial<Product>
): Promise<Product> => {
    await randomDelay();

    if (shouldFail()) {
        throw new Error('Network error: server rejected update.');
    }

    const res = await fetch(`${BASE_URL}/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });

    if (!res.ok) {
        throw new Error(`API error ${res.status}: Update failed.`);
    }

    return res.json();
};
