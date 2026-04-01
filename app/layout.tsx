import type { Metadata, Viewport } from 'next'
import { Inter as FontSans } from 'next/font/google'

import { Analytics } from '@vercel/analytics/next'

import { getCurrentUser, getCurrentUserId } from '@/lib/auth/get-current-user'
import { UserProvider } from '@/lib/contexts/user-context'
import { cn } from '@/lib/utils'

import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

import AppSidebar from '@/components/app-sidebar'
import ArtifactRoot from '@/components/artifact/artifact-root'
import Header from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

const title = 'Slayma - AI Hybrid Search'
const description =
  'An AI-powered hybrid search engine with intelligent chat and advanced search capabilities.'

export const metadata: Metadata = {
  metadataBase: new URL('https://slayma.vercel.app'),
  title,
  description,
  icons: {
    icon: '/logo.svg'
  },
  openGraph: {
    title,
    description
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getCurrentUser()
  const userId = user?.id ?? (await getCurrentUserId())

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen flex flex-col font-sans antialiased overflow-hidden',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider hasUser={!!userId}>
            <SidebarProvider defaultOpen={false}>
              {userId && <AppSidebar />}
              <div className="flex flex-col flex-1 min-w-0">
                <Header user={user} />
                <main className="flex flex-1 min-h-0 min-w-0 overflow-hidden">
                  <ArtifactRoot>{children}</ArtifactRoot>
                </main>
              </div>
            </SidebarProvider>
          </UserProvider>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
