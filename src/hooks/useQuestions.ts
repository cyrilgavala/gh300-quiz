import {useEffect, useState} from 'react'
import YAML from 'yaml'
import type {QuestionAttributes} from '../types'

const normalizeLetter = (letter: string) => letter.trim().toUpperCase()
type RawQuestion = Omit<QuestionAttributes, 'correctAnswers'> & {
  correct_answer?: string[];
  correctAnswer?: string[]
}

export default function useQuestions() {
  const [questions, setQuestions] = useState<QuestionAttributes[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadQuestions = async () => {
      try {
        const response = await fetch('/GH300-questions.yaml')
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`)
        }

        const text = await response.text()
        const parsed = (YAML.parse(text) as RawQuestion[] | null) ?? []
        const normalized: QuestionAttributes[] = parsed.map(({
                                                               correct_answer,
                                                               correctAnswer,
                                                               ...rest
                                                             }) => {
          const answersRaw = correct_answer ?? correctAnswer ?? []
          return {
            ...rest,
            correctAnswers: answersRaw.map(normalizeLetter),
          }
        })

        if (!cancelled) {
          setQuestions(normalized)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        if (!cancelled) setError(message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadQuestions()
    return () => {
      cancelled = true
    }
  }, [])

  return { questions, loading, error }
}
