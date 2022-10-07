import blueprint from './api/blueprint'
import ContactList from './ContactList'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export interface AppProps {
  api: typeof blueprint
}

export const App = (props: AppProps) => {
  const { api } = props

  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ContactList api={api} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
