import HeroSection from "@/components/sections/HeroSection";
import AboutVertical from "@/components/sections/AboutVertical";
import SelectedWork from "@/components/sections/SelectedWork";
import ContactFooter from "@/components/sections/ContactFooter";
import { supabase, Project } from "@/lib/supabase";

export const revalidate = 1800; // Cache for 30 minutes

export default async function Home() {
  const { data, error } = await supabase
    .from('projects')
    .select('slug, title, description, client, role, year, hero_image_url, tech_stack')
    .eq('is_personal_published', true)
    .eq('is_personal_featured', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase Error (Home):", error.message || error, JSON.stringify(error, Object.getOwnPropertyNames(error)));
  }

  // Fetch counts for stats section
  const { count: projectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });
    
  const { count: articlesCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true });

  const projects = (data || []) as Partial<Project>[] as Project[];

  return (
    <>
      <HeroSection />
      <AboutVertical projectsCount={projectsCount || 0} articlesCount={articlesCount || 0} />
      <SelectedWork projects={projects} />
      
      {/* Credentials Marquee Section (Placeholder) */}
      <section className="w-full py-24 bg-black text-white flex flex-col justify-center border-t border-white/20 relative z-20 overflow-hidden">
        {/* Watermark Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <span className="font-playfair text-6xl md:text-[120px] font-black uppercase tracking-tighter whitespace-nowrap -rotate-12 opacity-20 text-white select-none">
            IN DEVELOPMENT
          </span>
        </div>

        <div className="w-full text-center opacity-40 relative z-10 filter blur-[2px] transition-all duration-500 hover:blur-none space-y-16">
          <div className="px-6">
            <h2 className="font-playfair text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">CREDENTIALS</h2>
            <p className="font-montserrat text-sm tracking-[0.2em] leading-relaxed max-w-2xl mx-auto text-white/60">
              PROFESSIONAL ACCREDITATIONS
            </p>
          </div>

          {/* Marquee Track */}
          <div className="w-full overflow-hidden flex select-none">
            <div className="animate-marquee flex gap-8 whitespace-nowrap items-center px-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-8 items-center">
                  
                  {/* Certificate Card 1 */}
                  <div className="relative w-[360px] h-[260px] bg-white/5 border border-white/20 p-8 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-default text-center group">
                    <div className="absolute inset-2 border border-white/10 pointer-events-none"></div>
                    <span className="text-[10px] font-montserrat tracking-[0.3em] text-white/40 mb-4 uppercase">2026</span>
                    <h3 className="font-playfair text-xl font-bold mb-3 whitespace-normal leading-tight group-hover:scale-105 transition-transform duration-500">GOOGLE CLOUD ARCHITECT</h3>
                    <div className="w-8 h-[1px] bg-white/30 mb-3"></div>
                    <p className="text-[10px] font-montserrat opacity-60 tracking-[0.2em] uppercase">Professional Certification</p>
                  </div>
                  
                  {/* Certificate Card 2 */}
                  <div className="relative w-[360px] h-[260px] bg-white/5 border border-white/20 p-8 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-default text-center group">
                    <div className="absolute inset-2 border border-white/10 pointer-events-none"></div>
                    <span className="text-[10px] font-montserrat tracking-[0.3em] text-white/40 mb-4 uppercase">2025</span>
                    <h3 className="font-playfair text-xl font-bold mb-3 whitespace-normal leading-tight group-hover:scale-105 transition-transform duration-500">AWS SOLUTIONS EXPERT</h3>
                    <div className="w-8 h-[1px] bg-white/30 mb-3"></div>
                    <p className="text-[10px] font-montserrat opacity-60 tracking-[0.2em] uppercase">Amazon Web Services</p>
                  </div>
                  
                  {/* Certificate Card 3 */}
                  <div className="relative w-[360px] h-[260px] bg-white/5 border border-white/20 p-8 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-default text-center group">
                    <div className="absolute inset-2 border border-white/10 pointer-events-none"></div>
                    <span className="text-[10px] font-montserrat tracking-[0.3em] text-white/40 mb-4 uppercase">2024</span>
                    <h3 className="font-playfair text-xl font-bold mb-3 whitespace-normal leading-tight group-hover:scale-105 transition-transform duration-500">CISA CERTIFIED</h3>
                    <div className="w-8 h-[1px] bg-white/30 mb-3"></div>
                    <p className="text-[10px] font-montserrat opacity-60 tracking-[0.2em] uppercase">ISACA Global</p>
                  </div>

                  {/* Certificate Card 4 */}
                  <div className="relative w-[360px] h-[260px] bg-white/5 border border-white/20 p-8 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-default text-center group">
                    <div className="absolute inset-2 border border-white/10 pointer-events-none"></div>
                    <span className="text-[10px] font-montserrat tracking-[0.3em] text-white/40 mb-4 uppercase">2023</span>
                    <h3 className="font-playfair text-xl font-bold mb-3 whitespace-normal leading-tight group-hover:scale-105 transition-transform duration-500">SYSTEM ARCHITECTURE</h3>
                    <div className="w-8 h-[1px] bg-white/30 mb-3"></div>
                    <p className="text-[10px] font-montserrat opacity-60 tracking-[0.2em] uppercase">Tech Institute</p>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Insights / Articles Section (Placeholder) */}
      <section className="w-full min-h-[70vh] py-24 flex flex-col justify-center items-center bg-[var(--chalk)] relative z-20 text-center px-6 overflow-hidden">
        {/* Watermark Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <span className="font-playfair text-6xl md:text-[120px] font-black uppercase tracking-tighter whitespace-nowrap -rotate-12 opacity-[0.08] text-black select-none">
            IN DEVELOPMENT
          </span>
        </div>

        <div className="w-full max-w-2xl mx-auto opacity-40 relative z-10 filter blur-sm transition-all duration-500 hover:blur-none">
          <span className="block font-montserrat text-xs font-bold tracking-[0.2em] uppercase mb-4">ARTICLES / INSIGHTS</span>
          <h2 className="font-playfair text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">COMING SOON</h2>
          <p className="font-montserrat text-sm tracking-[0.2em] leading-relaxed">
            Ruang di mana saya membagikan perspektif teknis, studi kasus arsitektur, dan pemikiran bisnis seputar rekayasa perangkat lunak.
          </p>
          
          <div className="mt-12 w-full border border-gray-300 rounded-lg p-8 bg-[#f9f9f9] flex flex-col items-center shadow-inner">
             <div className="w-12 h-12 rounded-full bg-gray-200 mb-6 animate-pulse"></div>
             <div className="w-3/4 h-3 bg-gray-200 mb-3 animate-pulse rounded"></div>
             <div className="w-1/2 h-3 bg-gray-200 mb-6 animate-pulse rounded"></div>
             <div className="w-full h-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </section>

      <ContactFooter />
    </>
  );
}
