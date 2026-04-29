export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
  pendingUpdate?: boolean;
  lastUpdated?: number;
}

export interface Change {
  productId: number;
  field: keyof Product;
  oldValue: any;
  newValue: any;
  timestamp: number;
}

export type SortOption = 'none' | 'price_asc' | 'price_desc' | 'rating_asc' | 'rating_desc';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}