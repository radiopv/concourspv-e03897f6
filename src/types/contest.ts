export interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  score: number;
  status: string;
  created_at: string;
  participant_prizes?: Array<{
    prize: {
      catalog_item: {
        id: string;
        name: string;
        value: string;
        image_url: string;
      }
    }
  }>;
}

export interface Contest {
  id: string;
  title: string;
  description?: string;
  is_new: boolean;
  has_big_prizes: boolean;
  status: string;
  participants: Participant[];
}

export interface ContestWithParticipantCount {
  id: string;
  title: string;
  description?: string;
  is_new: boolean;
  has_big_prizes: boolean;
  status: string;
  participants?: {
    count: number;
    data?: Participant[];
  };
}