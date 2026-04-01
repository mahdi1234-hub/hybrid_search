import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD
  }
})

export async function sendOtpEmail(email: string, otp: string) {
  const mailOptions = {
    from: `"Slayma AI" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: 'Your Slayma Verification Code',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899); border-radius: 16px; line-height: 64px; font-size: 28px; color: white; font-weight: bold;">S</div>
          <h1 style="margin: 16px 0 4px; font-size: 24px; color: #1f2937;">Slayma</h1>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">AI-Powered Hybrid Search</p>
        </div>
        <div style="background: #f9fafb; border-radius: 12px; padding: 32px; text-align: center; border: 1px solid #e5e7eb;">
          <p style="color: #374151; margin: 0 0 8px; font-size: 16px;">Your verification code is:</p>
          <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #6366f1; margin: 16px 0; font-family: monospace;">${otp}</div>
          <p style="color: #9ca3af; margin: 16px 0 0; font-size: 13px;">This code expires in 10 minutes.</p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
          If you did not request this code, please ignore this email.
        </p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}
