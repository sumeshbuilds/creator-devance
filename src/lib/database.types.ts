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
          whatsapp_number: string | null;
          onboarding_completed: boolean;
          page_sections: Json | null;
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
          whatsapp_number?: string | null;
          onboarding_completed?: boolean;
          page_sections?: Json | null;
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
          whatsapp_number?: string | null;
          onboarding_completed?: boolean;
          page_sections?: Json | null;
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
      services: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          description: string | null;
          price: string | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          title: string;
          description?: string | null;
          price?: string | null;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          title?: string;
          description?: string | null;
          price?: string | null;
          position?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "services_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          media_type: "image" | "video";
          media_url: string;
          description: string | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          title: string;
          media_type: "image" | "video";
          media_url: string;
          description?: string | null;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          title?: string;
          media_type?: "image" | "video";
          media_url?: string;
          description?: string | null;
          position?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          id: string;
          profile_id: string;
          name: string;
          description: string | null;
          price: number | null;
          image_url: string | null;
          is_active: boolean;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          name: string;
          description?: string | null;
          price?: number | null;
          image_url?: string | null;
          is_active?: boolean;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          name?: string;
          description?: string | null;
          price?: number | null;
          image_url?: string | null;
          is_active?: boolean;
          position?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_profile_id_fkey";
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
          whatsapp_number: string | null;
          page_sections: Json | null;
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