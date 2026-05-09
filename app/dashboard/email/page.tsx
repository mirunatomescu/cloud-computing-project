'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function EmailPage() {
  const [form, setForm] = useState({ subject: '', messageBody: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.subject.trim() || !form.messageBody.trim()) {
      toast.error('Completează toate câmpurile')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Eroare la trimitere')
      } else {
        toast.success('Email trimis cu succes! 📧')
        setSent(true)
        setForm({ subject: '', messageBody: '' })
        setTimeout(() => setSent(false), 5000)
      }
    } catch {
      toast.error('Eroare de rețea')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={styles.label}>EMAIL SERVICE</div>
        <h1 style={styles.title}>Trimite Email</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
          Serviciu cloud de email via Gmail SMTP. Vei primi o confirmare pe adresa ta.
        </p>
      </div>

      {/* Service info */}
      <div style={styles.infoCard}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '8px' }}>
          SERVICIU CLOUD #1
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>PROVIDER</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Gmail SMTP / Nodemailer</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>STATUS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse-glow 2s ease infinite' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#22c55e' }}>Activ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={styles.card}>
        {sent && (
          <div style={styles.successBanner}>
            ✅ Email trimis! Verifică inbox-ul pentru confirmare.
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>Subiect</label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Subiectul emailului..."
              style={styles.input}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.fieldLabel}>Mesaj</label>
            <textarea
              required
              value={form.messageBody}
              onChange={(e) => setForm({ ...form, messageBody: e.target.value })}
              placeholder="Scrie mesajul tău..."
              rows={6}
              style={{ ...styles.input, resize: 'vertical', minHeight: '140px' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.btn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Se trimite...' : '📧 Trimite Email'}
          </button>
        </form>
      </div>

      {/* Cloud services overview */}
      <div style={{ marginTop: '32px' }}>
        <div style={styles.label}>SERVICII CLOUD INTEGRATE</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
          {[
            { num: '01', name: 'Email SMTP', tech: 'Nodemailer + Gmail', color: '#e94560' },
            { num: '02', name: 'AI Language Model', tech: 'OpenAI GPT-3.5 Turbo', color: '#10b981' },
          ].map((s) => (
            <div key={s.num} style={{
              padding: '16px 20px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              borderLeft: `3px solid ${s.color}`,
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                SERVICIU #{s.num}
              </div>
              <div style={{ fontWeight: 700, marginBottom: '2px' }}>{s.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{s.tech}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { animation: 'fadeIn 0.4s ease', maxWidth: '600px' },
  label: { fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.7rem', letterSpacing: '0.15em', marginBottom: '4px' },
  title: { fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em' },
  infoCard: {
    padding: '20px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    marginBottom: '24px',
    borderLeft: '3px solid var(--accent)',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '32px',
  },
  successBanner: {
    padding: '12px 16px',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '8px',
    color: '#22c55e',
    fontSize: '0.9rem',
    marginBottom: '20px',
    fontWeight: 600,
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  fieldLabel: { fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em' },
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
    fontFamily: 'var(--font-display)',
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
    transition: 'opacity 0.2s',
  },
}
