export interface Prize {
  id: string;
  name: string;
  description?: string;
  value?: number;
  images?: string[];
  main_image_url?: string;
  shop_url?: string;
  is_archived?: boolean;
  is_hidden?: boolean;
  category?: string;
  stock?: number;
  created_at?: string;
}

export interface PrizeFormData {
  name: string;
  description?: string;
  value?: number;
  images?: string[];
  main_image_url?: string;
  shop_url?: string;
  is_archived?: boolean;
  is_hidden?: boolean;
  category?: string;
  stock?: number;
}