import Card from './Card'
import './Summary.css'
import type {QuestionAttributes} from "../types.ts";

type SummaryProps = {
  answers: Record<number, Set<string>>
  questions: QuestionAttributes[]
  onReview: () => void
  onRetake: () => void
}

const setsEqual = (a: Set<string>, b: Set<string>) => a.size === b.size && [...a].every((value) => b.has(value))

const calculateScore = (questions: QuestionAttributes[], answers: Record<number, Set<string>>) => {
  const correct = questions.reduce((count, question) => {
    const selected = answers[question.id]
    if (!selected || selected.size === 0) return count
    const correctSet = new Set(question.correctAnswer)
    return setsEqual(selected, correctSet) ? count + 1 : count
  }, 0)


  const total = questions.length
  const points = correct * 10
  const totalPoints = total * 10

  return {points, totalPoints}
}

const summaryNote = (percent: number) => {
  if (percent === 100) return 'Perfect run. Every answer landed. Celebrate and move on to the next challenge!'
  if (percent >= 80) return 'Great job. You nailed most of this set. Review the few misses and you will be at 100% in no time.'
  if (percent >= 60) return 'Solid effort. You have a strong grasp, but a quick review of the tricky ones will boost you further.'
  if (percent >= 40) return 'Good start. Some gaps to close, so skim the explanations and take another pass.'
  if (percent >= 20) return 'Keep going You are picking up pieces; focus on the explanations to level up on the next run.'
  return 'Try again. Use the explanations as a guide and a second attempt will feel much smoother.'
}

const Summary = ({answers, questions, onReview, onRetake}: SummaryProps) => {
  const {points, totalPoints} = calculateScore(questions, answers)

  const percent = totalPoints ? Math.round((points / totalPoints) * 100) : 0
  const note = summaryNote(percent)
  return (
      <Card
          as="section"
          className="summary"
          header={
            <>
              <p className="eyebrow">All done</p>
              <h2>Your score</h2>
            </>
          }
      >
        <div className="score">
          <div className="score-number">{points}</div>
          <div className="score-details">
            <div>
              <span className="label">points of</span>
              <strong>{totalPoints}</strong>
            </div>
            <div className="percent">{percent}%</div>
            <div
                className="percent">{percent > 70 ? 'Passed (70% threshold)' : 'Not passed (70% threshold)'}</div>
            <div className="note">{note}</div>
          </div>
        </div>
        <div className="actions">
          <button className="primary" onClick={onReview}>
            Review answers
          </button>
          <button className="secondary" onClick={onRetake}>
            Restart quiz
          </button>
        </div>
      </Card>
  )
}

export default Summary
