'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface DayGroupProps {
  date: string
  notesCount: number
  isToday?: boolean
  children: React.ReactNode
}

export function DayGroup({ date, notesCount, isToday = false, children }: DayGroupProps) {
  const [isOpen, setIsOpen] = useState(isToday)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'TODAY'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'YESTERDAY'
    } else {
      return date.toLocaleDateString('pl-PL', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).toUpperCase()
    }
  }

  return (
    <div className={cn("mb-6 border border-gray-300", isToday && "border-gray-500")}>
      {/* Day Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full p-4 text-left font-mono font-bold text-sm uppercase tracking-wide",
          "flex items-center justify-between hover:bg-gray-50 transition-colors",
          isToday ? "bg-gray-100" : "bg-white"
        )}
      >
        <div className="flex items-center gap-3">
          <span>{formatDate(date)}</span>
          <span className="text-xs text-gray-600 font-normal">
            ({notesCount} {notesCount === 1 ? 'note' : 'notes'})
          </span>
        </div>
        
        <span className={cn(
          "transition-transform duration-200 text-gray-500",
          isOpen ? "rotate-90" : "rotate-0"
        )}>
          ▶
        </span>
      </button>

      {/* Notes Content */}
      {isOpen && (
        <div className="border-t border-gray-300 animate-in slide-in-from-top duration-200">
          {children}
        </div>
      )}
    </div>
  )
}
