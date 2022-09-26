import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Contact, ContactUpdate } from './data/db'
import fetchContacts from './data/fetchContacts'
import updateContact from './data/updateContact'

interface AddressBookEntryProps {
  contact: Contact
}

const AddressBookEntry = (props: AddressBookEntryProps) => {
  const { contact } = props

  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (incoming: ContactUpdate) => {
      return updateContact(incoming.id, incoming)
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['contacts'])
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

const AddressBook = () => {
  const contactQuery = useQuery(['contacts'], fetchContacts)

  if (contactQuery.status === 'loading') {
    return <div>Loading...</div>
  }

  if (contactQuery.status === 'error') {
    return <div>Error!</div>
  }

  const contacts = contactQuery.data

  return (
    <div className="grid grid-cols-3 gap-10 p-10">
      {contacts.map((contact) => (
        <AddressBookEntry key={contact.id} contact={contact} />
      ))}
    </div>
  )
}

export default AddressBook
