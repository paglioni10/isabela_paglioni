import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import SocialButtons from "../components/SocialButtons";
import HideOnAdmin from "../components/HideOnAdmin";
import WhatsAppTracking from "../components/WhatsAppTracking";
import CookieConsent from "../components/CookieConsent";
import { SITE_CONTENT } from "../constants/content";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair" 
});

const title = "Personal Organizer em Palhoça e Florianópolis | Mudanças – Isa Paglioni";
const description = "Personal organizer especialista em mudanças em Palhoça e Grande Florianópolis. Embalo, desembalo e organizo a casa inteira, fácil de manter.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONTENT.url),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Isa Paglioni Personal Organizer",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#FFF5F7] text-gray-900`}>
        <HideOnAdmin>
          <Header />
        </HideOnAdmin>
        
        <main className="min-h-screen">
          {children}
        </main>

        <HideOnAdmin>
          <SocialButtons />
          <WhatsAppTracking />
          {/* O Microsoft Clarity só carrega depois do consentimento */}
          <CookieConsent />
        </HideOnAdmin>
        
      </body>
    </html>
  );
}