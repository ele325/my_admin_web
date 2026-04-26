import { getPredictionsByUser } from '@/services/prediction.service'
import { getUserById } from '@/services/user.service'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, TrendingUp } from 'lucide-react'
import { PredictionsView } from '@/components/collections/PredictionsView'

export default async function PredictionsPage({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params
  const user = await getUserById(uid)
  if (!user) notFound()
  const predictions = await getPredictionsByUser(uid)

  return (
    <div style={{ padding: '32px', fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13 }}>
        <Link href="/users" style={{ color: '#94a3b8', textDecoration: 'none' }}>Utilisateurs</Link>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <Link href={`/users/${uid}`} style={{ color: '#94a3b8', textDecoration: 'none' }}>{user.fullName}</Link>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <span style={{ color: '#0f172a', fontWeight: 500 }}>Prédictions</span>
      </div>
      <Link href={`/users/${uid}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 24 }}>
        <ChevronLeft size={14} /> Retour au profil
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TrendingUp size={20} color="#8b5cf6" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0 }}>Prédictions de {user.fullName}</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{Object.keys(predictions).length} prédiction{Object.keys(predictions).length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <PredictionsViewModern uid={uid} predictions={predictions} />
    </div>
  )
}

function PredictionsViewModern({ predictions }: { uid: string, predictions: Record<string, any> }) {
  const entries = Object.entries(predictions).sort((a, b) =>
    (b[1].timestamp?._seconds || 0) - (a[1].timestamp?._seconds || 0)
  )

  if (entries.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0' }}>Aucune prédiction</div>
    )
  }

  const getTrend = (v: number) => v > 0 ? '↑' : v < 0 ? '↓' : '→'
  const getTrendColor = (v: number) => v > 0 ? '#16a34a' : v < 0 ? '#dc2626' : '#94a3b8'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
      {entries.map(([predId, pred]) => {
        const score = Math.round((pred.score || 0) * 100 > 100 ? pred.score || 0 : (pred.score || 0) * 100)
        const date = pred.timestamp?._seconds
          ? new Date(pred.timestamp._seconds * 1000).toLocaleString('fr-FR')
          : '—'
        return (
          <div key={predId} style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #f5f3ff 0%, #faf5ff 100%)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Zone {pred.zone_num}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{date}</div>
              </div>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#f5f3ff', color: '#8b5cf6', border: '1px solid #e9d5ff', fontWeight: 600 }}>{pred.type}</span>
            </div>

            {/* Score bar */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                <span>Score de prédiction</span>
                <span style={{ fontWeight: 700, color: '#8b5cf6', fontFamily: 'monospace' }}>{score}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: '#f1f5f9', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 4, background: score >= 80 ? '#16a34a' : score >= 60 ? '#f59e0b' : '#ef4444', width: `${Math.min(score, 100)}%`, transition: 'width 0.3s' }} />
              </div>
            </div>

            {/* Humidity comparison */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Humidité</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
                {[
                  { label: 'Réelle', value: `${pred.humidity?.toFixed(1)}%`, color: '#0f172a' },
                  { label: 'Prédite', value: `${pred.pred_humidity?.toFixed(1)}%`, color: '#3b82f6' },
                  { label: 'R²', value: pred.r2_humidity?.toFixed(3), color: '#8b5cf6' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: 8, padding: '8px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: item.color, fontFamily: 'monospace' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trends */}
            <div style={{ padding: '14px 20px' }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tendances</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, textAlign: 'center' }}>
                {[
                  { label: 'Humidité', value: pred.trend_humidity },
                  { label: 'Temp', value: pred.trend_temp },
                  { label: 'EC', value: pred.trend_ec },
                  { label: 'Azote', value: pred.trend_n },
                ].map((t, i) => (
                  <div key={i} style={{ background: '#fafafa', borderRadius: 8, padding: '8px 4px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>{t.label}</div>
                    <div style={{ fontSize: 18, color: getTrendColor(t.value) }}>{getTrend(t.value)}</div>
                  </div>
                ))}
              </div>
            </div>

            {pred.raison && (
              <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', fontSize: 12, color: '#64748b', background: '#fafafa', fontStyle: 'italic' }}>
                {pred.raison}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
