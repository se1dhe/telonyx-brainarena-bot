import { motion } from 'framer-motion'
import { Check, ChevronRight, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ChapterNodeSession } from '../../api/contracts'

type QuizStagePanelProps = {
  session: ChapterNodeSession
  onClose: () => void
}

export function QuizStagePanel({ session, onClose }: QuizStagePanelProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const question = session.questions[questionIndex]
  const questionCount = session.questions.length
  const isAnswered = selectedOptionId !== null
  const isCorrect = selectedOptionId === question.correctOptionId
  const isLastQuestion = questionIndex === session.questions.length - 1
  const projectedCorrect = correctAnswers + (isAnswered && isCorrect ? 1 : 0)

  const stars = useMemo(() => {
    const score = questionCount === 0 ? 0 : projectedCorrect / questionCount
    if (score >= 0.9) return 3
    if (score >= 0.7) return 2
    if (score >= 0.4) return 1
    return 0
  }, [projectedCorrect, questionCount])

  function chooseOption(optionId: string) {
    if (!isAnswered) {
      setSelectedOptionId(optionId)
    }
  }

  function goNext() {
    if (isLastQuestion) {
      onClose()
      return
    }

    setCorrectAnswers(projectedCorrect)
    setQuestionIndex((current) => current + 1)
    setSelectedOptionId(null)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="arena-card p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="arena-label">{session.title}</p>
          <h2 className="mt-1 text-2xl font-bold text-arena-ivory">{question.category}</h2>
          <p className="mt-1 text-sm font-bold text-arena-muted">
            {questionIndex + 1} из {questionCount}
          </p>
        </div>
        <div className="rounded-full border border-arena-gold/30 bg-arena-gold/10 px-3 py-2 text-sm font-black text-arena-gold">
          {stars} ★
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-codex-gold/15 bg-codex-ivory p-4 text-center">
        <p className="text-lg font-semibold leading-7 text-arena-ivory">{question.prompt}</p>
      </div>

      <div className="mt-3 grid gap-2">
        {question.options.map((option, index) => {
          const selected = selectedOptionId === option.id
          const correct = question.correctOptionId === option.id
          const stateClass = isAnswered
            ? correct
              ? 'border-arena-gold/70 bg-arena-gold/10'
              : selected
                ? 'border-arena-blue/40 bg-arena-blue/10'
                : ''
            : ''

          return (
            <button key={option.id} className={`answer-row ${stateClass}`} onClick={() => chooseOption(option.id)}>
              <span>{String.fromCharCode(65 + index)}</span>
              <span className="flex-1 text-base text-arena-ivory">{option.text}</span>
              {isAnswered && correct && <Check className="h-5 w-5 text-arena-gold" />}
              {isAnswered && selected && !correct && <X className="h-5 w-5 text-arena-blue" />}
            </button>
          )
        })}
      </div>

      {isAnswered && (
        <div className="mt-4 rounded-2xl border border-codex-gold/15 bg-codex-marble/70 p-4">
          <p className="text-sm font-bold text-arena-ivory">{isCorrect ? 'Верно' : 'Ответ принят'}</p>
          <p className="mt-1 text-sm leading-6 text-arena-muted">{question.explanation}</p>
        </div>
      )}

      <button className="arena-primary mt-5 w-full" onClick={goNext} disabled={!isAnswered}>
        {isLastQuestion ? 'Завершить' : 'Дальше'}
        <ChevronRight className="h-5 w-5" />
      </button>
    </motion.section>
  )
}
