export interface Prize {
  id: string;
  name: string;
  description?: string;
  value?: number;
  images?: string[];
  main_image_url?: string;
  shop_url?: string;
  category?: string;
  stock?: number;
  is_archived?: boolean;
  is_hidden?: boolean;
  created_at?: string;
}

export interface PrizeFormData {
  name: string;
  description: string;
  value?: number;
  images?: string[];
  main_image_url?: string;
  shop_url?: string;
  category?: string;
  stock?: number;
  is_archived?: boolean;
  is_hidden?: boolean;
}