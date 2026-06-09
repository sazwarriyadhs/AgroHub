export interface Product {
  id: number;
  name: string;
  slug?: string;
  price: number;
  stock: number;
  image?: string;
  category?: string;
  rating?: number;
}
