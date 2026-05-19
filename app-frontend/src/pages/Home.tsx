import { HeroPanel } from '../components/HeroPanel'
import { RitualCard } from '../components/RitualCard'
import { CoursePanel } from '../components/CoursePanel'
import { QuizQuestionCard } from '../components/QuizQuestionCard'
import { ChronicleTimeline } from '../components/ChronicleTimeline'
import { AchievementPanel } from '../components/AchievementPanel'
import { BottomNav } from '../components/BottomNav'

export function Home() {
  return (
    <main className="min-h-screen px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <HeroPanel />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <RitualCard />
          <QuizQuestionCard />
        </div>

        <CoursePanel />

        <div className="grid gap-6 lg:grid-cols-2">
          <ChronicleTimeline />
          <AchievementPanel />
        </div>

        <BottomNav />
      </div>
    </main>
  )
}
