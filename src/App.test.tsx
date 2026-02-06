import {render, screen} from '@testing-library/react'
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

  beforeEach(() => {
    localStorage.clear()
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

  it('saves an attempt after finishing the quiz', async () => {
    const user = userEvent.setup()
    render(<App/>)

    await user.click(screen.getByLabelText(/No/))
    await user.click(screen.getByRole('button', {name: /next/i}))
    await user.click(screen.getByLabelText(/Right/))
    await user.click(screen.getByRole('button', {name: /finish/i}))

    const stored = JSON.parse(localStorage.getItem('gh300-attempts') ?? '[]') as Array<any>
    expect(stored).toHaveLength(1)
    const attempt = stored[0]
    expect(attempt.attemptId).toBeTruthy()
    expect(attempt.score.correct).toBe(1)
    expect(attempt.score.total).toBe(2)
    expect(attempt.score.percent).toBe(50)
  })
})
