export type { Contact, ContactUpdate } from './db'
import type { Contact, ContactUpdate } from './db'
import { db } from './db'

export const fetchContacts = async () => {
  const contacts = await db.getContacts()
  return contacts.models.map((m) => m.attrs as Contact)
}

export const updateContact = async (props: ContactUpdate) => {
  const model = await db.updateContact(props)
  return model.attrs as Contact
}

export default {
  fetchContacts,
  updateContact,
}
