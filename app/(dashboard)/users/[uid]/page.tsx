
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { adminDb } from '@/lib/firebase/admin'
import { getUserById } from '@/services/user.service'
import { ChevronLeft, Mail, CreditCard, Shield, Calendar, CheckCircle, XCircle } from 'lucide-react'

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ uid: string }>
}) {
  const { uid } = await params
  const user = await getUserById(uid)
  if (!user) notFound()

  const [alertsSnap, commandsSnap, zonesSnap, predictionsSnap] = await Promise.all([
    adminDb.collection('users').doc(uid).collection('alerts').count().get(),
    adminDb.collection('users').doc(uid).collection('commands').count().get(),
    adminDb.collection('users').doc(uid).collection('zones').count().get(),
    adminDb.collection('users').doc(uid).collection('predictions').count().get(),
  ])

  const subcollections = [
    { name: 'alerts',      count: alertsSnap.data().count,      icon: '🔔', color: '#f59e0b', bg: '#fffbeb' },
    { name: 'commands',    count: commandsSnap.data().count,    icon: '⚡', color: '#3b82f6', bg: '#eff6ff' },
    { name: 'config',      count: user.config ? 1 : 0,          icon: '⚙️', color: '#64748b', bg: '#f8fafc' },
    { name: 'predictions', count: predictionsSnap.data().count, icon: '🤖', color: '#8b5cf6', bg: '#f5f3ff' },
    { name: 'zones',       count: zonesSnap.data().count,       icon: '🌿', color: '#16a34a', bg: '#f0fdf4' },
  ]

  const createdAt = user.createdAt
    ? new Date((user.createdAt as { _seconds: number })._seconds * 1000)
        .toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—'

  return (
    <div style={{ padding: '32px', fontFamily: 'DM Sans,sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13 }}>
        <Link href="/users" style={{ color: '#94a3b8', textDecoration: 'none' }}>Utilisateurs</Link>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <span style={{ color: '#0f172a', fontWeight: 500 }}>{user.fullName}</span>
      </div>

      <Link href="/users" style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 24,
      }}>
        <ChevronLeft size={14}/> Retour aux utilisateurs
      </Link>

      <div style={{
        background: 'white', borderRadius: 16, border: '1px solid #e2e8f0',
        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
        padding: '24px', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #16a34a, #3b82f6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, fontWeight: 800, color: 'white', fontFamily: 'Syne,sans-serif',
        }}>
          {user.fullName?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0 }}>
              {user.fullName}
            </h1>
            <span style={{
              fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600,
              background: user.role === 'admin' ? '#f0fdf4' : '#f8fafc',
              color: user.role === 'admin' ? '#16a34a' : '#64748b',
              border: `1px solid ${user.role === 'admin' ? '#bbf7d0' : '#e2e8f0'}`,
            }}>
              {user.role}
            </span>
            {user.emailVerified ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#16a34a' }}>
                <CheckCircle size={13}/> Vérifié
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#f59e0b' }}>
                <XCircle size={13}/> Non vérifié
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
              <Mail size={13}/> {user.email}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
              <CreditCard size={13}/> CIN: {user.cin}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
              <Calendar size={13}/> Inscrit le {createdAt}
            </span>
          </div>
        </div>
        <div style={{
          background: '#f0fdf4', borderRadius: 12, padding: '12px 20px',
          textAlign: 'center', border: '1px solid #bbf7d0',
        }}>
          <div style={{ fontSize: 10, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>UID</div>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#0f172a', wordBreak: 'break-all', maxWidth: 160 }}>
            {uid}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Zones',       value: zonesSnap.data().count,       color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Alertes',     value: alertsSnap.data().count,      color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Prédictions', value: predictionsSnap.data().count, color: '#8b5cf6', bg: '#f5f3ff' },
          { label: 'Commandes',   value: commandsSnap.data().count,    color: '#3b82f6', bg: '#eff6ff' },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: 12, padding: '16px 20px',
            border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: s.color, fontFamily: 'Syne,sans-serif' }}>
                {s.value}
              </span>
            </div>
            <span style={{ fontSize: 13, color: '#64748b' }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{
        background: 'white', borderRadius: 16, border: '1px solid #e2e8f0',
        boxShadow: '0 1px 6px rgba(0,0,0,0.04)', overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Shield size={16} color="#16a34a"/>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Sous-collections
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '16px' }}>
          {subcollections.map(sub => (
            <Link key={sub.name} href={`/users/${uid}/${sub.name}`} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px', borderRadius: 12,
              border: '1px solid #f1f5f9', textDecoration: 'none',
              background: '#fafafa',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: sub.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 18, flexShrink: 0,
              }}>
                {sub.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>
                  {sub.name.charAt(0).toUpperCase() + sub.name.slice(1)}
                </div>
                <div style={{ fontSize: 12, color: sub.color, fontWeight: 500 }}>
                  {sub.count} {sub.count === 1 ? 'élément' : 'éléments'}
                </div>
              </div>
              <ChevronLeft size={16} color="#cbd5e1" style={{ transform: 'rotate(180deg)' }}/>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
