export interface Timestamp {
  _seconds: number
  _nanoseconds: number
}

export interface Alert {
  zone_num: string
  type: string
  level: string
  // Compat: l'UI existante affichait surtout l'humidité
  humidity?: number
  // Nouvelles alertes "hors seuil" multi-paramètres
  param?: 'temperature' | 'humidity' | 'ph' | 'ec' | 'n' | 'p' | 'k'
  value?: number
  min?: number
  max?: number
  timestamp: Timestamp
}

export type SensorParam = 'temperature' | 'humidity' | 'ph' | 'ec' | 'n' | 'p' | 'k'

export interface ThresholdRange {
  min: number
  max: number
}

export interface Plant {
  id?: string
  name: string
  description?: string
  thresholds: Record<SensorParam, ThresholdRange>
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Command {
  mode: string
  isOn: boolean
  frequency: number
  lastUpdate: Timestamp
}

export interface Config {
  defaultDuration: number
  maxHumidity: number
  minHumidity: number
  updatedAt: Timestamp
}

export interface Prediction {
  trend_ec: number
  trend_p: number
  trend_humidity: number
  score: number
  r2_humidity: number
  pred_k: number
  zone_num: string
  pred_ec: number
  trend_k: number
  pred_humidity: number
  trend_temp: number
  raison: string
  humidity: number
  ci_humidity_high: number
  trend_n: number
  temperature: number
  n_anomalies: number
  ec: number
  ci_humidity_low: number
  type: string
  pred_p: number
  pred_n: number
  pred_temp: number
  timestamp: Timestamp
}

export interface Sensor {
  temperature: number
  ph: number
  p: number
  k: number
  sensor_id: string
  ec: number
  n: number
  humidity: number
  timestamp: Timestamp
  deactivated_at?: Timestamp
  active: boolean
}

export interface Measure {
  temperature: number
  ph: number
  p: number
  k: number
  source: string
  ec: number
  n: number
  humidity: number
  timestamp: Timestamp
}

export interface Zone {
  p: number
  last_updated: Timestamp
  sante: number
  ph: number
  temperature: number
  humidity: number
  sensor_count: number
  k: number
  ec: number
  n: number
  enabled: boolean
  plant_type?: string
  thresholds?: Record<SensorParam, ThresholdRange>
  history?: Prediction
  measures?: Measure
  sensors?: Record<string, Sensor>
}

export interface User {
  uid: string
  emailVerified: boolean
  role: string
  fullName: string
  cin: string
  email: string
  createdAt: Timestamp
  alerts?: Record<string, Alert>
  commands?: Record<string, Command>
  config?: Config
  predictions?: Record<string, Prediction>
  zones?: Record<string, Zone>
}