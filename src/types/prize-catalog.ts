export interface PrizeCatalogItem {
  id: string;
  name: string;
  description?: string;
  value?: number;
  image_url?: string;
  shop_url?: string;
  created_at?: string;
}

export interface PrizeFormData {
  name: string;
  description: string;
  value: string;
  image_url: string;
  shop_url: string;
}