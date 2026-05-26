import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Create a transporter using Gmail (Standard Student/Personal setup)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

export async function POST(request: NextRequest) {
    try {
        const { to, subject, body } = await request.json()

        if (!to || !subject || !body) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Check if configuration exists
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️ EMAIL_USER or EMAIL_PASS missing in .env.local')
            // Fallback to simulation for demo if not configured
            console.log(`[SIMULATED EMAIL] To: ${to}\nSubject: ${subject}`)
            return NextResponse.json({
                success: true,
                message: 'Simulation successful. Add EMAIL_USER and EMAIL_PASS for real delivery.'
            })
        }

        console.log(`🚀 Sending real email to: ${to} via ${process.env.EMAIL_USER}`)

        const mailOptions = {
            from: `"GrowthMate AI" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: body, // Plain text version
            html: body.replace(/\n/g, '<br>'), // HTML version
        }

        await transporter.sendMail(mailOptions)

        console.log('✅ Email sent successfully to:', to)
        return NextResponse.json({ success: true, message: 'Email sent successfully' })

    } catch (error: unknown) {
        console.error('Email error:', error)
        const err = error as Record<string, unknown>;
        // Provide more detailed error message for Gmail auth failures
        if (err.code === 'EAUTH') {
            return NextResponse.json({
                error: 'Authentication failed',
                details: 'Please check your Gmail App Password. Normal passwords do not work.'
            }, { status: 500 })
        }
        return NextResponse.json({ error: (err.message as string) || 'Failed to send email' }, { status: 500 })
    }
}
