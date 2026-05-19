import type {
  ChapterMapResponse,
  QuizAnswerResult,
  QuizSessionResult,
  ChapterNodeSession,
  ChapterNodeStatus,
  ChapterNodeSummary,
  PublicConfig
} from './contracts'

export type MeProfile = {
  id: number
  username?: string
  firstName?: string
  lastName?: string
  photoUrl?: string
  authDate: string
}

const fallbackConfig: PublicConfig = {
  app: 'Brain Arena',
  status: 'mock',
  telegramMiniApp: true,
  generatedAt: new Date(0).toISOString()
}

export function getApiBaseUrl() {
  const buildTimeBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
  if (buildTimeBaseUrl) {
    return buildTimeBaseUrl
  }

  if (globalThis.location?.hostname === 'brainarena-webapp-production.up.railway.app') {
    return 'https://brainarena-api-production.up.railway.app'
  }

  return ''
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

export async function fetchMe(initData: string, signal?: AbortSignal): Promise<MeProfile | null> {
  const baseUrl = getApiBaseUrl()

  if (!baseUrl || !initData) {
    return null
  }

  const response = await fetch(`${baseUrl}/api/me`, {
    method: 'GET',
    signal,
    headers: {
      'X-Telegram-Init-Data': initData
    }
  })

  if (response.status === 401) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Me request failed: ${response.status}`)
  }

  const profile = (await response.json()) as {
    telegramId: number
    username?: string
    firstName?: string
    lastName?: string
    photoUrl?: string
    authDate: string
  }

  return {
    id: profile.telegramId,
    username: profile.username,
    firstName: profile.firstName,
    lastName: profile.lastName,
    photoUrl: profile.photoUrl,
    authDate: profile.authDate
  }
}

export async function fetchChapterMap(
  chapterSlug: string,
  initData = '',
  signal?: AbortSignal
): Promise<ChapterNodeSummary[]> {
  const baseUrl = getApiBaseUrl()

  if (!baseUrl) {
    return []
  }

  const response = await fetch(`${baseUrl}/api/chapters/${chapterSlug}/map`, {
    signal,
    headers: telegramHeaders(initData)
  })

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

export async function startChapterNode(
  chapterSlug: string,
  nodeId: number,
  initData = '',
  signal?: AbortSignal
): Promise<ChapterNodeSession> {
  const baseUrl = getApiBaseUrl()

  if (!baseUrl) {
    return fallbackNodeSession(chapterSlug, nodeId)
  }

  const response = await fetch(`${baseUrl}/api/chapters/${chapterSlug}/nodes/${nodeId}/start`, {
    method: 'POST',
    signal,
    headers: telegramHeaders(initData)
  })

  if (!response.ok) {
    throw new Error(`Node start request failed: ${response.status}`)
  }

  return response.json() as Promise<ChapterNodeSession>
}

export async function submitQuizAnswer(
  sessionId: string,
  questionId: string,
  optionId: string,
  signal?: AbortSignal
): Promise<QuizAnswerResult> {
  const baseUrl = getApiBaseUrl()

  if (!baseUrl) {
    return fallbackAnswerResult(questionId, optionId)
  }

  const response = await fetch(`${baseUrl}/api/quiz/sessions/${sessionId}/answer`, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ questionId, optionId })
  })

  if (!response.ok) {
    throw new Error(`Answer request failed: ${response.status}`)
  }

  return response.json() as Promise<QuizAnswerResult>
}

export async function finishQuizSession(sessionId: string, signal?: AbortSignal): Promise<QuizSessionResult> {
  const baseUrl = getApiBaseUrl()

  if (!baseUrl) {
    return {
      sessionId,
      correctAnswers: 1,
      totalQuestions: 2,
      stars: 1,
      completed: false
    }
  }

  const response = await fetch(`${baseUrl}/api/quiz/sessions/${sessionId}/finish`, {
    method: 'POST',
    signal
  })

  if (!response.ok) {
    throw new Error(`Finish request failed: ${response.status}`)
  }

  return response.json() as Promise<QuizSessionResult>
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

function telegramHeaders(initData: string): HeadersInit {
  if (!initData) {
    return {}
  }

  return {
    'X-Telegram-Init-Data': initData
  }
}

function fallbackNodeSession(chapterSlug: string, nodeId: number): ChapterNodeSession {
  return {
    sessionId: `local-${chapterSlug}-${nodeId}`,
    chapterSlug,
    nodeId,
    title: 'Форум знатока',
    totalQuestions: 2,
    questions: [
      {
        id: 'local-q-1',
        type: 'MULTIPLE_CHOICE',
        category: 'История',
        prompt: 'Кто, согласно традиции, был первым царем Рима?',
        options: [
          { id: 'a', text: 'Ромул' },
          { id: 'b', text: 'Нума Помпилий' },
          { id: 'c', text: 'Тарквиний Гордый' },
          { id: 'd', text: 'Сервий Туллий' }
        ]
      },
      {
        id: 'local-q-2',
        type: 'TRUE_FALSE',
        category: 'Наука',
        prompt: 'Вода достигает наибольшей плотности примерно при 4 °C.',
        options: [
          { id: 'a', text: 'Верно' },
          { id: 'b', text: 'Неверно' }
        ]
      }
    ]
  }
}

function fallbackAnswerResult(questionId: string, optionId: string): QuizAnswerResult {
  const answers: Record<string, { correctOptionId: string; explanation: string }> = {
    'local-q-1': {
      correctOptionId: 'a',
      explanation: 'Римская традиция связывает основание города с Ромулом.'
    },
    'local-q-2': {
      correctOptionId: 'a',
      explanation: 'Это свойство объясняет, почему лед образуется сверху, а не со дна.'
    }
  }
  const answer = answers[questionId] ?? {
    correctOptionId: 'a',
    explanation: 'Ответ принят.'
  }
  const correct = optionId === answer.correctOptionId

  return {
    questionId,
    selectedOptionId: optionId,
    correctOptionId: answer.correctOptionId,
    correct,
    alreadyAnswered: false,
    explanation: answer.explanation,
    correctAnswers: correct ? 1 : 0,
    answeredQuestions: 1,
    totalQuestions: 2,
    stars: correct ? 1 : 0
  }
}
