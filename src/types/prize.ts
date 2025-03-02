
export interface Prize {
  id: string;
  name: string;
  description: string;
  image_url: string;
  shop_url: string;
  value: number;
  prize_catalog_id?: string;
  contest_id?: string;
}
