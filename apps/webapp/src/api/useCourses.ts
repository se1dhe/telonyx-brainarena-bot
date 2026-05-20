import { useEffect, useState, useCallback } from 'react'
import { Landmark, BookOpen, Brain, Star, type LucideIcon } from 'lucide-react'
import { fetchCourses } from './client'
import type { CategorySummary } from './contracts'

const ICON_MAP: Record<string, LucideIcon> = {
  'general-knowledge': Landmark,
  'roman-history': BookOpen,
  'logic': Brain
}

export function useCourses(initData = '') {
  const [courses, setCourses] = useState<CategorySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadCourses = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchCourses(initData, signal)
      
      const mapped = data.map((c) => ({
        slug: c.slug,
        title: c.title,
        icon: ICON_MAP[c.slug] || Star,
        rating: 0,
        maxStars: c.maxStars,
        earnedStars: c.earnedStars
      }))
      
      setCourses(mapped)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err : new Error('Unknown error loading courses'))
    } finally {
      setLoading(false)
    }
  }, [initData])

  useEffect(() => {
    const controller = new AbortController()
    loadCourses(controller.signal)
    return () => controller.abort()
  }, [loadCourses])

  return {
    courses,
    loading,
    error,
    refresh: () => loadCourses()
  }
}
