import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AgroAdmin — Irrigation Intelligente',
  description: 'Plateforme de gestion IoT pour l\'irrigation intelligente',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" style={{ background: '#071410' }}>
      {/*
        ⚠️  Le style inline ici + globals.css forcent le fond sombre.
        Sans ça, Next.js laisse le fond blanc par défaut entre navigations.
      */}
      <body style={{
        background: '#071410',
        color: '#e2f0e8',
        margin: 0,
        minHeight: '100vh',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {children}
      </body>
    </html>
  )
}