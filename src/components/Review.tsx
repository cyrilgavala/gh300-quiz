import Card from './Card'
import './Review.css'
import type {QuestionAttributes} from '../types'

const letterFromIndex = (index: number) => String.fromCharCode(65 + index)
const normalizeLetter = (letter: string) => letter.trim().toUpperCase()

type ReviewProps = {
  questions: QuestionAttributes[]
  answers: Record<number, Set<string>>
  onBack: () => void
  backLabel?: string
}

const Review = ({questions, answers, onBack, backLabel = 'Back to summary'}: ReviewProps) => (
    <section className="review">
      <div className="review-header">
        <div>
          <p className="eyebrow">Review</p>
          <h2>Check each question</h2>
          <p className="subtitle">Correct answers are highlighted, with your selections marked.</p>
        </div>
        <button className="secondary" onClick={onBack}>
          {backLabel}
        </button>
      </div>
      <div className="review-grid">
        {questions.map((question, index) => {
          const correctSet = new Set(question.correctAnswers.map(normalizeLetter))
          const selectedSet = answers[question.id] ?? new Set<string>()
          const hasSelection = selectedSet.size > 0

          return (
              <Card
                  key={question.id}
                  as="article"
                  className="review-card"
                  header={
                    <>
                      <p className="eyebrow">Question {index + 1}</p>
                      <h3>{question.question}</h3>
                      {question.correctAnswers.length > 1 && (
                          <div className="hint">Multiple answers were correct for this
                            question.</div>
                      )}
                    </>
                  }
              >
                <ul className="answers review-answers">
                  {question.answers.map((answer, answerIndex) => {
                    const letter = letterFromIndex(answerIndex)
                    const isCorrect = correctSet.has(letter)
                    const isSelected = selectedSet.has(letter)

                    return (
                        <li
                            key={letter}
                            className={`answer review-item${isCorrect && hasSelection ? ' correct' : ''}${
                                (isSelected && !isCorrect) || (!hasSelection && isCorrect) ? ' selected-wrong' : ''
                            }${isSelected ? ' chosen' : ''}`}
                        >
                          <div className="answer-body">
                            <span className="letter">{letter}</span>
                            <span>{answer}</span>
                          </div>
                          <div className="answer-flags">
                            {hasSelection && isCorrect &&
                                <span className="badge success">Correct</span>}
                            {hasSelection && isSelected && isCorrect &&
                                <span className="badge neutral">You chose this</span>}
                            {hasSelection && isSelected && !isCorrect &&
                                <span className="badge error">Your choice</span>}

                          </div>
                        </li>
                    )
                  })}
                </ul>
                {!hasSelection && (
                    <p className="explanation">
                      <strong>Not answered:</strong> You skipped this question. Review the correct
                      options above.
                    </p>
                )}
                <p className="explanation">
                  <strong>Explanation:</strong> {question.explanation}
                </p>
              </Card>
          )
        })}
      </div>
    </section>
)

export default Review
