import { notFound } from 'next/navigation'
import Link from 'next/link'
import { adminDb } from '@/lib/firebase/admin'
import { getUserById } from '@/services/user.service'
import { UserFieldTree } from '@/components/users/UserFieldTree'
import { SubcollectionCard } from '@/components/users/SubcollectionCard'
import { ChevronLeft } from 'lucide-react'

export async function UserDetailPage({
  params,
}: {
  params: Promise<{ uid: string }>
}) {
  const { uid } = await params
  const user = await getUserById(uid)
  if (!user) notFound()

  // ✅ Lire les counts depuis les vraies sous-collections
  const [alertsSnap, commandsSnap, zonesSnap, predictionsSnap] = await Promise.all([
    adminDb.collection('users').doc(uid).collection('alerts').count().get(),
    adminDb.collection('users').doc(uid).collection('commands').count().get(),
    adminDb.collection('users').doc(uid).collection('zones').count().get(),
    adminDb.collection('users').doc(uid).collection('predictions').count().get(),
  ])

  const documentFields = {
    uid:           user.uid,
    email:         user.email,
    fullName:      user.fullName,
    cin:           user.cin,
    role:          user.role,
    emailVerified: user.emailVerified,
    createdAt:     user.createdAt,
  }

  const subcollections = [
    { name: 'alerts',      count: alertsSnap.data().count },
    { name: 'commands',    count: commandsSnap.data().count },
    { name: 'config',      count: user.config ? 1 : 0 },
    { name: 'predictions', count: predictionsSnap.data().count },
    { name: 'zones',       count: zonesSnap.data().count },
  ]

  return (
    <>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{padding:'32px',fontFamily:'DM Sans,sans-serif'}}>

        <div style={{
          display:'flex',alignItems:'center',gap:6,
          marginBottom:18,fontSize:13,
          animation:'fadeUp .35s ease both',
        }}>
          <Link href="/users" style={{
            color:'oklch(0.40 0.018 145)',textDecoration:'none',
            transition:'color .15s',fontFamily:'Geist Mono,monospace',
          }}>users</Link>
          <span style={{color:'oklch(0.28 0.012 145)'}}>›</span>
          <span style={{color:'oklch(0.72 0.19 152)',fontFamily:'Geist Mono,monospace'}}>
            {uid}
          </span>
        </div>

        <Link href="/users" style={{
          display:'inline-flex',alignItems:'center',gap:5,
          fontSize:13,color:'oklch(0.40 0.018 145)',
          textDecoration:'none',marginBottom:24,
          transition:'color .15s',
        }}>
          <ChevronLeft size={14}/> Retour aux utilisateurs
        </Link>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <div style={{
            background:'oklch(0.10 0.015 145)',
            border:'1px solid oklch(0.18 0.013 145)',
            borderRadius:16,overflow:'hidden',
            animation:'fadeUp .4s .05s ease both',
          }}>
            <div style={{
              padding:'16px 20px',
              borderBottom:'1px solid oklch(0.18 0.013 145)',
              display:'flex',alignItems:'center',gap:10,
            }}>
              <h2 style={{fontFamily:'Syne,sans-serif',fontSize:14,fontWeight:600,
                color:'oklch(0.96 0.008 145)',margin:0}}>
                Document Fields
              </h2>
              <span style={{
                background:'oklch(0.18 0.013 145)',
                borderRadius:6,padding:'2px 8px',
                fontSize:11,color:'oklch(0.40 0.018 145)',
                fontFamily:'Geist Mono,monospace',
              }}>
                {Object.keys(documentFields).length} champs
              </span>
            </div>
            <div style={{padding:'16px 20px'}}>
              <UserFieldTree data={documentFields as unknown as Record<string, unknown>} />
            </div>
          </div>

          <div style={{animation:'fadeUp .4s .1s ease both'}}>
            <h2 style={{fontFamily:'Syne,sans-serif',fontSize:15,fontWeight:600,
              color:'oklch(0.96 0.008 145)',marginBottom:12}}>
              Sous-collections
            </h2>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {subcollections.map(sub=>(
                <SubcollectionCard key={sub.name} uid={uid} name={sub.name} count={sub.count}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserDetailPage