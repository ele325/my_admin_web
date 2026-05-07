'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types'
import { truncateUid } from '@/lib/utils'
import { DeleteUserButton } from '@/components/users/DeleteUserButton'
import { Search, CheckCircle, XCircle, Eye, Pencil } from 'lucide-react'

interface UsersTableProps {
  users: User[]
}

function formatDate(ts: { _seconds: number } | undefined) {
  if (!ts) return '—'
  return new Date(ts._seconds * 1000).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return (
      u.email?.toLowerCase().includes(q) ||
      u.fullName?.toLowerCase().includes(q) ||
      u.cin?.toLowerCase().includes(q) ||
      u.uid?.toLowerCase().includes(q)
    )
  })

  return (
    <div style={{ padding: '16px' }}>  {/* ✅ padding ajouté */}

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={15} style={{
          position: 'absolute', left: 12, top: '50%',
          transform: 'translateY(-50%)', color: '#94a3b8',
        }}/>
        <input
          placeholder="Rechercher par email, nom ou CIN..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px 10px 36px',
            border: '1px solid #e2e8f0', borderRadius: 10,
            fontSize: 13, color: '#0f172a', background: '#f8fafc',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Table */}
      <div style={{ borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['UID', 'Nom', 'Email', 'Rôle', 'Vérifié', 'Créé le', 'Actions'].map((h, i) => (
                <th key={i} style={{
                  padding: '10px 16px', textAlign: i === 6 ? 'right' : 'left',
                  fontSize: 11, fontWeight: 600, color: '#64748b',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => (
              <tr
                key={user.uid}
                onClick={() => router.push(`/users/${user.uid}`)}
                style={{
                  borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                  background: i % 2 === 0 ? 'white' : '#fafafa',
                  transition: 'background .15s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#f0fdf4')}
                onMouseOut={e => (e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#fafafa')}
              >
                {/* UID */}
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    fontFamily: 'monospace', fontSize: 12,
                    color: '#64748b', background: '#f1f5f9',
                    padding: '2px 8px', borderRadius: 6,
                  }}>
                    {truncateUid(user.uid)}
                  </span>
                </td>

                {/* Nom */}
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #16a34a, #3b82f6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: 'white',
                    }}>
                      {user.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                      {user.fullName || '—'}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>
                  {user.email}
                </td>

                {/* Rôle */}
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                    background: user.role === 'admin' ? '#f0fdf4' : '#f8fafc',
                    color: user.role === 'admin' ? '#16a34a' : '#64748b',
                    border: `1px solid ${user.role === 'admin' ? '#bbf7d0' : '#e2e8f0'}`,
                  }}>
                    {user.role}
                  </span>
                </td>

                {/* Vérifié */}
                <td style={{ padding: '12px 16px' }}>
                  {user.emailVerified
                    ? <CheckCircle size={16} color="#16a34a"/>
                    : <XCircle size={16} color="#f59e0b"/>
                  }
                </td>

                {/* Date */}
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>
                  {formatDate(user.createdAt as { _seconds: number })}
                </td>

                {/* Actions */}
                <td style={{ padding: '12px 16px' }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={() => router.push(`/users/${user.uid}`)}
                      style={{
                        padding: '6px', borderRadius: 8, border: 'none',
                        background: '#f1f5f9', color: '#64748b', cursor: 'pointer',
                        display: 'flex', alignItems: 'center',
                      }}
                    >
                      <Eye size={14}/>
                    </button>
                    <button style={{
                      padding: '6px', borderRadius: 8, border: 'none',
                      background: '#f1f5f9', color: '#64748b', cursor: 'pointer',
                      display: 'flex', alignItems: 'center',
                    }}>
                      <Pencil size={14}/>
                    </button>
                    <DeleteUserButton uid={user.uid} userName={user.fullName || user.email} />
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{
                  padding: '40px', textAlign: 'center',
                  color: '#94a3b8', fontSize: 13,
                }}>
                  Aucun utilisateur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}