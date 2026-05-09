'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Autentificat cu succes!')
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      toast.error('Eroare la autentificare')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.bg} />
      <div style={styles.card}>
        <Link href="/" style={styles.back}>← Înapoi</Link>
        <div style={styles.header}>
          <h1 style={styles.title}>Bun venit</h1>
          <p style={styles.subtitle}>Autentifică-te în contul tău</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@exemplu.com"
              style={styles.input}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Parolă</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              style={styles.input}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            ...styles.btn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Se autentifică...' : 'Autentificare'}
          </button>
        </form>

        <p style={styles.footer}>
          Nu ai cont?{' '}
          <Link href="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            Creează unul
          </Link>
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-primary)',
    padding: '24px',
    position: 'relative',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(233,69,96,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(233,69,96,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '48px 48px',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: '420px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '40px',
    animation: 'fadeIn 0.4s ease',
  },
  back: {
    display: 'inline-block',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '0.85rem',
    marginBottom: '24px',
    fontFamily: 'var(--font-mono)',
    transition: 'color 0.2s',
  },
  header: { marginBottom: '32px' },
  title: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' },
  subtitle: { color: 'var(--text-secondary)', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em' },
  input: {
    padding: '12px 16px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
  },
  btn: {
    padding: '14px',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '1rem',
    fontFamily: 'var(--font-display)',
    marginTop: '8px',
    transition: 'opacity 0.2s, transform 0.2s',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
}
