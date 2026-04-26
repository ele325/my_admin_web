import { getConfigByUser } from '@/services/config.service'
import { getUserById } from '@/services/user.service'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Settings } from 'lucide-react'

export default async function ConfigPage({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params
  const user = await getUserById(uid)
  if (!user) notFound()
  const config = await getConfigByUser(uid)

  return (
    <div style={{ padding: '32px', fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13 }}>
        <Link href="/users" style={{ color: '#94a3b8', textDecoration: 'none' }}>Utilisateurs</Link>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <Link href={`/users/${uid}`} style={{ color: '#94a3b8', textDecoration: 'none' }}>{user.fullName}</Link>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <span style={{ color: '#0f172a', fontWeight: 500 }}>Configuration</span>
      </div>
      <Link href={`/users/${uid}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 24 }}>
        <ChevronLeft size={14} /> Retour au profil
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
          <Settings size={20} color="#64748b" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0 }}>Configuration de {user.fullName}</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{config ? 'Configuration active' : 'Aucune configuration'}</p>
        </div>
      </div>

      {!config ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0' }}>Aucune configuration trouvée</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {[
            { label: 'Durée par défaut', value: `${config.defaultDuration}s`, color: '#3b82f6', bg: '#eff6ff' },
            { label: 'Humidité maximale', value: `${config.maxHumidity}%`, color: '#14b8a6', bg: '#f0fdfa' },
            { label: 'Humidité minimale', value: `${config.minHumidity}%`, color: '#8b5cf6', bg: '#f5f3ff' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: item.color, fontFamily: 'Syne, sans-serif' }}>{item.value}</div>
              <div style={{ marginTop: 12, height: 6, borderRadius: 3, background: '#f1f5f9', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 3, background: item.color, width: item.value.includes('%') ? item.value : '60%', opacity: 0.6 }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
