import { useEffect, useState } from 'react'
import { fetchPublicConfig } from './client'
import type { PublicConfig } from './contracts'

type PublicConfigState =
  | { status: 'loading'; config: null; error: null }
  | { status: 'ready'; config: PublicConfig; error: null }
  | { status: 'error'; config: null; error: string }

export function usePublicConfig(): PublicConfigState {
  const [state, setState] = useState<PublicConfigState>({
    status: 'loading',
    config: null,
    error: null
  })

  useEffect(() => {
    const controller = new AbortController()

    fetchPublicConfig(controller.signal)
      .then((config) => setState({ status: 'ready', config, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setState({
          status: 'error',
          config: null,
          error: error instanceof Error ? error.message : 'Unknown API error'
        })
      })

    return () => controller.abort()
  }, [])

  return state
}
