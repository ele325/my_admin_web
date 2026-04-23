'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Alert } from '@/types'
import { formatTimestamp, cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Trash2, ArrowUpDown } from 'lucide-react'

interface AlertsViewProps {
  uid: string
  alerts: Record<string, Alert>
}

export function AlertsView({ uid, alerts }: AlertsViewProps) {
  const [sortAsc, setSortAsc] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const entries = Object.entries(alerts).sort((a, b) => {
    const timeA = a[1].timestamp?._seconds || 0
    const timeB = b[1].timestamp?._seconds || 0
    return sortAsc ? timeA - timeB : timeB - timeA
  })

  const getLevelBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">critical</Badge>
      case 'warning':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">warning</Badge>
      case 'info':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">info</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{level}</Badge>
    }
  }

  const handleDelete = async (alertId: string) => {
    setLoadingId(alertId)
    try {
      const res = await fetch(`/api/users/${uid}/alerts/${alertId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete')
      toast({ title: 'Alert deleted' })
      router.refresh()
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete alert',
        variant: 'destructive',
      })
    } finally {
      setLoadingId(null)
    }
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-agro-muted">
        No alerts found
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-agro-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-agro-border bg-agro-surface/50 hover:bg-agro-surface/50">
            <TableHead className="text-agro-muted">Zone</TableHead>
            <TableHead className="text-agro-muted">Type</TableHead>
            <TableHead className="text-agro-muted">Level</TableHead>
            <TableHead className="text-agro-muted">Humidity</TableHead>
            <TableHead className="text-agro-muted">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-agro-muted hover:text-agro-text"
                onClick={() => setSortAsc(!sortAsc)}
              >
                Timestamp
                <ArrowUpDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </TableHead>
            <TableHead className="text-agro-muted text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map(([alertId, alert]) => (
            <TableRow key={alertId} className="border-agro-border hover:bg-agro-card/50">
              <TableCell className="font-mono text-agro-text">{alert.zone_num}</TableCell>
              <TableCell className="text-agro-text">{alert.type}</TableCell>
              <TableCell>{getLevelBadge(alert.level)}</TableCell>
              <TableCell className="font-mono text-agro-text">{alert.humidity?.toFixed(1)}%</TableCell>
              <TableCell className="text-agro-muted text-sm">
                {formatTimestamp(alert.timestamp)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-8 w-8 p-0 text-agro-muted hover:text-red-400 hover:bg-red-500/10',
                    loadingId === alertId && 'opacity-50'
                  )}
                  onClick={() => handleDelete(alertId)}
                  disabled={loadingId === alertId}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
