'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { useToast } from '@/hooks/use-toast'

function Droplet({ style }: { style: React.CSSProperties }) {
  return (
    <span style={{
      position: 'absolute', width: 6, height: 9,
      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
      background: 'oklch(0.72 0.19 152 / 0.3)',
      filter: 'blur(0.5px)',
      animation: 'floatDrop var(--dur, 4s) ease-in-out var(--delay, 0s) infinite',
      ...style,
    }} />
  )
}

const DROPLETS = Array.from({ length: 14 }, (_, i) => ({
  '--dur': `${3 + (i * 0.37) % 3}s`,
  '--delay': `${(i * 0.28) % 2.5}s`,
  left: `${(i * 7.3) % 100}%`,
  top: `${(i * 6.9) % 100}%`,
} as React.CSSProperties))

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()

  console.log('LOGIN SUBMIT', { email })

  setLoading(true)

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password)

    console.log('FIREBASE LOGIN OK', cred.user.uid)

    const idToken = await cred.user.getIdToken()

    const res = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })

    const data = await res.json().catch(() => null)

    console.log('SESSION RESPONSE', res.status, data)

    if (!res.ok) {
      throw new Error(data?.error || 'Erreur de création de session')
    }

    router.refresh()
    router.push('/')
  } catch (err) {
    console.error('LOGIN ERROR', err)

    toast({
      title: 'Connexion échouée',
      description:
        err instanceof Error
          ? err.message
          : 'Identifiants invalides.',
      variant: 'destructive',
    })
  } finally {
    setLoading(false)
  }
}
  return (
    <>
      <style>{`
        @keyframes floatDrop {
          0%,100%{transform:translateY(0) scale(1);opacity:.3}
          50%{transform:translateY(-16px) scale(1.12);opacity:.65}
        }
        @keyframes fadeUp {
          from{opacity:0;transform:translateY(20px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes shimmer {
          0%{background-position:-200% center}
          100%{background-position:200% center}
        }
        @keyframes pulseRing {
          0%,100%{box-shadow:0 0 0 0 oklch(0.72 0.19 152 / .45)}
          60%{box-shadow:0 0 0 10px oklch(0.72 0.19 152 / 0)}
        }
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes scanLine{0%{transform:translateY(-100%)}100%{transform:translateY(700%)}}
        .login-panel{animation:fadeUp .55s ease both}
        .login-btn{transition:transform .15s ease,box-shadow .15s ease}
        .login-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 28px oklch(0.72 0.19 152 / .35)!important}
        .login-btn:active:not(:disabled){transform:translateY(0)}
        .field-input{transition:border-color .2s,background .2s,box-shadow .2s}
        .field-input:focus{outline:none}
      `}</style>

      <div style={{
        display: 'flex', minHeight: '100vh',
        fontFamily: 'DM Sans, sans-serif',
        background: 'oklch(0.06 0.014 145)',
        color: 'oklch(0.96 0.008 145)',
      }}>

        {/* LEFT HERO PANEL */}
        <div style={{
          flex: '0 0 44%', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(150deg, oklch(0.09 0.016 145) 0%, oklch(0.11 0.018 148) 50%, oklch(0.07 0.013 142) 100%)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '48px',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg,transparent,oklch(0.72 0.19 152 / .5),transparent)',
            animation: 'scanLine 7s linear infinite', zIndex: 1 }} />
          <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%',
            background: 'radial-gradient(circle,oklch(0.72 0.19 152 / .09) 0%,transparent 70%)',
            top: '-10%', left: '-20%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%',
            background: 'radial-gradient(circle,oklch(0.52 0.17 150 / .07) 0%,transparent 70%)',
            bottom: '10%', right: '-10%', pointerEvents: 'none' }} />
          {DROPLETS.map((s, i) => <Droplet key={i} style={s} />)}

          {/* Logo */}
          <div style={{ position: 'relative', zIndex: 2, animation: 'fadeUp .5s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 13,
                background: 'linear-gradient(135deg,oklch(0.72 0.19 152),oklch(0.52 0.17 150))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, animation: 'pulseRing 3s ease infinite',
              }}>💧</div>
              <div>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22,
                  color: 'oklch(0.96 0.008 145)', letterSpacing: '-0.4px' }}>IrriSmart</div>
                <div style={{ fontSize: 10, color: 'oklch(0.72 0.19 152)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                  IoT Agriculture
                </div>
              </div>
            </div>
          </div>

          {/* Hero text */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-block',
              background: 'oklch(0.72 0.19 152 / .1)',
              border: '1px solid oklch(0.72 0.19 152 / .22)',
              borderRadius: 100, padding: '5px 14px',
              fontSize: 11, color: 'oklch(0.72 0.19 152)',
              letterSpacing: '1.5px', textTransform: 'uppercase',
              marginBottom: 18, animation: 'fadeUp .5s .15s ease both',
            }}>● Système actif</div>

            <h1 style={{
              fontFamily: 'Syne,sans-serif',
              fontSize: 'clamp(30px,3.2vw,46px)', fontWeight: 800,
              color: 'oklch(0.96 0.008 145)',
              lineHeight: 1.08, letterSpacing: '-1px',
              marginBottom: 18, animation: 'fadeUp .5s .2s ease both',
            }}>
              Irrigation<br />
              <span style={{
                background: 'linear-gradient(90deg,oklch(0.72 0.19 152),oklch(0.72 0.14 175),oklch(0.72 0.19 152))',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', animation: 'shimmer 3s linear infinite',
              }}>Intelligente</span><br />
              pour l'Avenir
            </h1>

            <p style={{ color: 'oklch(0.60 0.025 145)', fontSize: 14, lineHeight: 1.72,
              maxWidth: 330, animation: 'fadeUp .5s .3s ease both' }}>
              Optimisez vos ressources en eau, augmentez vos rendements et préservez
              l'environnement grâce à notre technologie IoT avancée.
            </p>
          </div>

          {/* Stats */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: 8, animation: 'fadeUp .5s .4s ease both' }}>
            {[
              { v: '45%', l: 'Eau économisée' },
              { v: '2.5k+', l: 'Capteurs actifs' },
              { v: '500+', l: 'Parcelles gérées' },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1,
                background: 'oklch(0.72 0.19 152 / .055)',
                border: '1px solid oklch(0.72 0.19 152 / .14)',
                borderRadius: 14, padding: '14px 10px',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 800,
                  color: 'oklch(0.72 0.19 152)', letterSpacing: '-0.5px' }}>{s.v}</div>
                <div style={{ fontSize: 11, color: 'oklch(0.40 0.018 145)', marginTop: 3, lineHeight: 1.3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'oklch(0.07 0.013 145)',
          position: 'relative', overflow: 'hidden', padding: '40px',
        }}>
          <div style={{
            position: 'absolute', width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle,oklch(0.72 0.19 152 / .05) 0%,transparent 70%)',
            top: '-80px', right: '-80px', pointerEvents: 'none',
          }} />

          <div className="login-panel" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 400 }}>
            <div style={{ marginBottom: 34 }}>
              <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 27, fontWeight: 700,
                color: 'oklch(0.96 0.008 145)', letterSpacing: '-0.5px', marginBottom: 7 }}>
                Connexion
              </h2>
              <p style={{ color: 'oklch(0.40 0.018 145)', fontSize: 14 }}>
                Accédez à votre tableau de bord d'administration
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500,
                  color: 'oklch(0.40 0.018 145)', letterSpacing: '0.6px',
                  textTransform: 'uppercase', marginBottom: 7 }}>Email</label>
                <input
                  className="field-input"
                  type="email" required
                  placeholder="admin@irrismart.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '13px 14px',
                    background: focused === 'email' ? 'oklch(0.72 0.19 152 / .06)' : 'oklch(0.10 0.015 145)',
                    border: focused === 'email' ? '1px solid oklch(0.72 0.19 152 / .5)' : '1px solid oklch(0.18 0.013 145)',
                    borderRadius: 11, color: 'oklch(0.96 0.008 145)', fontSize: 14,
                    boxShadow: focused === 'email' ? '0 0 0 3px oklch(0.72 0.19 152 / .1)' : 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500,
                  color: 'oklch(0.40 0.018 145)', letterSpacing: '0.6px',
                  textTransform: 'uppercase', marginBottom: 7 }}>Mot de passe</label>
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
                    width: '100%', padding: '13px 14px',
                    background: focused === 'password' ? 'oklch(0.72 0.19 152 / .06)' : 'oklch(0.10 0.015 145)',
                    border: focused === 'password' ? '1px solid oklch(0.72 0.19 152 / .5)' : '1px solid oklch(0.18 0.013 145)',
                    borderRadius: 11, color: 'oklch(0.96 0.008 145)', fontSize: 14,
                    boxShadow: focused === 'password' ? '0 0 0 3px oklch(0.72 0.19 152 / .1)' : 'none',
                  }}
                />
              </div>

              <div style={{ textAlign: 'right', marginBottom: 24 }}>
                <span style={{ fontSize: 13, color: 'oklch(0.72 0.19 152)', cursor: 'pointer' }}>
                  Mot de passe oublié ?
                </span>
              </div>

              <button
                className="login-btn"
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px',
                  background: loading
                    ? 'oklch(0.52 0.17 150 / .7)'
                    : 'linear-gradient(135deg,oklch(0.65 0.19 152),oklch(0.50 0.17 150))',
                  border: 'none', borderRadius: 11,
                  color: '#fff', fontSize: 15, fontWeight: 600,
                  fontFamily: 'Syne,sans-serif',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.3px',
                  boxShadow: '0 4px 18px oklch(0.72 0.19 152 / .22)',
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
                    Connexion...
                  </>
                ) : 'Connexion →'}
              </button>
            </form>

            {/* ✅ Lien ici, UNE SEULE FOIS, à l'intérieur du panel */}
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 14, color: 'oklch(0.40 0.018 145)' }}>
              Pas encore de compte ?{' '}
              <Link href="/signup" style={{ color: 'oklch(0.72 0.19 152)', textDecoration: 'underline' }}>
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}