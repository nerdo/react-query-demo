import { useQuery } from '@tanstack/react-query'
import fetchContacts from './data/fetchContacts'

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
      {contacts.map((c) => (
        <div key={c.id} className="card bg-neutral">
          <div className="gap-2 card-body">
            <div className="flex justify-center">
              <div className="badge badge-sm">ID {c.id}</div>
            </div>

            <div className="flex items-start card-title align-baseline">
              {c.avatarUrl && (
                <div className="flex-grow-0">
                  <img src={c.avatarUrl} alt={c.name} width="32" height="32" className="rounded-full" />
                </div>
              )}
              <h3 className="flex-1">{c.name}</h3>
            </div>

            {c.address && (
              <address className="grid grid-cols-1 gap-2">
                {c.email && <div>{c.email}</div>}
                <div>
                  <div>{c.address.street}</div>
                  <div>
                    {c.address.city}, {c.address.state} {c.address.zip}
                  </div>
                </div>
              </address>
            )}

            <div className="flex-1">&nbsp;</div>

            <div className="card-actions self-center">
              <button className="btn btn-default">Update Name</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AddressBook
