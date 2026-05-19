import { Search } from 'lucide-react'
import { AppHeader } from '../components/layout/AppHeader'
import { BottomNav } from '../components/layout/BottomNav'
import { ChapterMapCard } from '../features/chapters/ChapterMapCard'
import { StageCard } from '../features/chapters/StageCard'
import { DailyModes } from '../features/daily/DailyModes'
import { CategoryStrip } from '../features/home/CategoryStrip'
import { RatingCard } from '../features/home/RatingCard'
import { ProfileCard } from '../features/profile/ProfileCard'
import { DuelCard } from '../features/pvp/DuelCard'
import { Leaderboard } from '../features/ranked/Leaderboard'
import { activeStage, categories, dailyModes, duel, leaderboard, mapNodes, player } from '../theme/content'

export function Home() {
  return (
    <main className="min-h-screen px-3 pb-28 pt-[calc(16px+env(safe-area-inset-top))] text-arena-ivory sm:px-5 md:pb-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <AppHeader player={player} />

        <RatingCard player={player} />
        <CategoryStrip categories={categories} />

        <div className="grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
          <ChapterMapCard nodes={mapNodes} />
          <div className="space-y-4">
            <StageCard stage={activeStage} />
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
            <ProfileCard player={player} />
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  )
}
