import { Contact, db } from './db'

export const fetchContacts = async () => {
  const contacts = await db.fetchContacts()
  return contacts.models.map((m) => m.attrs as Contact)
}

export default fetchContacts
