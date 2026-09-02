import { Metadata } from "next";
import InfiniteArchiveGrid from "@/components/sections/InfiniteArchiveGrid";
import { supabase, Project } from "@/lib/supabase";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Archive — Natanael Alexander",
  description: "Complete archive of selected works.",
};

export default async function WorkPage() {
  const { data, error } = await supabase
    .from('projects')
    .select('slug, title, description, client, role, year, hero_image_url, tech_stack')
    .eq('is_personal_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase Error:", error);
  } else {
    console.log("Fetched projects count:", data?.length);
  }

  const projects = (data || []) as Partial<Project>[] as Project[];

  return (
    <main className="bg-[#f5f5f5] min-h-screen">
      <InfiniteArchiveGrid projects={projects} />
    </main>
  );
}
