import {render, screen} from '@testing-library/react'
import Review from './Review'
import type {QuestionAttributes} from '../types'

describe('Review', () => {
  const question: QuestionAttributes = {
    id: 1,
    question: 'Select the correct options',
    answers: ['Answer A', 'Answer B', 'Answer C'],
    correctAnswers: ['A', 'C'],
    explanation: 'A and C are correct because...'
  }

  it('highlights correct and incorrect selections', () => {
    const answers = { [question.id]: new Set(['A', 'B']) }
    render(<Review questions={[question]} answers={answers} onBack={() => {
    }} backLabel="Back"/>)

    expect(screen.getByText('Question 1')).toBeInTheDocument()
    expect(screen.getByText('Multiple answers were correct for this question.')).toBeInTheDocument()

    const correctBadges = screen.getAllByText('Correct')
    expect(correctBadges).toHaveLength(2)

    const yourChoiceBadge = screen.getByText('Your choice')
    expect(yourChoiceBadge).toBeInTheDocument()

    expect(screen.getByText(/A and C are correct/)).toBeInTheDocument()
  })
})
