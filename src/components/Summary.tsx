import Card from './Card'
import './Summary.css'

type SummaryProps = {
  correct: number
  total: number
  onReview: () => void
  onRetake: () => void
}

const summaryNote = (percent: number) => {
  if (percent === 100) return 'Perfect run. Every answer landed. Celebrate and move on to the next challenge!'
  if (percent >= 80) return 'Great job. You nailed most of this set. Review the few misses and you will be at 100% in no time.'
  if (percent >= 60) return 'Solid effort. You have a strong grasp, but a quick review of the tricky ones will boost you further.'
  if (percent >= 40) return 'Good start. Some gaps to close, so skim the explanations and take another pass.'
  if (percent >= 20) return 'Keep going You are picking up pieces; focus on the explanations to level up on the next run.'
  return 'Try again. Use the explanations as a guide and a second attempt will feel much smoother.'
}

const Summary = ({correct, total, onReview, onRetake}: SummaryProps) => {
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100)
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
          <div className="score-number">{correct}</div>
          <div className="score-details">
            <div>
              <span className="label">out of</span>
              <strong>{total}</strong>
            </div>
            <div className="percent">{percent}%</div>
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
