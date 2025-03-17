"use client"

import { useState, useEffect, useCallback } from "react"
import { handleApiError, type ApiError } from "../utils/api-error-handler"

interface UseApiOptions<T> {
  initialData?: T
  autoFetch?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: ApiError) => void
}

interface UseApiResult<T> {
  data: T | undefined
  isLoading: boolean
  error: ApiError | null
  fetch: () => Promise<void>
  reset: () => void
}

// Generic hook for making API requests
export function useApi<T>(apiMethod: () => Promise<T>, options: UseApiOptions<T> = {}): UseApiResult<T> {
  const { initialData, autoFetch = true, onSuccess, onError } = options

  const [data, setData] = useState<T | undefined>(initialData)
  const [isLoading, setIsLoading] = useState<boolean>(autoFetch)
  const [error, setError] = useState<ApiError | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await apiMethod()
      setData(result)
      if (onSuccess) onSuccess(result)
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError)
      if (onError) onError(apiError)
    } finally {
      setIsLoading(false)
    }
  }, [apiMethod, onSuccess, onError])

  const reset = useCallback(() => {
    setData(initialData)
    setIsLoading(false)
    setError(null)
  }, [initialData])

  useEffect(() => {
    if (autoFetch) {
      fetch()
    }
  }, [fetch, autoFetch])

  return { data, isLoading, error, fetch, reset }
}

// Example usage:
// const { data: students, isLoading, error } = useApi(() => apiService.getStudents());

