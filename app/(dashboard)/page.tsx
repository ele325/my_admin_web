import { getAggregatedStats } from '@/services/user.service'
import { Users, Map, Radio, AlertTriangle } from 'lucide-react'


/* ─── stat card ─── */
function StatCard({
  title, value, icon: Icon, color, bg, delay = 0,
}: {
  title: string; value: number | string
  icon: React.ElementType; color: string; bg: string; delay?: number
}) {
  return (
    <div
      className="card-hover"
      style={{
        background:'oklch(0.10 0.015 145)',
        border:'1px solid oklch(0.18 0.013 145)',
        borderRadius:16,padding:'20px',
        animation:`fadeUp .5s ${delay}s ease both`,
        position:'relative',overflow:'hidden',
      }}
    >
      {/* corner accent */}
      <div style={{
        position:'absolute',top:0,right:0,
        width:70,height:70,borderRadius:'0 16px 0 70px',
        background: bg,
      }}/>
      <div style={{
        width:38,height:38,borderRadius:11,
        background: bg,
        display:'flex',alignItems:'center',justifyContent:'center',
        marginBottom:14,
      }}>
        <Icon size={18} style={{color}} />
      </div>
      <div style={{fontSize:11,color:'oklch(0.40 0.018 145)',
        textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4}}>
        {title}
      </div>
      <div style={{fontFamily:'Syne,sans-serif',fontSize:28,fontWeight:800,
        color:'oklch(0.96 0.008 145)',letterSpacing:'-0.8px'}}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const stats = await getAggregatedStats()

  const cards = [
    { title:'Total Utilisateurs', value:stats.totalUsers,    icon:Users,         color:'oklch(0.72 0.19 152)', bg:'oklch(0.72 0.19 152 / .1)' },
    { title:'Zones Totales',      value:stats.totalZones,    icon:Map,           color:'oklch(0.67 0.15 230)', bg:'oklch(0.67 0.15 230 / .1)' },
    { title:'Capteurs Actifs',    value:stats.activeSensors, icon:Radio,         color:'oklch(0.72 0.14 175)', bg:'oklch(0.72 0.14 175 / .1)' },
    { title:'Alertes Totales',    value:stats.totalAlerts,   icon:AlertTriangle, color:'oklch(0.78 0.16  75)', bg:'oklch(0.78 0.16  75 / .1)' },
  ]

  return (
    <>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
      `}</style>

      <div style={{padding:'32px',fontFamily:'DM Sans,sans-serif'}}>

        {/* ── Hero banner ── */}
        <div style={{
          borderRadius:18,
          background:'linear-gradient(135deg,oklch(0.09 0.016 145) 0%,oklch(0.11 0.018 148) 60%,oklch(0.08 0.013 142) 100%)',
          border:'1px solid oklch(0.72 0.19 152 / .14)',
          padding:'26px 30px',
          marginBottom:28,
          display:'flex',alignItems:'center',justifyContent:'space-between',
          position:'relative',overflow:'hidden',
          animation:'fadeUp .4s ease both',
        }}>
          <div style={{
            position:'absolute',width:320,height:320,borderRadius:'50%',
            background:'radial-gradient(circle,oklch(0.72 0.19 152 / .08) 0%,transparent 70%)',
            right:'-40px',top:'-120px',pointerEvents:'none',
          }}/>
          <div>
            <div style={{
              display:'inline-flex',alignItems:'center',gap:6,
              background:'oklch(0.72 0.19 152 / .09)',
              border:'1px solid oklch(0.72 0.19 152 / .2)',
              borderRadius:100,padding:'4px 12px',
              fontSize:10,color:'oklch(0.72 0.19 152)',
              letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:10,
            }}>
              <span style={{width:6,height:6,borderRadius:'50%',
                background:'oklch(0.72 0.19 152)',
                boxShadow:'0 0 6px oklch(0.72 0.19 152)',display:'inline-block'}}/>
              Tableau de bord
            </div>
            <h1 style={{fontFamily:'Syne,sans-serif',fontSize:24,fontWeight:700,
              color:'oklch(0.96 0.008 145)',letterSpacing:'-0.4px',marginBottom:5}}>
              Bienvenue, Ayouni Alee
            </h1>
            <p style={{color:'oklch(0.40 0.018 145)',fontSize:13,maxWidth:400}}>
              Aperçu de votre système d'irrigation intelligent. Données en temps réel.
            </p>
          </div>
          <div style={{
            background:'oklch(0.72 0.19 152 / .08)',
            border:'1px solid oklch(0.72 0.19 152 / .18)',
            borderRadius:14,padding:'14px 18px',
            textAlign:'center',flexShrink:0,
          }}>
            <div style={{fontSize:22,marginBottom:4}}>🌡</div>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:22,fontWeight:700,
              color:'oklch(0.72 0.19 152)'}}>24°C</div>
            <div style={{fontSize:10,color:'oklch(0.40 0.018 145)',marginTop:2}}>Temp. moy.</div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',
          gap:14,marginBottom:28,
        }}>
          {cards.map((c,i)=>(
            <StatCard key={i} {...c} delay={0.08 + i*0.07}/>
          ))}
        </div>

        <div style={{
  background: 'oklch(0.10 0.015 145)',
  border: '1px solid oklch(0.18 0.013 145)',
  borderRadius: 16, padding: '20px 24px',
  animation: 'fadeUp .5s ease .4s both',
}}>
  <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 600,
    color: 'oklch(0.96 0.008 145)', marginBottom: 14 }}>
    Accès rapide
  </h2>
  <div>Quick Links Placeholder</div>
</div>
      </div>
    </>
  )
}