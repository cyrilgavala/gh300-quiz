import {useEffect, useState} from 'react'
import YAML from 'yaml'
import type {QuestionAttributes} from '../types'

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
          setError('Failed to load questions')
          return
        }

        const text = await response.text()
        const parsed = (YAML.parse(text) as QuestionAttributes[] | null) ?? []
        setQuestions(parsed)
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

  return {questions, loading, error}
}
