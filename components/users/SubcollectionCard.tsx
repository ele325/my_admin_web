'use client'

import Link from 'next/link'
import { ChevronRight, Bell, Terminal, Settings, BarChart3, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface SubcollectionCardProps {
  uid: string
  name: string
  count: number
}

const icons: Record<string, typeof Bell> = {
  alerts: Bell,
  commands: Terminal,
  config: Settings,
  predictions: BarChart3,
  zones: MapPin,
}

export function SubcollectionCard({ uid, name, count }: SubcollectionCardProps) {
  const Icon = icons[name] || Settings

  return (
    <Link href={`/users/${uid}/${name}`}>
      <Card className="bg-agro-surface border-agro-border hover:border-agro-green/50 hover:bg-agro-card transition-all cursor-pointer group">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-agro-card group-hover:bg-agro-green/20 transition-colors">
              <Icon className="h-5 w-5 text-agro-muted group-hover:text-agro-accent transition-colors" />
            </div>
            <div>
              <p className="font-mono text-agro-text">{name}</p>
              <p className="text-sm text-agro-muted">
                {count} {count === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-agro-muted group-hover:text-agro-accent transition-colors" />
        </CardContent>
      </Card>
    </Link>
  )
}
