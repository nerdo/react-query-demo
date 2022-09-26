import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import fetchContacts from './data/fetchContacts'

type Contact = Awaited<ReturnType<typeof fetchContacts>>[number]

interface AddressBookEntryProps {
  queryKey: QueryKey
  contact: Contact
}

const AddressBookEntry = (props: AddressBookEntryProps) => {
  const { queryKey, contact } = props

  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (incoming: Partial<Contact>) => {
      contact.name = incoming.name!
    },
    {
      onSuccess() {},
    }
  )
  const updateName = (c: Contact) => {
    console.debug('updating contact', queryKey, c)
    // queryClient.setQueryData(queryKey, { ...c, name: 'George Castanza' })
    mutation.mutate({ name: 'George Castanza' })
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
              <img src={contact.avatarUrl} alt={contact.name} width="32" height="32" className="rounded-full" />
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
            Update Name
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
    <div className="grid grid-cols-5 gap-10 p-10">
      {contacts.map((contact) => (
        <AddressBookEntry key={contact.id} queryKey={['contacts', { id: contact.id }]} contact={contact} />
      ))}
    </div>
  )
}

export default AddressBook
