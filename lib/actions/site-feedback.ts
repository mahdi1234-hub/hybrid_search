'use server'

import { getCurrentUser } from '@/lib/auth/get-current-user'
import { db } from '@/lib/db'
import { feedback, generateId } from '@/lib/db/schema'
import { withOptionalRLS } from '@/lib/db/with-rls'

export async function submitFeedback(data: {
  sentiment: 'positive' | 'neutral' | 'negative'
  message: string
  pageUrl: string
}) {
  try {
    // Get current user if logged in
    let userId: string | undefined

    const user = await getCurrentUser()
    if (user) {
      userId = user.id
    }

    // Get user agent from headers
    const { headers } = await import('next/headers')
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || undefined

    // Save to database with RLS context
    const id = generateId()
    await withOptionalRLS(userId || null, async tx => {
      await tx.insert(feedback).values({
        id,
        sentiment: data.sentiment,
        message: data.message,
        pageUrl: data.pageUrl,
        userId: userId || null,
        userAgent: userAgent || null
      })
    })

    return { success: true, id }
  } catch (error) {
    console.error('Failed to submit feedback:', error)
    return { success: false, error: 'Failed to submit feedback' }
  }
}
