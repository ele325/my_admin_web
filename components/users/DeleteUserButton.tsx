'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { Spinner } from '@/components/ui/spinner'
import { Trash2 } from 'lucide-react'

interface DeleteUserButtonProps {
  uid: string
  userName: string
}

export function DeleteUserButton({ uid, userName }: DeleteUserButtonProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${uid}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete user')

      toast({
        title: 'User deleted',
        description: `${userName} has been removed.`,
      })
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-agro-muted hover:text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-agro-card border-agro-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-agro-text">Delete User</AlertDialogTitle>
          <AlertDialogDescription className="text-agro-muted">
            Are you sure you want to delete <span className="text-agro-text font-medium">{userName}</span>?
            This action cannot be undone and will permanently remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-agro-surface border-agro-border text-agro-text hover:bg-agro-card">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Deleting...
              </span>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
