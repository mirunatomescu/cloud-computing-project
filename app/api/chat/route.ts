import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import OpenAI from 'openai'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

// ===== SERVICIU CLOUD 2: OpenAI GPT =====
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Trebuie să fii autentificat' },
        { status: 401 }
      )
    }

    const { message, history } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Mesajul nu poate fi gol' },
        { status: 400 }
      )
    }

    // Construiește istoricul conversației pentru OpenAI
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `Ești un asistent AI util și prietenos, integrat în platforma Web AI Assistant with Email Integration.
Răspunzi în română când utilizatorul scrie în română, și în engleză altfel.
Ești concis, precis și util. Data curentă: ${new Date().toLocaleDateString('ro-RO')}.`,
      },
      ...(history || []).slice(-10).map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    })

    const assistantMessage =
      completion.choices[0]?.message?.content || 'Nu am putut genera un răspuns.'

    // Salvează mesajele în MongoDB pentru persistență
    await connectDB()
    await User.findByIdAndUpdate(session.user.id, {
      $push: {
        chatHistory: {
          $each: [
            { role: 'user', content: message, timestamp: new Date() },
            { role: 'assistant', content: assistantMessage, timestamp: new Date() },
          ],
        },
      },
    })

    return NextResponse.json({
      message: assistantMessage,
      tokens: completion.usage?.total_tokens,
    })
  } catch (error: unknown) {
    console.error('Chat error:', error)
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `Eroare OpenAI: ${error.message}` },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: 'Eroare la procesarea mesajului' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
    }

    await connectDB()
    const user = await User.findById(session.user.id).select('chatHistory')

    return NextResponse.json({
      history: user?.chatHistory?.slice(-50) || [],
    })
  } catch (error) {
    console.error('Get history error:', error)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
