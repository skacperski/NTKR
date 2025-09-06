'use client'

import React, { useState } from 'react'

interface GenerateSummaryButtonProps {
  date: string
  type: 'daily' | 'weekly'
  onSuccess?: () => void
}

export function GenerateSummaryButton({ date, type, onSuccess }: GenerateSummaryButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSummary = async () => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const endpoint = type === 'daily' 
        ? '/api/summaries/daily/generate'
        : '/api/summaries/weekly/generate'
      
      const body = type === 'daily'
        ? { date }
        : { weekStartDate: date }
      
      console.log(`🤖 Generating ${type} summary for:`, body)
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to generate ${type} summary`)
      }
      
      const result = await response.json()
      console.log(`✅ ${type} summary generated:`, result)
      
      // Refresh page to show new summary
      onSuccess?.()
      window.location.reload()
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`❌ Error generating ${type} summary:`, errorMessage)
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="text-center py-8">
      {error && (
        <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-800 text-sm">
          <div className="font-bold">❌ ERROR</div>
          <div>{error}</div>
        </div>
      )}
      
      <p className="text-gray-600 mb-4">
        {type === 'daily' ? 'No summary for today yet' : 'No weekly summary yet'}
      </p>
      
      <button
        onClick={generateSummary}
        disabled={isGenerating}
        className="px-4 py-2 border border-gray-400 text-sm font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
            GENERATING...
          </span>
        ) : (
          `GENERATE ${type === 'daily' ? "TODAY'S" : "WEEKLY"} SUMMARY`
        )}
      </button>
    </div>
  )
}
