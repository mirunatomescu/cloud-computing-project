'use client'

import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Încarcă istoricul din MongoDB
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/chat')
        const data = await res.json()
        if (data.history && data.history.length > 0) {
          setMessages(data.history.slice(-30))
        }
      } catch {
        console.error('Could not load chat history')
      } finally {
        setLoadingHistory(false)
      }
    }
    fetchHistory()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessage, timestamp: new Date() },
    ]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-10),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Eroare la trimiterea mesajului')
        setMessages(messages) // Revert
      } else {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: data.message, timestamp: new Date() },
        ])
      }
    } catch {
      toast.error('Eroare de rețea')
      setMessages(messages)
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    toast.success('Conversație ștearsă local')
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.label}>AI CHAT</div>
          <h1 style={styles.title}>Asistent GPT-3.5</h1>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} style={styles.clearBtn}>
            Șterge conversația
          </button>
        )}
      </div>

      {/* Chat area */}
      <div style={styles.chatArea}>
        {loadingHistory && (
          <div style={styles.loading}>
            <div style={styles.spinner} />
            <span>Se încarcă istoricul...</span>
          </div>
        )}

        {!loadingHistory && messages.length === 0 && (
          <div style={styles.empty}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
            <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>Asistentul tău AI</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px', lineHeight: 1.6 }}>
              Pune orice întrebare. Conversațiile sunt salvate și persistă la refresh.
            </p>
            <div style={{ marginTop: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Explică-mi ce este cloud computing', 'Cum funcționează JWT?', 'Ce este MongoDB Atlas?'].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  style={styles.suggestion}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              animation: 'slideIn 0.2s ease',
            }}
          >
            <div style={{
              ...styles.bubble,
              background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-card)',
              border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
              borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
            }}>
              <p style={{ margin: 0, lineHeight: 1.6, fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.message, alignSelf: 'flex-start' }}>
            <div style={{ ...styles.bubble, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    animation: `pulse-glow 1s ease ${i * 0.2}s infinite`,
                    display: 'inline-block',
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} style={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrie un mesaj..."
          disabled={loading}
          style={styles.input}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            ...styles.sendBtn,
            opacity: loading || !input.trim() ? 0.5 : 1,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '...' : '→'}
        </button>
      </form>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 64px)',
    maxHeight: '900px',
    animation: 'fadeIn 0.4s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  label: { fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.7rem', letterSpacing: '0.15em', marginBottom: '4px' },
  title: { fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' },
  clearBtn: {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontSize: '0.8rem',
    transition: 'all 0.2s',
  },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    background: 'var(--bg-secondary)',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    marginBottom: '16px',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    justifyContent: 'center',
    padding: '40px',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid var(--border)',
    borderTop: '2px solid var(--accent)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center',
    padding: '40px',
  },
  suggestion: {
    padding: '8px 14px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontSize: '0.8rem',
    transition: 'all 0.2s',
  },
  message: {
    display: 'flex',
    gap: '8px',
  },
  bubble: {
    maxWidth: '75%',
    padding: '12px 16px',
    color: 'var(--text-primary)',
  },
  inputArea: {
    display: 'flex',
    gap: '12px',
  },
  input: {
    flex: 1,
    padding: '14px 16px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  sendBtn: {
    padding: '14px 20px',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '1.1rem',
    fontFamily: 'var(--font-display)',
    transition: 'opacity 0.2s',
    minWidth: '56px',
  },
}
