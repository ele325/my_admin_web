'use client'

import { Sidebar } from '@/components/sidebar/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    /*
      ─── FIX FOND BLANC ───────────────────────────────────────────
      Le fond doit être défini ICI sur le wrapper principal.
      Sans ça, le contenu entre le sidebar et le main reste blanc.
      ──────────────────────────────────────────────────────────────
    */
    <div style={{
      minHeight: '100vh',
      background: '#071410',          /* agro-bg — fond principal */
      display: 'flex',
    }}>
      <Sidebar />
      <main style={{
        flex: 1,
        marginLeft: 224,              /* largeur sidebar */
        minHeight: '100vh',
        background: '#071410',        /* répété pour éviter tout flash blanc */
        overflow: 'auto',
      }}>
        {children}
      </main>
    </div>
  )
}