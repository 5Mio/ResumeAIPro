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
            profiles: {
                Row: {
                    id: string
                    updated_at: string | null
                    username: string | null
                    full_name: string | null
                    avatar_url: string | null
                    website: string | null
                }
                Insert: {
                    id: string
                    updated_at?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    website?: string | null
                }
                Update: {
                    id?: string
                    updated_at?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    website?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            resumes: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    content: Json
                    template_id: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    title: string
                    content?: Json
                    template_id?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    content?: Json
                    template_id?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "resumes_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            student_resumes: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    title: string
                    user_id: string
                    content: Json
                    school_name: string | null
                    graduation_year: string | null
                    is_public: boolean | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    title: string
                    user_id: string
                    content?: Json
                    school_name?: string | null
                    graduation_year?: string | null
                    is_public?: boolean | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    title?: string
                    user_id?: string
                    content?: Json
                    school_name?: string | null
                    graduation_year?: string | null
                    is_public?: boolean | null
                }
                Relationships: [
                    {
                        foreignKeyName: "student_resumes_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            },
            cover_letters: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    content: string
                    job_title: string | null
                    company_name: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    title: string
                    content: string
                    job_title?: string | null
                    company_name?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    content?: string
                    job_title?: string | null
                    company_name?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "cover_letters_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            },
            admin_templates: {
                Row: {
                    id: string;
                    created_at: string;
                    updated_at: string;
                    name: string;
                    description: string | null;
                    template_id: string;
                    category: string;
                    target_audience: string;
                    source_file_url: string | null;
                    ai_provider: string;
                    generation_prompt: string | null;
                    generation_time_ms: number | null;
                    component_path: string;
                    component_code: string;
                    component_name: string;
                    preview_image_url: string | null;
                    status: string;
                    is_pro: boolean;
                    is_featured: boolean;
                    usage_count: number;
                    created_by: string;
                    version: number;
                    parent_template_id: string | null;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    name: string;
                    description?: string | null;
                    template_id: string;
                    category: string;
                    target_audience: string;
                    source_file_url?: string | null;
                    ai_provider: string;
                    generation_prompt?: string | null;
                    generation_time_ms?: number | null;
                    component_path: string;
                    component_code: string;
                    component_name: string;
                    preview_image_url?: string | null;
                    status?: string;
                    is_pro?: boolean;
                    is_featured?: boolean;
                    usage_count?: number;
                    created_by: string;
                    version?: number;
                    parent_template_id?: string | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    name?: string;
                    description?: string | null;
                    template_id?: string;
                    category?: string;
                    target_audience?: string;
                    source_file_url?: string | null;
                    ai_provider?: string;
                    generation_prompt?: string | null;
                    generation_time_ms?: number | null;
                    component_path?: string;
                    component_code?: string;
                    component_name?: string;
                    preview_image_url?: string | null;
                    status?: string;
                    is_pro?: boolean;
                    is_featured?: boolean;
                    usage_count?: number;
                    created_by?: string;
                    version?: number;
                    parent_template_id?: string | null;
                };
                Relationships: [];
            },
            template_generation_logs: {
                Row: {
                    id: string;
                    created_at: string;
                    template_id: string | null;
                    ai_provider: string;
                    success: boolean;
                    error_message: string | null;
                    execution_time_ms: number | null;
                    request_payload: Json | null;
                    response_payload: Json | null;
                    created_by: string;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    template_id?: string | null;
                    ai_provider: string;
                    success: boolean;
                    error_message?: string | null;
                    execution_time_ms?: number | null;
                    request_payload?: Json | null;
                    response_payload?: Json | null;
                    created_by: string;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    template_id?: string | null;
                    ai_provider?: string;
                    success?: boolean;
                    error_message?: string | null;
                    execution_time_ms?: number | null;
                    request_payload?: Json | null;
                    response_payload?: Json | null;
                    created_by?: string;
                };
                Relationships: [];
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
