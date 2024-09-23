import { type SchemaTypeDefinition } from 'sanity'
import user from './user'
import interview from './interview'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user, interview],
}
