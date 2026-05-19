import type { PublicConfig } from './contracts'

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
