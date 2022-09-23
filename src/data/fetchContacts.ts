import { Contact, db} from './db'

export const fetchContacts = async () => {
  const contacts = await db.fetchContacts()
  return contacts.models as any as Contact[]
}

export default fetchContacts
