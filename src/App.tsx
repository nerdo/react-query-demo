import { useEffect, useState } from 'react'
import fetchContacts from './data/fetchContacts'

function App() {
  const [contacts, setContacts] = useState<Awaited<ReturnType<typeof fetchContacts>>>([])

  useEffect(() => {
    ;(async () => {
      setContacts(await fetchContacts())
    })()
  })

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

export default App
