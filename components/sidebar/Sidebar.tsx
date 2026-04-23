'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Radio, MapPin,
  Activity, FileText, Settings, LogOut, Globe,
} from 'lucide-react'

const NAV = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/' },
  { icon: Users,           label: 'Utilisateurs',    href: '/users' },
  { icon: Radio,           label: 'Capteurs',         href: '/capteurs' },
  { icon: MapPin,          label: 'Parcelles',        href: '/parcelles' },
  { icon: Activity,        label: 'Monitoring',       href: '/monitoring' },
  { icon: FileText,        label: 'Rapports',         href: '/rapports' },
  { icon: Settings,        label: 'Paramètres',       href: '/parametres' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <style>{`
        @keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pulseRing{
          0%,100%{box-shadow:0 0 0 0 oklch(0.72 0.19 152 / .4)}
          60%{box-shadow:0 0 0 7px oklch(0.72 0.19 152 / 0)}
        }
        .nav-link{transition:background .15s,color .15s,border-color .15s;}
        .nav-link:hover{background:oklch(0.72 0.19 152 / .08)!important;color:oklch(0.72 0.19 152)!important;}
        .sidebar-root{transition:width .28s cubic-bezier(.4,0,.2,1);}
      `}</style>

      <aside
        className="sidebar-root"
        style={{
          position:'fixed',top:0,left:0,bottom:0,zIndex:40,
          width: collapsed ? 68 : 224,
          background:'oklch(0.08 0.013 145)',
          borderRight:'1px solid oklch(0.18 0.013 145)',
          display:'flex',flexDirection:'column',
          overflow:'hidden',
        }}
      >
        {/* hex overlay */}
        <div className="bg-hex" style={{position:'absolute',inset:0,pointerEvents:'none',opacity:.6}}/>
        {/* glow */}
        <div style={{
          position:'absolute',width:220,height:220,borderRadius:'50%',
          background:'radial-gradient(circle,oklch(0.72 0.19 152 / .06) 0%,transparent 70%)',
          top:'20%',left:'-40%',pointerEvents:'none',
        }}/>

        {/* ── Logo ── */}
        <div style={{
          position:'relative',zIndex:2,
          padding:'18px 14px',
          borderBottom:'1px solid oklch(0.18 0.013 145)',
          display:'flex',alignItems:'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap:10,
        }}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{
              width:36,height:36,borderRadius:10,flexShrink:0,
              background:'linear-gradient(135deg,oklch(0.72 0.19 152),oklch(0.52 0.17 150))',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:17,animation:'pulseRing 3s ease infinite',
            }}>💧</div>
            {!collapsed && (
              <div>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:17,
                  color:'oklch(0.96 0.008 145)',letterSpacing:'-0.3px',whiteSpace:'nowrap'}}>
                  IrriSmart
                </div>
                <div style={{fontSize:9,color:'oklch(0.72 0.19 152)',letterSpacing:'1.8px',
                  textTransform:'uppercase'}}>Admin</div>
              </div>
            )}
          </div>
          {!collapsed && (
            <button onClick={()=>setCollapsed(true)} style={{
              background:'none',border:'none',cursor:'pointer',padding:4,
              color:'oklch(0.40 0.018 145)',fontSize:16,lineHeight:1,
              borderRadius:6,transition:'color .15s',
            }}>‹</button>
          )}
        </div>

        {/* collapse expand btn when collapsed */}
        {collapsed && (
          <button onClick={()=>setCollapsed(false)} style={{
            background:'none',border:'none',cursor:'pointer',
            padding:'8px 0',color:'oklch(0.40 0.018 145)',
            fontSize:16,textAlign:'center',
            position:'relative',zIndex:2,
          }}>›</button>
        )}

        {/* ── Nav ── */}
        <nav style={{flex:1,padding:'10px 8px',overflowY:'auto',position:'relative',zIndex:2}}>
          {NAV.map((item,i)=>{
            const active = pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link key={i} href={item.href}
                className="nav-link"
                style={{
                  display:'flex',alignItems:'center',
                  gap:10,padding:'9px 10px',
                  borderRadius:10,marginBottom:2,
                  textDecoration:'none',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: active ? 'oklch(0.72 0.19 152 / .1)' : 'transparent',
                  color: active ? 'oklch(0.72 0.19 152)' : 'oklch(0.50 0.020 145)',
                  fontWeight: active ? 500 : 400,
                  fontSize:13.5,
                  borderLeft: active ? '2px solid oklch(0.72 0.19 152)' : '2px solid transparent',
                  animation:`slideIn .3s ${i*0.04}s ease both`,
                  position:'relative',
                }}
              >
                <Icon size={16} style={{flexShrink:0}}/>
                {!collapsed && <span style={{whiteSpace:'nowrap'}}>{item.label}</span>}
                {active && !collapsed && (
                  <span style={{
                    position:'absolute',right:10,
                    width:6,height:6,borderRadius:'50%',
                    background:'oklch(0.72 0.19 152)',
                    boxShadow:'0 0 6px oklch(0.72 0.19 152)',
                  }}/>
                )}
              </Link>
            )
          })}
        </nav>

        {/* ── User footer ── */}
        <div style={{
          borderTop:'1px solid oklch(0.18 0.013 145)',
          padding:'12px 10px',position:'relative',zIndex:2,
        }}>
          <div style={{display:'flex',alignItems:'center',gap:10,
            justifyContent: collapsed ? 'center' : 'flex-start',marginBottom: collapsed ? 0 : 10}}>
            <div style={{
              width:32,height:32,borderRadius:'50%',flexShrink:0,
              background:'linear-gradient(135deg,oklch(0.72 0.19 152),oklch(0.67 0.15 230))',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:13,fontWeight:700,color:'#fff',fontFamily:'Syne,sans-serif',
            }}>A</div>
            {!collapsed && (
              <div style={{minWidth:0}}>
                <div style={{fontSize:13,fontWeight:500,color:'oklch(0.96 0.008 145)',
                  whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                  Ayouni Alee
                </div>
                <div style={{fontSize:11,color:'oklch(0.40 0.018 145)',
                  whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                  aleeaioni@gmail.com
                </div>
              </div>
            )}
          </div>
          {!collapsed && (
            <div style={{display:'flex',gap:6}}>
              <button style={{
                flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:5,
                padding:'6px 8px',
                background:'oklch(0.10 0.015 145)',
                border:'1px solid oklch(0.18 0.013 145)',
                borderRadius:8,cursor:'pointer',
                fontSize:11,color:'oklch(0.40 0.018 145)',
                transition:'border-color .15s,color .15s',
              }}>
                <Globe size={12}/> FR
              </button>
              <form action="/api/auth/session" method="POST" style={{flex:1}}>
                <input type="hidden" name="_method" value="DELETE"/>
                <button type="submit" style={{
                  width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:5,
                  padding:'6px 8px',
                  background:'oklch(0.10 0.015 145)',
                  border:'1px solid oklch(0.18 0.013 145)',
                  borderRadius:8,cursor:'pointer',
                  fontSize:11,color:'oklch(0.54 0.22 25)',
                  transition:'border-color .15s',
                }}>
                  <LogOut size={12}/> Quitter
                </button>
              </form>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}