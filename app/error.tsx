'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-agro-bg flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-red-500/10">
            <AlertTriangle className="h-12 w-12 text-red-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-agro-text mb-2">Something went wrong</h1>
        <p className="text-agro-muted mb-6 max-w-md">
          An error occurred while loading this page. Please try again.
        </p>
        <Button
          onClick={reset}
          className="bg-agro-accent hover:bg-agro-accent-muted text-agro-bg"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  )
}
