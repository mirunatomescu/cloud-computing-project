import { getServerSession } from "next-auth/next" 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  let chatCount = 0
  let joinedDate = ''

  try {
    await connectDB()
    const user = await User.findById(session?.user?.id).select('chatHistory createdAt')

    chatCount = user?.chatHistory?.length || 0

    joinedDate = user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString('ro-RO', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'N/A'
  } catch (err) {
    // ignorăm erorile (nu e critic pentru UI)
  }

  const cards = [
    { label: 'Mesaje AI', value: chatCount.toString(), icon: '◈', href: '/dashboard/chat' },
    { label: 'Cont creat', value: joinedDate, icon: '◉', href: '#' },
    { label: 'Status', value: 'Activ', icon: '⬡', href: '#' },
  ]

  const quickActions = [
    { label: 'Deschide AI Chat', desc: 'Conversează cu GPT', icon: '🤖', href: '/dashboard/chat' },
    { label: 'Trimite Email', desc: 'Notificare prin SMTP', icon: '📧', href: '/dashboard/email' },
  ]

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent)',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          marginBottom: '8px'
        }}>
          DASHBOARD
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          marginBottom: '8px'
        }}>
          Salut, {session?.user?.name?.split(' ')[0]}! 👋
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.95rem'
        }}>
          Bun venit înapoi. Alege o acțiune.
        </p>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {cards.map((card) => (
          <div
            key={card.label}
            style={{
              padding: '24px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '12px' }}>
              {card.icon}
            </div>

            <div style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              marginBottom: '4px'
            }}>
              {card.value}
            </div>

            <div style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)'
            }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          marginBottom: '16px',
          color: 'var(--text-muted)'
        }}>
          ACȚIUNI RAPIDE
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px'
        }}>
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              style={{
                padding: '24px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                textDecoration: 'none',
                display: 'block',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>
                {action.icon}
              </div>

              <div style={{
                fontWeight: 700,
                marginBottom: '6px',
                color: 'var(--text-primary)'
              }}>
                {action.label}
              </div>

              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)'
              }}>
                {action.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div style={{
        marginTop: '32px',
        padding: '20px 24px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        borderLeft: '3px solid var(--accent)',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--accent)',
          marginBottom: '8px'
        }}>
          STACK TEHNOLOGIC
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['Next.js', 'MongoDB', 'NextAuth', 'OpenAI', 'SMTP', 'Vercel'].map((tech) => (
            <span
              key={tech}
              style={{
                padding: '4px 10px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}