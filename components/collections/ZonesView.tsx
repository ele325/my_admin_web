'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Zone, Measure } from '@/types'
import { useToast } from '@/hooks/use-toast'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  Droplets, Thermometer, Zap, FlaskConical,
  Leaf, Trash2, ChevronDown, ChevronUp,
  Activity, Power
} from 'lucide-react'

interface ZonesViewProps {
  uid: string
  zones: Record<string, Zone>
  measuresMap: Record<string, Measure[]>
}

function getHealthColor(sante: number) {
  if (sante >= 8) return { bg: '#dcfce7', text: '#16a34a' }
  if (sante >= 5) return { bg: '#fef9c3', text: '#ca8a04' }
  return { bg: '#fee2e2', text: '#dc2626' }
}

function formatTime(ts: { _seconds: number } | undefined) {
  if (!ts) return ''
  return new Date(ts._seconds * 1000).toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit'
  })
}

export function ZonesView({ uid, zones, measuresMap }: ZonesViewProps) {
  const [expandedZones, setExpandedZones] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<Record<string, string>>({})
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [plantTypes, setPlantTypes] = useState<Record<string, string>>({})
  const [savingPlant, setSavingPlant] = useState<Record<string, boolean>>({})
  const router = useRouter()
  const { toast } = useToast()

  const toggleExpand = (zoneId: string) => {
    setExpandedZones(prev => {
      const next = new Set(prev)
      next.has(zoneId) ? next.delete(zoneId) : next.add(zoneId)
      return next
    })
  }

  const getTab = (zoneId: string) => activeTab[zoneId] || 'data'
  const setTab = (zoneId: string, tab: string) =>
    setActiveTab(prev => ({ ...prev, [zoneId]: tab }))

  const handleTogglePump = async (zoneId: string, enabled: boolean) => {
    setLoadingStates(prev => ({ ...prev, [zoneId]: true }))
    try {
      const res = await fetch(`/api/users/${uid}/zones/${zoneId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour la zone', variant: 'destructive' })
    } finally {
      setLoadingStates(prev => ({ ...prev, [zoneId]: false }))
    }
  }

  const handleSavePlantType = async (zoneId: string) => {
    const plantType = plantTypes[zoneId]
    if (!plantType) return
    setSavingPlant(prev => ({ ...prev, [zoneId]: true }))
    try {
      const res = await fetch(`/api/users/${uid}/zones/${zoneId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant_type: plantType }),
      })
      if (!res.ok) throw new Error()
      toast({ title: '✅ Type de plante sauvegardé !' })
      router.refresh()
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder', variant: 'destructive' })
    } finally {
      setSavingPlant(prev => ({ ...prev, [zoneId]: false }))
    }
  }

  const handleDelete = async (zoneId: string) => {
    if (!confirm('Supprimer cette zone ?')) return
    setLoadingStates(prev => ({ ...prev, [zoneId]: true }))
    try {
      const res = await fetch(`/api/users/${uid}/zones/${zoneId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast({ title: 'Zone supprimée' })
      router.refresh()
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' })
    } finally {
      setLoadingStates(prev => ({ ...prev, [zoneId]: false }))
    }
  }

  const entries = Object.entries(zones)
  if (entries.length === 0) {
    return (
      <div style={{textAlign:'center', padding:'48px', color:'#94a3b8', background:'white', borderRadius:16}}>
        Aucune zone trouvée
      </div>
    )
  }

  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(520px, 1fr))', gap:20}}>
      {entries.map(([zoneId, zone]) => {
        const health = getHealthColor(zone.sante)
        const measures = (measuresMap[zoneId] || []).slice().reverse()
        const chartData = measures.map(m => ({
          time: formatTime(m.timestamp as { _seconds: number }),
          Humidité: m.humidity?.toFixed(1),
          Température: m.temperature?.toFixed(1),
          EC: m.ec?.toFixed(1),
          pH: m.ph?.toFixed(2),
        }))
        const tab = getTab(zoneId)
        const isExpanded = expandedZones.has(zoneId)

        return (
          <div key={zoneId} style={{
            background: 'white',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)',
            }}>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: '#dcfce7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Leaf size={18} color="#16a34a" />
                </div>
                <div>
                  <div style={{fontWeight:700, fontSize:15, color:'#0f172a', fontFamily:'monospace'}}>{zoneId}</div>
                  <div style={{fontSize:11, color:'#94a3b8', marginTop:2}}>
                    Mis à jour : {formatTime(zone.last_updated)}
                  </div>
                </div>
              </div>

              <div style={{display:'flex', alignItems:'center', gap:8}}>
                {/* Health badge */}
                <span style={{
                  background: health.bg, color: health.text,
                  borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600,
                }}>
                  Santé {zone.sante}/10
                </span>

                {/* Pump toggle */}
                <button
                  onClick={() => handleTogglePump(zoneId, !zone.enabled)}
                  disabled={loadingStates[zoneId]}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '6px 12px', borderRadius: 8, border: 'none',
                    background: zone.enabled ? '#dcfce7' : '#fee2e2',
                    color: zone.enabled ? '#16a34a' : '#dc2626',
                    fontWeight: 600, fontSize: 12, cursor: 'pointer',
                  }}
                >
                  <Power size={13} />
                  {zone.enabled ? 'Pompe ON' : 'Pompe OFF'}
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(zoneId)}
                  disabled={loadingStates[zoneId]}
                  style={{
                    padding: '6px 8px', borderRadius: 8, border: 'none',
                    background: '#fee2e2', color: '#dc2626', cursor: 'pointer',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 0, borderBottom: '1px solid #f1f5f9',
            }}>
              {[
                { icon: <Droplets size={16} color="#3b82f6"/>, label: 'Humidité', value: `${zone.humidity?.toFixed(1)}%`, color: '#3b82f6' },
                { icon: <Thermometer size={16} color="#f97316"/>, label: 'Temp', value: `${zone.temperature?.toFixed(1)}°`, color: '#f97316' },
                { icon: <Zap size={16} color="#eab308"/>, label: 'EC', value: zone.ec?.toFixed(2), color: '#eab308' },
                { icon: <FlaskConical size={16} color="#a855f7"/>, label: 'pH', value: zone.ph?.toFixed(2), color: '#a855f7' },
                { icon: <Activity size={16} color="#14b8a6"/>, label: 'Capteurs', value: zone.sensor_count, color: '#14b8a6' },
              ].map((m, i) => (
                <div key={i} style={{
                  padding: '14px 8px', textAlign: 'center',
                  borderRight: i < 4 ? '1px solid #f1f5f9' : 'none',
                }}>
                  <div style={{marginBottom:4}}>{m.icon}</div>
                  <div style={{fontSize:10, color:'#94a3b8', marginBottom:4}}>{m.label}</div>
                  <div style={{fontSize:15, fontWeight:700, color: m.color, fontFamily:'monospace'}}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* NPK */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              padding: '10px 16px', gap: 8, borderBottom: '1px solid #f1f5f9',
              background: '#fafafa',
            }}>
              {[
                { label: 'N (Azote)', value: zone.n, color: '#22c55e' },
                { label: 'P (Phosphore)', value: zone.p, color: '#f97316' },
                { label: 'K (Potassium)', value: zone.k, color: '#a855f7' },
              ].map((nutrient, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: 8, padding: '8px 12px',
                  border: '1px solid #f1f5f9', textAlign: 'center',
                }}>
                  <div style={{fontSize:10, color:'#94a3b8'}}>{nutrient.label}</div>
                  <div style={{fontSize:16, fontWeight:700, color: nutrient.color, fontFamily:'monospace'}}>
                    {nutrient.value?.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>

            {/* Plant type input */}
            <div style={{
              padding: '12px 16px', borderBottom: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Leaf size={14} color="#16a34a" />
              <span style={{fontSize:12, color:'#64748b', whiteSpace:'nowrap'}}>Type de plante :</span>
              <input
                type="text"
                placeholder="ex: Tomate, Blé, Maïs..."
                defaultValue={(zone as Zone & { plant_type?: string }).plant_type || ''}
                onChange={e => setPlantTypes(prev => ({ ...prev, [zoneId]: e.target.value }))}
                style={{
                  flex: 1, padding: '6px 10px', borderRadius: 8,
                  border: '1px solid #e2e8f0', fontSize: 13, color: '#0f172a',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => handleSavePlantType(zoneId)}
                disabled={savingPlant[zoneId]}
                style={{
                  padding: '6px 14px', borderRadius: 8, border: 'none',
                  background: '#16a34a', color: 'white',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {savingPlant[zoneId] ? '...' : 'Sauvegarder'}
              </button>
            </div>

            {/* Expand toggle */}
            <button
              onClick={() => toggleExpand(zoneId)}
              style={{
                width: '100%', padding: '10px', border: 'none',
                background: '#f8fafc', color: '#64748b',
                fontSize: 12, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}
            >
              {isExpanded ? <><ChevronUp size={14}/> Masquer les courbes</> : <><ChevronDown size={14}/> Voir les courbes historiques</>}
            </button>

            {/* Charts */}
            {isExpanded && (
              <div style={{padding:'16px', borderTop:'1px solid #f1f5f9'}}>
                {/* Tabs */}
                <div style={{display:'flex', gap:4, marginBottom:16}}>
                  {['Humidité', 'Température', 'EC & pH', 'NPK'].map(t => (
                    <button key={t} onClick={() => setTab(zoneId, t)} style={{
                      padding: '5px 12px', borderRadius: 8, border: 'none',
                      background: tab === t ? '#16a34a' : '#f1f5f9',
                      color: tab === t ? 'white' : '#64748b',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}>{t}</button>
                  ))}
                </div>

                {chartData.length === 0 ? (
                  <div style={{textAlign:'center', padding:'32px', color:'#94a3b8', fontSize:13}}>
                    Pas encore de données historiques
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData} margin={{top:5, right:10, left:-10, bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="time" tick={{fontSize:10, fill:'#94a3b8'}} />
                      <YAxis tick={{fontSize:10, fill:'#94a3b8'}} />
                      <Tooltip
                        contentStyle={{background:'white', border:'1px solid #e2e8f0', borderRadius:8, fontSize:12}}
                      />
                      <Legend wrapperStyle={{fontSize:11}} />
                      {tab === 'Humidité' && <Line type="monotone" dataKey="Humidité" stroke="#3b82f6" strokeWidth={2} dot={false}/>}
                      {tab === 'Température' && <Line type="monotone" dataKey="Température" stroke="#f97316" strokeWidth={2} dot={false}/>}
                      {tab === 'EC & pH' && <>
                        <Line type="monotone" dataKey="EC" stroke="#eab308" strokeWidth={2} dot={false}/>
                        <Line type="monotone" dataKey="pH" stroke="#a855f7" strokeWidth={2} dot={false}/>
                      </>}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}