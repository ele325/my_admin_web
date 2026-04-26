import { getAlertsByUser } from '@/services/alert.service'
import { getUserById } from '@/services/user.service'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, AlertTriangle, Trash2 } from 'lucide-react'

export default async function AlertsPage({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params
  const user = await getUserById(uid)
  if (!user) notFound()
  const alerts = await getAlertsByUser(uid)
  const entries = Object.entries(alerts).sort((a, b) =>
    (b[1].timestamp?._seconds || 0) - (a[1].timestamp?._seconds || 0)
  )

  const levelColor = (level: string) => {
    if (level === 'critique' || level === 'critical') return { bg: '#fee2e2', color: '#dc2626', dot: '#ef4444' }
    if (level === 'warning') return { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b' }
    return { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' }
  }

  return (
    <div style={{ padding: '32px', fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13 }}>
        <Link href="/users" style={{ color: '#94a3b8', textDecoration: 'none' }}>Utilisateurs</Link>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <Link href={`/users/${uid}`} style={{ color: '#94a3b8', textDecoration: 'none' }}>{user.fullName}</Link>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <span style={{ color: '#0f172a', fontWeight: 500 }}>Alertes</span>
      </div>
      <Link href={`/users/${uid}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 24 }}>
        <ChevronLeft size={14} /> Retour au profil
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertTriangle size={20} color="#f59e0b" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0 }}>Alertes de {user.fullName}</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{entries.length} alerte{entries.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0' }}>Aucune alerte</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {entries.map(([alertId, alert]) => {
            const lc = levelColor(alert.level)
            const date = alert.timestamp?._seconds
              ? new Date(alert.timestamp._seconds * 1000).toLocaleString('fr-FR')
              : '—'
            return (
              <div key={alertId} style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: lc.dot, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>Zone {alert.zone_num}</span>
                    <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, background: lc.bg, color: lc.color, fontWeight: 600 }}>{alert.level}</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>{alert.type}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#94a3b8' }}>
                    <span>Humidité : <strong style={{ color: '#0f172a' }}>{alert.humidity?.toFixed(1)}%</strong></span>
                    <span>{date}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
