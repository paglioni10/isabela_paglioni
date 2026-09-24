'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { getYouTubeId } from '../sanity/lib/youtube'

// Mostra só a capa do vídeo e carrega o player do YouTube ao clicar.
// Cada player embutido pesa ~1 MB; com 10 vídeos na página isso deixava o site lento.
export default function YouTubeVideo({ url, title }: { url?: string; title: string }) {
  const [playing, setPlaying] = useState(false)
  const id = getYouTubeId(url)

  if (!id) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/70 italic text-sm">
        Vídeo indisponível
      </div>
    )
  }

  if (playing) {
    return (
      <iframe
        className="w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group/video relative w-full h-full block cursor-pointer"
      aria-label={`Assistir vídeo: ${title}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-16 h-16 rounded-full bg-white/95 text-[#DB2777] flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out group-hover/video:scale-110">
          <Play size={26} className="ml-1" fill="currentColor" />
        </span>
      </span>
    </button>
  )
}
