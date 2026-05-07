'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SensorParam, ThresholdRange, Zone } from '@/types'

const PARAMS: { param: SensorParam; label: string; unit?: string; hasMax: boolean; step?: string }[] = [
  { param: 'humidity', label: 'Humidité', unit: '%', hasMax: true, step: '0.1' },
  { param: 'temperature', label: 'Température', unit: '°C', hasMax: true, step: '0.1' },
  { param: 'ph', label: 'pH', hasMax: true, step: '0.01' },
  { param: 'ec', label: 'EC', unit: 'µS/cm', hasMax: true, step: '1' },
  { param: 'n', label: 'N (Azote)', unit: 'mg/kg', hasMax: true, step: '0.1' },
  { param: 'p', label: 'P (Phosphore)', unit: 'mg/kg', hasMax: true, step: '0.1' },
  { param: 'k', label: 'K (Potassium)', unit: 'mg/kg', hasMax: true, step: '0.1' },
]

type ThresholdForm = Record<SensorParam, { min: string; max: string }>

function emptyForm(): ThresholdForm {
  return {
    humidity: { min: '', max: '' },
    temperature: { min: '', max: '' },
    ph: { min: '', max: '' },
    ec: { min: '', max: '' },
    n: { min: '', max: '' },
    p: { min: '', max: '' },
    k: { min: '', max: '' },
  }
}

function toForm(thresholds: Record<SensorParam, ThresholdRange> | undefined): ThresholdForm {
  if (!thresholds) return emptyForm()
  const f = emptyForm()
  ;(Object.keys(f) as SensorParam[]).forEach(p => {
    const t = thresholds[p]
    if (!t) return
    f[p] = { min: String(t.min ?? ''), max: String(t.max ?? '') }
  })
  return f
}

function toThresholds(form: ThresholdForm): { ok: true; value: Record<SensorParam, ThresholdRange> } | { ok: false; error: string } {
  const out: any = {}
  for (const p of Object.keys(form) as SensorParam[]) {
    const min = Number(form[p].min)
    const max = Number(form[p].max)
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      return { ok: false, error: `Veuillez saisir min/max pour ${p}` }
    }
    if (min > max) return { ok: false, error: `Seuil invalide pour ${p} (min > max)` }
    out[p] = { min, max }
  }
  return { ok: true, value: out }
}

export function ZonePlantPicker({
  uid,
  zoneId,
  zone,
}: {
  uid: string
  zoneId: string
  zone: Zone
}) {
  const router = useRouter()
  const hasExistingPlant = useMemo(() => Boolean(zone.plant_type), [zone.plant_type])

  const [mode, setMode] = useState<'existing' | 'new'>(hasExistingPlant ? 'existing' : 'new')
  const [plantType, setPlantType] = useState<string>(zone.plant_type || '')

  const [newName, setNewName] = useState(zone.plant_type || '')
  const [newDescription, setNewDescription] = useState('')
  const [thresholds, setThresholds] = useState<ThresholdForm>(() => {
    if (zone.thresholds) return toForm(zone.thresholds)
    return emptyForm()
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleThreshold = (param: SensorParam, key: 'min' | 'max', value: string) => {
    setThresholds(prev => ({
      ...prev,
      [param]: { ...prev[param], [key]: value },
    }))
  }

  const handleSave = async () => {
    setError(null)
    const parsed = toThresholds(thresholds)
    if (!parsed.ok) {
      setError(parsed.error)
      return
    }

    setSaving(true)
    try {
      const finalPlantType = mode === 'new' ? newName.trim() : plantType.trim()
      if (!finalPlantType) {
        setError('Le type de plante est obligatoire')
        setSaving(false)
        return
      }

      const zoneRes = await fetch(`/api/users/${uid}/zones/${zoneId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plant_type: finalPlantType,
          thresholds: parsed.value,
        }),
      })
      const zoneData = await zoneRes.json().catch(() => ({}))
      if (!zoneRes.ok) throw new Error(zoneData?.error || 'Erreur sauvegarde zone')

      router.push(`/users/${uid}/zones`)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <button
          onClick={() => setMode('existing')}
          style={{
            padding: '8px 14px',
            borderRadius: 10,
            border: '1px solid ' + (mode === 'existing' ? '#16a34a' : '#e2e8f0'),
            background: mode === 'existing' ? '#f0fdf4' : 'white',
            cursor: 'pointer',
            fontWeight: 700,
            color: mode === 'existing' ? '#16a34a' : '#64748b',
          }}
        >
          Utiliser le type actuel
        </button>
        <button
          onClick={() => setMode('new')}
          style={{
            padding: '8px 14px',
            borderRadius: 10,
            border: '1px solid ' + (mode === 'new' ? '#16a34a' : '#e2e8f0'),
            background: mode === 'new' ? '#f0fdf4' : 'white',
            cursor: 'pointer',
            fontWeight: 700,
            color: mode === 'new' ? '#16a34a' : '#64748b',
          }}
        >
          Nouveau type de plante
        </button>
      </div>

      {mode === 'existing' ? (
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 6 }}>
            Type de plante
          </label>
          <input
            value={plantType}
            onChange={e => setPlantType(e.target.value)}
            placeholder="ex: Blé, Tomate..."
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              background: 'white',
              fontSize: 14,
            }}
          />
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
            Les seuils ci-dessous seront sauvegardés uniquement sur cette zone.
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 6 }}>
              Nom de la plante *
            </label>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="ex: Tomate, Blé..."
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 6 }}>
              Description (optionnelle)
            </label>
            <input
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="ex: culture serre..."
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14 }}
            />
          </div>
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 800, marginBottom: 8 }}>
          Seuils optimaux (7 paramètres)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
          {PARAMS.map(f => (
            <div key={f.param} style={{ background: '#f8fafc', borderRadius: 12, padding: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
                {f.label} {f.unit ? `(${f.unit})` : ''}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>Min</div>
                  <input
                    type="number"
                    step={f.step}
                    value={thresholds[f.param].min}
                    onChange={e => handleThreshold(f.param, 'min', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>Max</div>
                  <input
                    type="number"
                    step={f.step}
                    value={thresholds[f.param].max}
                    onChange={e => handleThreshold(f.param, 'max', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '10px 12px',
          borderRadius: 12,
          fontSize: 13,
          marginBottom: 12,
        }}>
          {error}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: '10px 18px',
          borderRadius: 12,
          border: 'none',
          background: saving ? '#86efac' : '#16a34a',
          color: 'white',
          fontWeight: 800,
          cursor: saving ? 'not-allowed' : 'pointer',
        }}
      >
        {saving ? 'Sauvegarde...' : 'Sauvegarder'}
      </button>
    </div>
  )
}

