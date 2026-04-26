import { getCommandsByUser } from '@/services/command.service'
import { getUserById } from '@/services/user.service'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Zap } from 'lucide-react'

export default async function CommandsPage({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params
  const user = await getUserById(uid)
  if (!user) notFound()
  const commands = await getCommandsByUser(uid)
  const entries = Object.entries(commands)

  return (
    <div style={{ padding: '32px', fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13 }}>
        <Link href="/users" style={{ color: '#94a3b8', textDecoration: 'none' }}>Utilisateurs</Link>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <Link href={`/users/${uid}`} style={{ color: '#94a3b8', textDecoration: 'none' }}>{user.fullName}</Link>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <span style={{ color: '#0f172a', fontWeight: 500 }}>Commandes</span>
      </div>
      <Link href={`/users/${uid}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 24 }}>
        <ChevronLeft size={14} /> Retour au profil
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={20} color="#3b82f6" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0 }}>Commandes de {user.fullName}</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{entries.length} commande{entries.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0' }}>Aucune commande</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {entries.map(([commandId, command]) => {
            const lastUpdate = command.lastUpdate?._seconds
              ? new Date(command.lastUpdate._seconds * 1000).toLocaleString('fr-FR')
              : '—'
            return (
              <div key={commandId} style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#94a3b8', background: '#f8fafc', padding: '3px 8px', borderRadius: 6, border: '1px solid #e2e8f0' }}>{commandId}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, background: '#eff6ff', color: '#3b82f6', fontWeight: 600 }}>{command.mode}</span>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: command.isOn ? '#22c55e' : '#ef4444' }} title={command.isOn ? 'On' : 'Off'} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>Fréquence</span>
                    <span style={{ fontFamily: 'monospace', color: '#0f172a', fontWeight: 600 }}>{command.frequency}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>Statut</span>
                    <span style={{ color: command.isOn ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{command.isOn ? '● Actif' : '● Inactif'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>Dernière MAJ</span>
                    <span style={{ color: '#64748b', fontSize: 12 }}>{lastUpdate}</span>
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
