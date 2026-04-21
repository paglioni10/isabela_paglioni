import { groq } from 'next-sanity'

export const servicesQuery = groq`*[_type == "service"] | order(title asc)`

export const testimonialsQuery = groq`*[_type == "testimonial"]`

export const portfolioQuery = groq`*[_type == "portfolio"] {
  title,
  category,
  "imageUrl": mainImage.asset->url
}`