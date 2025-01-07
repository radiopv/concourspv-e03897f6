export interface PrizeCatalogRow {
  id: string;
  created_at: string;
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

export interface PrizeCatalogInsert extends Omit<PrizeCatalogRow, 'id' | 'created_at'> {
  id?: string;
  created_at?: string;
}

export interface PrizeCatalogUpdate extends Partial<PrizeCatalogInsert> {}