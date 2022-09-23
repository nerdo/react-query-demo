import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AddressBook from './AddressBook'

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <AddressBook />
      </div>
    </QueryClientProvider>
  )
}

export default App
