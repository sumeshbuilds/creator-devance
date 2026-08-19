export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Profession = "artisan" | "professional" | "creator";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          email: string;
          profession: Profession;
          location: string;
          avatar_url: string | null;
          bio: string | null;
          brand_name: string | null;
          instagram_url: string | null;
          facebook_url: string | null;
          youtube_url: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          full_name: string;
          email: string;
          profession: Profession;
          location: string;
          avatar_url?: string | null;
          bio?: string | null;
          brand_name?: string | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          youtube_url?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string;
          email?: string;
          profession?: Profession;
          location?: string;
          avatar_url?: string | null;
          bio?: string | null;
          brand_name?: string | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          youtube_url?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      links: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          url: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          title: string;
          url: string;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          title?: string;
          url?: string;
          position?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "links_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      public_profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          profession: Profession;
          location: string;
          avatar_url: string | null;
          bio: string | null;
          brand_name: string | null;
          instagram_url: string | null;
          facebook_url: string | null;
          youtube_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Functions: {
      is_username_available: {
        Args: { p_username: string };
        Returns: boolean;
      };
      get_email_by_username: {
        Args: { p_username: string };
        Returns: string | null;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}