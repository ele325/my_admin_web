'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { useToast } from '@/hooks/use-toast'

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [done, setDone] = useState(false)
  const [invalidCode, setInvalidCode] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const oobCode = searchParams.get('oobCode')
  const { toast } = useToast()

  // Verify the oobCode on mount
  useEffect(() => {
    if (!oobCode) {
      setInvalidCode(true)
      setVerifying(false)
      return
    }
    verifyPasswordResetCode(auth, oobCode)
      .then(() => setVerifying(false))
      .catch(() => {
        setInvalidCode(true)
        setVerifying(false)
      })
  }, [oobCode])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      toast({ title: 'Erreur', description: 'Les mots de passe ne correspondent pas.', variant: 'destructive' })
      return
    }
    if (password.length < 6) {
      toast({ title: 'Erreur', description: 'Le mot de passe doit contenir au moins 6 caractères.', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      await confirmPasswordReset(auth, oobCode!, password)
      setDone(true)
      setTimeout(() => router.push('/login'), 3000)
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

  // ── LOADING STATE ──
  if (verifying) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 52, height: 52, border: '3px solid #e2e8f0',
          borderTopColor: '#2d6a2d', borderRadius: '50%',
          animation: 'spin .8s linear infinite',
          margin: '0 auto 20px',
        }} />
        <p style={{ color: '#64748b', fontSize: 14 }}>Vérification du lien...</p>
      </div>
    )
  }

  // ── INVALID CODE STATE ──
  if (invalidCode) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
          border: '2px solid #fecdd3',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
          boxShadow: '0 8px 24px rgba(239,68,68,0.12)',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>

        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700,
          color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 12,
        }}>Lien invalide ou expiré</h2>

        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
          Ce lien de réinitialisation est invalide ou a expiré (15 minutes).
          Veuillez faire une nouvelle demande.
        </p>

        <Link href="/forgot-password" style={{
          display: 'block', width: '100%', padding: '13px',
          background: 'linear-gradient(135deg, #2d6a2d, #3d8b3d)',
          borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600,
          fontFamily: 'Syne, sans-serif', textDecoration: 'none', textAlign: 'center',
          boxShadow: '0 4px 18px rgba(45,106,45,0.25)',
          boxSizing: 'border-box',
        }}>
          Nouvelle demande →
        </Link>

        <Link href="/login" style={{
          display: 'flex', marginTop: 14, fontSize: 14,
          color: '#2d6a2d', textDecoration: 'none', fontWeight: 500,
          alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6a2d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Retour à la connexion
        </Link>
      </div>
    )
  }

  // ── SUCCESS STATE ──
  if (done) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
          border: '2px solid #bbf7d0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
          boxShadow: '0 8px 24px rgba(45,106,45,0.15)',
          animation: 'checkPop .45s cubic-bezier(.34,1.56,.64,1) both',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2d6a2d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 700,
          color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 12,
        }}>Mot de passe modifié !</h2>

        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
          Votre mot de passe a été réinitialisé avec succès.
        </p>
        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 32 }}>
          Redirection automatique dans <strong style={{ color: '#2d6a2d' }}>3 secondes</strong>...
        </p>

        <Link href="/login" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          width: '100%', padding: '13px',
          background: 'linear-gradient(135deg, #2d6a2d, #3d8b3d)',
          borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600,
          fontFamily: 'Syne, sans-serif', textDecoration: 'none',
          boxShadow: '0 4px 18px rgba(45,106,45,0.25)',
          boxSizing: 'border-box',
        }}>
          Se connecter maintenant →
        </Link>
      </div>
    )
  }

  // ── FORM STATE ──
  return (
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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>

        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 27, fontWeight: 700,
          color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 7,
        }}>Nouveau mot de passe</h2>
        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
          Choisissez un mot de passe sécurisé d'au moins 6 caractères.
        </p>
      </div>

      <form onSubmit={handleReset}>
        {/* Password */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: 'block', fontSize: 11, fontWeight: 600,
            color: '#475569', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 7,
          }}>Nouveau mot de passe</label>
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
          {/* Strength indicator */}
          {password.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 3, borderRadius: 99,
                    background: i <= (password.length < 6 ? 1 : password.length < 8 ? 2 : password.length < 10 ? 3 : 4)
                      ? (password.length < 6 ? '#ef4444' : password.length < 8 ? '#f97316' : password.length < 10 ? '#eab308' : '#22c55e')
                      : '#e2e8f0',
                    transition: 'background .2s',
                  }} />
                ))}
              </div>
              <p style={{ fontSize: 11, color: password.length < 6 ? '#ef4444' : password.length < 8 ? '#f97316' : password.length < 10 ? '#eab308' : '#22c55e' }}>
                {password.length < 6 ? 'Trop court' : password.length < 8 ? 'Faible' : password.length < 10 ? 'Moyen' : 'Fort'}
              </p>
            </div>
          )}
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
          {confirm && password === confirm && confirm.length > 0 && (
            <p style={{ fontSize: 12, color: '#22c55e', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Les mots de passe correspondent
            </p>
          )}
        </div>

        <button
          className="reset-btn" type="submit"
          disabled={loading || password !== confirm || password.length < 6}
          style={{
            width: '100%', padding: '14px',
            background: (loading || password !== confirm || password.length < 6)
              ? 'rgba(45,106,45,0.4)'
              : 'linear-gradient(135deg, #2d6a2d, #3d8b3d)',
            border: 'none', borderRadius: 11,
            color: '#fff', fontSize: 15, fontWeight: 600,
            fontFamily: 'Syne, sans-serif',
            cursor: (loading || password !== confirm || password.length < 6) ? 'not-allowed' : 'pointer',
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
              Réinitialisation...
            </>
          ) : 'Réinitialiser le mot de passe →'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Link href="/login" style={{
          fontSize: 14, color: '#2d6a2d', textDecoration: 'none', fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6a2d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Retour à la connexion
        </Link>
      </div>
    </>
  )
}

export default function ResetPasswordPage() {
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
        .forgot-panel { animation: fadeUp .5s ease both }
        .reset-btn    { transition: transform .15s ease, box-shadow .15s ease }
        .reset-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 28px rgba(45,106,45,.35)!important }
        .reset-btn:active:not(:disabled){ transform:translateY(0) }
        .field-input  { transition: border-color .2s, background .2s, box-shadow .2s }
        .field-input:focus { outline:none }
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
            <Suspense fallback={
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 40, height: 40, border: '3px solid #e2e8f0',
                  borderTopColor: '#2d6a2d', borderRadius: '50%',
                  animation: 'spin .8s linear infinite', margin: '0 auto',
                }} />
              </div>
            }>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}