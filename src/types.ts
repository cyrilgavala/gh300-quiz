export interface Question {
  id: number
  question: string
  answers: string[]
  correctAnswers: string[]
  explanation: string
}

export type Attempt = {
  attemptId: string
  startedAt: string
  completedAt: string
  score: {
    correct: number
    total: number
    percent: number
  }
  notes?: string
}
