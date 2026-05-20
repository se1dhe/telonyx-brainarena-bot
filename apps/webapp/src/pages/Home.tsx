import { X, Landmark, BookOpen, Brain } from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import { startChapterNode, startDailyRitual, fetchChapters } from '../api/client'
import type { ChapterNodeSession, ChapterNodeSummary } from '../api/contracts'
import { useChapterMap } from '../api/useChapterMap'
import { useDailyRitualStatus } from '../api/useDailyRitualStatus'
import { useMe } from '../api/useMe'
import { usePlayerSummary } from '../api/usePlayerSummary'
import { useCourses } from '../api/useCourses'
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
import { activeStage, dailyModes, duel, leaderboard, mapNodes, player } from '../theme/content'

export function Home() {
  const telegram = useTelegram()
  const me = useMe(telegram)
  const playerSummary = usePlayerSummary(telegram.initData, player)
  const dailyRitualStatus = useDailyRitualStatus(telegram.initData)
  const [activeView, setActiveView] = useState<AppView>('map')

  const { courses, loading: coursesLoading, error: coursesError } = useCourses(telegram.initData)
  
  const [activeCourseSlug, setActiveCourseSlug] = useState('general-knowledge')
  const [activeChapterSlug, setActiveChapterSlug] = useState('path-of-scholar')
  const [chaptersLoading, setChaptersLoading] = useState(false)
  const [chaptersError, setChaptersError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function loadChapters() {
      setChaptersLoading(true)
      setChaptersError(null)
      try {
        const chapters = await fetchChapters(activeCourseSlug, telegram.initData)
        if (active && chapters.length > 0) {
          setActiveChapterSlug(chapters[0].slug)
        }
      } catch (err) {
        if (active) {
          setChaptersError(err instanceof Error ? err.message : 'Не удалось загрузить главы курса')
        }
      } finally {
        if (active) {
          setChaptersLoading(false)
        }
      }
    }
    loadChapters()
    return () => {
      active = false
    }
  }, [activeCourseSlug, telegram.initData])

  const fallbackNodes = useMemo(() => mapNodes, [])
  const chapterMap = useChapterMap(activeChapterSlug, fallbackNodes, telegram.initData)
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
    const summary = playerSummary.player
    const profile = me.profile
    if (!profile) {
      return summary
    }

    const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim()
    return {
      ...summary,
      name: displayName || profile.username || summary.name
    }
  }, [me.profile, playerSummary.player])
  const currentCategories = useMemo(() => {
    const list = courses.length > 0 ? courses : [
      { slug: 'general-knowledge', title: 'Общие знания', icon: Landmark, maxStars: 15, earnedStars: 6 },
      { slug: 'roman-history', title: 'История Рима', icon: BookOpen, maxStars: 12, earnedStars: 0 },
      { slug: 'logic', title: 'Логика', icon: Brain, maxStars: 9, earnedStars: 0 }
    ].map((c) => ({
      ...c,
      icon: c.slug === 'general-knowledge' ? Landmark : c.slug === 'roman-history' ? BookOpen : Brain,
      rating: 0
    }))

    return list.map((category, index) => ({
      ...category,
      active: category.slug === activeCourseSlug,
      rating: Math.max(0, currentPlayer.iq - index * 37)
    }))
  }, [courses, activeCourseSlug, currentPlayer.iq])
  const currentDuel = useMemo(() => ({
    ...duel,
    me: {
      ...duel.me,
      name: currentPlayer.name,
      mmr: currentPlayer.iq,
      league: currentPlayer.league
    },
    opponent: {
      ...duel.opponent,
      mmr: Math.max(1000, currentPlayer.iq - 74)
    }
  }), [currentPlayer.iq, currentPlayer.league, currentPlayer.name])
  const currentLeaderboard = useMemo(() => {
    const rows = leaderboard.map((row) => ({ ...row, active: false }))
    rows[3] = {
      place: 4,
      name: currentPlayer.name,
      rating: currentPlayer.iq,
      active: true
    }

    return rows.sort((left, right) => right.rating - left.rating).map((row, index) => ({
      ...row,
      place: index + 1
    }))
  }, [currentPlayer.iq, currentPlayer.name])
  const [nodeSession, setNodeSession] = useState<ChapterNodeSession | null>(null)
  const [selectedNode, setSelectedNode] = useState<ChapterNodeSummary | null>(null)
  const [nodeStartError, setNodeStartError] = useState<string | null>(null)
  const [isStartingNode, setIsStartingNode] = useState(false)
  const [isStartingDaily, setIsStartingDaily] = useState(false)

  async function handleStartNode(node = selectedNode ?? playableNode) {
    if (!node || node.status === 'locked') {
      return
    }

    setIsStartingNode(true)
    setNodeStartError(null)
    try {
      const session = await startChapterNode(activeChapterSlug, node.id, telegram.initData)
      if (session.questions.length === 0) {
        setNodeStartError('В этой точке пока нет вопросов. Попробуй другую доступную точку.')
        return
      }

      setNodeSession(session)
    } catch (error) {
      setNodeStartError(error instanceof Error ? error.message : 'Не удалось открыть точку.')
    } finally {
      setIsStartingNode(false)
    }
  }

  function closeQuizStage() {
    setNodeSession(null)
    chapterMap.refresh()
    dailyRitualStatus.refresh()
  }

  async function handleStartDailyRitual() {
    setIsStartingDaily(true)
    setNodeStartError(null)
    try {
      const session = await startDailyRitual(telegram.initData)
      if (session.questions.length === 0) {
        setNodeStartError('Ежедневный ритуал пока не содержит вопросов.')
        return
      }

      setNodeSession(session)
    } catch (error) {
      setNodeStartError(error instanceof Error ? error.message : 'Не удалось открыть ежедневный ритуал.')
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
              <CategoryStrip categories={currentCategories} onSelect={setActiveCourseSlug} />
              
              {coursesError || chaptersError || chapterMap.status === 'error' ? (
                <div className="arena-card p-5 text-center">
                  <p className="text-lg font-bold text-arena-blue">Сенат не отвечает</p>
                  <p className="mt-2 text-sm text-arena-muted">
                    {coursesError?.message || chaptersError || chapterMap.error || 'Не удалось связаться с сервером.'}
                  </p>
                  <button
                    onClick={() => {
                      if (coursesError) window.location.reload()
                      else if (chaptersError) setActiveCourseSlug(activeCourseSlug)
                      else chapterMap.refresh()
                    }}
                    className="arena-secondary mt-4 w-full"
                  >
                    Повторить обряд
                  </button>
                </div>
              ) : coursesLoading || chaptersLoading || chapterMap.status === 'loading' ? (
                <div className="arena-card animate-pulse p-4">
                  <div className="mx-auto h-4 w-1/3 rounded bg-arena-muted/20"></div>
                  <div className="mt-6 flex flex-col items-center justify-center space-y-4 py-8">
                    <div className="h-16 w-16 rounded-full bg-arena-muted/20 animate-spin border-4 border-t-arena-blue border-r-transparent border-b-transparent border-l-transparent"></div>
                    <div className="h-4 w-1/2 rounded bg-arena-muted/10"></div>
                    <div className="h-4 w-2/3 rounded bg-arena-muted/10"></div>
                  </div>
                </div>
              ) : (
                <>
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
                    {nodeStartError && (
                      <div className="mt-3 rounded-2xl border border-arena-blue/25 bg-arena-blue/10 px-3 py-2 text-sm font-bold text-arena-blue">
                        {nodeStartError}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeView === 'arena' && (
            <div className="screen-stack">
              <button className="arena-secondary w-full">Найти матч</button>
              <DuelCard duel={currentDuel} />
            </div>
          )}

          {activeView === 'top' && (
            <div className="screen-stack">
              <Leaderboard rows={currentLeaderboard} />
            </div>
          )}

          {activeView === 'profile' && (
            <div className="screen-stack">
              <ProfileCard player={currentPlayer} />
              <DailyModes
                modes={dailyModes}
                ritual={dailyRitualStatus.ritual}
                onStartRitual={handleStartDailyRitual}
                isStartingRitual={isStartingDaily}
              />
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
