export type Prize = {
  prize_catalog: {
    id: string;
    name: string;
    description?: string;
    image_url?: string;
    shop_url?: string;
    value?: number;
  };
};

export type ContestPrize = {
  id: string;
  catalog_item: Prize;
};