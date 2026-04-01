import { redirect } from 'next/navigation'

// Legacy confirm route - replaced by email OTP verification
export async function GET() {
  redirect('/auth/login')
}
