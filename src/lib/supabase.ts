import { createClient } from '@supabase/supabase-js';

export interface Project {
  id: string;
  slug: string;
  title: string;
  year: number | null;
  description: string | null;
  hero_image_url: string | null;
  gallery_urls: string[] | null;
  is_av_published: boolean;
  is_personal_published: boolean;
  is_av_featured: boolean;
  is_personal_featured: boolean;
  project_status: 'public' | 'nda' | 'concept';
  sort_order: number;
  client: string | null;
  role: string | null;
  tech_stack: string[] | null; 
  live_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_html: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  reading_time: number | null;
  tags: string[] | null;
  is_av_published: boolean;
  is_personal_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: string;
  name: string;
  created_at?: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Singleton instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
