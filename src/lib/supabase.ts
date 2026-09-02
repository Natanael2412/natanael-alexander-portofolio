import { createClient } from '@supabase/supabase-js';

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  client: string | null;
  role: string | null;
  year: number | null;
  live_url: string | null;
  hero_image_url: string | null; // URL from Cloudflare R2
  gallery_urls: string[] | null; // Array of URLs from Cloudflare R2
  tech_stack: string[] | null; 
  content_html: string | null; // Pure HTML string
  sort_order: number;
  is_personal_published: boolean;
  created_at?: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Singleton instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
