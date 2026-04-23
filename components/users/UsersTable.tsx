'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types'
import { formatTimestamp, truncateUid } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CopyableText } from '@/components/ui/copyable-text'
import { DeleteUserButton } from '@/components/users/DeleteUserButton'
import { Search, CheckCircle, XCircle, Eye, Pencil } from 'lucide-react'

interface UsersTableProps {
  users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const filteredUsers = users.filter(user => {
    const searchLower = search.toLowerCase()
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.fullName?.toLowerCase().includes(searchLower) ||
      user.cin?.toLowerCase().includes(searchLower) ||
      user.uid?.toLowerCase().includes(searchLower)
    )
  })

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">admin</Badge>
      case 'farmer':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">farmer</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{role}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-agro-muted" />
        <Input
          placeholder="Search by email, name, or CIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-agro-surface border-agro-border text-agro-text placeholder:text-agro-muted/50"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-agro-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-agro-border bg-agro-surface/50 hover:bg-agro-surface/50">
              <TableHead className="text-agro-muted font-mono">uid</TableHead>
              <TableHead className="text-agro-muted">Full Name</TableHead>
              <TableHead className="text-agro-muted">Email</TableHead>
              <TableHead className="text-agro-muted">Role</TableHead>
              <TableHead className="text-agro-muted">Verified</TableHead>
              <TableHead className="text-agro-muted">Created At</TableHead>
              <TableHead className="text-agro-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow
                key={user.uid}
                className="border-agro-border cursor-pointer hover:bg-agro-card/50"
                onClick={() => router.push(`/users/${user.uid}`)}
              >
                <TableCell>
                  <CopyableText
                    text={user.uid}
                    displayText={truncateUid(user.uid)}
                    className="text-agro-muted"
                  />
                </TableCell>
                <TableCell className="text-agro-text">{user.fullName || '—'}</TableCell>
                <TableCell className="text-agro-text">{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>
                  {user.emailVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-agro-muted" />
                  )}
                </TableCell>
                <TableCell className="text-agro-muted text-sm">
                  {formatTimestamp(user.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-agro-muted hover:text-agro-text hover:bg-agro-card"
                      onClick={() => router.push(`/users/${user.uid}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-agro-muted hover:text-agro-accent hover:bg-agro-card"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <DeleteUserButton uid={user.uid} userName={user.fullName || user.email} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-agro-muted">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
