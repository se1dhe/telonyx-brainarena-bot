import { Home } from '../pages/Home'
import { TelegramProvider } from './providers/TelegramProvider'
import { usePublicConfig } from '../api/usePublicConfig'

function AppContent() {
  usePublicConfig()

  return <Home />
}

export default function App() {
  return (
    <TelegramProvider>
      <AppContent />
    </TelegramProvider>
  )
}
