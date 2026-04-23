'use client'

import type { Prediction } from '@/types'
import { formatTimestamp, getTrendIcon, cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface PredictionsViewProps {
  predictions: Record<string, Prediction>
}

export function PredictionsView({ predictions }: PredictionsViewProps) {
  const entries = Object.entries(predictions)

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-agro-muted">
        No predictions found
      </div>
    )
  }

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-400'
    if (value < 0) return 'text-red-400'
    return 'text-agro-muted'
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {entries.map(([predId, pred]) => (
        <Card key={predId} className="bg-agro-card border-agro-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="font-mono text-base text-agro-text">
                Zone {pred.zone_num}
              </CardTitle>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                {pred.type}
              </Badge>
            </div>
            <p className="text-xs text-agro-muted">
              {formatTimestamp(pred.timestamp)}
            </p>
          </CardHeader>
          <CardContent>
            {/* Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-agro-muted">Prediction Score</span>
                <span className="font-mono text-agro-text">{(pred.score * 100).toFixed(1)}%</span>
              </div>
              <Progress value={pred.score * 100} className="h-2" />
            </div>

            {/* Humidity Comparison */}
            <div className="bg-agro-surface rounded-lg p-3 mb-3">
              <p className="text-xs text-agro-muted mb-2">Humidity</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-agro-muted">Actual</p>
                  <p className="font-mono text-agro-text">{pred.humidity?.toFixed(1)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-agro-muted">Predicted</p>
                  <p className="font-mono text-blue-400">{pred.pred_humidity?.toFixed(1)}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-agro-muted">R²</p>
                  <p className="font-mono text-agro-text">{pred.r2_humidity?.toFixed(3)}</p>
                </div>
              </div>
            </div>

            {/* Trends */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-xs text-agro-muted">Humidity</p>
                <p className={cn('font-mono', getTrendColor(pred.trend_humidity))}>
                  {getTrendIcon(pred.trend_humidity)}
                </p>
              </div>
              <div>
                <p className="text-xs text-agro-muted">Temp</p>
                <p className={cn('font-mono', getTrendColor(pred.trend_temp))}>
                  {getTrendIcon(pred.trend_temp)}
                </p>
              </div>
              <div>
                <p className="text-xs text-agro-muted">EC</p>
                <p className={cn('font-mono', getTrendColor(pred.trend_ec))}>
                  {getTrendIcon(pred.trend_ec)}
                </p>
              </div>
              <div>
                <p className="text-xs text-agro-muted">N</p>
                <p className={cn('font-mono', getTrendColor(pred.trend_n))}>
                  {getTrendIcon(pred.trend_n)}
                </p>
              </div>
            </div>

            {/* Reason if present */}
            {pred.raison && (
              <p className="mt-3 text-xs text-agro-muted border-t border-agro-border pt-3">
                {pred.raison}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
