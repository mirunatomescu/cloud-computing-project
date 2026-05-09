'use client'

import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'

export default function DashboardClient({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session
}) {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '⬡' },
    { href: '/dashboard/chat', label: 'AI Chat', icon: '◈' },
    { href: '/dashboard/email', label: 'Email', icon: '◉' },
  ]

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
    toast.success('Deconectat cu succes')
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        {/* Logo */}
        <div style={styles.logo}>
          <span style={styles.logoIcon}>◈</span>
          <div>
            <div style={styles.logoText}>SIMPRE</div>
            <div style={styles.logoSub}>2026</div>
          </div>
        </div>

        {/* User info */}
        <div style={styles.userCard}>
          <div style={styles.avatar}>
            {session.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{session.user?.name}</div>
            <div style={styles.userEmail}>{session.user?.email}</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  ...styles.navItem,
                  background: isActive ? 'var(--accent-dim)' : 'transparent',
                  borderColor: isActive ? 'var(--border-accent)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <button onClick={handleSignOut} style={styles.logoutBtn}>
          <span>⊗</span>
          <span>Deconectare</span>
        </button>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        {children}
      </main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg-primary)',
  },
  sidebar: {
    width: '240px',
    background: 'var(--bg-card)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
    padding: '0 8px',
  },
  logoIcon: {
    fontSize: '24px',
    color: 'var(--accent)',
  },
  logoText: {
    fontWeight: 800,
    fontSize: '1rem',
    letterSpacing: '0.1em',
  },
  logoSub: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'var(--bg-secondary)',
    borderRadius: '10px',
    marginBottom: '24px',
    border: '1px solid var(--border)',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '1rem',
    flexShrink: 0,
  },
  userInfo: { overflow: 'hidden', flex: 1 },
  userName: {
    fontWeight: 700,
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    border: '1px solid transparent',
    transition: 'all 0.15s',
  },
  navIcon: { fontSize: '16px' },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: '8px',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.9rem',
    width: '100%',
    transition: 'all 0.15s',
  },
  main: {
    flex: 1,
    overflow: 'auto',
    padding: '32px',
  },
}
