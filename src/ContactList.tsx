import { blueprint } from './api/blueprint'
import { ContactCard } from './ContactCard'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'

export interface ContactListProps {
  api: Pick<typeof blueprint, 'pageContacts' | 'updateContact'>
}

const ContactList = (props: ContactListProps) => {
  const { api } = props

  const contactQuery = useInfiniteQuery(['contacts'], ({ pageParam }) => api.pageContacts({ cursor: pageParam || 0, limit: 20 }), {
    getNextPageParam: (lastPage, _pages) => lastPage.nextCursor,
  })

  const queryClient = useQueryClient()

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
              api={api}
              contact={contact}
              onUpdateContact={(contact) => {
                queryClient.setQueryData<typeof contactQuery.data>(['contacts'], (oldData) => {
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
