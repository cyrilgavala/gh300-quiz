import { useEffect, useMemo, useState } from 'react'
import './App.css'
import useQuestions from './hooks/useQuestions'
import Review from './components/Review'
import Summary from './components/Summary'
import Card from './components/Card'

type ViewMode = 'quiz' | 'summary' | 'review'

const letterFromIndex = (index: number) => String.fromCharCode(65 + index)
const normalizeLetter = (letter: string) => letter.trim().toUpperCase()
const setsEqual = (a: Set<string>, b: Set<string>) => a.size === b.size && [...a].every((value) => b.has(value))

const App = () => {
  const { questions, loading, error } = useQuestions()
  const [answers, setAnswers] = useState<Record<number, Set<string>>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [view, setView] = useState<ViewMode>('quiz')

  const currentQuestion = questions[currentIndex]
  const isMultiSelect = currentQuestion?.correctAnswers?.length > 1

  const score = useMemo(() => {
    const correct = questions.reduce((count, question) => {
      const selected = answers[question.id]
      if (!selected || selected.size === 0) return count
      const correctSet = new Set(question.correctAnswers.map(normalizeLetter))
      return setsEqual(selected, correctSet) ? count + 1 : count
    }, 0)

    return { correct, total: questions.length }
  }, [answers, questions])

  const toggleAnswer = (questionId: number, letter: string) => {
    const normalized = normalizeLetter(letter)
    setAnswers((prev) => {
      const next = { ...prev }
      const current = new Set(next[questionId] ?? [])
      current.has(normalized) ? current.delete(normalized) : current.add(normalized)
      next[questionId] = current
      return next
    })
  }

  const goNext = () => setCurrentIndex((index) => Math.min(index + 1, questions.length - 1))
  const goPrev = () => setCurrentIndex((index) => Math.max(index - 1, 0))

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
    setView('summary')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const retakeQuiz = () => {
    setAnswers({})
    setCurrentIndex(0)
    setView('quiz')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const answeredCurrent = currentQuestion && answers[currentQuestion.id]?.size
  const progress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0

  return (
    <div className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">GH300 GitHub Copilot</p>
          <h1>Quiz Wizard</h1>
          <p className="subtitle">Step through each question, submit, then review answers with explanations.</p>
        </div>
        <div className="stats">
          <div className="pill">Questions: {questions.length || '—'}</div>
          <div className="pill">Score: {score.correct}/{score.total || '—'}</div>
        </div>
      </header>

      {loading && <div className="panel">Loading questions…</div>}
      {error && <div className="panel error">Failed to load questions: {error}</div>}
      {!loading && !error && questions.length === 0 &&
        <div className="panel">No questions available.</div>}

      {!loading && !error && currentQuestion && view === 'quiz' && (
        <Card
          as="section"
          header={
            <div className="card-header">
              <div>
                <p className="eyebrow">Question {currentIndex + 1}</p>
                <h2>{currentQuestion.question}</h2>
              </div>
              <div className="progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <span>
                  {currentIndex + 1}/{questions.length}
                </span>
              </div>
            </div>
          }
        >
          {isMultiSelect && (
            <div className="hint">Multiple answers may be correct. Select all that apply.</div>
          )}

          <ul className="answers">
            {currentQuestion.answers.map((answer, index) => {
              const letter = letterFromIndex(index)
              const isSelected = answers[currentQuestion.id]?.has(letter)
              return (
                <li key={letter} className={isSelected ? 'answer selected' : 'answer'}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isSelected ?? false}
                      onChange={() => toggleAnswer(currentQuestion.id, letter)}
                    />
                    <span className="letter">{letter}</span>
                    <span>{answer}</span>
                  </label>
                </li>
              )
            })}
          </ul>

          <div className="actions">
            <button onClick={goPrev} disabled={currentIndex === 0}>
              Previous
            </button>
            <div className="actions-right">
              {currentIndex < questions.length - 1 && (
                <button onClick={goNext} className="secondary">
                  Next
                </button>
              )}
              {currentIndex === questions.length - 1 && (
                <button onClick={finishQuiz} className="primary" disabled={!answeredCurrent}>
                  Finish &amp; score
                </button>
              )}
            </div>
          </div>
        </Card>
      )}

      {!loading && !error && view === 'summary' && (
        <Summary
          correct={score.correct}
          total={score.total}
          onReview={() => setView('review')}
          onRetake={retakeQuiz}
        />
      )}

      {!loading && !error && view === 'review' && (
        <Review questions={questions} answers={answers} onBack={() => setView('summary')} />
      )}
    </div>
  )
}

export default App
