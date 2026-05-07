import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth/verifyAdmin'
import { updateZone, deleteZone } from '@/services/zone.service'
import type { SensorParam } from '@/types'

const PARAMS: SensorParam[] = ['humidity', 'temperature', 'ph', 'ec', 'n', 'p', 'k']

function validateThresholds(thresholds: any): { ok: true } | { ok: false; error: string } {
  if (!thresholds || typeof thresholds !== 'object') {
    return { ok: false, error: 'Seuils manquants' }
  }
  for (const p of PARAMS) {
    const row = thresholds[p]
    if (!row || typeof row !== 'object') return { ok: false, error: `Seuil ${p} manquant` }
    if (typeof row.min !== 'number' || typeof row.max !== 'number') {
      return { ok: false, error: `Seuil ${p} invalide (min/max requis)` }
    }
    if (!Number.isFinite(row.min) || !Number.isFinite(row.max)) {
      return { ok: false, error: `Seuil ${p} invalide (valeurs non numériques)` }
    }
    if (row.min > row.max) {
      return { ok: false, error: `Seuil ${p} invalide: min > max` }
    }
  }
  return { ok: true }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string; zoneId: string }> }
) {
  try {
    await verifyAdmin()
    const { uid, zoneId } = await params
    const data = await request.json()

    const hasPlantType = Object.prototype.hasOwnProperty.call(data, 'plant_type')
    const hasThresholds = Object.prototype.hasOwnProperty.call(data, 'thresholds')

    // Si la plante est supprimée explicitement, on accepte (pas de defaults)
    if (hasPlantType && (!data.plant_type || String(data.plant_type).trim() === '')) {
      data.plant_type = ''
      data.thresholds = null
    } else if (hasPlantType || hasThresholds) {
      // Dès qu'on touche aux données plante, les 7 seuils sont obligatoires
      if (!hasPlantType || typeof data.plant_type !== 'string' || data.plant_type.trim().length === 0) {
        return NextResponse.json(
          { error: 'Type de plante requis' },
          { status: 400 }
        )
      }
      const valid = validateThresholds(data.thresholds)
      if (!valid.ok) {
        return NextResponse.json(
          { error: valid.error },
          { status: 400 }
        )
      }
      data.plant_type = data.plant_type.trim()
    }

    console.log(`✅ PUT /api/users/${uid}/zones/${zoneId}`, data)

    await updateZone(uid, zoneId, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ PUT zone error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unauthorized' },
      { status: 403 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ uid: string; zoneId: string }> }
) {
  try {
    await verifyAdmin()
    const { uid, zoneId } = await params

    console.log(`✅ DELETE /api/users/${uid}/zones/${zoneId}`)

    await deleteZone(uid, zoneId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ DELETE zone error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unauthorized' },
      { status: 403 }
    )
  }
}