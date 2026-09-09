import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import "../globals.css";
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
  metadataBase: new URL("https://natanael.anugerahventures.com/"),
  title: "Natanael Alexander — Creative Digital Architect",
  description:
    "Portfolio of Natanael Alexander — Creative Digital Architect.",
  keywords: ["portfolio", "creative developer", "ui/ux", "web design", "natanael alexander"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Natanael Alexander",
    description: "Creative Digital Architect",
    type: "website",
    url: "/",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="overflow-x-hidden w-full">
        <NextIntlClientProvider messages={messages}>
          <LenisProvider>
            <div className="noise-overlay" aria-hidden="true" />
            <CustomCursor />
            <NavigationPill />
            <PageTransition>
              {children}
            </PageTransition>
          </LenisProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ProfilePage",
                "mainEntity": {
                  "@type": "Person",
                  "name": "Natanael Alexander",
                  "jobTitle": ["Creative Digital Architect", "Production Lead", "Technical Engineer"],
                  "url": "https://natanael.anugerahventures.com",
                }
              }),
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
