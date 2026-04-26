import { getAllZonesMeasures } from '@/services/monitoring.service'
import { Activity, Droplets, Thermometer, Zap, FlaskConical, Leaf, Wifi, WifiOff } from 'lucide-react'
import Link from 'next/link'

function HealthBar({ value }: { value: number }) {
  const color = value >= 8 ? '#16a34a' : value >= 5 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#f1f5f9', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 3, background: color, width: `${(value / 10) * 100}%` }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: 'monospace', minWidth: 32 }}>{value}/10</span>
    </div>
  )
}

export default async function MonitoringPage() {
  const data = await getAllZonesMeasures()

  const totalZones = data.reduce((a, u) => a + u.zones.length, 0)
  const allZones = data.flatMap(u => u.zones)
  const avgHumidity = allZones.length > 0
    ? Math.round(allZones.reduce((a, z) => a + (z.zoneData.humidity || 0), 0) / allZones.length)
    : 0
  const avgHealth = allZones.length > 0
    ? (allZones.reduce((a, z) => a + (z.zoneData.sante || 0), 0) / allZones.length).toFixed(1)
    : 0
  const onlineZones = allZones.filter(z => {
    const ts = z.lastMeasure?.timestamp?._seconds
    return ts && (Date.now() / 1000 - ts) < 3600
  }).length

  return (
    <div style={{ padding: '32px', fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>Monitoring</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Mesures en temps réel — toutes les zones</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Zones totales', value: totalZones, color: '#3b82f6', bg: '#eff6ff', icon: '🌿' },
          { label: 'Zones en ligne', value: onlineZones, color: '#16a34a', bg: '#f0fdf4', icon: '📡' },
          { label: 'Humidité moy.', value: `${avgHumidity}%`, color: '#14b8a6', bg: '#f0fdfa', icon: '💧' },
          { label: 'Santé moy.', value: `${avgHealth}/10`, color: '#8b5cf6', bg: '#f5f3ff', icon: '🌱' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: 'Syne, sans-serif' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Zones par utilisateur */}
      {data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', background: 'white', borderRadius: 16 }}>Aucune donnée</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {data.map(user => (
            <div key={user.uid} style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>

              {/* User header */}
              <div style={{ padding: '14px 24px', background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white' }}>
                    {user.userName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{user.userName}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{user.zones.length} zone{user.zones.length > 1 ? 's' : ''}</div>
                  </div>
                </div>
                <Link href={`/users/${user.uid}`} style={{ fontSize: 12, color: '#3b82f6', textDecoration: 'none', background: '#eff6ff', padding: '6px 14px', borderRadius: 8, border: '1px solid #bfdbfe', fontWeight: 600 }}>
                  Voir profil →
                </Link>
              </div>

              {/* Zones grid */}
              <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                {user.zones.map(zone => {
                  const z = zone.zoneData
                  const m = zone.lastMeasure
                  const isOnline = m?.timestamp?._seconds && (Date.now() / 1000 - m.timestamp._seconds) < 3600
                  const lastSeen = m?.timestamp?._seconds
                    ? new Date(m.timestamp._seconds * 1000).toLocaleString('fr-FR')
                    : '—'

                  return (
                    <div key={zone.zoneId} style={{ border: '1px solid #f1f5f9', borderRadius: 16, overflow: 'hidden' }}>

                      {/* Zone header */}
                      <div style={{ padding: '12px 16px', background: '#fafafa', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Leaf size={14} color="#16a34a" />
                          <span style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', fontFamily: 'monospace' }}>{zone.zoneId}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {isOnline
                            ? <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#16a34a', background: '#f0fdf4', padding: '3px 8px', borderRadius: 20, border: '1px solid #bbf7d0', fontWeight: 600 }}><Wifi size={10}/> En ligne</span>
                            : <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8', background: '#f8fafc', padding: '3px 8px', borderRadius: 20, border: '1px solid #e2e8f0', fontWeight: 600 }}><WifiOff size={10}/> Hors ligne</span>
                          }
                        </div>
                      </div>

                      {/* Metrics */}
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 12 }}>
                          {[
                            { icon: <Droplets size={13} color="#3b82f6"/>, label: 'Humidité', value: `${m?.humidity?.toFixed(1) || z.humidity?.toFixed(1)}%`, color: '#3b82f6' },
                            { icon: <Thermometer size={13} color="#f97316"/>, label: 'Température', value: `${m?.temperature?.toFixed(1) || z.temperature?.toFixed(1)}°C`, color: '#f97316' },
                            { icon: <Zap size={13} color="#eab308"/>, label: 'EC', value: `${m?.ec?.toFixed(2) || z.ec?.toFixed(2)}`, color: '#eab308' },
                            { icon: <FlaskConical size={13} color="#a855f7"/>, label: 'pH', value: `${m?.ph?.toFixed(2) || z.ph?.toFixed(2)}`, color: '#a855f7' },
                          ].map((metric, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', borderRadius: 10, padding: '8px 12px', border: '1px solid #f1f5f9' }}>
                              {metric.icon}
                              <div>
                                <div style={{ fontSize: 10, color: '#94a3b8' }}>{metric.label}</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: metric.color, fontFamily: 'monospace' }}>{metric.value}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Health */}
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Santé de la zone</div>
                          <HealthBar value={z.sante || 0} />
                        </div>

                        {/* Last seen */}
                        <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right' }}>
                          Dernière mesure : <span style={{ color: '#64748b' }}>{lastSeen}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
