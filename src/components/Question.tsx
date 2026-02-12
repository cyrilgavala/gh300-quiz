import Card from './Card'
import './Question.css'
import type {QuestionAttributes} from '../types'

const letterFromIndex = (index: number) => String.fromCharCode(65 + index)

export type QuestionProps = {
  question: QuestionAttributes
  index: number
  total: number
  selectedAnswers?: Set<string>
  onSelectAnswer: (letter: string) => void
  onReset: () => void
  onReview: () => void
  onPrev: () => void
  onNext: () => void
  onFinish: () => void
  canFinish: boolean
}

const Question = ({
                    question,
                    index,
                    total,
                    selectedAnswers,
                    onSelectAnswer,
                    onReset,
                    onReview,
                    onPrev,
                    onNext,
                    onFinish,
                    canFinish,
                  }: QuestionProps) => {
  const progress = total ? ((index + 1) / total) * 100 : 0
  const isMultiSelect = question.correctAnswers.length > 1
  const correctCount = question.correctAnswers.length
  const isLast = index === total - 1
  const selected = selectedAnswers ?? new Set<string>()
  const inputType = isMultiSelect ? 'checkbox' : 'radio'
  const overLimit = isMultiSelect && selected.size > correctCount
  const hasSelection = selected.size > 0

  return (
      <Card
          as="section"
          header={
            <div className="card-header">
              <div>
                <p className="eyebrow">Question {index + 1}</p>
                <h2>{question.question}</h2>
              </div>
              <div className="progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: `${progress}%`}}/>
                </div>
                <span>
              {index + 1}/{total}
            </span>
              </div>
            </div>
          }
      >
        {isMultiSelect && (
            <div className="hint">
              Multiple answers are correct ({correctCount} in total). Select all that apply.
            </div>
        )}

        {overLimit && (
            <div className="panel warning" role="alert">
              You selected {selected.size} options, but only {correctCount} are correct. Deselect
              extras to stay within the limit.
            </div>
        )}

        <ul className="answers">
          {question.answers.map((answer, answerIndex) => {
            const letter = letterFromIndex(answerIndex)
            const isSelected = selected.has(letter)

            return (
                <li key={letter} className={isSelected ? 'answer selected' : 'answer'}>
                  <label>
                    <input
                        type={inputType}
                        name={`question-${question.id}`}
                        checked={isSelected}
                        onChange={() => onSelectAnswer(letter)}
                    />
                    <span className="letter">{letter}</span>
                    <span>{answer}</span>
                  </label>
                </li>
            )
          })}
        </ul>

        <div className="actions">
          <div className="actions-right">
            <button onClick={onReset} className="secondary">
              Reset selection
            </button>
            <button onClick={onReview} className="secondary">
              Review answers
            </button>
          </div>
          <div className="actions-right">
            <button onClick={onPrev} disabled={index === 0}>
              Previous
            </button>
            {!isLast && (
                <button onClick={onNext} className="secondary">
                  Next
                </button>
            )}
            {isLast && (
                <button onClick={onFinish} className="primary" disabled={!canFinish || overLimit}>
                  Finish &amp; score
                </button>
            )}
          </div>
        </div>

        {isLast && !hasSelection && (
            <div className="panel">
              You have not selected an answer for this question. Finishing now will count it as
              incorrect.
            </div>
        )}
      </Card>
  )
}

export default Question
