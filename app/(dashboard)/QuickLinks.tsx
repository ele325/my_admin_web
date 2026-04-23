'use client'

export function QuickLinks() {
  const links = [
    { label: 'Voir les utilisateurs', href: '/users',     color: 'oklch(0.72 0.19 152)' },
    { label: 'Monitoring',            href: '/monitoring', color: 'oklch(0.67 0.15 230)' },
    { label: 'Alertes',               href: '/alertes',   color: 'oklch(0.78 0.16  75)' },
    { label: 'Paramètres',            href: '/parametres', color: 'oklch(0.40 0.018 145)' },
  ]

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {links.map((q, i) => (
        <a
          key={i}
          href={q.href}
          style={{
            padding: '8px 16px',
            background: 'oklch(0.12 0.014 145)',
            border: '1px solid oklch(0.18 0.013 145)',
            borderRadius: 9,
            fontSize: 13, color: q.color,
            textDecoration: 'none',
            transition: 'border-color .15s,background .15s',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = 'oklch(0.72 0.19 152 / .08)'
            e.currentTarget.style.borderColor = 'oklch(0.72 0.19 152 / .3)'
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'oklch(0.12 0.014 145)'
            e.currentTarget.style.borderColor = 'oklch(0.18 0.013 145)'
          }}
        >
          {q.label} →
        </a>
      ))}
    </div>
  )
}