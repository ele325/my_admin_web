'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CopyableTextProps {
  text: string
  displayText?: string
  className?: string
}

export function CopyableText({ text, displayText, className }: CopyableTextProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-sm hover:text-agro-accent transition-colors group',
        className
      )}
    >
      <span>{displayText || text}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-400" />
      ) : (
        <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  )
}
