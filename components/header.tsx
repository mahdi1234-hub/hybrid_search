'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import { useSidebar } from '@/components/ui/sidebar'

import { Button } from './ui/button'
import { FeedbackModal } from './feedback-modal'
import GuestMenu from './guest-menu'
import UserMenu from './user-menu'

interface HeaderProps {
  user: { id: string; email: string } | null
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const { open } = useSidebar()
  const pathname = usePathname()
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const isRootPage = pathname === '/'

  return (
    <>
      <header
        className={cn(
          'absolute top-0 right-0 p-3 flex justify-between items-center z-10 backdrop-blur-sm lg:backdrop-blur-none bg-background/80 lg:bg-transparent transition-[width] duration-200 ease-linear',
          open ? 'md:w-[calc(100%-var(--sidebar-width))]' : 'md:w-full',
          'w-full'
        )}
      >
        <div></div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog">Blog</Link>
          </Button>
          {isRootPage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFeedbackOpen(true)}
            >
              Feedback
            </Button>
          )}
          {user ? <UserMenu user={user} /> : <GuestMenu />}
        </div>
      </header>

      {isRootPage && (
        <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />
      )}
    </>
  )
}

export default Header
