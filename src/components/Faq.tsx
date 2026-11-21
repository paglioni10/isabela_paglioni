import { ChevronDown } from 'lucide-react'
import { FAQ } from '../constants/faq'

export default function Faq() {
  return (
    <section id="duvidas" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-12 leading-[1.1] text-center text-balance">
          Dúvidas <span className="text-[#DB2777] italic">frequentes.</span>
        </h2>

        <div className="space-y-4">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-[24px] border border-pink-100 bg-[#FFF5F7] open:bg-white open:shadow-[0_8px_24px_rgba(219,39,119,0.08)] transition-shadow"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 md:px-8 md:py-6 font-serif text-xl font-bold text-gray-900 [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown
                  size={22}
                  className="shrink-0 text-[#DB2777] transition-transform duration-300 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="px-6 pb-6 md:px-8 md:pb-7 text-gray-600 text-lg leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
