import { notFound } from "next/navigation";
import { supabase, Project } from "@/lib/supabase";
import ProjectClient from "./ProjectClient";

export const revalidate = 60; // ISR revalidation

export async function generateStaticParams() {
  const { data: projects } = await supabase
    .from("projects")
    .select("slug")
    .eq("is_personal_published", true);

  if (!projects) return [];

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!project) {
    notFound();
  }

  return <ProjectClient project={project as Project} />;
}
