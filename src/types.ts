export type QuestionAttributes = {
  id: number
  question: string
  answers: string[]
  correctAnswers: string[]
  explanation: string
}

export type Score = {
  points: number,
  totalPoints: number
}

export type Attempt = {
  attemptId: string
  startedAt: string
  completedAt: string
  score: Score
  notes?: string
}
