import { useCallback, useEffect, useState } from 'react'
import { fetchChapterMap } from './client'
import type { ChapterNodeSummary } from './contracts'

type ChapterMapState =
  | { status: 'idle'; nodes: ChapterNodeSummary[]; error: null; refresh: () => void }
  | { status: 'loading'; nodes: ChapterNodeSummary[]; error: null; refresh: () => void }
  | { status: 'ready'; nodes: ChapterNodeSummary[]; error: null; refresh: () => void }
  | { status: 'error'; nodes: ChapterNodeSummary[]; error: string; refresh: () => void }

export function useChapterMap(chapterSlug: string, fallbackNodes: ChapterNodeSummary[], initData = ''): ChapterMapState {
  const [version, setVersion] = useState(0)
  const refresh = useCallback(() => setVersion((value) => value + 1), [])
  const [state, setState] = useState<ChapterMapState>({
    status: 'idle',
    nodes: fallbackNodes,
    error: null,
    refresh
  })

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading', nodes: fallbackNodes, error: null, refresh })

    fetchChapterMap(chapterSlug, initData, controller.signal)
      .then((nodes) => {
        setState({
          status: 'ready',
          nodes: nodes.length > 0 ? nodes : fallbackNodes,
          error: null,
          refresh
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setState({
          status: 'error',
          nodes: fallbackNodes,
          error: error instanceof Error ? error.message : 'Unknown chapter map error',
          refresh
        })
      })

    return () => controller.abort()
  }, [chapterSlug, fallbackNodes, initData, refresh, version])

  return state
}
