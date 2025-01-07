export interface Prize {
  id: string;
  name: string;
  description?: string;
  value?: number;
  image_url?: string;
  shop_url?: string;
  category?: string;
  stock?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface PrizeFormData {
  name: string;
  description?: string;
  value?: number;
  image_url?: string;
  shop_url?: string;
  category?: string;
  stock?: number;
  is_active?: boolean;
}