import { Contact, ContactUpdate, db } from './db'

export const updateContact = async (props: ContactUpdate) => {
  return db.updateContact(props) as any as Contact
}

export default updateContact
