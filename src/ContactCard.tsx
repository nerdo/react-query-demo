import { blueprint } from './api/blueprint'
import { Contact, ContactUpdate } from './api/blueprint'
import { useMutation } from '@tanstack/react-query'

export interface ContactCardProps {
  api: Pick<typeof blueprint, 'updateContact'>
  contact: Contact
  onUpdateContact?: (contact: Contact) => unknown
}

export const ContactCard = (props: ContactCardProps) => {
  const { api, contact, onUpdateContact } = props

  const mutation = useMutation(
    async (incoming: ContactUpdate) => {
      return api.updateContact(incoming)
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

        {(contact.email || contact.address) && (
          <address className="grid grid-cols-1 gap-2">
            {contact.email && <div>{contact.email}</div>}
            {contact.address && Object.keys(contact.address).length && (
              <div>
                <div>{contact.address.street}</div>
                <div>
                  {contact.address.city}, {contact.address.state} {contact.address.zip}
                </div>
              </div>
            )}
          </address>
        )}

        <div className="flex-1">&nbsp;</div>

        {onUpdateContact && (
          <div className="card-actions self-center">
            <button className="btn btn-default" onClick={() => updateName(contact)}>
              Test Update
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactCard
