import { useEffect, useState } from 'react'
import { fetchPlayerSummary } from './client'
import type { PlayerSummary } from './contracts'

type PlayerSummaryState = {
  status: 'idle' | 'loading' | 'ready' | 'error'
  player: PlayerSummary
  error: string | null
}

export function usePlayerSummary(initData: string, fallbackPlayer: PlayerSummary): PlayerSummaryState {
  const [state, setState] = useState<PlayerSummaryState>({
    status: 'idle',
    player: fallbackPlayer,
    error: null
  })

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading', player: fallbackPlayer, error: null })

    fetchPlayerSummary(initData, controller.signal)
      .then((player) => {
        setState({
          status: 'ready',
          player: player ?? fallbackPlayer,
          error: null
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setState({
          status: 'error',
          player: fallbackPlayer,
          error: error instanceof Error ? error.message : 'Unknown player summary error'
        })
      })

    return () => controller.abort()
  }, [fallbackPlayer, initData])

  return state
}
