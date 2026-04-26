import { Settings, Bell, Shield, Palette, Database, Globe } from 'lucide-react'

export default function ParametresPage() {
  return (
    <div style={{ padding: '32px', fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #64748b, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Settings size={22} color="white" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>Paramètres</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Configuration de la plateforme admin</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {[
          {
            icon: <Bell size={18} color="#f59e0b"/>,
            bg: '#fffbeb', title: 'Notifications',
            items: ['Alertes critiques par email', 'Résumé quotidien', 'Notifications push'],
          },
          {
            icon: <Shield size={18} color="#16a34a"/>,
            bg: '#f0fdf4', title: 'Sécurité',
            items: ['Authentification Firebase', 'Sessions admin', 'Logs d\'accès'],
          },
          {
            icon: <Database size={18} color="#3b82f6"/>,
            bg: '#eff6ff', title: 'Base de données',
            items: ['Projet : smart-irrigation-pfe-a52f7', 'Firestore activé', 'Règles de sécurité'],
          },
          {
            icon: <Globe size={18} color="#8b5cf6"/>,
            bg: '#f5f3ff', title: 'Application mobile',
            items: ['Flutter Android/iOS', 'Sync Firestore activée', 'Firebase Auth'],
          },
        ].map((section, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: section.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {section.icon}
              </div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>{section.title}</h2>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {section.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#fafafa', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{item}</span>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Palette size={16} color="#64748b"/>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>Informations système</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Framework',  value: 'Next.js 16' },
            { label: 'Base de données', value: 'Firebase Firestore' },
            { label: 'Auth',       value: 'Firebase Auth' },
            { label: 'App mobile', value: 'Flutter 3.x' },
            { label: 'Projet',     value: 'smart-irrigation-pfe' },
            { label: 'Version',    value: '1.0.0' },
          ].map((info, i) => (
            <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{info.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>{info.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
