import { SITE_CONTENT } from "../constants/content";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-pink-100 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          
          <div className="max-w-md">
            <h3 className="text-2xl font-bold text-[#DB2777] mb-6">
              {SITE_CONTENT.brand.name}
            </h3>
            <p className="text-[#4B5563]">
              Transformando espaços e renovando vidas através da organização personalizada em Florianópolis e região.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-6 text-lg">Contato</h4>
            <p className="text-[#4B5563] mb-4">Florianópolis - SC</p>
            <a 
              href={SITE_CONTENT.hero.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#DB2777] text-white px-6 py-3 rounded-full font-bold hover:bg-[#b91d63] transition-all shadow-lg"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-pink-50 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} {SITE_CONTENT.brand.name}. Todos os direitos reservados. Produzido por Nicolas Paglioni.
          </p>
        </div>
      </div>
    </footer>
  );
}