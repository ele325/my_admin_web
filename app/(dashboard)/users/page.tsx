/* ============================================================
   FILE 1 — app/(dashboard)/users/page.tsx
   ============================================================ */
import { getAllUsers } from '@/services/user.service'
import { UsersTable } from '@/components/users/UsersTable'

export default async function UsersPage() {
  const users = await getAllUsers()

  return (
    <>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{padding:'32px',fontFamily:'DM Sans,sans-serif'}}>

        {/* Header */}
        <div style={{
          display:'flex',alignItems:'center',justifyContent:'space-between',
          marginBottom:24,animation:'fadeUp .4s ease both',
        }}>
          <div>
            <h1 style={{fontFamily:'Syne,sans-serif',fontSize:22,fontWeight:700,
              color:'oklch(0.96 0.008 145)',letterSpacing:'-0.4px',marginBottom:4}}>
              Utilisateurs
            </h1>
            <p style={{fontSize:13,color:'oklch(0.40 0.018 145)'}}>
              {users.length} document{users.length !== 1 ? 's' : ''} dans la collection
            </p>
          </div>
          <div style={{
            background:'oklch(0.72 0.19 152 / .09)',
            border:'1px solid oklch(0.72 0.19 152 / .2)',
            borderRadius:9,padding:'6px 14px',
            fontSize:12,color:'oklch(0.72 0.19 152)',
            letterSpacing:'1px',textTransform:'uppercase',
          }}>
            {users.length} total
          </div>
        </div>

        {/* Table wrapper */}
        <div style={{
          background:'oklch(0.10 0.015 145)',
          border:'1px solid oklch(0.18 0.013 145)',
          borderRadius:16,overflow:'hidden',
          animation:'fadeUp .4s .08s ease both',
        }}>
          <UsersTable users={users} />
        </div>
      </div>
    </>
  )
}

