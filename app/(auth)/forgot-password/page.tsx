'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { useToast } from '@/hooks/use-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [focused, setFocused] = useState(false)
  const { toast } = useToast()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // actionCodeSettings tells Firebase where to redirect after the user clicks the link
      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: false,
      }
      await sendPasswordResetEmail(auth, email, actionCodeSettings)
      setSent(true)
    } catch (err) {
      toast({
        title: 'Erreur',
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
        @keyframes checkPop {
          0%   { transform: scale(0) rotate(-10deg); opacity: 0 }
          60%  { transform: scale(1.15) rotate(3deg); opacity: 1 }
          100% { transform: scale(1) rotate(0deg); opacity: 1 }
        }
        .forgot-panel  { animation: fadeUp .5s ease both }
        .reset-btn     { transition: transform .15s ease, box-shadow .15s ease }
        .reset-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 28px rgba(45,106,45,.35)!important }
        .reset-btn:active:not(:disabled){ transform:translateY(0) }
        .field-input   { transition: border-color .2s, background .2s, box-shadow .2s }
        .field-input:focus { outline:none }
        .check-icon    { animation: checkPop .45s cubic-bezier(.34,1.56,.64,1) both }
      `}</style>

      <div style={{
        display: 'flex', minHeight: '100vh',
        fontFamily: 'DM Sans, sans-serif',
        background: '#ffffff', color: '#0f172a',
      }}>

        {/* ── LEFT HERO PANEL ── */}
        <div style={{
          flex: '0 0 44%', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(160deg, #1a3d1a 0%, #0f2d0f 50%, #1a3d1a 100%)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '48px',
          borderRight: '1px solid #0f2d0f',
        }}>
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
              <img src="/logo-robocare.png" alt="RoboCare" style={{
                width: 60, height: 60, objectFit: 'contain',
                borderRadius: 14, background: 'rgba(255,255,255,0.95)', padding: 4,
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)', display: 'block',
              }} />
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: '#ffffff', letterSpacing: '-0.4px' }}>
                  Robo<span style={{ color: '#4ade80' }}>Care</span>
                </div>
                <div style={{ fontSize: 10, color: '#86efac', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
                  Agriculture 4.0
                </div>
              </div>
            </div>
          </div>

          {/* Hero text */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 100, padding: '5px 14px',
              fontSize: 11, color: '#86efac', letterSpacing: '1.5px',
              textTransform: 'uppercase', marginBottom: 20, fontWeight: 600,
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
              { v: '45%', l: 'Eau économisée' },
              { v: '2.5k+', l: 'Capteurs actifs' },
              { v: '500+', l: 'Parcelles gérées' },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 14, padding: '14px 12px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
              }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: '#4ade80', letterSpacing: '-0.5px' }}>{s.v}</div>
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
          <div className="forgot-panel" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 400 }}>

            {!sent ? (
              <>
                <div style={{ marginBottom: 34 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                    border: '1px solid #bbf7d0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20,
                    boxShadow: '0 4px 14px rgba(45,106,45,0.12)',
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d6a2d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>

                  <h2 style={{
                    fontFamily: 'Syne, sans-serif', fontSize: 27, fontWeight: 700,
                    color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 7,
                  }}>Mot de passe oublié ?</h2>
                  <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                    Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                  </p>
                </div>

                <form onSubmit={handleReset}>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{
                      display: 'block', fontSize: 11, fontWeight: 600,
                      color: '#475569', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 7,
                    }}>Email</label>
                    <input
                      className="field-input"
                      type="email" required placeholder="vous@example.com"
                      value={email} onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                      disabled={loading}
                      style={{
                        width: '100%', padding: '13px 14px', boxSizing: 'border-box',
                        background: focused ? '#f0fdf4' : '#f8fafc',
                        border: focused ? '1px solid #2d6a2d' : '1px solid #e2e8f0',
                        borderRadius: 11, color: '#0f172a', fontSize: 14,
                        boxShadow: focused ? '0 0 0 3px rgba(45,106,45,0.1)' : 'none',
                      }}
                    />
                  </div>

                  <button
                    className="reset-btn" type="submit" disabled={loading}
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
                        Envoi en cours...
                      </>
                    ) : 'Envoyer le lien →'}
                  </button>
                </form>

                <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                  <Link href="/login" style={{
                    fontSize: 14, color: '#2d6a2d', textDecoration: 'none', fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6a2d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 5l-7 7 7 7"/>
                    </svg>
                    Retour à la connexion
                  </Link>
                  <p style={{ fontSize: 14, color: '#64748b' }}>
                    Pas encore de compte ?{' '}
                    <Link href="/signup" style={{ color: '#2d6a2d', textDecoration: 'underline', fontWeight: 500 }}>
                      S'inscrire
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              /* ── SUCCESS STATE ── */
              <div style={{ textAlign: 'center' }}>
                <div className="check-icon" style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  border: '2px solid #bbf7d0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 28px',
                  boxShadow: '0 8px 24px rgba(45,106,45,0.15)',
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2d6a2d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>

                <h2 style={{
                  fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 700,
                  color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 12,
                }}>Email envoyé !</h2>

                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
                  Un lien de réinitialisation a été envoyé à
                </p>
                <p style={{
                  color: '#2d6a2d', fontSize: 14, fontWeight: 600,
                  background: '#f0fdf4', border: '1px solid #bbf7d0',
                  borderRadius: 8, padding: '8px 16px', display: 'inline-block',
                  marginBottom: 28,
                }}>{email}</p>

                <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 32 }}>
                  Vérifiez votre boîte de réception et suivez les instructions.
                  Le lien expire dans <strong style={{ color: '#64748b' }}>15 minutes</strong>.
                </p>

                <button
                  onClick={() => { setSent(false); setEmail('') }}
                  style={{
                    width: '100%', padding: '13px',
                    background: '#f8fafc', border: '1px solid #e2e8f0',
                    borderRadius: 11, color: '#475569', fontSize: 14, fontWeight: 500,
                    fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', marginBottom: 16,
                    transition: 'background .15s', boxSizing: 'border-box',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f0fdf4')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#f8fafc')}
                >
                  Renvoyer un lien
                </button>

                <Link href="/login" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  width: '100%', padding: '13px',
                  background: 'linear-gradient(135deg, #2d6a2d, #3d8b3d)',
                  borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600,
                  fontFamily: 'Syne, sans-serif', textDecoration: 'none',
                  boxShadow: '0 4px 18px rgba(45,106,45,0.25)',
                  boxSizing: 'border-box',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7"/>
                  </svg>
                  Retour à la connexion
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}