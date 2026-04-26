import { getAllSensorsData } from '@/services/sensor.service'
import { Radio, Wifi, WifiOff, Activity, Cpu, Hash } from 'lucide-react'
import Link from 'next/link'

function SignalBar({ rssi }: { rssi: number }) {
  const strength = rssi >= -50 ? 4 : rssi >= -65 ? 3 : rssi >= -80 ? 2 : 1
  const color = strength === 4 ? '#16a34a' : strength === 3 ? '#84cc16' : strength === 2 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 16 }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{
          width: 4, borderRadius: 1,
          height: i * 4,
          background: i <= strength ? color : '#e2e8f0',
        }} />
      ))}
    </div>
  )
}

export default async function CapteursPage() {
  const data = await getAllSensorsData()

  const totalZones = data.reduce((a, u) => a + u.zones.length, 0)
  const totalSignals = data.reduce((a, u) => a + u.zones.reduce((b, z) => b + z.signals.length, 0), 0)
  const totalUsers = data.length

  return (
    <div style={{ padding: '32px', fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #16a34a, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>Capteurs</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Signaux et données par zone</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Utilisateurs actifs', value: totalUsers, color: '#16a34a', bg: '#f0fdf4', icon: '👤' },
          { label: 'Zones surveillées', value: totalZones, color: '#3b82f6', bg: '#eff6ff', icon: '🌿' },
          { label: 'Signaux récents', value: totalSignals, color: '#8b5cf6', bg: '#f5f3ff', icon: '📡' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 16, padding: '20px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: 'Syne, sans-serif' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Users > Zones > Signals */}
      {data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0' }}>Aucun capteur trouvé</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {data.map(user => (
            <div key={user.uid} style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>

              {/* User header */}
              <div style={{ padding: '16px 24px', background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'white' }}>
                    {user.userName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{user.userName}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{user.uid.slice(0, 20)}...</div>
                  </div>
                </div>
                <Link href={`/users/${user.uid}`} style={{ fontSize: 12, color: '#16a34a', textDecoration: 'none', background: '#f0fdf4', padding: '6px 14px', borderRadius: 8, border: '1px solid #bbf7d0', fontWeight: 600 }}>
                  Voir profil →
                </Link>
              </div>

              {/* Zones */}
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {user.zones.map(zone => {
                  const z = zone.zoneData
                  const latestSignal = zone.signals[0]
                  const isOnline = latestSignal?.timestamp?._seconds
                    ? (Date.now() / 1000 - latestSignal.timestamp._seconds) < 3600
                    : false

                  return (
                    <div key={zone.zoneId} style={{ border: '1px solid #f1f5f9', borderRadius: 16, overflow: 'hidden' }}>

                      {/* Zone header */}
                      <div style={{ padding: '14px 20px', background: '#fafafa', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🌿</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', fontFamily: 'monospace' }}>{zone.zoneId}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>Santé : {z.sante}/10 · {zone.signals.length} signaux</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {isOnline
                            ? <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#16a34a', background: '#f0fdf4', padding: '4px 10px', borderRadius: 20, border: '1px solid #bbf7d0', fontWeight: 600 }}><Wifi size={11}/> En ligne</span>
                            : <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8', background: '#f8fafc', padding: '4px 10px', borderRadius: 20, border: '1px solid #e2e8f0', fontWeight: 600 }}><WifiOff size={11}/> Hors ligne</span>
                          }
                        </div>
                      </div>

                      {/* Zone metrics */}
                      <div style={{ padding: '14px 20px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, borderBottom: '1px solid #f1f5f9' }}>
                        {[
                          { label: 'Humidité', value: `${z.humidity?.toFixed(1)}%`, color: '#3b82f6' },
                          { label: 'Temp', value: `${z.temperature?.toFixed(1)}°C`, color: '#f97316' },
                          { label: 'pH', value: z.ph?.toFixed(2), color: '#a855f7' },
                          { label: 'EC', value: z.ec?.toFixed(2), color: '#eab308' },
                          { label: 'Santé', value: `${z.sante}/10`, color: z.sante >= 8 ? '#16a34a' : z.sante >= 5 ? '#f59e0b' : '#ef4444' },
                        ].map((m, i) => (
                          <div key={i} style={{ textAlign: 'center', background: 'white', borderRadius: 10, padding: '10px 8px', border: '1px solid #f1f5f9' }}>
                            <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>{m.label}</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: m.color, fontFamily: 'monospace' }}>{m.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Signals table */}
                      {zone.signals.length > 0 && (
                        <div style={{ padding: '14px 20px' }}>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Signaux récents</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {zone.signals.slice(0, 5).map((sig, i) => {
                              const ts = sig.timestamp?._seconds
                                ? new Date(sig.timestamp._seconds * 1000).toLocaleString('fr-FR')
                                : '—'
                              return (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 2fr', gap: 8, alignItems: 'center', padding: '10px 14px', background: '#fafafa', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Cpu size={12} color="#94a3b8"/>
                                    <div>
                                      <div style={{ fontSize: 10, color: '#94a3b8' }}>Node ID</div>
                                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>{sig.node_id}</div>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Hash size={12} color="#94a3b8"/>
                                    <div>
                                      <div style={{ fontSize: 10, color: '#94a3b8' }}>Sensor ID</div>
                                      <div style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', fontFamily: 'monospace' }}>{sig.sensor_id}</div>
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>RSSI</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <SignalBar rssi={sig.rssi || 0} />
                                      <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#0f172a' }}>{sig.rssi} dBm</span>
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 10, color: '#94a3b8' }}>SNR</div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#8b5cf6', fontFamily: 'monospace' }}>{sig.snr} dB</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 10, color: '#94a3b8' }}>MAC · Timestamp</div>
                                    <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>{sig.mac}</div>
                                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{ts}</div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
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
