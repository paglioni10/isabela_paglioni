import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import SocialButtons from "../components/SocialButtons";

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
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#FFF5F7] text-gray-900`}>
        <Header />
        
        <main className="min-h-screen">
          {children}
        </main>

        <SocialButtons />
        
        {/* Opcional: Script para garantir que o scroll suave funcione em todos os browsers */}
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                  e.preventDefault();
                  document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                  });
                });
              });
            `
          }}
        />
      </body>
    </html>
  );
}