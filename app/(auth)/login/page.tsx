'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [focused, setFocused]   = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const cred    = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await cred.user.getIdToken()
      const res     = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || 'Erreur de création de session')
      router.refresh()
      router.push('/')
    } catch (err) {
      toast({
        title: 'Connexion échouée',
        description: err instanceof Error ? err.message : 'Identifiants invalides.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px) }
          to   { opacity:1; transform:translateY(0) }
        }
        @keyframes shimmer {
          0%   { background-position:-200% center }
          100% { background-position:200% center }
        }
        @keyframes spin {
          from { transform:rotate(0deg) }
          to   { transform:rotate(360deg) }
        }
        @keyframes scanLine {
          0%   { transform:translateY(-100%) }
          100% { transform:translateY(900%) }
        }
        .login-panel { animation: fadeUp .55s ease both }
        .login-btn { transition: transform .15s ease, box-shadow .15s ease }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(45,106,45,.35) !important;
        }
        .login-btn:active:not(:disabled) { transform: translateY(0) }
        .field-input { transition: border-color .2s, background .2s, box-shadow .2s }
        .field-input:focus { outline: none }
      `}</style>

      <div style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: 'DM Sans, sans-serif',
      }}>

        {/* ══════════════════════════════
            PANNEAU GAUCHE — VERT FONCÉ
        ══════════════════════════════ */}
        <div style={{
          flex: '0 0 44%',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(150deg, #0f2d1a 0%, #1a4d2e 35%, #2d6a2d 65%, #1a3d1a 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
        }}>

          {/* Ligne scan animée */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(134,239,172,0.4), transparent)',
            animation: 'scanLine 8s linear infinite',
            zIndex: 1,
          }} />

          {/* Orbes décoratifs */}
          <div style={{
            position: 'absolute', width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(134,239,172,0.08) 0%, transparent 70%)',
            top: '-15%', left: '-20%', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', width: 350, height: 350, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(134,239,172,0.06) 0%, transparent 70%)',
            bottom: '5%', right: '-10%', pointerEvents: 'none',
          }} />

          {/* ── LOGO ── */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-robocare.png"
                alt="RoboCare"
                style={{
                  width: 60,
                  height: 60,
                  objectFit: 'contain',
                  borderRadius: 14,
                  background: 'white',
                  padding: 6,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  display: 'block',
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 800,
                  fontSize: 26,
                  color: 'white',
                  letterSpacing: '-0.4px',
                  lineHeight: 1.1,
                }}>
                  Robo<span style={{ color: '#86efac' }}>Care</span>
                </div>
                <div style={{
                  fontSize: 10,
                  color: '#86efac',
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginTop: 2,
                }}>Agriculture 4.0</div>
              </div>
            </div>
          </div>

          {/* ── HERO TEXT ── */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(134,239,172,0.12)',
              border: '1px solid rgba(134,239,172,0.3)',
              borderRadius: 100,
              padding: '5px 16px',
              fontSize: 11,
              color: '#86efac',
              letterSpacing: '1.8px',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: 22,
            }}>● Système actif</div>

            <h1 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(28px, 3vw, 46px)',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.08,
              letterSpacing: '-1px',
              marginBottom: 18,
            }}>
              Agriculture<br />
              <span style={{
                background: 'linear-gradient(90deg, #86efac, #4ade80, #86efac)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 3s linear infinite',
              }}>Intelligente</span><br />
              pour l'Avenir
            </h1>

            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 14.5,
              lineHeight: 1.75,
              maxWidth: 330,
            }}>
              Optimisez vos ressources, augmentez vos rendements et préservez
              l'environnement grâce à notre technologie IoT avancée.
            </p>
          </div>

          {/* ── STATS ── */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: 10 }}>
            {[
              { v: '45%',   l: 'Eau économisée' },
              { v: '2.5k+', l: 'Capteurs actifs' },
              { v: '500+',  l: 'Parcelles gérées' },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(134,239,172,0.2)',
                borderRadius: 14,
                padding: '14px 12px',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#86efac',
                  letterSpacing: '-0.5px',
                }}>{s.v}</div>
                <div style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.45)',
                  marginTop: 3,
                  lineHeight: 1.3,
                }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════
            PANNEAU DROIT — BLANC
        ══════════════════════════════ */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          padding: '40px',
        }}>
          <div style={{
            position: 'absolute', width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(45,106,45,0.04) 0%, transparent 70%)',
            top: '-80px', right: '-80px', pointerEvents: 'none',
          }} />

          <div className="login-panel" style={{
            position: 'relative', zIndex: 2, width: '100%', maxWidth: 400,
          }}>

            {/* Titre */}
            <div style={{ marginBottom: 34 }}>
              <h2 style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 27,
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.5px',
                marginBottom: 7,
              }}>Connexion</h2>
              <p style={{ color: '#64748b', fontSize: 14 }}>
                Accédez à votre tableau de bord d'administration
              </p>
            </div>

            <form onSubmit={handleLogin}>

              {/* Email */}
              <div style={{ marginBottom: 14 }}>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 600,
                  color: '#475569', letterSpacing: '0.6px',
                  textTransform: 'uppercase', marginBottom: 7,
                }}>Email</label>
                <input
                  className="field-input"
                  type="email" required
                  placeholder="admin@robocare.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '13px 14px', boxSizing: 'border-box',
                    background: focused === 'email' ? '#f0fdf4' : '#f8fafc',
                    border: focused === 'email' ? '1px solid #2d6a2d' : '1px solid #e2e8f0',
                    borderRadius: 11, color: '#0f172a', fontSize: 14,
                    boxShadow: focused === 'email' ? '0 0 0 3px rgba(45,106,45,0.1)' : 'none',
                  }}
                />
              </div>

              {/* Mot de passe */}
              <div style={{ marginBottom: 10 }}>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 600,
                  color: '#475569', letterSpacing: '0.6px',
                  textTransform: 'uppercase', marginBottom: 7,
                }}>Mot de passe</label>
                <input
                  className="field-input"
                  type="password" required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '13px 14px', boxSizing: 'border-box',
                    background: focused === 'password' ? '#f0fdf4' : '#f8fafc',
                    border: focused === 'password' ? '1px solid #2d6a2d' : '1px solid #e2e8f0',
                    borderRadius: 11, color: '#0f172a', fontSize: 14,
                    boxShadow: focused === 'password' ? '0 0 0 3px rgba(45,106,45,0.1)' : 'none',
                  }}
                />
              </div>

              <div style={{ textAlign: 'right', marginBottom: 24 }}>
                <Link
                  href="/forgot-password"
                  style={{ fontSize: 13, color: '#2d6a2d', cursor: 'pointer', fontWeight: 500, textDecoration: 'none' }}
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Bouton */}
              <button
                className="login-btn"
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px',
                  background: loading
                    ? 'rgba(45,106,45,0.6)'
                    : 'linear-gradient(135deg, #1a4d2e, #2d6a2d)',
                  border: 'none', borderRadius: 11,
                  color: '#fff', fontSize: 15, fontWeight: 600,
                  fontFamily: 'Syne, sans-serif',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 18px rgba(45,106,45,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 15, height: 15,
                      border: '2px solid rgba(255,255,255,.3)',
                      borderTopColor: '#fff', borderRadius: '50%',
                      animation: 'spin .8s linear infinite',
                      display: 'inline-block',
                    }} />
                    Connexion...
                  </>
                ) : 'Connexion →'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 14, color: '#64748b' }}>
              Pas encore de compte ?{' '}
              <Link href="/signup" style={{ color: '#2d6a2d', textDecoration: 'underline', fontWeight: 500 }}>
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}