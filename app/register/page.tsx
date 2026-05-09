'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.password !== form.confirm) {
      toast.error('Parolele nu coincid')
      return
    }

    if (form.password.length < 6) {
      toast.error('Parola trebuie să aibă minim 6 caractere')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Eroare la înregistrare')
      } else {
        toast.success('Cont creat! Verifică emailul 📧')
        setTimeout(() => router.push('/login'), 1500)
      }
    } catch {
      toast.error('Eroare de rețea')
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
          <h1 style={styles.title}>Cont nou</h1>
          <p style={styles.subtitle}>Completează datele pentru înregistrare</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { key: 'name', label: 'Nume complet', type: 'text', placeholder: 'Ion Popescu' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'email@exemplu.com' },
            { key: 'password', label: 'Parolă', type: 'password', placeholder: '••••••••' },
            { key: 'confirm', label: 'Confirmă parola', type: 'password', placeholder: '••••••••' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input
                type={type}
                required
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                style={styles.input}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            ...styles.btn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Se creează contul...' : 'Creează cont'}
          </button>
        </form>

        <p style={styles.footer}>
          Ai deja cont?{' '}
          <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            Autentifică-te
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
  },
  header: { marginBottom: '32px' },
  title: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' },
  subtitle: { color: 'var(--text-secondary)', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
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
    transition: 'opacity 0.2s',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
}
