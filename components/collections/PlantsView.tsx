'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SensorParam, ThresholdRange } from '@/types'
import { Leaf, Plus, Trash2, Edit, Save, X } from 'lucide-react'

type ZonePlantRow = {
  uid: string
  userName: string
  zoneId: string
  plant_type: string
  thresholds: Record<SensorParam, ThresholdRange> | null
}

type ThresholdForm = Record<SensorParam, { min: string; max: string }>

function emptyThresholds(): ThresholdForm {
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

function toForm(thresholds: Record<SensorParam, ThresholdRange> | null | undefined): ThresholdForm {
  const f = emptyThresholds()
  if (!thresholds) return f
  ;(Object.keys(f) as SensorParam[]).forEach((p) => {
    const t = thresholds[p]
    if (!t) return
    f[p] = { min: String(t.min ?? ''), max: String(t.max ?? '') }
  })
  return f
}

function toThresholds(form: ThresholdForm): { ok: true; value: Record<SensorParam, ThresholdRange> } | { ok: false; error: string } {
  const out: Partial<Record<SensorParam, ThresholdRange>> = {}
  for (const p of Object.keys(form) as SensorParam[]) {
    const min = Number(form[p].min)
    const max = Number(form[p].max)
    if (!Number.isFinite(min) || !Number.isFinite(max)) return { ok: false, error: `Veuillez saisir min/max pour ${p}` }
    if (min > max) return { ok: false, error: `Seuil invalide pour ${p} (min > max)` }
    out[p] = { min, max }
  }
  return { ok: true, value: out as Record<SensorParam, ThresholdRange> }
}

const EMPTY_FORM = {
  uid: '',
  zoneId: '',
  plant_type: '',
  description: '',
  thresholds: emptyThresholds(),
}

const THRESHOLD_FIELDS = [
  { param: 'humidity' as SensorParam, label: 'Humidité', unit: '%', color: '#3b82f6' },
  { param: 'temperature' as SensorParam, label: 'Température', unit: '°C', color: '#f97316' },
  { param: 'ph' as SensorParam, label: 'pH', unit: '', color: '#a855f7' },
  { param: 'ec' as SensorParam, label: 'EC', unit: 'µS/cm', color: '#eab308' },
  { param: 'n' as SensorParam, label: 'Azote (N)', unit: 'mg/kg', color: '#22c55e' },
  { param: 'p' as SensorParam, label: 'Phosphore (P)', unit: 'mg/kg', color: '#f97316' },
  { param: 'k' as SensorParam, label: 'Potassium (K)', unit: 'mg/kg', color: '#a855f7' },
]

interface PlantsViewProps {
  zones: ZonePlantRow[]
  users: { uid: string; userName: string }[]
  initialEditKey?: string | null
}

export function PlantsView({ zones, users, initialEditKey = null }: PlantsViewProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editKey, setEditKey] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedUid, setSelectedUid] = useState('')
  const [loading, setLoading] = useState(false)

  const configuredZones = useMemo(
    () => zones.filter((z) => z.plant_type || z.thresholds),
    [zones]
  )
  const zonesForSelectedUser = useMemo(
    () => zones.filter((z) => z.uid === selectedUid),
    [zones, selectedUid]
  )
  const thresholdsState = useMemo(() => {
    for (const p of Object.keys(form.thresholds) as SensorParam[]) {
      const min = Number(form.thresholds[p].min)
      const max = Number(form.thresholds[p].max)
      if (!Number.isFinite(min) || !Number.isFinite(max)) {
        return { complete: false, valid: false, error: `Seuil ${p} incomplet` }
      }
      if (min > max) {
        return { complete: true, valid: false, error: `Seuil ${p} invalide (min > max)` }
      }
    }
    return { complete: true, valid: true, error: '' }
  }, [form.thresholds])

  useEffect(() => {
    if (!initialEditKey) return
    const row = zones.find((z) => `${z.uid}:${z.zoneId}` === initialEditKey)
    if (!row) return
    setForm({
      uid: row.uid,
      zoneId: row.zoneId,
      plant_type: row.plant_type || '',
      description: '',
      thresholds: toForm(row.thresholds),
    })
    setSelectedUid(row.uid)
    setEditKey(initialEditKey)
    setShowForm(true)
  }, [initialEditKey, zones])

  const handleCreate = () => {
    setForm(EMPTY_FORM)
    setSelectedUid('')
    setEditKey(null)
    setShowForm(true)
  }

  const handleEdit = (row: ZonePlantRow) => {
    setForm({
      uid: row.uid,
      zoneId: row.zoneId,
      plant_type: row.plant_type || '',
      description: '',
      thresholds: toForm(row.thresholds),
    })
    setSelectedUid(row.uid)
    setEditKey(`${row.uid}:${row.zoneId}`)
    setShowForm(true)
  }

  const handleThreshold = (param: SensorParam, key: 'min' | 'max', value: string) => {
    setForm((prev) => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [param]: {
          ...prev.thresholds[param],
          [key]: value,
        },
      },
    }))
  }

  const handleSave = async () => {
    if (!form.uid || !form.zoneId) {
      alert('Veuillez choisir une zone')
      return
    }
    if (!form.plant_type.trim()) {
      alert('Le type de plante est obligatoire')
      return
    }
    const parsed = toThresholds(form.thresholds)
    if (!parsed.ok) {
      alert(parsed.error)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/users/${form.uid}/zones/${form.zoneId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plant_type: form.plant_type.trim(),
          thresholds: parsed.value,
        }),
      })
      if (!res.ok) throw new Error('Erreur de sauvegarde')
      setShowForm(false)
      router.refresh()
    } catch {
      alert('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (row: ZonePlantRow) => {
    if (!confirm(`Supprimer la plante de ${row.zoneId} ?`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${row.uid}/zones/${row.zoneId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plant_type: '',
          thresholds: null,
        }),
      })
      if (!res.ok) throw new Error('Erreur suppression')
      router.refresh()
    } catch {
      alert('Erreur suppression')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={handleCreate} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 20px', borderRadius: 10, border: 'none',
        background: '#16a34a', color: 'white',
        fontWeight: 700, fontSize: 14, cursor: 'pointer', marginBottom: 24,
      }}>
        <Plus size={16} /> Nouvelle Plante
      </button>

      {showForm && (
        <div style={{
          background: 'white', borderRadius: 16,
          border: '1px solid #e2e8f0', padding: 24,
          marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 20,
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
              {editKey ? '✏️ Modifier' : '🌱 Nouvelle plante'}
            </h2>
            <button onClick={() => setShowForm(false)} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8',
            }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block', fontSize: 12, color: '#64748b',
              marginBottom: 6, fontWeight: 600,
            }}>Utilisateur *</label>
            <select
              value={selectedUid}
              onChange={(e) => {
                const uid = e.target.value
                setSelectedUid(uid)
                setForm((prev) => ({
                  ...prev,
                  uid,
                  zoneId: '',
                }))
              }}
              disabled={Boolean(editKey)}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 8,
                border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
                marginBottom: 10,
              }}
            >
              <option value="">Choisir un utilisateur</option>
              {users.map((u) => (
                <option key={u.uid} value={u.uid}>
                  {u.userName}
                </option>
              ))}
            </select>

            <label style={{
              display: 'block', fontSize: 12, color: '#64748b',
              marginBottom: 6, fontWeight: 600,
            }}>Zone *</label>
            <select
              value={`${form.uid}:${form.zoneId}`}
              onChange={(e) => {
                const [uid, zoneId] = e.target.value.split(':')
                const row = zones.find((z) => z.uid === uid && z.zoneId === zoneId)
                setForm((prev) => ({
                  ...prev,
                  uid,
                  zoneId,
                  plant_type: row?.plant_type || prev.plant_type,
                  thresholds: row?.thresholds ? toForm(row.thresholds) : prev.thresholds,
                }))
              }}
              disabled={Boolean(editKey)}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 8,
                border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
              }}
            >
              <option value="">Choisir une zone</option>
              {zonesForSelectedUser.map((z) => (
                <option key={`${z.uid}-${z.zoneId}`} value={`${z.uid}:${z.zoneId}`}>
                  {z.userName} — {z.zoneId}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block', fontSize: 12, color: '#64748b',
              marginBottom: 6, fontWeight: 600,
            }}>Nom de la plante *</label>
            <input
              type="text"
              placeholder="ex: Tomate, Blé, Olive..."
              value={form.plant_type}
              onChange={(e) => setForm((p) => ({ ...p, plant_type: e.target.value }))}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 8,
                border: '1px solid #e2e8f0', fontSize: 14,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block', fontSize: 12, color: '#64748b',
              marginBottom: 12, fontWeight: 600,
            }}>Seuils optimaux</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 12,
            }}>
              {THRESHOLD_FIELDS.map((f) => (
                <div key={f.param} style={{
                  background: '#f8fafc', borderRadius: 10,
                  padding: 12, border: '1px solid ' + f.color + '30',
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700,
                    color: f.color, marginBottom: 8,
                  }}>
                    {f.label} {f.unit ? '(' + f.unit + ')' : ''}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>Min</div>
                      <input
                        type="number" step="0.1"
                        value={form.thresholds[f.param]?.min ?? ''}
                        onChange={(e) => handleThreshold(f.param, 'min', e.target.value)}
                        style={{
                          width: '100%', padding: '6px 8px', borderRadius: 6,
                          border: '1px solid ' + f.color + '40',
                          fontSize: 13, outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>Max</div>
                      <input
                        type="number" step="0.1"
                        value={form.thresholds[f.param]?.max ?? ''}
                        onChange={(e) => handleThreshold(f.param, 'max', e.target.value)}
                        style={{
                          width: '100%', padding: '6px 8px', borderRadius: 6,
                          border: '1px solid ' + f.color + '40',
                          fontSize: 13, outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSave} disabled={loading || !thresholdsState.valid} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 24px', borderRadius: 10, border: 'none',
            background: loading || !thresholdsState.valid ? '#86efac' : '#16a34a',
            color: 'white', fontWeight: 700, fontSize: 14,
            cursor: loading || !thresholdsState.valid ? 'not-allowed' : 'pointer',
          }}>
            <Save size={16} />
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
          {!thresholdsState.valid && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#dc2626', fontWeight: 700 }}>
              Seuils non configurés correctement (7 paramètres requis, min ≤ max).
            </div>
          )}
        </div>
      )}

      {configuredZones.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '48px', color: '#94a3b8',
          background: 'white', borderRadius: 16, border: '1px solid #e2e8f0',
        }}>
          Aucune plante configurée — cliquez sur Nouvelle Plante
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}>
          {configuredZones.map((row) => (
            <div key={`${row.uid}-${row.zoneId}`} style={{
              background: 'white', borderRadius: 12,
              border: '1px solid #e2e8f0', padding: 16,
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: '#dcfce7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Leaf size={16} color="#16a34a" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>
                      {row.plant_type || 'Sans nom'}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>
                      {row.userName} — {row.zoneId}
                    </div>
                    {!row.thresholds && (
                      <div style={{
                        marginTop: 4,
                        fontSize: 11,
                        color: '#dc2626',
                        fontWeight: 700,
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                        borderRadius: 999,
                        padding: '2px 8px',
                        display: 'inline-block',
                      }}>
                        Seuils non configurés
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => handleEdit(row)} style={{
                    padding: '5px 8px', borderRadius: 8, border: 'none',
                    background: '#dbeafe', color: '#2563eb', cursor: 'pointer',
                  }}>
                    <Edit size={13} />
                  </button>
                  <button onClick={() => handleDelete(row)} style={{
                    padding: '5px 8px', borderRadius: 8, border: 'none',
                    background: '#fee2e2', color: '#dc2626', cursor: 'pointer',
                  }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
              }}>
                {THRESHOLD_FIELDS.map((f) => {
                  const t = row.thresholds?.[f.param]
                  if (!t) return null
                  return (
                    <div key={f.param} style={{
                      background: '#f8fafc', borderRadius: 6,
                      padding: '5px 8px', fontSize: 11,
                    }}>
                      <span style={{ color: '#64748b' }}>{f.label} : </span>
                      <span style={{
                        fontWeight: 700, color: f.color, fontFamily: 'monospace',
                      }}>
                        {t.min}-{t.max}
                        {f.unit ? ' ' + f.unit : ''}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

