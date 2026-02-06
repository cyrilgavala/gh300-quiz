import { render, screen } from '@testing-library/react'
import Card from './Card'
import type { ReactNode } from 'react'

describe('Card', () => {
  const renderCard = (header?: ReactNode) =>
    render(
      <Card header={header} data-testid="card">
        <div>Body content</div>
      </Card>,
    )

  it('renders header and children', () => {
    renderCard(<h3>Header text</h3>)
    expect(screen.getByText('Header text')).toBeInTheDocument()
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })

  it('renders without header when omitted', () => {
    renderCard()
    expect(screen.getByTestId('card')).toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})

