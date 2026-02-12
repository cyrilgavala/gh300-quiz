import {render, screen} from '@testing-library/react'
import Summary from './Summary'

describe('Summary', () => {
  it('shows score, percent, and note', () => {
    render(
        <Summary
            points={30}
            totalPoints={50}
            onReview={() => {
            }}
            onRetake={() => {
            }}
        />,
    )
    expect(screen.getByText('Your score')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText(/points of/i)).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()
    expect(screen.getByText(/Not passed/)).toBeInTheDocument()
    expect(
      screen.getByText(/Solid effort\. You have a strong grasp, but a quick review/i),
    ).toBeInTheDocument()
  })
})
