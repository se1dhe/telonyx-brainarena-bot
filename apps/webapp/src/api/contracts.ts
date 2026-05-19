import type { LucideIcon } from 'lucide-react'

export type PlayerSummary = {
  name: string
  title: string
  league: string
  iq: number
  wins: number
  winrate: string
  streak: number
  coins: number
  energy: number
}

export type CategorySummary = {
  title: string
  icon: LucideIcon
  active?: boolean
  rating: number
}

export type ChapterNodeStatus = 'done' | 'active' | 'locked'

export type ChapterNodeSummary = {
  id: number
  title: string
  subtitle: string
  stars: number
  status: ChapterNodeStatus
  x: number
  y: number
  types: string[]
}

export type QuestionTypeSummary = {
  title: string
  icon: LucideIcon
}

export type ActiveStageSummary = {
  title: string
  subtitle: string
  questions: number
  completed: number
  stars: number
  best: string
  questionTypes: QuestionTypeSummary[]
}

export type DuelFighter = {
  name: string
  mmr: number
  league: string
}

export type DuelPreview = {
  round: number
  timer: string
  score: string
  me: DuelFighter
  opponent: DuelFighter
  question: string
  answers: string[]
}

export type LeaderboardRow = {
  place: number
  name: string
  rating: number
  active?: boolean
}

export type DailyMode = {
  title: string
  reward: string
  progress: string
}

export type PublicConfig = {
  app: string
  status: string
  telegramMiniApp: boolean
  generatedAt: string
}
