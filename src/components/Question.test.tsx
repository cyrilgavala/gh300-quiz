import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Question from './Question'
import type {QuestionAttributes} from '../types'

const baseQuestion: QuestionAttributes = {
  id: 1,
  question: 'Sample question?',
  answers: ['First', 'Second', 'Third'],
  correctAnswers: ['A'],
  explanation: 'Because it is correct.'
}

const renderQuestion = (overrides?: Partial<React.ComponentProps<typeof Question>>) => {
  const onSelectAnswer = vi.fn()
  const onReset = vi.fn()
  const onReview = vi.fn()
  const onPrev = vi.fn()
  const onNext = vi.fn()
  const onFinish = vi.fn()

  const props: React.ComponentProps<typeof Question> = {
    question: baseQuestion,
    index: 0,
    total: 3,
    selectedAnswers: undefined,
    onSelectAnswer,
    onReset,
    onReview,
    onPrev,
    onNext,
    onFinish,
    canFinish: true,
    ...overrides,
  }

  const view = render(<Question {...props} />)
  return {view, onSelectAnswer, onReset, onReview, onPrev, onNext, onFinish}
}

describe('Question', () => {
  it('shows progress, question text, and uses radio inputs for single-answer', async () => {
    const user = userEvent.setup()
    const {onSelectAnswer} = renderQuestion()

    expect(screen.getByText('Question 1')).toBeInTheDocument()
    expect(screen.getByText('1/3')).toBeInTheDocument()

    const options = screen.getAllByRole('radio')
    expect(options).toHaveLength(3)

    await user.click(options[0])
    expect(onSelectAnswer).toHaveBeenCalledWith('A')
  })

  it('shows multi-select hint, checkboxes, and over-limit warning with disabled finish', () => {
    const selected = new Set(['A', 'B', 'C'])
    renderQuestion({
      question: {...baseQuestion, correctAnswers: ['A', 'B']},
      selectedAnswers: selected,
      total: 1,
      index: 0,
    })

    expect(screen.getByText(/Multiple answers are correct/i)).toBeInTheDocument()
    const boxes = screen.getAllByRole('checkbox')
    expect(boxes).toHaveLength(3)
    expect(screen.getByRole('alert')).toHaveTextContent('only 2 are correct')
    expect(screen.getByRole('button', {name: /Finish/})).toBeDisabled()
  })

  it('shows skip notice on last question when nothing selected', () => {
    renderQuestion({
      index: 0,
      total: 1,
      selectedAnswers: new Set(),
    })

    expect(
        screen.getByText('You have not selected an answer for this question. Finishing now will count it as incorrect.'),
    ).toBeInTheDocument()
  })

  it('fires reset callback when clicking reset selection', async () => {
    const user = userEvent.setup()
    const {onReset} = renderQuestion({index: 1, total: 2})

    await user.click(screen.getByRole('button', {name: /Reset selection/i}))
    expect(onReset).toHaveBeenCalled()
  })

  it('fires review callback when clicking review answers', async () => {
    const user = userEvent.setup()
    const {onReview} = renderQuestion({index: 1, total: 2})

    await user.click(screen.getByRole('button', {name: /Review answers/i}))
    expect(onReview).toHaveBeenCalled()
  })

  it('fires previous and next navigation callbacks', async () => {
    const user = userEvent.setup()
    const first = renderQuestion({index: 1, total: 2})

    await user.click(screen.getByRole('button', {name: /Previous/i}))
    expect(first.onPrev).toHaveBeenCalled()

    first.view.unmount()

    const {onNext, view: nextView} = renderQuestion({index: 0, total: 2})
    await user.click(screen.getByRole('button', {name: /Next/i}))
    expect(onNext).toHaveBeenCalled()

    nextView.unmount()
  })

  it('fires finish callback when finish is enabled', async () => {
    const user = userEvent.setup()
    const {onFinish} = renderQuestion({index: 0, total: 1, canFinish: true})

    await user.click(screen.getByRole('button', {name: /Finish/i}))
    expect(onFinish).toHaveBeenCalled()
  })
})
