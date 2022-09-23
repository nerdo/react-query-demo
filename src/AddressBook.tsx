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
    <div className="App" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
      {contacts.map((c) => (
        <div key={c.id} style={{ margin: '20px 0' }}>
          <div>ID: {c.id}</div>

          <div style={{ marginTop: '10px' }}>Name: {c.name}</div>

          {c.address && (
            <div style={{ marginTop: '10px' }}>
              <div>Address</div>
              <div>{c.address.street}</div>
              <div>
                {c.address.city}, {c.address.state} {c.address.zip}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default AddressBook
