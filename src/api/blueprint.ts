export type { Contact, ContactUpdate } from '../db/entities'
import type { ContactUpdate } from '../db/entities'
import { memorydb } from '../db/memory'

export const blueprint = {
  getContacts: async () => memorydb.schema.contact.getAll(),

  pageContacts: async (settings: { cursor: number; limit: number }) => {
    const { cursor, limit } = settings

    const cursorEnd = cursor + limit

    const slice = memorydb.schema.contact.find(
      (_model, context) => context.index < cursorEnd,
      (context) => context.results.length === limit,
      { startingIndex: cursor }
    )
    const nextCursor = cursor + slice.length < memorydb.schema.contact.count() ? cursor + slice.length : void 0

    return {
      data: slice,
      nextCursor,
    }
  },

  updateContact: async (props: ContactUpdate) => {
    const [contact] = memorydb.schema.contact.findById(props.id)

    if (!contact) throw new Error(`Contact #${props.id} not found.`)

    const emptyAddress = {
      zip: '',
      city: '',
      state: '',
      street: '',
    }

    const address = props.address
      ? {
          ...emptyAddress,
          ...(contact.address || {}),
          ...props.address,
        }
      : contact.address

    const update = {
      ...contact,
      ...props,
      address,
    }

    const [newContact] = memorydb.schema.contact.save(update)

    return newContact
  },
}

export default blueprint
