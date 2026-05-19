import { useEffect, useState } from 'react'
import { fetchMe, type MeProfile } from './client'
import type { TelegramRuntime } from './telegram'

type MeState =
  | { status: 'idle'; profile: null; error: null }
  | { status: 'loading'; profile: null; error: null }
  | { status: 'ready'; profile: MeProfile | null; error: null }
  | { status: 'error'; profile: null; error: string }

export function useMe(telegram: TelegramRuntime): MeState {
  const [state, setState] = useState<MeState>({
    status: 'idle',
    profile: null,
    error: null
  })

  useEffect(() => {
    const controller = new AbortController()

    if (!telegram.isTelegram || !telegram.initData) {
      setState({
        status: 'ready',
        profile: null,
        error: null
      })
      return () => controller.abort()
    }

    setState({
      status: 'loading',
      profile: null,
      error: null
    })

    fetchMe(telegram.initData, controller.signal)
      .then((profile) => {
        setState({
          status: 'ready',
          profile,
          error: null
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setState({
          status: 'error',
          profile: null,
          error: error instanceof Error ? error.message : 'Unknown me profile error'
        })
      })

    return () => controller.abort()
  }, [telegram])

  return state
}
