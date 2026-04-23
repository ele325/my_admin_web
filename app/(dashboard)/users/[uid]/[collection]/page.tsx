import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAlertsByUser }     from '@/services/alert.service'
import { getCommandsByUser }   from '@/services/command.service'
import { getConfigByUser }     from '@/services/config.service'
import { getPredictionsByUser } from '@/services/prediction.service'
import { getZonesByUser }      from '@/services/zone.service'
import { AlertsView }      from '@/components/collections/AlertsView'
import { CommandsView }    from '@/components/collections/CommandsView'
import { ConfigView }      from '@/components/collections/ConfigView'
import { PredictionsView } from '@/components/collections/PredictionsView'
import { ZonesView }       from '@/components/collections/ZonesView'
import { ChevronLeft } from 'lucide-react'

const VALID = ['alerts','commands','config','predictions','zones']

const COLLECTION_META: Record<string, { icon: string; color: string }> = {
  alerts:      { icon:'🔔', color:'oklch(0.78 0.16  75)' },
  commands:    { icon:'⚡', color:'oklch(0.67 0.15 230)' },
  config:      { icon:'⚙', color:'oklch(0.40 0.018 145)' },
  predictions: { icon:'🤖', color:'oklch(0.72 0.14 175)' },
  zones:       { icon:'🌿', color:'oklch(0.72 0.19 152)' },
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ uid: string; collection: string }>
}) {
  const { uid, collection } = await params
  if (!VALID.includes(collection)) notFound()

  let data: unknown
  let count = 0

  switch (collection) {
    case 'alerts':
      data  = await getAlertsByUser(uid)
      count = Object.keys(data as Record<string, unknown>).length; break
    case 'commands':
      data  = await getCommandsByUser(uid)
      count = Object.keys(data as Record<string, unknown>).length; break
    case 'config':
      data  = await getConfigByUser(uid)
      count = data ? 1 : 0; break
    case 'predictions':
      data  = await getPredictionsByUser(uid)
      count = Object.keys(data as Record<string, unknown>).length; break
    case 'zones':
      data  = await getZonesByUser(uid)
      count = Object.keys(data as Record<string, unknown>).length; break
  }

  const meta = COLLECTION_META[collection]

  const renderView = () => {
    switch (collection) {
      case 'alerts':      return <AlertsView      uid={uid} alerts={data as Record<string,import('@/types').Alert>}/>
      case 'commands':    return <CommandsView    uid={uid} commands={data as Record<string,import('@/types').Command>}/>
      case 'config':      return <ConfigView      uid={uid} config={data as import('@/types').Config | null}/>
      case 'predictions': return <PredictionsView predictions={data as Record<string,import('@/types').Prediction>}/>
      case 'zones':       return <ZonesView       uid={uid} zones={data as Record<string,import('@/types').Zone>}/>
      default: return null
    }
  }

  return (
    <>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{padding:'32px',fontFamily:'DM Sans,sans-serif'}}>

        {/* Breadcrumb */}
        <div style={{
          display:'flex',alignItems:'center',gap:6,
          marginBottom:18,fontSize:13,
          animation:'fadeUp .35s ease both',
        }}>
          <Link href="/users" style={{
            color:'oklch(0.40 0.018 145)',textDecoration:'none',
            fontFamily:'Geist Mono,monospace',
          }}>users</Link>
          <span style={{color:'oklch(0.28 0.012 145)'}}>›</span>
          <Link href={`/users/${uid}`} style={{
            color:'oklch(0.40 0.018 145)',textDecoration:'none',
            fontFamily:'Geist Mono,monospace',
          }}>{uid.slice(0,8)}...</Link>
          <span style={{color:'oklch(0.28 0.012 145)'}}>›</span>
          <span style={{color: meta.color, fontFamily:'Geist Mono,monospace'}}>
            {collection}
          </span>
        </div>

        {/* Back */}
        <Link href={`/users/${uid}`} style={{
          display:'inline-flex',alignItems:'center',gap:5,
          fontSize:13,color:'oklch(0.40 0.018 145)',
          textDecoration:'none',marginBottom:24,transition:'color .15s',
        }}>
          <ChevronLeft size={14}/> Retour à l'utilisateur
        </Link>

        {/* Header */}
        <div style={{
          display:'flex',alignItems:'center',gap:14,
          marginBottom:24,animation:'fadeUp .4s .05s ease both',
        }}>
          <div style={{
            width:42,height:42,borderRadius:12,
            background:`${meta.color.replace(')','')} / .12)`.replace('oklch','oklch'),
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:20,
          }}>
            {meta.icon}
          </div>
          <div>
            <h1 style={{fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:700,
              color:'oklch(0.96 0.008 145)',letterSpacing:'-0.3px',margin:0}}>
              {collection.charAt(0).toUpperCase() + collection.slice(1)}
            </h1>
            <div style={{fontSize:12,color:'oklch(0.40 0.018 145)',marginTop:2}}>
              {count} {count === 1 ? 'élément' : 'éléments'}
            </div>
          </div>
          <div style={{
            marginLeft:'auto',
            background:'oklch(0.10 0.015 145)',
            border:'1px solid oklch(0.18 0.013 145)',
            borderRadius:9,padding:'5px 12px',
            fontFamily:'Geist Mono,monospace',
            fontSize:11,color:'oklch(0.40 0.018 145)',
          }}>
            {count} doc{count !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Content */}
        <div style={{animation:'fadeUp .4s .1s ease both'}}>
          {renderView()}
        </div>
      </div>
    </>
  )
}