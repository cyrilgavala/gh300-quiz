import {useEffect, useState} from 'react'
import './App.css'
import useQuestions from './hooks/useQuestions'
import Review from './components/Review'
import Summary from './components/Summary'
import type {QuestionAttributes} from './types'
import Question from './components/Question'

type ViewMode = 'quiz' | 'summary' | 'review' | 'disclaimer'


const App = () => {
  const {questions, loading, error} = useQuestions()
  const [answers, setAnswers] = useState<Record<number, Set<string>>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [view, setView] = useState<ViewMode>('disclaimer')
  const [reviewReturnView, setReviewReturnView] = useState<ViewMode>('summary')

  const currentQuestion = questions[currentIndex]
  const ready = !loading && !error

  const selectAnswer = (question: QuestionAttributes, letter: string) => {
    setAnswers((prev) => {
      const next = {...prev}
      if (question.correctAnswer.length > 1) {
        const current = new Set(next[question.id] ?? [])
        current.has(letter) ? current.delete(letter) : current.add(letter)
        next[question.id] = current
      } else {
        next[question.id] = new Set([letter])
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

  const finishQuiz = () => {
    setView('summary')
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  const retakeQuiz = () => {
    setAnswers({})
    setCurrentIndex(0)
    setView('quiz')
    window.scrollTo({top: 0, behavior: 'smooth'})
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

  return (
      <div className="app-shell">
        <header className="page-header">
          <div>
            <p className="eyebrow">GH300 GitHub Copilot</p>
            <h1>Quiz Wizard</h1>
          </div>
        </header>

        {ready && view === 'disclaimer' && (
            <div className="panel disclaimer">
              <h3>Disclaimer</h3>
              <p>
                All questions are web-scraped from publicly available sources and are provided
                solely for personal use to prepare for and evaluate knowledge for the GH300 GitHub
                Copilot certification. All rights and copyrights belong to Microsoft and GitHub.
              </p>
              <button onClick={() => setView('quiz')}>Start Quiz</button>
            </div>
        )}

        {loading && <div className="panel">Loading questions…</div>}
        {error && <div className="panel error">Failed to load questions: {error}</div>}
        {ready && questions.length === 0 && <div className="panel">No questions available.</div>}

        {ready && currentQuestion && view === 'quiz' && (
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

        {ready && view === 'summary' && (
            <Summary
                answers={answers}
                questions={questions}
                onReview={() => openReview('summary')}
                onRetake={retakeQuiz}
            />
        )}

        {ready && view === 'review' && (
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
