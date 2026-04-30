'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { useToast } from '@/hooks/use-toast'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      toast({ title: 'Inscription échouée', description: 'Les mots de passe ne correspondent pas.', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      const idToken = await cred.user.getIdToken()
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || "Erreur lors de l'inscription.")
      }
      router.refresh()
      router.push('/')
    } catch (err) {
      toast({
        title: 'Inscription échouée',
        description: err instanceof Error ? err.message : 'Une erreur est survenue.',
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
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .signup-panel { animation: fadeUp .5s ease both }
        .signup-btn   { transition: transform .15s ease, box-shadow .15s ease }
        .signup-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 28px rgba(45,106,45,.35)!important }
        .signup-btn:active:not(:disabled){ transform:translateY(0) }
        .field-input { transition: border-color .2s, background .2s, box-shadow .2s }
        .field-input:focus { outline:none }
      `}</style>

      <div style={{
        display: 'flex', minHeight: '100vh',
        fontFamily: 'DM Sans, sans-serif',
        background: '#ffffff', color: '#0f172a',
      }}>

        {/* ── LEFT HERO PANEL (dark green) ── */}
        <div style={{
          flex: '0 0 44%', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(160deg, #1a3d1a 0%, #0f2d0f 50%, #1a3d1a 100%)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '48px',
          borderRight: '1px solid #0f2d0f',
        }}>
          {/* Decorative glow */}
          <div style={{
            position: 'absolute', width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)',
            top: '-15%', left: '-20%', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)',
            bottom: '10%', right: '-10%', pointerEvents: 'none',
          }} />

          {/* Logo */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-robocare.png"
                alt="RoboCare"
                style={{
                  width: 60, height: 60, objectFit: 'contain',
                  borderRadius: 14, background: 'rgba(255,255,255,0.95)', padding: 4,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)', display: 'block',
                }}
              />
              <div>
                <div style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24,
                  color: '#ffffff', letterSpacing: '-0.4px',
                }}>
                  Robo<span style={{ color: '#4ade80' }}>Care</span>
                </div>
                <div style={{
                  fontSize: 10, color: '#86efac',
                  letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600,
                }}>Agriculture 4.0</div>
              </div>
            </div>
          </div>

          {/* Hero text — identical to login page */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 100, padding: '5px 14px',
              fontSize: 11, color: '#86efac',
              letterSpacing: '1.5px', textTransform: 'uppercase',
              marginBottom: 20, fontWeight: 600,
            }}>● Système Actif</div>

            <h1 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 800,
              color: '#ffffff', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 18,
            }}>
              Agriculture<br />
              <span style={{ color: '#4ade80' }}>Intelligente</span><br />
              pour l'Avenir
            </h1>

            <p style={{ color: '#bbf7d0', fontSize: 14.5, lineHeight: 1.75, maxWidth: 330 }}>
              Optimisez vos ressources, augmentez vos rendements et préservez
              l'environnement grâce à notre technologie IoT avancée.
            </p>
          </div>

          {/* Stats */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: 10 }}>
            {[
              { v: '45%',   l: 'Eau économisée' },
              { v: '2.5k+', l: 'Capteurs actifs' },
              { v: '500+',  l: 'Parcelles gérées' },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 14, padding: '14px 12px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
              }}>
                <div style={{
                  fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800,
                  color: '#4ade80', letterSpacing: '-0.5px',
                }}>{s.v}</div>
                <div style={{ fontSize: 11, color: '#86efac', marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT FORM PANEL ── */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#ffffff', position: 'relative', overflow: 'hidden', padding: '40px',
        }}>
          <div className="signup-panel" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 400 }}>
            <div style={{ marginBottom: 34 }}>
              <h2 style={{
                fontFamily: 'Syne, sans-serif', fontSize: 27, fontWeight: 700,
                color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 7,
              }}>Créer un compte</h2>
              <p style={{ color: '#64748b', fontSize: 14 }}>
                Rejoignez RoboCare et gérez vos cultures
              </p>
            </div>

            <form onSubmit={handleSignup}>
              {/* Email */}
              <div style={{ marginBottom: 14 }}>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 600,
                  color: '#475569', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 7,
                }}>Email</label>
                <input
                  className="field-input" type="email" required placeholder="vous@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
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

              {/* Password */}
              <div style={{ marginBottom: 14 }}>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 600,
                  color: '#475569', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 7,
                }}>Mot de passe</label>
                <input
                  className="field-input" type="password" required placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
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

              {/* Confirm */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 600,
                  color: '#475569', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 7,
                }}>Confirmer le mot de passe</label>
                <input
                  className="field-input" type="password" required placeholder="••••••••"
                  value={confirm} onChange={e => setConfirm(e.target.value)}
                  onFocus={() => setFocused('confirm')} onBlur={() => setFocused(null)}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '13px 14px', boxSizing: 'border-box',
                    background: focused === 'confirm' ? '#f0fdf4' : '#f8fafc',
                    border: confirm && password !== confirm
                      ? '1px solid #ef4444'
                      : focused === 'confirm' ? '1px solid #2d6a2d' : '1px solid #e2e8f0',
                    borderRadius: 11, color: '#0f172a', fontSize: 14,
                    boxShadow: focused === 'confirm' ? '0 0 0 3px rgba(45,106,45,0.1)' : 'none',
                  }}
                />
                {confirm && password !== confirm && (
                  <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>
                    Les mots de passe ne correspondent pas
                  </p>
                )}
              </div>

              <button
                className="signup-btn" type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '14px',
                  background: loading ? 'rgba(45,106,45,0.6)' : 'linear-gradient(135deg, #2d6a2d, #3d8b3d)',
                  border: 'none', borderRadius: 11,
                  color: '#fff', fontSize: 15, fontWeight: 600,
                  fontFamily: 'Syne, sans-serif',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 18px rgba(45,106,45,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 15, height: 15, border: '2px solid rgba(255,255,255,.3)',
                      borderTopColor: '#fff', borderRadius: '50%',
                      animation: 'spin .8s linear infinite', display: 'inline-block',
                    }} />
                    Inscription...
                  </>
                ) : "S'inscrire →"}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 14, color: '#64748b' }}>
              Déjà un compte ?{' '}
              <Link href="/login" style={{ color: '#2d6a2d', textDecoration: 'underline', fontWeight: 500 }}>
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}