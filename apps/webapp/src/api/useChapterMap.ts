import { useEffect, useState } from 'react'
import { fetchChapterMap } from './client'
import type { ChapterNodeSummary } from './contracts'

type ChapterMapState =
  | { status: 'idle'; nodes: ChapterNodeSummary[]; error: null }
  | { status: 'loading'; nodes: ChapterNodeSummary[]; error: null }
  | { status: 'ready'; nodes: ChapterNodeSummary[]; error: null }
  | { status: 'error'; nodes: ChapterNodeSummary[]; error: string }

export function useChapterMap(chapterSlug: string, fallbackNodes: ChapterNodeSummary[]): ChapterMapState {
  const [state, setState] = useState<ChapterMapState>({
    status: 'idle',
    nodes: fallbackNodes,
    error: null
  })

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading', nodes: fallbackNodes, error: null })

    fetchChapterMap(chapterSlug, controller.signal)
      .then((nodes) => {
        setState({
          status: 'ready',
          nodes: nodes.length > 0 ? nodes : fallbackNodes,
          error: null
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setState({
          status: 'error',
          nodes: fallbackNodes,
          error: error instanceof Error ? error.message : 'Unknown chapter map error'
        })
      })

    return () => controller.abort()
  }, [chapterSlug, fallbackNodes])

  return state
}
