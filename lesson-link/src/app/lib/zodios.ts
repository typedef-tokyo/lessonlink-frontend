'use client'
import { QueryClient } from '@tanstack/react-query'
import { ZodiosHooks } from '@zodios/react'
import { createApiClient } from '@/generated/api'
import { Env } from './env'

const MaxRetry = 3

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry(failureCount, error) {
        const method = (error as any)?.config?.method?.toUpperCase()
        if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
          return false
        }

        if (error && typeof error === 'object' && 'response' in error) {
          const status = (error as any).response?.status
          if (status >= 400 && status < 500) return false
        }

        return failureCount < MaxRetry
      },
      retryDelay: attemptIndex => Math.min(100 * 2 ** attemptIndex, 1000),
    },
  },
})

export const apiClient = createApiClient(Env.apiBaseUrl, { axiosConfig: { withCredentials: true } })
export const apiHooks = new ZodiosHooks('api', apiClient)
