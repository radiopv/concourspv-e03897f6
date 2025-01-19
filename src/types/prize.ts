export type Prize = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  shop_url?: string;
  value?: number;
};

export type ContestPrize = {
  id: string;
  prize_catalog: Prize;
};