'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Zone } from '@/types'
import { cn, getHealthBgColor, formatTimestamp } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserFieldTree } from '@/components/users/UserFieldTree'
import { useToast } from '@/hooks/use-toast'
import { ChevronDown, ChevronUp, Trash2, Droplets, Thermometer, Zap, FlaskConical } from 'lucide-react'

interface ZonesViewProps {
  uid: string
  zones: Record<string, Zone>
}

export function ZonesView({ uid, zones }: ZonesViewProps) {
  const [expandedZones, setExpandedZones] = useState<Set<string>>(new Set())
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const router = useRouter()
  const { toast } = useToast()

  const toggleExpand = (zoneId: string) => {
    setExpandedZones((prev) => {
      const next = new Set(prev)
      if (next.has(zoneId)) {
        next.delete(zoneId)
      } else {
        next.add(zoneId)
      }
      return next
    })
  }

  const handleToggleEnabled = async (zoneId: string, enabled: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [zoneId]: true }))
    try {
      const res = await fetch(`/api/users/${uid}/zones/${zoneId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      })
      if (!res.ok) throw new Error('Failed to update zone')
      router.refresh()
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update zone status',
        variant: 'destructive',
      })
    } finally {
      setLoadingStates((prev) => ({ ...prev, [zoneId]: false }))
    }
  }

  const handleDelete = async (zoneId: string) => {
    if (!confirm('Are you sure you want to delete this zone?')) return
    setLoadingStates((prev) => ({ ...prev, [zoneId]: true }))
    try {
      const res = await fetch(`/api/users/${uid}/zones/${zoneId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete zone')
      toast({ title: 'Zone deleted' })
      router.refresh()
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete zone',
        variant: 'destructive',
      })
    } finally {
      setLoadingStates((prev) => ({ ...prev, [zoneId]: false }))
    }
  }

  const entries = Object.entries(zones)

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-agro-muted">
        No zones found
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {entries.map(([zoneId, zone]) => (
        <Card key={zoneId} className="bg-agro-card border-agro-border">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle className="font-mono text-agro-text text-base">{zoneId}</CardTitle>
              <p className="text-xs text-agro-muted mt-1">
                Last updated: {formatTimestamp(zone.last_updated)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={zone.enabled}
                disabled={loadingStates[zoneId]}
                onCheckedChange={(checked) => handleToggleEnabled(zoneId, checked)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-agro-muted hover:text-red-400 hover:bg-red-500/10"
                onClick={() => handleDelete(zoneId)}
                disabled={loadingStates[zoneId]}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Metrics Grid */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              <div className="text-center p-2 bg-agro-surface rounded-lg">
                <Droplets className="h-4 w-4 mx-auto text-blue-400 mb-1" />
                <p className="text-xs text-agro-muted">Humidity</p>
                <p className="text-sm font-mono text-agro-text">{zone.humidity?.toFixed(1)}%</p>
              </div>
              <div className="text-center p-2 bg-agro-surface rounded-lg">
                <Thermometer className="h-4 w-4 mx-auto text-orange-400 mb-1" />
                <p className="text-xs text-agro-muted">Temp</p>
                <p className="text-sm font-mono text-agro-text">{zone.temperature?.toFixed(1)}°</p>
              </div>
              <div className="text-center p-2 bg-agro-surface rounded-lg">
                <Zap className="h-4 w-4 mx-auto text-yellow-400 mb-1" />
                <p className="text-xs text-agro-muted">EC</p>
                <p className="text-sm font-mono text-agro-text">{zone.ec?.toFixed(2)}</p>
              </div>
              <div className="text-center p-2 bg-agro-surface rounded-lg">
                <FlaskConical className="h-4 w-4 mx-auto text-purple-400 mb-1" />
                <p className="text-xs text-agro-muted">pH</p>
                <p className="text-sm font-mono text-agro-text">{zone.ph?.toFixed(1)}</p>
              </div>
              <div className="text-center p-2 bg-agro-surface rounded-lg">
                <p className="text-xs text-agro-muted mb-1">Health</p>
                <Badge className={cn('text-xs', getHealthBgColor(zone.sante))}>
                  {zone.sante}
                </Badge>
              </div>
            </div>

            {/* Expand/Collapse */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-agro-muted hover:text-agro-text"
              onClick={() => toggleExpand(zoneId)}
            >
              {expandedZones.has(zoneId) ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> Show Details
                </>
              )}
            </Button>

            {expandedZones.has(zoneId) && (
              <div className="mt-3 pt-3 border-t border-agro-border">
                <UserFieldTree data={zone as unknown as Record<string, unknown>} />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
