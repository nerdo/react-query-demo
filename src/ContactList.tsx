import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchContacts, updateContact, Contact, ContactUpdate } from './api'

interface AddressBookEntryProps {
  contact: Contact
  onUpdateContact?: (contact: Contact) => unknown
}

const ContactCard = (props: AddressBookEntryProps) => {
  const { contact, onUpdateContact } = props

  const mutation = useMutation(
    async (incoming: ContactUpdate) => {
      return updateContact(incoming)
    },
    {
      onSuccess: (c) => {
        onUpdateContact?.(c)
      },
    }
  )
  const updateName = (c: Contact) => {
    mutation.mutate({ id: c.id, name: 'George Castanza', address: { zip: '12345' } })
  }

  return (
    <div key={contact.id} className="card bg-neutral">
      <div className="gap-2 card-body">
        <div className="flex justify-center">
          <div className="badge badge-sm">ID {contact.id}</div>
        </div>

        <div className="flex items-start card-title align-baseline">
          {contact.avatarUrl && (
            <div className="flex-grow-0">
              {/* Use first and last initial in avatar alt tag */}
              <img
                src={contact.avatarUrl}
                alt={contact.name
                  .split(/\s+/)
                  .filter((_, i, array) => i === 0 || i === array.length - 1)
                  .map((name) => name[0])
                  .join('')}
                width="32"
                height="32"
                className="rounded-full"
              />
            </div>
          )}
          <h3 className="flex-1">{contact.name}</h3>
        </div>

        {contact.address && (
          <address className="grid grid-cols-1 gap-2">
            {contact.email && <div>{contact.email}</div>}
            <div>
              <div>{contact.address.street}</div>
              <div>
                {contact.address.city}, {contact.address.state} {contact.address.zip}
              </div>
            </div>
          </address>
        )}

        <div className="flex-1">&nbsp;</div>

        <div className="card-actions self-center">
          <button className="btn btn-default" onClick={() => updateName(contact)}>
            Test Update
          </button>
        </div>
      </div>
    </div>
  )
}

const ContactList = () => {
  const contactQuery = useQuery(['contacts'], fetchContacts)
  const queryClient = useQueryClient()

  if (contactQuery.status === 'loading') {
    return <div>Loading...</div>
  }

  if (contactQuery.status === 'error') {
    return <div>Error!</div>
  }

  const contacts = contactQuery.data

  return (
    <div className="grid grid-cols-3 gap-10 p-10">
      {contacts.map((contact, i) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onUpdateContact={(contact) => {
            queryClient.setQueryData<Contact[]>(['contacts'], (oldData) => {
              const oldContacts = oldData || []
              const contactsBeforeCurrent = oldContacts.slice(0, Math.min(oldContacts.length - 1, i))
              const contactsAfterCurrent = oldContacts.slice(Math.min(oldContacts.length - 1, i + 1), oldContacts.length - 1)
              const newContacts = contactsBeforeCurrent.concat(contact, contactsAfterCurrent)
              return newContacts
            })
          }}
        />
      ))}
    </div>
  )
}

export default ContactList
