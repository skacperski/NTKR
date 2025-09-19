'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface CollapsibleSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}

export function CollapsibleSection({ 
  title, 
  defaultOpen = false, 
  children, 
  className 
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn("mb-4", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-gray-700 transition-colors"
      >
        <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
        <span className={cn(
          "transition-transform duration-200 text-gray-500",
          isOpen ? "rotate-90" : "rotate-0"
        )}>
          ▶
        </span>
      </button>
      
      {isOpen && (
        <div className="mt-2 animate-in slide-in-from-top duration-200">
          {children}
        </div>
      )}
    </div>
  )
}
