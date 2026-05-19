import type { ChapterMapResponse, ChapterNodeStatus, ChapterNodeSummary, PublicConfig } from './contracts'

const fallbackConfig: PublicConfig = {
  app: 'Brain Arena',
  status: 'mock',
  telegramMiniApp: true,
  generatedAt: new Date(0).toISOString()
}

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''
}

export async function fetchPublicConfig(signal?: AbortSignal): Promise<PublicConfig> {
  const baseUrl = getApiBaseUrl()

  if (!baseUrl) {
    return fallbackConfig
  }

  const response = await fetch(`${baseUrl}/api/public/config`, { signal })

  if (!response.ok) {
    throw new Error(`Public config request failed: ${response.status}`)
  }

  return response.json() as Promise<PublicConfig>
}

export async function fetchChapterMap(chapterSlug: string, signal?: AbortSignal): Promise<ChapterNodeSummary[]> {
  const baseUrl = getApiBaseUrl()

  if (!baseUrl) {
    return []
  }

  const response = await fetch(`${baseUrl}/api/chapters/${chapterSlug}/map`, { signal })

  if (!response.ok) {
    throw new Error(`Chapter map request failed: ${response.status}`)
  }

  const map = (await response.json()) as ChapterMapResponse
  return map.nodes.map((node) => ({
    id: node.id,
    title: node.title,
    subtitle: node.subtitle,
    stars: node.stars,
    status: mapChapterNodeStatus(node.status),
    x: node.positionX,
    y: node.positionY,
    types: []
  }))
}

function mapChapterNodeStatus(status: ChapterMapResponse['nodes'][number]['status']): ChapterNodeStatus {
  if (status === 'MASTERED' || status === 'COMPLETED') {
    return 'done'
  }

  if (status === 'IN_PROGRESS') {
    return 'active'
  }

  return 'locked'
}
