'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, Radio,
  Activity, FileText, Settings, LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react'

const NAV = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/' },
  { icon: Users,           label: 'Utilisateurs',    href: '/users' },
  { icon: Radio,           label: 'Capteurs',         href: '/capteurs' },
  { icon: Activity,        label: 'Monitoring',       href: '/monitoring' },
  { icon: FileText,        label: 'Rapports',         href: '/rapports' },
  { icon: Settings,        label: 'Paramètres',       href: '/parametres' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' })
    router.push('/login')
  }

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity:0; transform:translateX(-8px) }
          to   { opacity:1; transform:translateX(0) }
        }
        .nav-link { transition: background .15s, color .15s; }
        .nav-link:hover { background: #f0fdf4 !important; color: #2d6a2d !important; }
        .sidebar-root { transition: width .28s cubic-bezier(.4,0,.2,1); }
        .logout-btn:hover { background: #fee2e2 !important; color: #ef4444 !important; border-color: #fecaca !important; }
      `}</style>

      <aside className="sidebar-root" style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
        width: collapsed ? 68 : 224,
        background: 'white',
        borderRight: '1px solid #e2e8f0',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
      }}>

        {/* Logo */}
        <div style={{
          padding: '18px 14px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            {/* ✅ <img> natif — pas de next/image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-robocare.png"
              alt="RoboCare"
              style={{
                width: 36, height: 36,
                objectFit: 'contain',
                flexShrink: 0,
                borderRadius: 8,
                display: 'block',
              }}
            />

            {!collapsed && (
              <div>
                <div style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16,
                  color: '#0f172a', letterSpacing: '-0.3px', whiteSpace: 'nowrap',
                }}>
                  Robo<span style={{ color: '#2d6a2d' }}>Care</span>
                </div>
                <div style={{
                  fontSize: 9, color: '#2d6a2d', letterSpacing: '2px',
                  textTransform: 'uppercase', fontWeight: 600,
                }}>Agriculture 4.0</div>
              </div>
            )}
          </div>

          {!collapsed && (
            <button onClick={() => setCollapsed(true)} style={{
              background: '#f8fafc', border: '1px solid #e2e8f0',
              cursor: 'pointer', padding: '4px 6px',
              color: '#94a3b8', borderRadius: 6,
              display: 'flex', alignItems: 'center',
            }}>
              <ChevronLeft size={14}/>
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button onClick={() => setCollapsed(false)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '10px 0', color: '#94a3b8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ChevronRight size={16}/>
          </button>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
          {!collapsed && (
            <div style={{
              fontSize: 10, color: '#94a3b8', letterSpacing: '1px',
              textTransform: 'uppercase', fontWeight: 600,
              padding: '4px 10px 8px',
            }}>Navigation</div>
          )}
          {NAV.map((item, i) => {
            const active = pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link key={i} href={item.href}
                className="nav-link"
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: 10, padding: '9px 10px',
                  borderRadius: 10, marginBottom: 2,
                  textDecoration: 'none',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: active ? '#f0fdf4' : 'transparent',
                  color: active ? '#2d6a2d' : '#64748b',
                  fontWeight: active ? 600 : 400,
                  fontSize: 13.5,
                  borderLeft: active ? '3px solid #2d6a2d' : '3px solid transparent',
                  animation: `slideIn .3s ${i * 0.04}s ease both`,
                  position: 'relative',
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }}/>
                {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                {active && !collapsed && (
                  <span style={{
                    position: 'absolute', right: 10,
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#2d6a2d',
                  }}/>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User footer */}
        <div style={{
          borderTop: '1px solid #f1f5f9',
          padding: '12px 10px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            justifyContent: collapsed ? 'center' : 'flex-start',
            marginBottom: collapsed ? 0 : 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #2d6a2d, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'white',
            }}>A</div>
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: '#0f172a',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>Ayouni Alee</div>
                <div style={{
                  fontSize: 11, color: '#94a3b8',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>aleeaioni@gmail.com</div>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              className="logout-btn"
              onClick={handleLogout}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 6,
                padding: '8px', borderRadius: 8,
                background: '#f8fafc', border: '1px solid #e2e8f0',
                cursor: 'pointer', fontSize: 12,
                color: '#64748b', transition: 'all .15s',
              }}
            >
              <LogOut size={13}/> Déconnexion
            </button>
          )}

          {collapsed && (
            <button
              onClick={handleLogout}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: '8px',
                borderRadius: 8, background: 'none', border: 'none',
                cursor: 'pointer', color: '#94a3b8', marginTop: 8,
              }}
            >
              <LogOut size={14}/>
            </button>
          )}
        </div>
      </aside>
    </>
  )
}