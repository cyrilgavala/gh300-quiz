import { render, screen } from '@testing-library/react'
import Summary from './Summary'

describe('Summary', () => {
  it('shows score, percent, and note', () => {
    render(<Summary correct={3} total={5} onReview={() => {}} onRetake={() => {}} />)
    expect(screen.getByText('Your score')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('out of')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()
    expect(
      screen.getByText(/Solid effort\. You have a strong grasp, but a quick review/i),
    ).toBeInTheDocument()
  })
})

