import { Contact, ContactUpdate, db } from './db'

export const updateContact = async (id: Contact['id'], props: ContactUpdate) => {
  return db.updateContact(id, props)
}

export default updateContact
