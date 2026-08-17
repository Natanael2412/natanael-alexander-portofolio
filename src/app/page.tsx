import HeroSection from "@/components/sections/HeroSection";
import AboutVertical from "@/components/sections/AboutVertical";
import SelectedWork from "@/components/sections/SelectedWork";
import ContactFooter from "@/components/sections/ContactFooter";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutVertical />
      <SelectedWork />
      <ContactFooter />
    </>
  );
}
