'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export function StickyNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      if (response.ok) {
        router.push('/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-300 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/notes" className="text-lg font-bold font-mono hover:text-gray-600 transition-colors">
            NTKR
          </Link>

          {/* Navigation Links - Right Side */}
          <div className="flex items-center space-x-8">
            <Link
              href="/notes"
              className={cn(
                "text-sm font-bold font-mono uppercase tracking-wide hover:text-gray-600 transition-colors",
                pathname.startsWith('/notes') ? "text-black border-b-2 border-black pb-1" : "text-gray-500"
              )}
            >
              NOTES
            </Link>
            
            <Link
              href="/summaries"
              className={cn(
                "text-sm font-bold font-mono uppercase tracking-wide hover:text-gray-600 transition-colors",
                pathname.startsWith('/summaries') ? "text-black border-b-2 border-black pb-1" : "text-gray-500"
              )}
            >
              SUMMARIES
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-sm font-bold font-mono uppercase tracking-wide text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? 'WYLOGOWUJĘ...' : 'WYLOGUJ'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
