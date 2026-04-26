'use client'
import { Sidebar } from '@/components/sidebar/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 224, minHeight: '100vh', background: '#f8fafc', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}