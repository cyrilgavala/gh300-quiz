import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.tsx'

vi.mock('./hooks/useQuestions', () => {
  const questions = [
    {
      id: 1,
      question: 'How can you use GitHub Copilot to get inline suggestions for refactoring your code?',
      answers: [
        'By adding comments to your code and triggering a suggestion.',
        "By highlighting the code you want to fix, right-clicking, and selecting 'Fix using GitHub Copilot.'",
        'By running the gh copilot fix command.',
        "By using the '/fix' command in GitHub Copilot in-line chat.",
        "By highlighting the code you want to fix, right-clicking, and selecting 'Refactor using GitHub Copilot.'",
      ],
      correctAnswer: ['A', 'E'],
      explanation: 'You can use comments or the refactor context menu for inline suggestions.',
    },
    {
      id: 2,
      question: 'Second question?',
      answers: ['Left', 'Right', 'Up'],
      correctAnswer: ['B'],
      explanation: 'Right is correct',
    },
  ]
  return {
    default: () => ({questions, loading: false, error: null}),
  }
})

describe('App', () => {
  beforeAll(() => {
    // Prevent scroll errors in jsdom
    window.scrollTo = vi.fn()
  })

  it('walks through the wizard and shows summary score', async () => {
    const user = userEvent.setup()
    render(<App/>)

    await user.click(screen.getByRole('button', {name: /start quiz/i}))
    expect(screen.getByText(/inline suggestions for refactoring/i)).toBeInTheDocument()

    await user.click(screen.getByLabelText(/adding comments/i))
    await user.click(screen.getByLabelText(/refactor using github copilot/i))
    await user.click(screen.getByRole('button', {name: /next/i}))

    expect(screen.getByText('Second question?')).toBeInTheDocument()

    await user.click(screen.getByLabelText(/Right/))
    await user.click(screen.getByRole('button', {name: /finish/i}))

    expect(screen.getByText('Your score')).toBeInTheDocument()
    expect(screen.getAllByText('20')).toHaveLength(2)
    expect(screen.getByText(/points of/i)).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText(/Passed \(70% threshold\)/i)).toBeInTheDocument()
  })

  it('shows a warning when selecting too many answers for a multi-select question', async () => {
    const user = userEvent.setup()
    render(<App/>)

    await user.click(screen.getByRole('button', {name: /start quiz/i}))
    await user.click(screen.getByLabelText(/adding comments/i))
    await user.click(screen.getByLabelText(/fix using github copilot/i))
    await user.click(screen.getByLabelText(/gh copilot fix command/i))

    expect(screen.getByRole('alert')).toHaveTextContent('only 2 are correct')
  })

  it('resets selected answers for the current question', async () => {
    const user = userEvent.setup()
    render(<App/>)

    await user.click(screen.getByRole('button', {name: /start quiz/i}))
    const first = screen.getByLabelText(/adding comments/i)
    const second = screen.getByLabelText(/refactor using github copilot/i)

    await user.click(first)
    await user.click(second)
    expect((first as HTMLInputElement).checked).toBe(true)
    expect((second as HTMLInputElement).checked).toBe(true)

    await user.click(screen.getByRole('button', {name: /reset selection/i}))

    expect((first as HTMLInputElement).checked).toBe(false)
    expect((second as HTMLInputElement).checked).toBe(false)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('allows opening review from the quiz and returning back', async () => {
    const user = userEvent.setup()
    render(<App/>)

    await user.click(screen.getByRole('button', {name: /start quiz/i}))
    await user.click(screen.getByRole('button', {name: /review answers/i}))
    expect(screen.getByText('Review')).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /back to quiz/i})).toBeInTheDocument()

    await user.click(screen.getByRole('button', {name: /back to quiz/i}))
    expect(screen.getByText(/inline suggestions for refactoring/i)).toBeInTheDocument()
  })
})
