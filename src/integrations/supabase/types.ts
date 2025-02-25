export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_date: string | null
          achievement_name: string
          id: string
          player_id: string
        }
        Insert: {
          achievement_date?: string | null
          achievement_name: string
          id?: string
          player_id: string
        }
        Update: {
          achievement_date?: string | null
          achievement_name?: string
          id?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      matches: {
        Row: {
          created_at: string
          id: string
          match_date: string
          match_type: string
          score: string | null
          venue_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          match_date: string
          match_type: string
          score?: string | null
          venue_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          match_date?: string
          match_type?: string
          score?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          }
        ]
      }
      player_stats: {
        Row: {
          assists: number
          created_at: string
          goals: number
          id: string
          matches_played: number
          player_id: string
          xg: number | null
        }
        Insert: {
          assists?: number
          created_at?: string
          goals?: number
          id?: string
          matches_played?: number
          player_id: string
          xg?: number | null
        }
        Update: {
          assists?: number
          created_at?: string
          goals?: number
          id?: string
          matches_played?: number
          player_id?: string
          xg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          position: Database["public"]["Enums"]["player_position"] | null
          username: string | null
          xp_level: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          position?: Database["public"]["Enums"]["player_position"] | null
          username?: string | null
          xp_level?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          position?: Database["public"]["Enums"]["player_position"] | null
          username?: string | null
          xp_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      venues: {
        Row: {
          address: string | null
          id: string
          name: string
        }
        Insert: {
          address?: string | null
          id?: string
          name: string
        }
        Update: {
          address?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      tournaments: {
        Row: {
          id: string
          name: string
          description: string | null
          start_date: string
          end_date: string | null
          status: string
          created_at: string
          max_participants: number | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          start_date: string
          end_date?: string | null
          status: string
          created_at?: string
          max_participants?: number | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          start_date?: string
          end_date?: string | null
          status?: string
          created_at?: string
          max_participants?: number | null
        }
        Relationships: []
      }
      tournament_participants: {
        Row: {
          id: string
          tournament_id: string
          player_id: string
          joined_at: string
          status: string
        }
        Insert: {
          id?: string
          tournament_id: string
          player_id: string
          joined_at?: string
          status?: string
        }
        Update: {
          id?: string
          tournament_id?: string
          player_id?: string
          joined_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      player_rankings: {
        Row: {
          id: string
          player_id: string
          rank: number
          points: number
          updated_at: string
        }
        Insert: {
          id?: string
          player_id: string
          rank: number
          points: number
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          rank?: number
          points?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_rankings_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      challenges: {
        Row: {
          id: string
          challenger_id: string
          challenged_id: string
          status: string
          created_at: string
          match_id: string | null
          expiry_date: string | null
        }
        Insert: {
          id?: string
          challenger_id: string
          challenged_id: string
          status: string
          created_at?: string
          match_id?: string | null
          expiry_date?: string | null
        }
        Update: {
          id?: string
          challenger_id?: string
          challenged_id?: string
          status?: string
          created_at?: string
          match_id?: string | null
          expiry_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_challenger_id_fkey"
            columns: ["challenger_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_challenged_id_fkey"
            columns: ["challenged_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          }
        ]
      }
      device_pairings: {
        Row: {
          id: string
          player_id: string
          selected_time: string
          selected_position: string
          selected_team: string
          device_id: number
          created_at: string
          expiry_at: string | null
          is_active: boolean
          is_guest: boolean
          guest_identifier: string | null
        }
        Insert: {
          id?: string
          player_id: string
          selected_time: string
          selected_position: string
          selected_team: string
          device_id: number
          created_at?: string
          expiry_at?: string | null
          is_active?: boolean
          is_guest?: boolean
          guest_identifier?: string | null
        }
        Update: {
          id?: string
          player_id?: string
          selected_time?: string
          selected_position?: string
          selected_team?: string
          device_id?: number
          created_at?: string
          expiry_at?: string | null
          is_active?: boolean
          is_guest?: boolean
          guest_identifier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_pairings_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
      active_device_pairings: {
        Row: {
          id: string
          player_id: string
          selected_time: string
          selected_position: string
          selected_team: string
          device_id: number
          created_at: string
          expiry_at: string | null
          is_active: boolean
          is_guest: boolean
          guest_identifier: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_pairings_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      player_position: "goalkeeper" | "defender" | "midfielder" | "forward"
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
