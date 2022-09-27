import { Contact, ContactUpdate, db } from './db'

export const updateContact = async (props: ContactUpdate) => {
  const model = await db.updateContact(props)
  return model.attrs as Contact
}

export default updateContact
