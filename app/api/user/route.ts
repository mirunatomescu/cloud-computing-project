import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
    }

    await connectDB()
    const user = await User.findById(session.user.id).select('-password')

    if (!user) {
      return NextResponse.json({ error: 'Utilizator negăsit' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        chatCount: user.chatHistory?.length || 0,
      },
    })
  } catch (error) {
    console.error('User profile error:', error)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
