// Extrai o ID de um link do YouTube (watch, youtu.be, shorts, embed)
export function getYouTubeId(url?: string) {
  if (!url) return undefined
  const match = url.match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/)([\w-]{11})/)
  return match?.[1]
}

export function getYouTubeThumb(url?: string) {
  const id = getYouTubeId(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined
}
