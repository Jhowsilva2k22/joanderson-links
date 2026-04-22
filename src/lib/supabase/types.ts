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
      clicks: {
        Row: {
          clicked_at: string
          country: string | null
          device: string | null
          id: string
          link_id: string
          referrer: string | null
          region: string | null
          source: string | null
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string
          country?: string | null
          device?: string | null
          id?: string
          link_id: string
          referrer?: string | null
          region?: string | null
          source?: string | null
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string
          country?: string | null
          device?: string | null
          id?: string
          link_id?: string
          referrer?: string | null
          region?: string | null
          source?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      links: {
        Row: {
          active: boolean
          category: string
          created_at: string
          icon_url: string | null
          id: string
          order_index: number
          profile_id: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          active?: boolean
          category?: string
          created_at?: string
          icon_url?: string | null
          id?: string
          order_index?: number
          profile_id: string
          title?: string
          updated_at?: string
          url?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          icon_url?: string | null
          id?: string
          order_index?: number
          profile_id?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bg_color: string
          bio: string
          cover_url: string | null
          created_at: string
          font_family: string
          id: string
          name: string
          primary_color: string
          secondary_color: string
          slug: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bg_color?: string
          bio?: string
          cover_url?: string | null
          created_at?: string
          font_family?: string
          id?: string
          name?: string
          primary_color?: string
          secondary_color?: string
          slug?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bg_color?: string
          bio?: string
          cover_url?: string | null
          created_at?: string
          font_family?: string
          id?: string
          name?: string
          primary_color?: string
          secondary_color?: string
          slug?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Link = Database["public"]["Tables"]["links"]["Row"]
export type Click = Database["public"]["Tables"]["clicks"]["Row"]
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"]
export type LinkInsert = Database["public"]["Tables"]["links"]["Insert"]
export type ClickInsert = Database["public"]["Tables"]["clicks"]["Insert"]
