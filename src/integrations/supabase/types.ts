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
      old_participants: {
        Row: {
          attempts: number | null
          completed_at: string | null
          contest_id: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          participation_id: string | null
          score: number | null
          status: string | null
        }
        Insert: {
          attempts?: number | null
          completed_at?: string | null
          contest_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          participation_id?: string | null
          score?: number | null
          status?: string | null
        }
        Update: {
          attempts?: number | null
          completed_at?: string | null
          contest_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          participation_id?: string | null
          score?: number | null
          status?: string | null
        }
        Relationships: []
      }
      participant_answers: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          participant_id: string | null
          question_id: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          participant_id?: string | null
          question_id?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          participant_id?: string | null
          question_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participant_answers_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "old_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      participant_prizes: {
        Row: {
          created_at: string | null
          id: string
          participant_id: string | null
          prize_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          participant_id?: string | null
          prize_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          participant_id?: string | null
          prize_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participant_prizes_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "old_participants"
            referencedColumns: ["id"]
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
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          updated_at?: string | null
        }
        Relationships: []
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
        Relationships: []
      }
      prize_catalog: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          shop_url: string | null
          stock: number | null
          value: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          shop_url?: string | null
          stock?: number | null
          value?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          shop_url?: string | null
          stock?: number | null
          value?: number | null
        }
        Relationships: []
      }
      prizes: {
        Row: {
          catalog_item_id: string
          contest_id: string
          created_at: string
          id: string
        }
        Insert: {
          catalog_item_id: string
          contest_id: string
          created_at?: string
          id?: string
        }
        Update: {
          catalog_item_id?: string
          contest_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_prize_catalog"
            columns: ["catalog_item_id"]
            isOneToOne: false
            referencedRelation: "prize_catalog"
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
      questionnaires: {
        Row: {
          contest_id: string
          created_at: string | null
          description: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          contest_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          contest_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionnaires_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          correct_answer: string | null
          created_at: string | null
          id: string
          options: Json | null
          question_text: string
          questionnaire_id: string
          updated_at: string | null
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string | null
          id?: string
          options?: Json | null
          question_text: string
          questionnaire_id: string
          updated_at?: string | null
        }
        Update: {
          correct_answer?: string | null
          created_at?: string | null
          id?: string
          options?: Json | null
          question_text?: string
          questionnaire_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "questionnaires"
            referencedColumns: ["id"]
          },
        ]
      }
      responses: {
        Row: {
          answer_text: string
          contest_id: string
          created_at: string | null
          id: string
          participant_id: string
          question_id: string
        }
        Insert: {
          answer_text: string
          contest_id: string
          created_at?: string | null
          id?: string
          participant_id: string
          question_id: string
        }
        Update: {
          answer_text?: string
          contest_id?: string
          created_at?: string | null
          id?: string
          participant_id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "responses_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
