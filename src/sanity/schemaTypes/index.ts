import { type SchemaTypeDefinition } from 'sanity'
import portfolio from './portfolio'
import service from './service'
import testimonial from './testimonial'
import dicas from './dicas' 

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    portfolio, 
    service, 
    testimonial, 
    dicas 
  ],
}