import React from 'react'
import Link from 'next/link'

export default function DailySummariesPage() {
  return (
    <div className="min-h-screen bg-white text-black font-mono">
      <div className="max-w-4xl mx-auto p-6">
        
        {/* Header */}
        <div className="border-b border-gray-300 pb-4 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">DAILY SUMMARIES</h1>
            <div className="space-x-4 text-sm">
              <Link href="/summaries" className="hover:underline">
                ← BACK TO SUMMARIES
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center py-12 text-gray-600">
          <h2 className="text-lg font-bold mb-4">DAILY SUMMARIES ARCHIVE</h2>
          <p className="mb-4">This page will show all daily summaries</p>
          <p className="text-sm">Coming soon...</p>
        </div>

      </div>
    </div>
  )
}
