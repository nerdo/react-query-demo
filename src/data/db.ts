import { createServer, Model } from 'miragejs'
import { ModelDefinition } from 'miragejs/-types'
import { z } from 'zod'
import { faker } from '@faker-js/faker'

// MirageJS doesn't have first-class TS support, but this gets types working...
// https://github.com/miragejs/miragejs/issues/460#issuecomment-733123712

const zContact = z.object({
  name: z.string().min(1),
  email: z.string().email().min(5).optional(),
  address: z
    .object({
      street: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(5).max(2),
      zip: z.string().min(5).max(5).regex(/\d{5}/, { message: 'Zip code can only contain numbers' }),
    })
    .optional(),
})
export type Contact = { id: any } & z.infer<typeof zContact>

const ContactModel: ModelDefinition<Contact> = Model.extend({})

const server = createServer({
  models: {
    contact: ContactModel,
  },

  seeds(server) {
    // Make the fake data deterministic with a fixed seed
    faker.seed(195939218)

    for (let i = 0; i < 500; i++) {
      const name = faker.name.fullName()
      const address =
        i % 3 === 0
          ? { street: faker.address.streetAddress(), city: faker.address.city(), state: faker.address.stateAbbr(), zip: faker.address.zipCode() }
          : void 0
      const email = i % 7 === 0 ? faker.internet.email() : void 0

      server.create('contact', { name, email, address })
    }
  },
})

export const db = {
  fetchContacts: async () => {
    return server.schema.all('contact')
  },
}

export default db
