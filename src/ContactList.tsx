import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { updateContact, Contact, ContactUpdate, pageContacts } from './api'

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

        {(contact.email || contact.address) && (
          <address className="grid grid-cols-1 gap-2">
            {contact.email && <div>{contact.email}</div>}
            {contact.address && (
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
  const contactQuery = useInfiniteQuery(['contacts'], ({ pageParam }) => pageContacts({ cursor: pageParam || 0, limit: 20 }), {
    getNextPageParam: (lastPage, _pages) => lastPage.nextCursor,
  })
  const queryClient = useQueryClient()
  type ContactQueryData = typeof contactQuery.data

  if (contactQuery.status === 'loading') {
    return <div>Loading...</div>
  }

  if (contactQuery.status === 'error') {
    return <div>Error!</div>
  }

  return (
    <div className="grid grid-cols-3 gap-10 p-10">
      {contactQuery.data.pages.map((page, p) => (
        <React.Fragment key={p}>
          {page.data.map((contact, i) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onUpdateContact={(contact) => {
                queryClient.setQueryData<ContactQueryData>(['contacts'], (oldData) => {
                  const newPages = [...(oldData?.pages || [])]
                  const newPageData = [...(newPages[p].data || [])]

                  newPageData.splice(i, 1, contact)
                  newPages[p] = {
                    ...newPages[p],
                    data: newPageData,
                  }

                  return {
                    pages: newPages,
                    pageParams: oldData?.pageParams || [],
                  }
                })
              }}
            />
          ))}
        </React.Fragment>
      ))}

      <div className="justify-self-center place-self-center">
        <button
          onClick={() => contactQuery.fetchNextPage()}
          disabled={!contactQuery.hasNextPage || contactQuery.isFetchingNextPage}
          className="btn btn-default"
        >
          {contactQuery.isFetchingNextPage ? 'Loading more...' : contactQuery.hasNextPage ? 'Load More' : 'No more!'}
        </button>
      </div>
      <div>{contactQuery.isFetching && contactQuery.isFetchingNextPage ? 'Fetching...' : null}</div>
    </div>
  )
}

export default ContactList
