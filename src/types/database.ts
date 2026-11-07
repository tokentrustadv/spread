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
          cashapp_handle: string | null;
          venmo_handle: string | null;
          bio: string | null;
          is_live: boolean;
          agreed_terms_at: string | null;
          terms_version: string | null;
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
          cashapp_handle?: string | null;
          venmo_handle?: string | null;
          bio?: string | null;
          is_live?: boolean;
          agreed_terms_at?: string | null;
          terms_version?: string | null;
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
          cashapp_handle?: string | null;
          venmo_handle?: string | null;
          bio?: string | null;
          is_live?: boolean;
          agreed_terms_at?: string | null;
          terms_version?: string | null;
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
          is_paused: boolean;
          food_cost: number | null;
          price: number | null;
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
          is_paused?: boolean;
          food_cost?: number | null;
          price?: number | null;
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
          is_paused?: boolean;
          food_cost?: number | null;
          price?: number | null;
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
      memberships: {
        Row: {
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string | null;
          stripe_subscription_created_at: string | null;
          status: string;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          intro_offer_used_at: string | null;
          pending_checkout_session_id: string | null;
          pending_checkout_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id?: string | null;
          stripe_subscription_created_at?: string | null;
          status?: string;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          intro_offer_used_at?: string | null;
          pending_checkout_session_id?: string | null;
          pending_checkout_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          stripe_customer_id?: string;
          stripe_subscription_id?: string | null;
          stripe_subscription_created_at?: string | null;
          status?: string;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          intro_offer_used_at?: string | null;
          pending_checkout_session_id?: string | null;
          pending_checkout_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      requests: {
        Row: {
          id: string;
          creator_id: string;
          spread_id: string;
          spread_title: string;
          items: unknown;
          currency: string;
          listed_price_cents: number | null;
          quantity: number;
          customer_display_name: string;
          contact_channel: string;
          social_handle: string;
          requested_window_start: string | null;
          requested_window_end: string | null;
          requested_window_tz: string | null;
          status: string;
          client_submission_id: string;
          requested_at: string;
          accepted_at: string | null;
          closed_at: string | null;
          expires_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          spread_id: string;
          spread_title: string;
          items: unknown;
          currency?: string;
          listed_price_cents?: number | null;
          quantity?: number;
          customer_display_name: string;
          contact_channel: string;
          social_handle: string;
          requested_window_start?: string | null;
          requested_window_end?: string | null;
          requested_window_tz?: string | null;
          status?: string;
          client_submission_id: string;
          requested_at?: string;
          accepted_at?: string | null;
          closed_at?: string | null;
          expires_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          spread_id?: string;
          spread_title?: string;
          items?: unknown;
          currency?: string;
          listed_price_cents?: number | null;
          quantity?: number;
          customer_display_name?: string;
          contact_channel?: string;
          social_handle?: string;
          requested_window_start?: string | null;
          requested_window_end?: string | null;
          requested_window_tz?: string | null;
          status?: string;
          client_submission_id?: string;
          requested_at?: string;
          accepted_at?: string | null;
          closed_at?: string | null;
          expires_at?: string;
        };
        Relationships: [];
      };
      request_rate_limit_events: {
        Row: {
          id: number;
          creator_id: string;
          ip_hash: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          creator_id: string;
          ip_hash: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          creator_id?: string;
          ip_hash?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_membership_active: {
        Args: { target_user_id: string };
        Returns: boolean;
      };
      submit_request: {
        Args: {
          p_client_submission_id: string;
          p_creator_id: string;
          p_spread_id: string;
          p_ip_hash: string;
          p_spread_title: string;
          p_items: unknown;
          p_listed_price_cents: number | null;
          p_quantity: number;
          p_customer_display_name: string;
          p_contact_channel: string;
          p_social_handle: string;
          p_requested_window_start: string | null;
          p_requested_window_end: string | null;
          p_requested_window_tz: string | null;
        };
        Returns: Database["public"]["Tables"]["requests"]["Row"];
      };
      update_request_status: {
        Args: {
          p_request_id: string;
          p_creator_id: string;
          p_expected_status: string;
          p_new_status: string;
        };
        Returns: Database["public"]["Tables"]["requests"]["Row"];
      };
    };
  };
};
