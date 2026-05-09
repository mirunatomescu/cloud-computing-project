import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
    }

    const { subject, messageBody } = await req.json()

    if (!subject || !messageBody) {
      return NextResponse.json(
        { error: 'Subiectul și mesajul sunt obligatorii' },
        { status: 400 }
      )
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Trimite email de confirmare utilizatorului
    await transporter.sendMail({
      from: `"AI Assistant Platform" <${process.env.EMAIL_USER}>`,
      to: session.user.email!,
      subject: `✅ Mesaj primit: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: 'Segoe UI', sans-serif; background: #0f0f0f; color: #fff; padding: 40px;">
          <div style="max-width: 500px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; padding: 40px; border: 1px solid #16213e;">
            <h2 style="color: #e94560; margin: 0 0 16px;">Mesajul tău a fost primit! ✅</h2>
            <p style="color: #a0a0b0;">Salut, <strong style="color:#fff">${session.user.name}</strong>!</p>
            <p style="color: #a0a0b0;">Am primit mesajul tău cu subiectul: <strong style="color:#fff">"${subject}"</strong></p>
            <div style="background: #16213e; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p style="margin: 0; color: #a0a0b0; font-size: 14px;">${messageBody}</p>
            </div>
            <hr style="border: 1px solid #16213e; margin: 24px 0;">
            <p style="color: #555; font-size: 12px;">Web AI Assistant with Email Integration - Cloud Computing Project</p>
          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ message: 'Email trimis cu succes!' })
  } catch (error) {
    console.error('Contact email error:', error)
    return NextResponse.json(
      { error: 'Eroare la trimiterea emailului' },
      { status: 500 }
    )
  }
}
