import {useEffect, useMemo, useState} from 'react'
import './App.css'
import useQuestions from './hooks/useQuestions'
import Review from './components/Review'
import Summary from './components/Summary'
import {saveAttempt} from './storage/attempts'
import type {Attempt, QuestionAttributes, Score} from './types'
import Question from './components/Question'

type ViewMode = 'quiz' | 'summary' | 'review' | 'disclaimer'

const normalizeLetter = (letter: string) => letter.trim().toUpperCase()
const setsEqual = (a: Set<string>, b: Set<string>) => a.size === b.size && [...a].every((value) => b.has(value))

const App = () => {
  const {questions, loading, error} = useQuestions()
  const [answers, setAnswers] = useState<Record<number, Set<string>>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [view, setView] = useState<ViewMode>('disclaimer')
  const [reviewReturnView, setReviewReturnView] = useState<ViewMode>('summary')
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString())

  const currentQuestion = questions[currentIndex]

  const score: Score = useMemo(() => {
    const correct = questions.reduce((count, question) => {
      const selected = answers[question.id]
      if (!selected || selected.size === 0) return count
      const correctSet = new Set(question.correctAnswers.map(normalizeLetter))
      return setsEqual(selected, correctSet) ? count + 1 : count
    }, 0)

    const total = questions.length
    const points = correct * 10
    const totalPoints = total * 10

    return {points, totalPoints}
  }, [answers, questions])

  const selectAnswer = (question: QuestionAttributes, letter: string) => {
    const normalized = normalizeLetter(letter)
    setAnswers((prev) => {
      const next = {...prev}
      if (question.correctAnswers.length > 1) {
        const current = new Set(next[question.id] ?? [])
        current.has(normalized) ? current.delete(normalized) : current.add(normalized)
        next[question.id] = current
      } else {
        next[question.id] = new Set([normalized])
      }
      return next
    })
  }

  const resetAnswers = (questionId: number) => {
    setAnswers((prev) => {
      if (!prev[questionId]) return prev
      const next = {...prev}
      delete next[questionId]
      return next
    })
  }

  const goNext = () => setCurrentIndex((index) => Math.min(index + 1, questions.length - 1))
  const goPrev = () => setCurrentIndex((index) => Math.max(index - 1, 0))

  const openReview = (from: ViewMode) => {
    setReviewReturnView(from)
    setView('review')
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (view !== 'quiz') return
      if (event.defaultPrevented) return
      const tagName = (event.target as HTMLElement | null)?.tagName
      if (tagName && ['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName)) return

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goPrev()
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev, view])

  const finishQuiz = () => {
    const attempt: Attempt = {
      attemptId: (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)),
      startedAt,
      completedAt: new Date().toISOString(),
      score: score,
    }
    saveAttempt(attempt)

    setView('summary')
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  const retakeQuiz = () => {
    setAnswers({})
    setCurrentIndex(0)
    setView('quiz')
    setStartedAt(new Date().toISOString())
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  return (
      <div className="app-shell">
        <header className="page-header">
          <div>
            <p className="eyebrow">GH300 GitHub Copilot</p>
            <h1>Quiz Wizard</h1>
          </div>
        </header>

        {!loading && !error && view === 'disclaimer' && (
            <div className="panel disclaimer">
              <h3>Disclaimer</h3>
              <p>
                All questions are web-scraped from publicly available sources and are provided
                solely for
                personal use to prepare for and evaluate knowledge for the GH300 GitHub Copilot
                certification. All
                rights and copyrights belong to Microsoft and GitHub.
              </p>
              <button onClick={() => setView('quiz')}>Start Quiz</button>
            </div>
        )}

        {loading && <div className="panel">Loading questions…</div>}
        {error && <div className="panel error">Failed to load questions: {error}</div>}
        {!loading && !error && questions.length === 0 &&
            <div className="panel">No questions available.</div>}

        {!loading && !error && currentQuestion && view === 'quiz' && (
            <Question
                question={currentQuestion}
                index={currentIndex}
                total={questions.length}
                selectedAnswers={answers[currentQuestion.id]}
                onSelectAnswer={(letter) => selectAnswer(currentQuestion, letter)}
                onReset={() => resetAnswers(currentQuestion.id)}
                onReview={() => openReview('quiz')}
                onPrev={goPrev}
                onNext={goNext}
                onFinish={finishQuiz}
                canFinish={!!currentQuestion}
            />
        )}

        {!loading && !error && view === 'summary' && (
            <Summary
                points={score.points}
                totalPoints={score.totalPoints}
                onReview={() => openReview('summary')}
                onRetake={retakeQuiz}
            />
        )}

        {!loading && !error && view === 'review' && (
            <Review
                questions={questions}
                answers={answers}
                onBack={() => setView(reviewReturnView)}
                backLabel={reviewReturnView === 'quiz' ? 'Back to quiz' : 'Back to summary'}
            />
        )}
      </div>
  )
}

export default App
