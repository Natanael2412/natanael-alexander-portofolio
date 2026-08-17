import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import NavigationPill from "@/components/global/NavigationPill";
import PageTransition from "@/components/global/PageTransition";
import CustomCursor from "@/components/global/CustomCursor";

import LenisProvider from "@/components/global/LenisProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://natanaelalexander.com"), // Change this to your actual production domain
  title: "Natanael Alexander — Creative Digital Architect",
  description:
    "Portfolio of Natanael Alexander — Creative Digital Architect.",
  keywords: ["portfolio", "creative developer", "ui/ux", "web design", "natanael alexander"],
  alternates: {
    canonical: "/", // Consolidates all /about, /work pseudo-routes back to the main SEO authority
  },
  openGraph: {
    title: "Natanael Alexander",
    description: "Creative Digital Architect",
    type: "website",
    url: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body>
        <LenisProvider>
          <div className="noise-overlay" aria-hidden="true" />
          <CustomCursor />
          <NavigationPill />
          <PageTransition>
            {children}
          </PageTransition>
        </LenisProvider>
      </body>
    </html>
  );
}
