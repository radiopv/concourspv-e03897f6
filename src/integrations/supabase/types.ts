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
          is_rank_restricted: boolean | null
          is_visible: boolean | null
          main_image_url: string | null
          min_rank: string | null
          prize_image_url: string | null
          share_image_url: string | null
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
          is_rank_restricted?: boolean | null
          is_visible?: boolean | null
          main_image_url?: string | null
          min_rank?: string | null
          prize_image_url?: string | null
          share_image_url?: string | null
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
          is_rank_restricted?: boolean | null
          is_visible?: boolean | null
          main_image_url?: string | null
          min_rank?: string | null
          prize_image_url?: string | null
          share_image_url?: string | null
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
        Relationships: [
          {
            foreignKeyName: "fk_draw_history_participant"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["participation_id"]
          },
        ]
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
          answered_at: string | null
          attempt_number: number
          contest_id: string | null
          created_at: string | null
          id: number
          is_correct: boolean | null
          participant_id: string
          question_id: string
        }
        Insert: {
          answer?: string | null
          answered_at?: string | null
          attempt_number: number
          contest_id?: string | null
          created_at?: string | null
          id?: number
          is_correct?: boolean | null
          participant_id: string
          question_id: string
        }
        Update: {
          answer?: string | null
          answered_at?: string | null
          attempt_number?: number
          contest_id?: string | null
          created_at?: string | null
          id?: number
          is_correct?: boolean | null
          participant_id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participant_answers_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      participant_prizes: {
        Row: {
          contest_id: string | null
          created_at: string | null
          id: string
          participant_id: string | null
          participation_id: string | null
          prize_id: string | null
        }
        Insert: {
          contest_id?: string | null
          created_at?: string | null
          id?: string
          participant_id?: string | null
          participation_id?: string | null
          prize_id?: string | null
        }
        Update: {
          contest_id?: string | null
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
            foreignKeyName: "participant_prizes_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
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
          current_rank: string | null
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
          current_rank?: string | null
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
          current_rank?: string | null
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
            foreignKeyName: "fk_point_history_contest"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
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
          status: string | null
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
          status?: string | null
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
          status?: string | null
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
      taxi_chauffeur: {
        Row: {
          accepted_currencies: string[] | null
          available: boolean | null
          created_at: string
          description: string | null
          display_order: number | null
          email: string | null
          facebook_url: string | null
          full_name: string
          id: string
          is_certified: boolean | null
          is_first_login: boolean | null
          is_visible: boolean | null
          languages: string[] | null
          linkedin_url: string | null
          location: Json | null
          messenger: string | null
          other_links: string[] | null
          phone: string | null
          photo_url: string | null
          preferred_channel: string | null
          publish_date: string | null
          qr_code_token: string | null
          qr_code_token_expires_at: string | null
          qr_code_url: string | null
          role: Database["public"]["Enums"]["driver_role"]
          service_areas: string[] | null
          status: string | null
          taxi_category: string | null
          taxi_images: string[] | null
          taxi_model: string | null
          taxi_type: string | null
          temp_password: string | null
          tripadvisor_url: string | null
          unpublish_date: string | null
          updated_at: string
          website_url: string | null
          whatsapp: string | null
          youtube_url: string | null
        }
        Insert: {
          accepted_currencies?: string[] | null
          available?: boolean | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          email?: string | null
          facebook_url?: string | null
          full_name: string
          id?: string
          is_certified?: boolean | null
          is_first_login?: boolean | null
          is_visible?: boolean | null
          languages?: string[] | null
          linkedin_url?: string | null
          location?: Json | null
          messenger?: string | null
          other_links?: string[] | null
          phone?: string | null
          photo_url?: string | null
          preferred_channel?: string | null
          publish_date?: string | null
          qr_code_token?: string | null
          qr_code_token_expires_at?: string | null
          qr_code_url?: string | null
          role?: Database["public"]["Enums"]["driver_role"]
          service_areas?: string[] | null
          status?: string | null
          taxi_category?: string | null
          taxi_images?: string[] | null
          taxi_model?: string | null
          taxi_type?: string | null
          temp_password?: string | null
          tripadvisor_url?: string | null
          unpublish_date?: string | null
          updated_at?: string
          website_url?: string | null
          whatsapp?: string | null
          youtube_url?: string | null
        }
        Update: {
          accepted_currencies?: string[] | null
          available?: boolean | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          email?: string | null
          facebook_url?: string | null
          full_name?: string
          id?: string
          is_certified?: boolean | null
          is_first_login?: boolean | null
          is_visible?: boolean | null
          languages?: string[] | null
          linkedin_url?: string | null
          location?: Json | null
          messenger?: string | null
          other_links?: string[] | null
          phone?: string | null
          photo_url?: string | null
          preferred_channel?: string | null
          publish_date?: string | null
          qr_code_token?: string | null
          qr_code_token_expires_at?: string | null
          qr_code_url?: string | null
          role?: Database["public"]["Enums"]["driver_role"]
          service_areas?: string[] | null
          status?: string | null
          taxi_category?: string | null
          taxi_images?: string[] | null
          taxi_model?: string | null
          taxi_type?: string | null
          temp_password?: string | null
          tripadvisor_url?: string | null
          unpublish_date?: string | null
          updated_at?: string
          website_url?: string | null
          whatsapp?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      taxi_user_reviews: {
        Row: {
          content: string
          courtesy_rating: number | null
          created_at: string | null
          driver_response: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          overall_rating: number | null
          price_rating: number | null
          punctuality_rating: number | null
          status: Database["public"]["Enums"]["review_status"] | null
          taxi_condition_rating: number | null
          taxi_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          courtesy_rating?: number | null
          created_at?: string | null
          driver_response?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          overall_rating?: number | null
          price_rating?: number | null
          punctuality_rating?: number | null
          status?: Database["public"]["Enums"]["review_status"] | null
          taxi_condition_rating?: number | null
          taxi_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          courtesy_rating?: number | null
          created_at?: string | null
          driver_response?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          overall_rating?: number | null
          price_rating?: number | null
          punctuality_rating?: number | null
          status?: Database["public"]["Enums"]["review_status"] | null
          taxi_condition_rating?: number | null
          taxi_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "taxi_user_reviews_taxi_id_fkey"
            columns: ["taxi_id"]
            isOneToOne: false
            referencedRelation: "taxi_chauffeur"
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
          monthly_shares: number | null
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
          monthly_shares?: number | null
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
          monthly_shares?: number | null
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
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_streak_bonus: {
        Args: {
          streak_count: number
          base_points: number
        }
        Returns: number
      }
      calculate_user_points: {
        Args: {
          input_user_id: string
        }
        Returns: number
      }
      get_contest_share_metadata: {
        Args: {
          input_contest_id: string
        }
        Returns: {
          title: string
          description: string
          image_url: string
          prize_value: number
        }[]
      }
      get_taxi_ratings: {
        Args: {
          taxi_id_input: string
        }
        Returns: {
          average_courtesy: number
          average_punctuality: number
          average_price: number
          average_taxi_condition: number
          average_overall: number
          total_reviews: number
        }[]
      }
      get_user_profile: {
        Args: {
          input_user_id: string
        }
        Returns: {
          username: string
          email: string
          bio: string
        }[]
      }
      handle_answer_points: {
        Args: {
          user_id_param: string
          is_correct: boolean
          current_streak: number
          total_questions: number
          correct_answers: number
        }
        Returns: Json
      }
      handle_facebook_share: {
        Args: {
          input_user_id: string
          share_type: string
          contest_id?: string
        }
        Returns: Json
      }
      log_user_activity: {
        Args: {
          input_user_id: string
          activity: string
        }
        Returns: undefined
      }
      set_claim: {
        Args: {
          uid: string
          claim: string
          value: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "driver"
      driver_role: "admin" | "driver"
      review_status: "pending" | "approved" | "rejected"
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
