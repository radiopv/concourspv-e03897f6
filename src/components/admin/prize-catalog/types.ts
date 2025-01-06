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

export interface Prize extends PrizeFormData {
  id: string;
  created_at: string;
}