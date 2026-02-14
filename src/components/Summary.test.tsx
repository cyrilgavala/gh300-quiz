import {render, screen} from '@testing-library/react'
import Summary from './Summary'
import type {QuestionAttributes} from '../types'

describe('Summary', () => {
  it('shows score, percent, and note', () => {
    const questions: QuestionAttributes[] = [
      {
        id: 1,
        question: 'Q1',
        answers: ['First', 'Second'],
        correctAnswer: ['A'],
        explanation: 'Because A is correct',
      },
      {
        id: 2,
        question: 'Q2',
        answers: ['Left', 'Right'],
        correctAnswer: ['B'],
        explanation: 'Right is correct',
      },
    ]
    const answers = {
      1: new Set(['A']),
      2: new Set(['A']),
    }

    render(
        <Summary
            answers={answers}
            questions={questions}
            onReview={() => {
            }}
            onRetake={() => {
            }}
        />,
    )
    expect(screen.getByText('Your score')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText(/points of/i)).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText(/Not passed/)).toBeInTheDocument()
    expect(screen.getByText(/Good start/)).toBeInTheDocument()
  })
})
