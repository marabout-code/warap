export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          website: string | null;
          role: "admin" | "employer" | "jobseeker" | "agent";
          phone: string | null;
          pin_hash: string | null;
          pin_lookup: string | null;
          supabase_auth_secret: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          role?: "admin" | "employer" | "jobseeker" | "agent";
          phone?: string | null;
          pin_hash?: string | null;
          pin_lookup?: string | null;
          supabase_auth_secret?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          role?: "admin" | "employer" | "jobseeker" | "agent";
          phone?: string | null;
          pin_hash?: string | null;
          pin_lookup?: string | null;
          supabase_auth_secret?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          logo_url: string | null;
          website: string | null;
          location: string | null;
          industry: string | null;
          size: string | null;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          location?: string | null;
          industry?: string | null;
          size?: string | null;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          location?: string | null;
          industry?: string | null;
          size?: string | null;
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          description: string;
          company: string;
          location: string;
          salary_min: number | null;
          salary_max: number | null;
          employment_type: "full-time" | "part-time" | "contract" | "internship" | "remote";
          status: "open" | "closed" | "draft";
          posted_by: string;
          company_id: string | null;
          contact_phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          company: string;
          location: string;
          salary_min?: number | null;
          salary_max?: number | null;
          employment_type: "full-time" | "part-time" | "contract" | "internship" | "remote";
          status?: "open" | "closed" | "draft";
          posted_by: string;
          company_id?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          company?: string;
          location?: string;
          salary_min?: number | null;
          salary_max?: number | null;
          employment_type?: "full-time" | "part-time" | "contract" | "internship" | "remote";
          status?: "open" | "closed" | "draft";
          posted_by?: string;
          company_id?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          priority: "low" | "medium" | "high" | "urgent";
          status: "todo" | "in_progress" | "review" | "done";
          due_date: string | null;
          job_id: string;
          assigned_to: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          priority?: "low" | "medium" | "high" | "urgent";
          status?: "todo" | "in_progress" | "review" | "done";
          due_date?: string | null;
          job_id: string;
          assigned_to?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          priority?: "low" | "medium" | "high" | "urgent";
          status?: "todo" | "in_progress" | "review" | "done";
          due_date?: string | null;
          job_id?: string;
          assigned_to?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          user_id: string;
          cover_letter: string | null;
          resume_url: string | null;
          status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
          contact_phone: string | null;
          documents: { name: string; type: string; url: string }[];
          verification_status: "unverified" | "in_review" | "verified" | "rejected";
          verified_by: string | null;
          verification_notes: string | null;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          user_id: string;
          cover_letter?: string | null;
          resume_url?: string | null;
          status?: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
          contact_phone?: string | null;
          documents?: { name: string; type: string; url: string }[];
          verification_status?: "unverified" | "in_review" | "verified" | "rejected";
          verified_by?: string | null;
          verification_notes?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          user_id?: string;
          cover_letter?: string | null;
          resume_url?: string | null;
          status?: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
          contact_phone?: string | null;
          documents?: { name: string; type: string; url: string }[];
          verification_status?: "unverified" | "in_review" | "verified" | "rejected";
          verified_by?: string | null;
          verification_notes?: string | null;
          verified_at?: string | null;
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
      employment_type: "full-time" | "part-time" | "contract" | "internship" | "remote";
      job_status: "open" | "closed" | "draft";
      task_priority: "low" | "medium" | "high" | "urgent";
      task_status: "todo" | "in_progress" | "review" | "done";
      application_status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
      user_role: "admin" | "employer" | "jobseeker" | "agent";
      verification_status: "unverified" | "in_review" | "verified" | "rejected";
    };
  };
}
