export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
          full_name: string | null;
          avatar_url: string | null;
          subscription_tier: 'freemium' | 'basic' | 'professional' | 'advanced' | 'enterprise';
          tokens: number;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'freemium' | 'basic' | 'professional' | 'advanced' | 'enterprise';
          tokens?: number;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'freemium' | 'basic' | 'professional' | 'advanced' | 'enterprise';
          tokens?: number;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
          owner_id: string;
          status: 'active' | 'archived' | 'deleted';
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          owner_id: string;
          status?: 'active' | 'archived' | 'deleted';
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          owner_id?: string;
          status?: 'active' | 'archived' | 'deleted';
        };
      };
      epics: {
        Row: {
          id: string;
          title: string;
          description: string;
          project_id: string;
          status: 'todo' | 'in_progress' | 'done';
          created_at: string;
          updated_at: string;
          business_value: string | null;
          priority: 'low' | 'medium' | 'high';
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          project_id: string;
          status?: 'todo' | 'in_progress' | 'done';
          created_at?: string;
          updated_at?: string;
          business_value?: string | null;
          priority?: 'low' | 'medium' | 'high';
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          project_id?: string;
          status?: 'todo' | 'in_progress' | 'done';
          created_at?: string;
          updated_at?: string;
          business_value?: string | null;
          priority?: 'low' | 'medium' | 'high';
        };
      };
      user_stories: {
        Row: {
          id: string;
          title: string;
          description: string;
          epic_id: string;
          project_id: string;
          status: 'todo' | 'in_progress' | 'done';
          created_at: string;
          updated_at: string;
          acceptance_criteria: string[] | null;
          priority: 'low' | 'medium' | 'high';
          story_points: number | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          epic_id: string;
          project_id: string;
          status?: 'todo' | 'in_progress' | 'done';
          created_at?: string;
          updated_at?: string;
          acceptance_criteria?: string[] | null;
          priority?: 'low' | 'medium' | 'high';
          story_points?: number | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          epic_id?: string;
          project_id?: string;
          status?: 'todo' | 'in_progress' | 'done';
          created_at?: string;
          updated_at?: string;
          acceptance_criteria?: string[] | null;
          priority?: 'low' | 'medium' | 'high';
          story_points?: number | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          story_id: string;
          project_id: string;
          assigned_to: string | null;
          status: 'todo' | 'in_progress' | 'done';
          created_at: string;
          updated_at: string;
          priority: 'low' | 'medium' | 'high';
          estimated_hours: number | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          story_id: string;
          project_id: string;
          assigned_to?: string | null;
          status?: 'todo' | 'in_progress' | 'done';
          created_at?: string;
          updated_at?: string;
          priority?: 'low' | 'medium' | 'high';
          estimated_hours?: number | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          story_id?: string;
          project_id?: string;
          assigned_to?: string | null;
          status?: 'todo' | 'in_progress' | 'done';
          created_at?: string;
          updated_at?: string;
          priority?: 'low' | 'medium' | 'high';
          estimated_hours?: number | null;
        };
      };
      token_ledger: {
        Row: {
          id: string;
          user_id: string;
          tokens_deducted: number;
          artifact_type: 'epic' | 'user_story' | 'task';
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tokens_deducted: number;
          artifact_type: 'epic' | 'user_story' | 'task';
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tokens_deducted?: number;
          artifact_type?: 'epic' | 'user_story' | 'task';
          note?: string | null;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          status: 'active' | 'inactive' | 'cancelled' | 'past_due';
          subscription_id: string;
          current_period_end: string;
          tier: 'freemium' | 'basic' | 'professional' | 'advanced' | 'enterprise';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: 'active' | 'inactive' | 'cancelled' | 'past_due';
          subscription_id: string;
          current_period_end: string;
          tier?: 'freemium' | 'basic' | 'professional' | 'advanced' | 'enterprise';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: 'active' | 'inactive' | 'cancelled' | 'past_due';
          subscription_id?: string;
          current_period_end?: string;
          tier?: 'freemium' | 'basic' | 'professional' | 'advanced' | 'enterprise';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 