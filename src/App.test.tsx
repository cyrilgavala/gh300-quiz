import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

vi.mock('./hooks/useQuestions', () => {
  const questions = [
    {
      id: 1,
      question: 'First question?',
      answers: ['Yes', 'No'],
      correctAnswers: ['A'],
      explanation: 'Because yes'
    },
    {
      id: 2,
      question: 'Second question?',
      answers: ['Left', 'Right', 'Up'],
      correctAnswers: ['B'],
      explanation: 'Right is correct'
    }
  ]
  return {
    default: () => ({ questions, loading: false, error: null }),
  }
})

describe('App', () => {
  beforeAll(() => {
    // Prevent scroll errors in jsdom
    window.scrollTo = vi.fn()
  })

  it('walks through the wizard and shows summary score', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText('First question?')).toBeInTheDocument()

    await user.click(screen.getByLabelText(/No/))
    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(screen.getByText('Second question?')).toBeInTheDocument()

    await user.click(screen.getByLabelText(/Right/))
    await user.click(screen.getByRole('button', { name: /finish/i }))

    expect(screen.getByText('Your score')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('out of')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })
})
