import { contact } from './entities'
import { makeMemoryDB } from '@nerdo/memorydb'
import { faker } from '@faker-js/faker'

const NUM_CONTACTS = 100

export const memorydb = makeMemoryDB({
  schema: {
    contact,
  },

  seeder(db) {
    // Make the fake data deterministic with a fixed seed
    faker.seed(195939218)

    for (let i = 0; i < NUM_CONTACTS; i++) {
      const id = faker.datatype.uuid()
      const name = faker.name.fullName()
      const avatarUrl = i % 9 !== 0 ? faker.internet.avatar() : void 0
      const address =
        i % 8 !== 0
          ? { street: faker.address.streetAddress(), city: faker.address.city(), state: faker.address.stateAbbr(), zip: faker.address.zipCode() }
          : void 0
      const email = i % 7 === 0 ? faker.internet.email() : void 0

      db.schema.contact.save({ id, name, email, avatarUrl, address })
    }
  },
})

// exposing the memory db for debugging
if (window) {
  // @ts-ignore
  window.memorydb = memorydb
}

export default memorydb
