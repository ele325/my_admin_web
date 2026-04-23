import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Timestamp } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(value: { _seconds: number; _nanoseconds: number }): string {
  return new Date(value._seconds * 1000).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function getTrendIcon(value: number): string {
  if (value > 0) return '↑'
  if (value < 0) return '↓'
  return '→'
}

export function getHealthColor(score: number): string {
  if (score >= 70) return 'text-green-400'
  if (score >= 40) return 'text-amber-400'
  return 'text-red-400'
}

export function getHealthBgColor(score: number): string {
  if (score >= 70) return 'bg-green-500/20 text-green-400'
  if (score >= 40) return 'bg-amber-500/20 text-amber-400'
  return 'bg-red-500/20 text-red-400'
}

export function truncateUid(uid: string, chars = 8): string {
  return uid.length > chars ? `${uid.slice(0, chars)}...` : uid
}
