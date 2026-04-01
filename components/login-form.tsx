'use client'

import Link from 'next/link'

import { cn } from '@/lib/utils/index'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { IconLogo } from '@/components/ui/icons'

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('flex flex-col items-center gap-6', className)}
      {...props}
    >
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex flex-col items-center justify-center gap-4">
            <IconLogo className="size-12" />
            Welcome to Slayma
          </CardTitle>
          <CardDescription>
            Sign in with your email to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/auth/login">Sign In with Email OTP</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
