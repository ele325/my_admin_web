'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { cn, formatTimestamp } from '@/lib/utils'
import type { Timestamp } from '@/types'

interface FieldTreeProps {
  data: Record<string, unknown>
  excludeKeys?: string[]
}

function isTimestamp(value: unknown): value is Timestamp {
  return (
    typeof value === 'object' &&
    value !== null &&
    '_seconds' in value &&
    '_nanoseconds' in value
  )
}

function renderValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-agro-muted italic">null</span>
  }

  if (typeof value === 'string') {
    return <span className="text-green-400">&quot;{value}&quot;</span>
  }

  if (typeof value === 'number') {
    return <span className="text-blue-400">{value}</span>
  }

  if (typeof value === 'boolean') {
    return (
      <span
        className={cn(
          'px-2 py-0.5 rounded text-xs font-medium',
          value ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'
        )}
      >
        {value.toString()}
      </span>
    )
  }

  if (isTimestamp(value)) {
    return <span className="text-purple-400">{formatTimestamp(value)}</span>
  }

  return null
}

function FieldItem({
  name,
  value,
  depth = 0,
}: {
  name: string
  value: unknown
  depth?: number
}) {
  const [isOpen, setIsOpen] = useState(depth < 1)

  const isObject =
    typeof value === 'object' &&
    value !== null &&
    !isTimestamp(value) &&
    !Array.isArray(value)

  const isArray = Array.isArray(value)
  const isExpandable = isObject || isArray

  if (isExpandable) {
    const entries = isArray
      ? value.map((v, i) => [i.toString(), v] as const)
      : Object.entries(value as Record<string, unknown>)

    return (
      <div className="py-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 w-full text-left group"
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-agro-muted shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-agro-muted shrink-0" />
          )}
          <span className="font-mono text-sm text-agro-muted group-hover:text-agro-text">
            {name}
          </span>
          <span className="text-agro-muted/50 text-xs ml-1">
            {isArray ? `[${entries.length}]` : `{${entries.length}}`}
          </span>
        </button>
        {isOpen && (
          <div className="ml-4 pl-3 border-l border-agro-border/50 mt-1">
            {entries.map(([key, val]) => (
              <FieldItem key={key} name={key} value={val} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 py-1">
      <span className="font-mono text-sm text-agro-muted">{name}:</span>
      {renderValue(value)}
    </div>
  )
}

export function UserFieldTree({ data, excludeKeys = [] }: FieldTreeProps) {
  const entries = Object.entries(data).filter(([key]) => !excludeKeys.includes(key))

  return (
    <div className="font-mono text-sm">
      {entries.map(([key, value]) => (
        <FieldItem key={key} name={key} value={value} />
      ))}
    </div>
  )
}
