import type {Attempt} from '../types'

const ATTEMPTS_KEY = 'gh300-attempts'

const safeParse = (value: string | null): Attempt[] => {
  if (!value) return []
  try {
    return JSON.parse(value) as Attempt[]
  } catch {
    return []
  }
}

export const loadAttempts = (): Attempt[] => safeParse(localStorage.getItem(ATTEMPTS_KEY))

export const saveAttempt = (attempt: Attempt) => {
  try {
    const current = loadAttempts()
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify([attempt, ...current]))
  } catch {
    // Ignore storage failures (private mode or quota)
  }
}

