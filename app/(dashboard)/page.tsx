import { adminDb } from '@/lib/firebase/admin'
import { getAllUsers } from '@/services/user.service'
import { Users, Map, AlertTriangle, Leaf, TrendingUp, Droplets, Activity } from 'lucide-react'
import Link from 'next/link'
import { HumidityChart } from '@/components/dashboard/HumidityChart'

function StatCard({ title, value, icon: Icon, color, bg, sub }: {
  title: string; value: number | string
  icon: React.ElementType; color: string; bg: string; sub?: string
}) {
  return (
    <div style={{
      background: 'white', borderRadius: 16, padding: '20px 24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 80, height: 80, borderRadius: '0 16px 0 80px',
        background: bg,
      }}/>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: bg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginBottom: 16,
      }}>
        <Icon size={20} color={color} />
      </div>
      <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', fontFamily: 'Syne,sans-serif', letterSpacing: '-1px' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      {sub && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

export default async function DashboardPage() {
  const users = await getAllUsers()

  let totalZones = 0
  let totalAlerts = 0
  let avgHumidity = 0
  let avgHealth = 0
  let zoneCount = 0
  const recentAlerts: { id: string; zone: string; type: string; level: string; uid: string }[] = []

  // Pour le graphique humidité — on collecte les measures de toutes les zones
  const humidityByTime: Record<string, Record<string, number>> = {}
  const allZoneLabels: string[] = []

  for (const user of users) {
    const [zonesSnap, alertsSnap] = await Promise.all([
      adminDb.collection('users').doc(user.uid).collection('zones').get(),
      adminDb.collection('users').doc(user.uid).collection('alerts')
        .orderBy('timestamp', 'desc').limit(5).get(),
    ])

    totalZones += zonesSnap.size

    for (const zoneDoc of zonesSnap.docs) {
      const z = zoneDoc.data()
      if (z.humidity) { avgHumidity += z.humidity; zoneCount++ }
      if (z.sante) avgHealth += z.sante

      // Récupérer les mesures historiques
      const label = `${user.fullName?.split(' ')[0] || 'User'} - ${zoneDoc.id}`
      allZoneLabels.push(label)

      const measuresSnap = await adminDb
        .collection('users').doc(user.uid)
        .collection('zones').doc(zoneDoc.id)
        .collection('measures')
        .orderBy('timestamp', 'desc')
        .limit(24)
        .get()

      const measures = measuresSnap.docs.reverse()
      for (const m of measures) {
        const data = m.data()
        const ts = data.timestamp?._seconds
        if (!ts) continue
        const time = new Date(ts * 1000).toLocaleTimeString('fr-FR', {
          hour: '2-digit', minute: '2-digit'
        })
        if (!humidityByTime[time]) humidityByTime[time] = {}
        humidityByTime[time][label] = Math.round(data.humidity * 10) / 10
      }
    }

    totalAlerts += alertsSnap.size
    for (const alertDoc of alertsSnap.docs) {
      const a = alertDoc.data()
      recentAlerts.push({
        id: alertDoc.id, zone: a.zone_num,
        type: a.type, level: a.level, uid: user.uid
      })
    }
  }

  if (zoneCount > 0) {
    avgHumidity = Math.round(avgHumidity / zoneCount)
    avgHealth = Math.round((avgHealth / zoneCount) * 10) / 10
  }

  // Construire les données du graphique
  const chartData = Object.entries(humidityByTime)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, values]) => ({ time, ...values }))

  const cards = [
    { title: 'Utilisateurs',   value: users.length,   icon: Users,         color: '#16a34a', bg: '#f0fdf4' },
    { title: 'Zones Totales',  value: totalZones,     icon: Map,           color: '#3b82f6', bg: '#eff6ff' },
    { title: 'Humidité Moy.',  value: `${avgHumidity}%`, icon: Droplets,  color: '#14b8a6', bg: '#f0fdfa' },
    { title: 'Alertes Totales',value: totalAlerts,    icon: AlertTriangle, color: '#f59e0b', bg: '#fffbeb' },
    { title: 'Santé Moy.',     value: `${avgHealth}/10`, icon: Leaf,       color: '#8b5cf6', bg: '#f5f3ff' },
  ]

  return (
    <div style={{ padding: '32px', fontFamily: 'DM Sans,sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        borderRadius: 20,
        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 50%, #14532d 100%)',
        padding: '28px 32px', marginBottom: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', right: '-50px', top: '-100px' }}/>
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', right: '100px', bottom: '-80px' }}/>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.15)', borderRadius: 100,
            padding: '4px 12px', fontSize: 10, color: 'white',
            letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}/>
            Système actif
          </div>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 8 }}>
            Tableau de bord RoboCare
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, maxWidth: 400 }}>
            Gérez vos {users.length} utilisateur{users.length > 1 ? 's' : ''} et leurs {totalZones} zone{totalZones > 1 ? 's' : ''} d'irrigation en temps réel.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: '16px 20px', textAlign: 'center' }}>
            <Droplets size={20} color="white" style={{ margin: '0 auto 6px' }}/>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, fontWeight: 800, color: 'white' }}>{avgHumidity}%</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Humidité moy.</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: '16px 20px', textAlign: 'center' }}>
            <Activity size={20} color="white" style={{ margin: '0 auto 6px' }}/>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, fontWeight: 800, color: 'white' }}>{avgHealth}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Santé moy./10</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16, marginBottom: 28,
      }}>
        {cards.map((c, i) => <StatCard key={i} {...c} />)}
      </div>

      {/* ── Graphique humidité ── */}
      <div style={{
        background: 'white', borderRadius: 16, border: '1px solid #e2e8f0',
        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
        marginBottom: 24, overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Humidité — 24 dernières heures
            </h2>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>
              Toutes les zones confondues
            </p>
          </div>
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 8, padding: '4px 12px',
            fontSize: 12, color: '#16a34a', fontWeight: 600,
          }}>
            {allZoneLabels.length} zone{allZoneLabels.length > 1 ? 's' : ''}
          </div>
        </div>
        <div style={{ padding: '16px 24px 8px' }}>
          <HumidityChart data={chartData} zones={allZoneLabels} />
        </div>
      </div>

      {/* Bottom grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Utilisateurs */}
        <div style={{
          background: 'white', borderRadius: 16, border: '1px solid #e2e8f0',
          boxShadow: '0 1px 6px rgba(0,0,0,0.04)', overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Utilisateurs
            </h2>
            <Link href="/users" style={{ fontSize: 12, color: '#16a34a', textDecoration: 'none' }}>
              Voir tous →
            </Link>
          </div>
          {users.slice(0, 5).map((user, i) => (
            <Link key={i} href={`/users/${user.uid}`} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 20px', borderBottom: '1px solid #f8fafc',
              textDecoration: 'none',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#f0fdf4', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#16a34a',
              }}>
                {user.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{user.fullName}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{user.email}</div>
              </div>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 20,
                background: user.role === 'admin' ? '#f0fdf4' : '#f8fafc',
                color: user.role === 'admin' ? '#16a34a' : '#94a3b8',
                border: `1px solid ${user.role === 'admin' ? '#bbf7d0' : '#e2e8f0'}`,
              }}>
                {user.role}
              </span>
            </Link>
          ))}
        </div>

        {/* Alertes récentes */}
        <div style={{
          background: 'white', borderRadius: 16, border: '1px solid #e2e8f0',
          boxShadow: '0 1px 6px rgba(0,0,0,0.04)', overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Alertes récentes
            </h2>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{totalAlerts} total</span>
          </div>
          {recentAlerts.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
              Aucune alerte récente
            </div>
          ) : recentAlerts.slice(0, 6).map((alert, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 20px', borderBottom: '1px solid #f8fafc',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: alert.level === 'critique' ? '#ef4444' : alert.level === 'warning' ? '#f59e0b' : '#16a34a',
              }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Zone {alert.zone}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{alert.type}</div>
              </div>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 20,
                background: alert.level === 'critique' ? '#fee2e2' : '#fffbeb',
                color: alert.level === 'critique' ? '#ef4444' : '#f59e0b',
              }}>
                {alert.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}