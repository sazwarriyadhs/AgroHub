// app/types/order.ts
export interface Order {
  id: number;
  order_code: string;        // ← Ganti order_number jadi order_code
  user_id: number;
  store_id: number;
  store_name?: string;
  product_id: number;
  product_name?: string;
  product_image?: string;
  quantity: number;
  total_price: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_method: string;
  snap_token?: string;
  redirect_url?: string;
  paid_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderDetail extends Order {
  // Detail tambahan dari join dengan tabel lain
  buyer: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  store: {
    id: number;
    name: string;
    logo?: string;
    phone?: string;
  };
  product: {
    id: number;
    name: string;
    image: string;
    price: number;
  };
  shipping_address?: {
    address: string;
    city: string;
    province: string;
    postal_code: string;
  };
}