export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      booking_stats: {
        Row: {
          cancelled_rides: number | null
          completed_rides: number | null
          created_at: string
          id: string
          month: string
          taxi_id: string | null
          total_bookings: number | null
          total_revenue: number | null
          updated_at: string
        }
        Insert: {
          cancelled_rides?: number | null
          completed_rides?: number | null
          created_at?: string
          id?: string
          month: string
          taxi_id?: string | null
          total_bookings?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Update: {
          cancelled_rides?: number | null
          completed_rides?: number | null
          created_at?: string
          id?: string
          month?: string
          taxi_id?: string | null
          total_bookings?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_stats_taxi_id_fkey"
            columns: ["taxi_id"]
            isOneToOne: false
            referencedRelation: "taxis"
            referencedColumns: ["id"]
          },
        ]
      }
      contests: {
        Row: {
          created_at: string | null
          description: string | null
          draw_date: string | null
          end_date: string
          has_big_prizes: boolean | null
          id: string
          is_featured: boolean | null
          is_new: boolean | null
          prize_image_url: string | null
          shop_url: string | null
          start_date: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          draw_date?: string | null
          end_date: string
          has_big_prizes?: boolean | null
          id?: string
          is_featured?: boolean | null
          is_new?: boolean | null
          prize_image_url?: string | null
          shop_url?: string | null
          start_date: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          draw_date?: string | null
          end_date?: string
          has_big_prizes?: boolean | null
          id?: string
          is_featured?: boolean | null
          is_new?: boolean | null
          prize_image_url?: string | null
          shop_url?: string | null
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      draw_history: {
        Row: {
          contest_id: string
          created_at: string
          draw_date: string
          id: string
          participant_id: string
        }
        Insert: {
          contest_id: string
          created_at?: string
          draw_date?: string
          id?: string
          participant_id: string
        }
        Update: {
          contest_id?: string
          created_at?: string
          draw_date?: string
          id?: string
          participant_id?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          preferred_channel: string | null
          qr_code_url: string | null
          temp_password: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          preferred_channel?: string | null
          qr_code_url?: string | null
          temp_password?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          preferred_channel?: string | null
          qr_code_url?: string | null
          temp_password?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      featured_winners: {
        Row: {
          created_at: string
          description: string | null
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          photo_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          first_name: string
          id?: string
          is_active?: boolean | null
          last_name: string
          photo_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          photo_url?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          contests_participated: number | null
          contests_won: number | null
          country: string | null
          created_at: string
          email: string
          facebook_profile_url: string | null
          first_name: string
          id: string
          last_name: string
          notifications_enabled: boolean | null
          phone_number: string | null
          postal_code: string | null
          role: string | null
          share_scores: boolean | null
          street_address: string | null
          total_points: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          contests_participated?: number | null
          contests_won?: number | null
          country?: string | null
          created_at?: string
          email: string
          facebook_profile_url?: string | null
          first_name: string
          id: string
          last_name: string
          notifications_enabled?: boolean | null
          phone_number?: string | null
          postal_code?: string | null
          role?: string | null
          share_scores?: boolean | null
          street_address?: string | null
          total_points?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          contests_participated?: number | null
          contests_won?: number | null
          country?: string | null
          created_at?: string
          email?: string
          facebook_profile_url?: string | null
          first_name?: string
          id?: string
          last_name?: string
          notifications_enabled?: boolean | null
          phone_number?: string | null
          postal_code?: string | null
          role?: string | null
          share_scores?: boolean | null
          street_address?: string | null
          total_points?: number | null
        }
        Relationships: []
      }
      participant_answers: {
        Row: {
          answer: string | null
          attempt_number: number
          created_at: string | null
          id: number
          is_correct: boolean | null
          participant_id: string
          question_id: string
        }
        Insert: {
          answer?: string | null
          attempt_number: number
          created_at?: string | null
          id?: number
          is_correct?: boolean | null
          participant_id: string
          question_id: string
        }
        Update: {
          answer?: string | null
          attempt_number?: number
          created_at?: string | null
          id?: number
          is_correct?: boolean | null
          participant_id?: string
          question_id?: string
        }
        Relationships: []
      }
      participant_prizes: {
        Row: {
          created_at: string | null
          id: string
          participant_id: string | null
          participation_id: string | null
          prize_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          participant_id?: string | null
          participation_id?: string | null
          prize_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          participant_id?: string | null
          participation_id?: string | null
          prize_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_participant_prizes_participations"
            columns: ["participation_id"]
            isOneToOne: false
            referencedRelation: "participations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_prizes_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["participation_id"]
          },
          {
            foreignKeyName: "participant_prizes_prize_id_fkey"
            columns: ["prize_id"]
            isOneToOne: false
            referencedRelation: "prizes"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          attempts: number | null
          completed_at: string | null
          contest_id: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          participation_id: string
          score: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          attempts?: number | null
          completed_at?: string | null
          contest_id?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          participation_id?: string
          score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          attempts?: number | null
          completed_at?: string | null
          contest_id?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          participation_id?: string
          score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_participants_contest"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      participations: {
        Row: {
          attempts: number | null
          completed_at: string | null
          contest_id: string
          created_at: string | null
          id: string
          participant_id: string
          score: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          attempts?: number | null
          completed_at?: string | null
          contest_id: string
          created_at?: string | null
          id?: string
          participant_id: string
          score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          attempts?: number | null
          completed_at?: string | null
          contest_id?: string
          created_at?: string | null
          id?: string
          participant_id?: string
          score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_contest"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_participations_participant"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["participation_id"]
          },
        ]
      }
      point_history: {
        Row: {
          contest_id: string | null
          created_at: string
          id: string
          points: number
          source: string
          streak: number | null
          user_id: string | null
        }
        Insert: {
          contest_id?: string | null
          created_at?: string
          id?: string
          points: number
          source: string
          streak?: number | null
          user_id?: string | null
        }
        Update: {
          contest_id?: string | null
          created_at?: string
          id?: string
          points?: number
          source?: string
          streak?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "point_history_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      prize_catalog: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          images: string[] | null
          is_active: boolean | null
          is_archived: boolean | null
          is_hidden: boolean | null
          is_visible: boolean | null
          main_image_url: string | null
          name: string
          shop_url: string | null
          status: string | null
          stock: number | null
          value: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean | null
          is_archived?: boolean | null
          is_hidden?: boolean | null
          is_visible?: boolean | null
          main_image_url?: string | null
          name: string
          shop_url?: string | null
          status?: string | null
          stock?: number | null
          value?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean | null
          is_archived?: boolean | null
          is_hidden?: boolean | null
          is_visible?: boolean | null
          main_image_url?: string | null
          name?: string
          shop_url?: string | null
          status?: string | null
          stock?: number | null
          value?: number | null
        }
        Relationships: []
      }
      prizes: {
        Row: {
          catalog_item_id: number | null
          contest_id: string | null
          created_at: string
          id: string
          is_choice: boolean | null
          prize_catalog_id: string
        }
        Insert: {
          catalog_item_id?: number | null
          contest_id?: string | null
          created_at?: string
          id?: string
          is_choice?: boolean | null
          prize_catalog_id: string
        }
        Update: {
          catalog_item_id?: number | null
          contest_id?: string | null
          created_at?: string
          id?: string
          is_choice?: boolean | null
          prize_catalog_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_prize_catalog"
            columns: ["prize_catalog_id"]
            isOneToOne: false
            referencedRelation: "prize_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prizes_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          created_at: string
          description: string | null
          discount_percentage: number | null
          end_date: string
          id: string
          is_active: boolean | null
          start_date: string
          taxi_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          end_date: string
          id?: string
          is_active?: boolean | null
          start_date: string
          taxi_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          start_date?: string
          taxi_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotions_taxi_id_fkey"
            columns: ["taxi_id"]
            isOneToOne: false
            referencedRelation: "taxis"
            referencedColumns: ["id"]
          },
        ]
      }
      question_bank: {
        Row: {
          article_url: string | null
          correct_answer: string
          created_at: string
          id: string
          options: Json
          question_text: string
          status: string
        }
        Insert: {
          article_url?: string | null
          correct_answer: string
          created_at?: string
          id?: string
          options: Json
          question_text: string
          status?: string
        }
        Update: {
          article_url?: string | null
          correct_answer?: string
          created_at?: string
          id?: string
          options?: Json
          question_text?: string
          status?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          article_url: string | null
          contest_id: string | null
          correct_answer: string | null
          created_at: string | null
          id: string
          options: Json | null
          order_number: number | null
          question_text: string
          questionnaire_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          article_url?: string | null
          contest_id?: string | null
          correct_answer?: string | null
          created_at?: string | null
          id?: string
          options?: Json | null
          order_number?: number | null
          question_text: string
          questionnaire_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Update: {
          article_url?: string | null
          contest_id?: string | null
          correct_answer?: string | null
          created_at?: string | null
          id?: string
          options?: Json | null
          order_number?: number | null
          question_text?: string
          questionnaire_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_questions_contest"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          content: string
          created_at: string
          id: string
          status: string
          taxi_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          status?: string
          taxi_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          status?: string
          taxi_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_taxi_id_fkey"
            columns: ["taxi_id"]
            isOneToOne: false
            referencedRelation: "taxis"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string
          default_attempts: number
          id: number
          required_percentage: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_attempts?: number
          id?: never
          required_percentage?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_attempts?: number
          id?: never
          required_percentage?: number
          updated_at?: string
        }
        Relationships: []
      }
      taxi_contacts: {
        Row: {
          created_at: string
          facebook: string | null
          id: string
          messenger: string | null
          phone: string
          taxi_id: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          facebook?: string | null
          id?: string
          messenger?: string | null
          phone: string
          taxi_id: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          facebook?: string | null
          id?: string
          messenger?: string | null
          phone?: string
          taxi_id?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "taxi_contacts_taxi_id_fkey"
            columns: ["taxi_id"]
            isOneToOne: true
            referencedRelation: "taxis"
            referencedColumns: ["id"]
          },
        ]
      }
      taxi_currencies: {
        Row: {
          currency: string
          taxi_id: string
        }
        Insert: {
          currency: string
          taxi_id: string
        }
        Update: {
          currency?: string
          taxi_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "taxi_currencies_taxi_id_fkey"
            columns: ["taxi_id"]
            isOneToOne: false
            referencedRelation: "taxis"
            referencedColumns: ["id"]
          },
        ]
      }
      taxi_ratings: {
        Row: {
          comment: string | null
          courtesy_rating: number | null
          created_at: string
          id: string
          price_rating: number | null
          punctuality_rating: number | null
          service_rating: number | null
          taxi_id: string | null
          user_id: string | null
          vehicle_condition_rating: number | null
        }
        Insert: {
          comment?: string | null
          courtesy_rating?: number | null
          created_at?: string
          id?: string
          price_rating?: number | null
          punctuality_rating?: number | null
          service_rating?: number | null
          taxi_id?: string | null
          user_id?: string | null
          vehicle_condition_rating?: number | null
        }
        Update: {
          comment?: string | null
          courtesy_rating?: number | null
          created_at?: string
          id?: string
          price_rating?: number | null
          punctuality_rating?: number | null
          service_rating?: number | null
          taxi_id?: string | null
          user_id?: string | null
          vehicle_condition_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "taxi_ratings_taxi_id_fkey"
            columns: ["taxi_id"]
            isOneToOne: false
            referencedRelation: "taxis"
            referencedColumns: ["id"]
          },
        ]
      }
      taxi_working_hours: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_closed: boolean | null
          start_time: string
          taxi_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_closed?: boolean | null
          start_time: string
          taxi_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_closed?: boolean | null
          start_time?: string
          taxi_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "taxi_working_hours_taxi_id_fkey"
            columns: ["taxi_id"]
            isOneToOne: false
            referencedRelation: "taxis"
            referencedColumns: ["id"]
          },
        ]
      }
      taxis: {
        Row: {
          available: boolean | null
          category: string
          created_at: string
          description: string | null
          driver_id: string | null
          driver_name: string
          id: string
          images: string[] | null
          is_certified: boolean | null
          license_plate: string | null
          location: string | null
          photo_url: string
          updated_at: string
          website: string | null
        }
        Insert: {
          available?: boolean | null
          category: string
          created_at?: string
          description?: string | null
          driver_id?: string | null
          driver_name: string
          id?: string
          images?: string[] | null
          is_certified?: boolean | null
          license_plate?: string | null
          location?: string | null
          photo_url: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          available?: boolean | null
          category?: string
          created_at?: string
          description?: string | null
          driver_id?: string | null
          driver_name?: string
          id?: string
          images?: string[] | null
          is_certified?: boolean | null
          license_plate?: string | null
          location?: string | null
          photo_url?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "taxis_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          best_streak: number | null
          created_at: string
          current_rank: string | null
          current_streak: number | null
          extra_participations: number | null
          total_points: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          best_streak?: number | null
          created_at?: string
          current_rank?: string | null
          current_streak?: number | null
          extra_participations?: number | null
          total_points?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          best_streak?: number | null
          created_at?: string
          current_rank?: string | null
          current_streak?: number | null
          extra_participations?: number | null
          total_points?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_points_member"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_facebook_share: {
        Args: {
          user_id: string
          share_type: string
          contest_id?: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
