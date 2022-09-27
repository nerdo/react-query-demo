import { createServer, Model } from 'miragejs'
import { ModelDefinition } from 'miragejs/-types'
import { z } from 'zod'
import { faker } from '@faker-js/faker'

const NUM_CONTACTS = 75

// MirageJS doesn't have first-class TS support, but this gets types working...
// https://github.com/miragejs/miragejs/issues/460#issuecomment-733123712

const zContact = z.object({
  name: z.string().min(1),
  email: z.string().email().min(5).optional(),
  avatarUrl: z.string().url().optional(),
  address: z
    .object({
      street: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(5).max(2),
      zip: z.string().min(5).max(5).regex(/\d{5}/, { message: 'Zip code can only contain numbers' }),
    })
    .optional(),
})
export type Contact = { id: number } & z.infer<typeof zContact>

export type ContactUpdate = Required<Pick<Contact, 'id'>> & { address?: Partial<Contact['address']> } & Partial<Omit<Contact, 'address'>>

const ContactModel: ModelDefinition<Contact> = Model.extend({})

const server = createServer({
  models: {
    contact: ContactModel,
  },

  seeds(server) {
    // Make the fake data deterministic with a fixed seed
    faker.seed(195939218)

    for (let i = 0; i < NUM_CONTACTS; i++) {
      const name = faker.name.fullName()
      const avatarUrl = i % 9 !== 0 ? faker.internet.avatar() : void 0
      const address =
        i % 8 !== 0
          ? { street: faker.address.streetAddress(), city: faker.address.city(), state: faker.address.stateAbbr(), zip: faker.address.zipCode() }
          : void 0
      const email = i % 7 === 0 ? faker.internet.email() : void 0

      const contact = server.create('contact')
      contact.update({ name, email, avatarUrl, address })
    }
  },
})

export const db = {
  getContacts: async () => {
    return server.schema.all('contact')
  },

  pageContacts: async (settings: { cursor: number; limit: number }) => {
    const { cursor, limit } = settings

    const collection = server.schema.all('contact')
    const slice = collection.slice(cursor, cursor + limit)
    const nextCursor = cursor + slice.length < collection.length ? cursor + slice.length : void 0

    return {
      slice,
      nextCursor,
    }
  },

  updateContact: async (props: ContactUpdate) => {
    const contact = server.schema.findBy('contact', { id: `${props.id}` })

    if (!contact) throw new Error(`Contact #${props.id} not found.`)

    contact.update({
      ...props,
      address: {
        ...(contact.attrs as Contact).address,
        ...(props.address || {}),
      },
    })

    return contact
  },
}

export default db
