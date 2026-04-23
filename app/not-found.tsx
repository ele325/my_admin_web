import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-agro-bg flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-agro-card">
            <FileQuestion className="h-12 w-12 text-agro-muted" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-agro-text mb-2">Document not found</h1>
        <p className="text-agro-muted mb-6 max-w-md">
          The document or page you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button asChild className="bg-agro-accent hover:bg-agro-accent-muted text-agro-bg">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
