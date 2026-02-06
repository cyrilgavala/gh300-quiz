import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Clean up React Testing Library DOM between tests
afterEach(() => {
  cleanup()
})

