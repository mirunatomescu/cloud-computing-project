import { redirect } from 'next/navigation'
import { getServerSession } from "next-auth/next" 'next-auth'
import { authOptions } from '@/lib/auth'
import DashboardClient from './DashboardClient'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return <DashboardClient session={session}>{children}</DashboardClient>
}
