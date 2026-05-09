import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import SessionProvider from './components/SessionProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Web AI Assistant with Email Integration - AI Assistant',
  description: 'Proiect Cloud Computing - Aplicație web cu AI și autentificare',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SessionProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a2e',
                color: '#fff',
                border: '1px solid #e94560',
                borderRadius: '8px',
                fontFamily: 'Syne, sans-serif',
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}
