"use client"

import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      
      {/* Background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(233,69,96,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(233,69,96,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      {/* Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(233,69,96,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        textAlign: 'center',
        maxWidth: '640px',
      }}>
        
        <div style={{
          display: 'inline-block',
          padding: '6px 16px',
          background: 'var(--accent-dim)',
          border: '1px solid var(--border-accent)',
          borderRadius: '999px',
          marginBottom: '24px',
        }}>
          <span style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent)',
            letterSpacing: '0.1em',
          }}>
            CLOUD COMPUTING 2026 - SIMPRE
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          marginBottom: '20px',
          color: 'var(--text-primary)',
        }}>
          AI Assistant<br />
          <span style={{ color: 'var(--accent)' }}>Platform</span>
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          marginBottom: '40px',
        }}>
          Aplicație web cu autentificare securizată, asistent AI bazat pe GPT și notificări email automate.
        </p>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          
          <Link
            href="/register"
            className="btn-primary"
          >
            Creează cont
          </Link>

          <Link
            href="/login"
            className="btn-secondary"
          >
            Autentificare
          </Link>
        </div>

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginTop: '64px',
          textAlign: 'left',
        }}>
          {[
            { icon: '🤖', title: 'AI Chat', desc: 'GPT integrat' },
            { icon: '🔐', title: 'Autentificare', desc: 'JWT + MongoDB' },
            { icon: '📧', title: 'Email', desc: 'Notificări SMTP' },
          ].map((f) => (
            <div key={f.title} style={{
              padding: '20px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                {f.icon}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {f.title}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}