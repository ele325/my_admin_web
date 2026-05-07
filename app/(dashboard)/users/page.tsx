import { getAllUsers } from '@/services/user.service'
import { UsersTable } from '@/components/users/UsersTable'

export default async function UsersPage() {
  const users = await getAllUsers()

  return (
    <>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{padding:'32px', fontFamily:'DM Sans,sans-serif', background:'#f8fafc', minHeight:'100vh'}}>

        {/* Header */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          marginBottom:24, animation:'fadeUp .4s ease both',
        }}>
          <div>
            <h1 style={{
              fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:700,
              color:'#0f172a', letterSpacing:'-0.4px', marginBottom:4
            }}>
              Utilisateurs
            </h1>
            <p style={{fontSize:13, color:'#64748b'}}>
              {users.length} document{users.length !== 1 ? 's' : ''} dans la collection
            </p>
          </div>
          <div style={{
            background:'#f0fdf4',
            border:'1px solid #bbf7d0',
            borderRadius:9, padding:'6px 14px',
            fontSize:12, color:'#16a34a',
            letterSpacing:'1px', textTransform:'uppercase',
          }}>
            {users.length} total
          </div>
        </div>

        {/* Table wrapper */}
        <div style={{
          background:'white',           // ✅ noir supprimé
          border:'1px solid #e2e8f0',
          borderRadius:16, overflow:'hidden',
          animation:'fadeUp .4s .08s ease both',
          boxShadow:'0 1px 6px rgba(0,0,0,0.04)',
        }}>
          <UsersTable users={users} />
        </div>

      </div>
    </>
  )
}