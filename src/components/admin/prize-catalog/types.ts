export interface Prize {
  id: string;
  name: string;
  description?: string;
  value?: number;
}

export interface PrizeFormData {
  name: string;
  description?: string;
  value?: number;
}