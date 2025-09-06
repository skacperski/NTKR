'use client'

import React, { useState } from 'react'

interface DeleteNoteButtonProps {
  noteId: number
  noteTitle: string
  onSuccess?: () => void
}

export function DeleteNoteButton({ noteId, noteTitle, onSuccess }: DeleteNoteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch('/api/voice-notes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: noteId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete note')
      }

      console.log(`✅ Note ${noteId} deleted successfully`)
      onSuccess?.()
      
      // Wyślij event żeby odświeżyć listę notatek
      window.dispatchEvent(new CustomEvent('noteDeleted'))
      
      // Zamknij confirmation dialog
      setShowConfirm(false)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('❌ Delete error:', errorMessage)
      alert(`Błąd podczas usuwania: ${errorMessage}`)
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="border border-red-300 bg-red-50 p-3 rounded-none">
        <div className="text-xs text-red-800 mb-2 font-bold uppercase">
          ⚠️ CONFIRM DELETE
        </div>
        <div className="text-xs text-red-700 mb-3">
          Delete &quot;{noteTitle}&quot;? This action cannot be undone.
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'DELETING...' : 'DELETE'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
            className="px-3 py-1 border border-gray-400 text-xs font-bold uppercase hover:bg-gray-100 disabled:opacity-50"
          >
            CANCEL
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-xs text-red-600 hover:text-red-800 hover:underline font-bold uppercase"
    >
      DELETE
    </button>
  )
}
