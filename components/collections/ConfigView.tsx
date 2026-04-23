'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Config } from '@/types'
import { formatTimestamp } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { useToast } from '@/hooks/use-toast'
import { Spinner } from '@/components/ui/spinner'
import { Save } from 'lucide-react'

interface ConfigViewProps {
  uid: string
  config: Config | null
}

export function ConfigView({ uid, config }: ConfigViewProps) {
  const [defaultDuration, setDefaultDuration] = useState(config?.defaultDuration || 0)
  const [maxHumidity, setMaxHumidity] = useState(config?.maxHumidity || 100)
  const [minHumidity, setMinHumidity] = useState(config?.minHumidity || 0)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  if (!config) {
    return (
      <div className="text-center py-12 text-agro-muted">
        No configuration found
      </div>
    )
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${uid}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultDuration,
          maxHumidity,
          minHumidity,
          updatedAt: config.updatedAt,
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast({ title: 'Configuration saved' })
      router.refresh()
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save configuration',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-agro-card border-agro-border max-w-xl">
      <CardHeader className="border-b border-agro-border">
        <CardTitle className="text-agro-text">User Configuration</CardTitle>
        <p className="text-xs text-agro-muted">
          Last updated: {formatTimestamp(config.updatedAt)}
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <FieldGroup>
          <Field>
            <FieldLabel className="text-agro-muted">Default Duration (seconds)</FieldLabel>
            <Input
              type="number"
              value={defaultDuration}
              onChange={(e) => setDefaultDuration(Number(e.target.value))}
              className="bg-agro-surface border-agro-border text-agro-text"
            />
          </Field>

          <Field>
            <FieldLabel className="text-agro-muted">
              Max Humidity: <span className="font-mono text-agro-accent">{maxHumidity}%</span>
            </FieldLabel>
            <Slider
              value={[maxHumidity]}
              onValueChange={([value]) => setMaxHumidity(value)}
              max={100}
              min={0}
              step={1}
              className="py-2"
            />
          </Field>

          <Field>
            <FieldLabel className="text-agro-muted">
              Min Humidity: <span className="font-mono text-agro-accent">{minHumidity}%</span>
            </FieldLabel>
            <Slider
              value={[minHumidity]}
              onValueChange={([value]) => setMinHumidity(value)}
              max={100}
              min={0}
              step={1}
              className="py-2"
            />
          </Field>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-agro-accent hover:bg-agro-accent-muted text-agro-bg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Configuration
              </span>
            )}
          </Button>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
