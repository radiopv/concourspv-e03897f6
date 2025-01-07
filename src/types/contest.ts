export interface CatalogItem {
  id: string;
  name: string;
  value: string;
  image_url: string;
}

export interface ParticipantPrize {
  prize: {
    catalog_item: CatalogItem;
  };
}

export interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  score?: number;
  status: string;
  created_at: string;
  participant_prizes?: ParticipantPrize[];
}

export interface Contest {
  id: string;
  title: string;
  description?: string;
  is_new: boolean;
  has_big_prizes: boolean;
  status: string;
  participants?: Participant[];
}

export interface ContestWithParticipantCount extends Omit<Contest, 'participants'> {
  participants?: {
    count: number;
    data?: Participant[];
  };
}