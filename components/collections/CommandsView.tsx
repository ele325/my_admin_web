'use client'

import type { Command } from '@/types'
import { formatTimestamp } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CommandsViewProps {
  uid: string
  commands: Record<string, Command>
}

export function CommandsView({ commands }: CommandsViewProps) {
  const entries = Object.entries(commands)

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-agro-muted">
        No commands found
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {entries.map(([commandId, command]) => (
        <Card key={commandId} className="bg-agro-card border-agro-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-sm text-agro-muted">{commandId}</span>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {command.mode}
                </Badge>
                <div
                  className={`h-3 w-3 rounded-full ${
                    command.isOn ? 'bg-green-400' : 'bg-red-400'
                  }`}
                  title={command.isOn ? 'On' : 'Off'}
                />
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-agro-muted">Frequency</span>
                <span className="font-mono text-agro-text">{command.frequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-agro-muted">Last Update</span>
                <span className="text-agro-text text-xs">
                  {formatTimestamp(command.lastUpdate)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
