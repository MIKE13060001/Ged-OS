export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      folders: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string | null;
          created_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          original_name: string | null;
          mime_type: string;
          size: number;
          folder_id: string | null;
          ocr_status: "pending" | "processing" | "completed" | "error";
          ocr_text: string | null;
          tags: string[];
          version: number;
          root_id: string | null;
          storage_path: string | null;
          preview_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          original_name?: string | null;
          mime_type: string;
          size: number;
          folder_id?: string | null;
          ocr_status?: "pending" | "processing" | "completed" | "error";
          ocr_text?: string | null;
          tags?: string[];
          version?: number;
          root_id?: string | null;
          storage_path?: string | null;
          preview_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          original_name?: string | null;
          mime_type?: string;
          size?: number;
          folder_id?: string | null;
          ocr_status?: "pending" | "processing" | "completed" | "error";
          ocr_text?: string | null;
          tags?: string[];
          version?: number;
          root_id?: string | null;
          storage_path?: string | null;
          preview_url?: string | null;
          updated_at?: string;
        };
      };
      audit_events: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          detail: string;
          status: "success" | "warning" | "error";
          user_label: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          detail: string;
          status: "success" | "warning" | "error";
          user_label?: string;
          created_at?: string;
        };
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
