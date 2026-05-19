import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { getTelegramRuntime, type TelegramRuntime } from '../../api/telegram'

const TelegramContext = createContext<TelegramRuntime | null>(null)

type TelegramProviderProps = {
  children: ReactNode
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const runtime = useMemo(() => getTelegramRuntime(), [])

  useEffect(() => {
    runtime.ready()
    runtime.expand()
  }, [runtime])

  return (
    <TelegramContext.Provider value={runtime}>
      {children}
    </TelegramContext.Provider>
  )
}

export function useTelegram() {
  const runtime = useContext(TelegramContext)

  if (!runtime) {
    throw new Error('useTelegram must be used inside TelegramProvider')
  }

  return runtime
}
