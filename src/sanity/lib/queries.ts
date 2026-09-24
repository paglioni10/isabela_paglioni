import { groq } from 'next-sanity'

export const servicesQuery = groq`*[_type == "service"] | order(orderRank asc, title asc)`

export const testimonialsQuery = groq`*[_type == "testimonial"]`

export const portfolioQuery = groq`*[_type == "portfolio"] | order(orderRank asc, title asc) {
  title,
  category,
  "imageUrl": mainImage.asset->url
}`