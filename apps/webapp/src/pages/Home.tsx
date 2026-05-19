import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { startChapterNode } from '../api/client'
import type { ChapterNodeSession } from '../api/contracts'
import { useChapterMap } from '../api/useChapterMap'
import { useMe } from '../api/useMe'
import { useTelegram } from '../app/providers/TelegramProvider'
import { AppHeader } from '../components/layout/AppHeader'
import { BottomNav } from '../components/layout/BottomNav'
import { ChapterMapCard } from '../features/chapters/ChapterMapCard'
import { StageCard } from '../features/chapters/StageCard'
import { DailyModes } from '../features/daily/DailyModes'
import { CategoryStrip } from '../features/home/CategoryStrip'
import { RatingCard } from '../features/home/RatingCard'
import { ProfileCard } from '../features/profile/ProfileCard'
import { DuelCard } from '../features/pvp/DuelCard'
import { QuizStagePanel } from '../features/quiz/QuizStagePanel'
import { Leaderboard } from '../features/ranked/Leaderboard'
import { activeStage, categories, dailyModes, duel, leaderboard, mapNodes, player } from '../theme/content'

export function Home() {
  const telegram = useTelegram()
  const me = useMe(telegram)
  const fallbackNodes = useMemo(() => mapNodes, [])
  const chapterMap = useChapterMap('path-of-scholar', fallbackNodes, telegram.initData)
  const currentPlayer = useMemo(() => {
    const profile = me.profile
    if (!profile) {
      return player
    }

    const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim()
    return {
      ...player,
      name: displayName || profile.username || player.name
    }
  }, [me.profile])
  const [nodeSession, setNodeSession] = useState<ChapterNodeSession | null>(null)
  const [isStartingNode, setIsStartingNode] = useState(false)

  async function handleStartNode() {
    setIsStartingNode(true)
    try {
      const session = await startChapterNode('path-of-scholar', 3, telegram.initData)
      setNodeSession(session)
    } finally {
      setIsStartingNode(false)
    }
  }

  function closeQuizStage() {
    setNodeSession(null)
    chapterMap.refresh()
  }

  return (
    <main className="min-h-screen px-3 pb-28 pt-[calc(16px+env(safe-area-inset-top))] text-arena-ivory sm:px-5 md:pb-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <AppHeader player={currentPlayer} />

        <RatingCard player={currentPlayer} />
        <CategoryStrip categories={categories} />

        <div className="grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
          <ChapterMapCard nodes={chapterMap.nodes} />
          <div className="space-y-4">
            <StageCard stage={activeStage} onStart={handleStartNode} isStarting={isStartingNode} />
            {nodeSession && <QuizStagePanel session={nodeSession} onClose={closeQuizStage} />}
            <DailyModes modes={dailyModes} />
          </div>
        </div>

        <button className="arena-secondary w-full">
          <Search className="h-5 w-5" />
          Найти матч
        </button>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
          <DuelCard duel={duel} />
          <div className="space-y-4">
            <Leaderboard rows={leaderboard} />
            <ProfileCard player={currentPlayer} />
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  )
}
