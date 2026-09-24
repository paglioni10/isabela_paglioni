import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import SocialButtons from "../components/SocialButtons";
import HideOnAdmin from "../components/HideOnAdmin";
import Script from "next/script"; // Importação necessária para o Clarity

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair" 
});

export const metadata: Metadata = {
  title: "Isabela Paglioni | Personal Organizer",
  description: "Transformando lares em espaços de harmonia e bem-estar através da organização estratégica.",
  keywords: ["Personal Organizer", "Organização Residencial", "Organização Baby", "Mudanças", "Isabela Paglioni"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        {/* Microsoft Clarity Tracking Script */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wo2izteoc9");
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#FFF5F7] text-gray-900`}>
        <HideOnAdmin>
          <Header />
        </HideOnAdmin>
        
        <main className="min-h-screen">
          {children}
        </main>

        <HideOnAdmin>
          <SocialButtons />
        </HideOnAdmin>
        
      </body>
    </html>
  );
}