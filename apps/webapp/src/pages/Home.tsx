import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { startChapterNode, startDailyRitual } from '../api/client'
import type { ChapterNodeSession, ChapterNodeSummary } from '../api/contracts'
import { useChapterMap } from '../api/useChapterMap'
import { useMe } from '../api/useMe'
import { useTelegram } from '../app/providers/TelegramProvider'
import { AppHeader } from '../components/layout/AppHeader'
import { BottomNav, type AppView } from '../components/layout/BottomNav'
import { ChapterMapCard } from '../features/chapters/ChapterMapCard'
import { DailyModes } from '../features/daily/DailyModes'
import { CategoryStrip } from '../features/home/CategoryStrip'
import { ProfileCard } from '../features/profile/ProfileCard'
import { DuelCard } from '../features/pvp/DuelCard'
import { QuizStagePanel } from '../features/quiz/QuizStagePanel'
import { Leaderboard } from '../features/ranked/Leaderboard'
import { activeStage, categories, dailyModes, duel, leaderboard, mapNodes, player } from '../theme/content'

export function Home() {
  const telegram = useTelegram()
  const me = useMe(telegram)
  const [activeView, setActiveView] = useState<AppView>('map')
  const fallbackNodes = useMemo(() => mapNodes, [])
  const chapterMap = useChapterMap('path-of-scholar', fallbackNodes, telegram.initData)
  const playableNode = useMemo(() => {
    return (
      chapterMap.nodes.find((node) => node.status === 'active')
      ?? chapterMap.nodes.find((node) => node.status !== 'locked')
      ?? chapterMap.nodes[0]
    )
  }, [chapterMap.nodes])
  const currentStage = useMemo(() => {
    if (!playableNode) {
      return activeStage
    }

    const questionCount = Number.parseInt(playableNode.subtitle, 10) || activeStage.questions
    return {
      ...activeStage,
      title: playableNode.title,
      subtitle: `Точка ${playableNode.id} · Общие знания`,
      questions: questionCount,
      completed: playableNode.stars > 0 ? Math.round((playableNode.stars / 3) * questionCount) : 0,
      stars: playableNode.stars,
      best: playableNode.stars > 0 ? `${playableNode.stars} / 3 звезды` : 'ещё нет'
    }
  }, [playableNode])
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
  const [selectedNode, setSelectedNode] = useState<ChapterNodeSummary | null>(null)
  const [isStartingNode, setIsStartingNode] = useState(false)
  const [isStartingDaily, setIsStartingDaily] = useState(false)

  async function handleStartNode(node = selectedNode ?? playableNode) {
    if (!node || node.status === 'locked') {
      return
    }

    setIsStartingNode(true)
    try {
      const session = await startChapterNode('path-of-scholar', node.id, telegram.initData)
      setNodeSession(session)
    } finally {
      setIsStartingNode(false)
    }
  }

  function closeQuizStage() {
    setNodeSession(null)
    chapterMap.refresh()
  }

  async function handleStartDailyRitual() {
    setIsStartingDaily(true)
    try {
      const session = await startDailyRitual(telegram.initData)
      setNodeSession(session)
    } finally {
      setIsStartingDaily(false)
    }
  }

  function handleNodeSelect(node: ChapterNodeSummary) {
    setSelectedNode(node)
    void handleStartNode(node)
  }

  return (
    <main className="app-shell px-3 pt-[calc(12px+env(safe-area-inset-top))] text-arena-ivory sm:px-5">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
        <AppHeader player={currentPlayer} />

        <section className="app-viewport">
          {activeView === 'map' && (
            <div className="screen-stack">
              <CategoryStrip categories={categories} />
              <ChapterMapCard
                nodes={chapterMap.nodes}
                selectedNodeId={selectedNode?.id}
                onNodeSelect={handleNodeSelect}
              />
              <div className="arena-card p-3">
                <p className="arena-label">Текущая точка</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-arena-ivory">{currentStage.title}</h2>
                    <p className="text-sm text-arena-muted">{currentStage.best}</p>
                  </div>
                  <button className="arena-primary min-w-28 px-4" onClick={() => handleStartNode()} disabled={isStartingNode}>
                    {isStartingNode ? 'Открываем' : 'Играть'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeView === 'arena' && (
            <div className="screen-stack">
              <button className="arena-secondary w-full">Найти матч</button>
              <DuelCard duel={duel} />
            </div>
          )}

          {activeView === 'top' && (
            <div className="screen-stack">
              <Leaderboard rows={leaderboard} />
            </div>
          )}

          {activeView === 'profile' && (
            <div className="screen-stack">
              <ProfileCard player={currentPlayer} />
              <DailyModes modes={dailyModes} onStartRitual={handleStartDailyRitual} isStartingRitual={isStartingDaily} />
            </div>
          )}
        </section>

        {nodeSession && (
          <div className="quiz-overlay">
            <div className="quiz-sheet">
              <button className="quiz-close" onClick={closeQuizStage} aria-label="Закрыть вопрос" type="button">
                <X className="h-5 w-5" />
              </button>
              <QuizStagePanel session={nodeSession} onClose={closeQuizStage} />
            </div>
          </div>
        )}

        <BottomNav activeView={activeView} onChange={setActiveView} />
      </div>
    </main>
  )
}
