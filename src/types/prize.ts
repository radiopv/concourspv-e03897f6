export interface Prize {
  id: string;
  name: string;
  description?: string;
  value?: number;
  image_url?: string;
  shop_url?: string;
  category?: string;
  is_active?: boolean;
  stock?: number;
}

export interface PrizeFormData {
  name: string;
  description: string;
  value: number;
}