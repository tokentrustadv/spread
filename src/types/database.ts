export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          handle: string;
          display_name: string;
          social_link: string | null;
          availability: string | null;
          area: string | null;
          payment_note: string | null;
          is_live: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          handle: string;
          display_name: string;
          social_link?: string | null;
          availability?: string | null;
          area?: string | null;
          payment_note?: string | null;
          is_live?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          handle?: string;
          display_name?: string;
          social_link?: string | null;
          availability?: string | null;
          area?: string | null;
          payment_note?: string | null;
          is_live?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      spreads: {
        Row: {
          id: string;
          user_id: string;
          slug: string;
          title: string;
          color: string;
          notes: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          slug: string;
          title: string;
          color?: string;
          notes?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          slug?: string;
          title?: string;
          color?: string;
          notes?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      spread_restaurants: {
        Row: {
          id: string;
          spread_id: string;
          name: string;
          position: number;
        };
        Insert: {
          id?: string;
          spread_id: string;
          name: string;
          position: number;
        };
        Update: {
          id?: string;
          spread_id?: string;
          name?: string;
          position?: number;
        };
        Relationships: [];
      };
      spread_items: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          note: string | null;
          position: number;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          note?: string | null;
          position?: number;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          note?: string | null;
          position?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
