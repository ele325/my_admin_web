import { getAllReportsData } from '@/services/report.service'
import { FileText, Users, CreditCard, TrendingUp, Leaf, AlertTriangle } from 'lucide-react'

const planColor = (plan: string) => {
  if (plan === 'premium') return { bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe' }
  if (plan === 'pro')     return { bg: '#f5f3ff', color: '#8b5cf6', border: '#ddd6fe' }
  return { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' }
}

export default async function RapportsPage() {
  const data = await getAllReportsData()

  const totalRevenue = data.reduce((acc, u) => {
    return acc + u.billing.reduce((a: number, b: any) => {
      const num = parseFloat(b.prix?.replace(/[^0-9.]/g, '') || '0')
      return a + num
    }, 0)
  }, 0)

  const premiumUsers = data.filter(u => u.plan === 'premium').length
  const totalBilling = data.reduce((a, u) => a + u.billing.length, 0)

  return (
    <div style={{ padding: '32px', fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={22} color="white" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>Rapports</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Abonnements et facturation</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Utilisateurs',    value: data.length,    color: '#16a34a', bg: '#f0fdf4', icon: '👤' },
          { label: 'Comptes Premium', value: premiumUsers,   color: '#3b82f6', bg: '#eff6ff', icon: '⭐' },
          { label: 'Factures totales',value: totalBilling,   color: '#f59e0b', bg: '#fffbeb', icon: '🧾' },
          { label: 'Revenus (DT)',    value: `${totalRevenue} DT`, color: '#16a34a', bg: '#f0fdf4', icon: '💰' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: 'Syne, sans-serif' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users size={16} color="#64748b" />
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Rapport par utilisateur</h2>
        </div>

        {data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>Aucune donnée — les utilisateurs doivent ouvrir l'app mobile</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.map((user, i) => {
              const pc = planColor(user.plan)
              return (
                <div key={user.uid} style={{ borderBottom: i < data.length - 1 ? '1px solid #f1f5f9' : 'none' }}>

                  {/* User row */}
                  <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 16, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                        {user.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{user.fullName}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{user.email}</div>
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, padding: '3px 12px', borderRadius: 20, background: pc.bg, color: pc.color, border: `1px solid ${pc.border}`, fontWeight: 600 }}>
                        {user.plan}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
                      <Leaf size={13} color="#16a34a"/> {user.zonesCount} zones
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
                      <AlertTriangle size={13} color="#f59e0b"/> {user.alertsCount} alertes
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
                      <CreditCard size={13} color="#3b82f6"/> {user.billing.length} factures
                    </div>
                  </div>

                  {/* Billing history */}
                  {user.billing.length > 0 && (
                    <div style={{ padding: '0 24px 16px', paddingLeft: 86 }}>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Historique de facturation</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {user.billing.map((bill: any, j: number) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', borderRadius: 10, padding: '8px 14px', border: '1px solid #f1f5f9', fontSize: 12 }}>
                            <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>{bill.id}</span>
                            <span style={{ color: '#0f172a', fontWeight: 600 }}>{bill.service}</span>
                            <span style={{ color: '#64748b' }}>{bill.date}</span>
                            <span style={{ color: '#16a34a', fontWeight: 700 }}>{bill.prix}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
