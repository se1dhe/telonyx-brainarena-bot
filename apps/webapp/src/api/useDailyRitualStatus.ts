import { useCallback, useEffect, useState } from 'react'
import { fetchDailyRitualStatus } from './client'
import type { DailyRitualStatus } from './contracts'

const fallbackStatus: DailyRitualStatus = {
  completedToday: false,
  starsEarned: 0,
  currentStreak: 0,
  longestStreak: 0,
  streakSaves: 0
}

type DailyRitualStatusState = {
  status: 'idle' | 'loading' | 'ready' | 'error'
  ritual: DailyRitualStatus
  error: string | null
  refresh: () => void
}

export function useDailyRitualStatus(initData = ''): DailyRitualStatusState {
  const [version, setVersion] = useState(0)
  const refresh = useCallback(() => setVersion((value) => value + 1), [])
  const [state, setState] = useState<DailyRitualStatusState>({
    status: 'idle',
    ritual: fallbackStatus,
    error: null,
    refresh
  })

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading', ritual: fallbackStatus, error: null, refresh })

    fetchDailyRitualStatus(initData, controller.signal)
      .then((ritual) => {
        setState({ status: 'ready', ritual, error: null, refresh })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setState({
          status: 'error',
          ritual: fallbackStatus,
          error: error instanceof Error ? error.message : 'Unknown daily ritual status error',
          refresh
        })
      })

    return () => controller.abort()
  }, [initData, refresh, version])

  return state
}
