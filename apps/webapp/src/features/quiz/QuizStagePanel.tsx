import { motion } from 'framer-motion'
import { Check, ChevronRight, RotateCcw, Trophy, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { finishQuizSession, submitQuizAnswer } from '../../api/client'
import type { ChapterNodeSession, QuizAnswerResult, QuizSessionResult } from '../../api/contracts'

type QuizStagePanelProps = {
  session: ChapterNodeSession
  onClose: () => void
}

export function QuizStagePanel({ session, onClose }: QuizStagePanelProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [answerResult, setAnswerResult] = useState<QuizAnswerResult | null>(null)
  const [sessionResult, setSessionResult] = useState<QuizSessionResult | null>(null)
  const [stars, setStars] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)
  const [flowError, setFlowError] = useState<string | null>(null)
  const question = session.questions[questionIndex]
  const questionCount = session.questions.length
  const isAnswered = Boolean(question && answerResult?.questionId === question.id)
  const isCorrect = answerResult?.correct ?? false
  const isLastQuestion = questionIndex === session.questions.length - 1

  const progressLabel = useMemo(() => {
    if (!isAnswered) {
      return `${questionIndex + 1} из ${questionCount}`
    }

    return answerResult
      ? `${answerResult.answeredQuestions} из ${answerResult.totalQuestions}`
      : `${questionIndex + 1} из ${questionCount}`
  }, [answerResult, isAnswered, questionCount, questionIndex])

  async function chooseOption(optionId: string) {
    if (!question || isAnswered || isSubmitting) {
      return
    }

    setSelectedOptionId(optionId)
    setIsSubmitting(true)
    setFlowError(null)
    try {
      const result = await submitQuizAnswer(session.sessionId, question.id, optionId)
      setAnswerResult(result)
      setStars(result.stars)
    } catch (error) {
      setFlowError(error instanceof Error ? error.message : 'Не удалось принять ответ.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function goNext() {
    if (isLastQuestion) {
      setIsFinishing(true)
      setFlowError(null)
      try {
        const result = await finishQuizSession(session.sessionId)
        setSessionResult(result)
        setStars(result.stars)
      } catch (error) {
        setFlowError(error instanceof Error ? error.message : 'Не удалось завершить точку.')
      } finally {
        setIsFinishing(false)
      }
      return
    }

    setQuestionIndex((current) => current + 1)
    setSelectedOptionId(null)
    setAnswerResult(null)
    setFlowError(null)
  }

  if (sessionResult) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="arena-card p-4 text-center"
      >
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-arena-gold/40 bg-arena-gold/10 text-arena-gold">
          <Trophy className="h-10 w-10" />
        </div>
        <p className="arena-label mt-5">Точка завершена</p>
        <h2 className="mt-1 text-2xl font-bold text-arena-ivory">{session.title}</h2>
        <p className="mt-3 text-sm leading-6 text-arena-muted">
          Верных ответов: {sessionResult.correctAnswers} из {sessionResult.totalQuestions}
        </p>
        <div className="mt-5 rounded-2xl border border-arena-gold/25 bg-arena-gold/10 px-4 py-5">
          <p className="font-display text-5xl font-bold text-arena-gold">{sessionResult.stars} ★</p>
          <p className="mt-2 text-sm font-bold text-arena-ivory">
            {sessionResult.completed ? 'Прогресс сохранён' : 'Можно усилить результат повторением'}
          </p>
        </div>
        <button className="arena-primary mt-5 w-full" onClick={onClose}>
          <RotateCcw className="h-5 w-5" />
          Вернуться к карте
        </button>
      </motion.section>
    )
  }

  if (!question) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="arena-card p-4 text-center"
      >
        <p className="arena-label">Точка недоступна</p>
        <h2 className="mt-2 text-2xl font-bold text-arena-ivory">{session.title}</h2>
        <p className="mt-3 text-sm leading-6 text-arena-muted">
          Для этой точки пока не загружены вопросы. Прогресс не потерян, можно вернуться к карте.
        </p>
        <button className="arena-primary mt-5 w-full" onClick={onClose}>
          <RotateCcw className="h-5 w-5" />
          Вернуться к карте
        </button>
      </motion.section>
    )
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
            {progressLabel}
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
          const correct = answerResult?.correctOptionId === option.id
          const stateClass = isAnswered
            ? correct
              ? 'border-arena-gold/70 bg-arena-gold/10'
              : selected
                ? 'border-arena-blue/40 bg-arena-blue/10'
                : ''
            : ''

          return (
            <button key={option.id} className={`answer-row ${stateClass}`} onClick={() => chooseOption(option.id)} disabled={isSubmitting || isAnswered}>
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
          <p className="mt-1 text-sm leading-6 text-arena-muted">{answerResult?.explanation}</p>
        </div>
      )}

      {flowError && (
        <div className="mt-4 rounded-2xl border border-arena-blue/25 bg-arena-blue/10 p-3 text-sm font-bold text-arena-blue">
          {flowError}
        </div>
      )}

      <button className="arena-primary mt-5 w-full" onClick={goNext} disabled={!isAnswered || isFinishing}>
        {isLastQuestion ? (isFinishing ? 'Считаем' : 'Завершить') : 'Дальше'}
        <ChevronRight className="h-5 w-5" />
      </button>
    </motion.section>
  )
}
