import { useEffect, useState } from 'react'

export const useCurrentUserName = () => {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfileName = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        setName(data.user?.name || data.user?.email?.split('@')[0] || '?')
      } catch {
        setName('Anonymous')
      }
    }

    fetchProfileName()
  }, [])

  return name || '?'
}
