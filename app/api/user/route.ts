export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
  try {
    await connectDB()
    const users = await User.find().limit(1)
    return NextResponse.json({
      message: 'API user works',
      sampleUser: users[0] || null,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}