import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Toate câmpurile sunt obligatorii' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Parola trebuie să aibă minim 6 caractere' },
        { status: 400 }
      )
    }

    await connectDB()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Există deja un cont cu acest email' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    // ===== SERVICIU CLOUD 1: Email de bun venit via Gmail SMTP =====
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })

      await transporter.sendMail({
        from: `"AI Assistant Platform" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🎉 Bun venit pe AI Asssitant Platform!',
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: 'Segoe UI', sans-serif; background: #0f0f0f; color: #fff; padding: 40px;">
            <div style="max-width: 500px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; padding: 40px; border: 1px solid #16213e;">
              <h1 style="color: #e94560; margin: 0 0 8px;">Bun venit, ${name}! 👋</h1>
              <p style="color: #a0a0b0; margin: 0 0 24px;">Contul tău a fost creat cu succes.</p>
              <hr style="border: 1px solid #16213e; margin: 24px 0;">
              <p style="color: #a0a0b0; font-size: 14px;">Acum poți folosi asistentul AI și toate funcționalitățile platformei.</p>
              <div style="margin-top: 24px; padding: 16px; background: #16213e; border-radius: 8px;">
                <p style="margin: 0; color: #e94560; font-size: 13px;">Web AI Assistant with Email Integration - Cloud Computing Project</p>
              </div>
            </div>
          </body>
          </html>
        `,
      })
    } catch (emailError) {
      console.error('Email error (non-fatal):', emailError)
      // Nu blocăm înregistrarea dacă emailul eșuează
    }

    return NextResponse.json(
      {
        message: 'Cont creat cu succes! Verifică emailul.',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Eroare la crearea contului' },
      { status: 500 }
    )
  }
}
