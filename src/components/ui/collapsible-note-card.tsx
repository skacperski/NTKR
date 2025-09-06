'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { DeleteNoteButton } from './delete-note-button'
import { CollapsibleSection } from './collapsible-section'

interface VoiceNote {
  id: number
  filename: string
  blob_url: string
  transcription: string
  corrected_text: string
  summary: string
  topics: string[]
  follow_up_questions: string[]
  action_items: string[]
  insights: string[]
  location: string
  recorded_at: string
  created_at: string
  mood_score?: number
  emotional_tags?: string[]
  main_topics?: string[]
  importance_level?: number
  processing_status?: 'uploading' | 'processing' | 'transcribing' | 'analyzing' | 'completed' | 'error'
}

interface CollapsibleNoteCardProps {
  note: VoiceNote
  isExpanded?: boolean
  isNewest?: boolean
}

export function CollapsibleNoteCard({ note, isExpanded = false, isNewest = false }: CollapsibleNoteCardProps) {
  const [isOpen, setIsOpen] = useState(isExpanded || isNewest)

  // Funkcja do określenia statusu i kolorów
  const getStatusInfo = (status?: string) => {
    switch (status) {
      case 'processing':
        return { text: 'Przetwarzanie...', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '🔄' }
      case 'transcribing':
        return { text: 'Transkrypcja...', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: '📝' }
      case 'analyzing':
        return { text: 'Analiza...', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: '🧠' }
      case 'completed':
        return { text: 'Gotowe', color: 'text-green-600', bgColor: 'bg-green-100', icon: '✅' }
      case 'error':
        return { text: 'Błąd', color: 'text-red-600', bgColor: 'bg-red-100', icon: '❌' }
      default:
        return { text: 'Gotowe', color: 'text-green-600', bgColor: 'bg-green-100', icon: '✅' }
    }
  }

  const statusInfo = getStatusInfo(note.processing_status)
  const isProcessing = note.processing_status && note.processing_status !== 'completed'

  return (
    <div className={cn(
      "border-b border-gray-200 last:border-b-0",
      isNewest && "bg-gray-50"
    )}>
      {/* Note Header - Always Visible */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex-1 flex items-center gap-3 text-left hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
          >
            <span className="font-bold text-sm">NOTE #{note.id}</span>
            <span className="text-xs text-gray-600">
              {new Date(note.created_at).toLocaleTimeString('pl-PL', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
              {note.location && ` • ${note.location}`}
            </span>
            
            {/* Status Indicator */}
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              statusInfo.color,
              statusInfo.bgColor
            )}>
              <span className={isProcessing ? "animate-pulse" : ""}>{statusInfo.icon}</span>
              {statusInfo.text}
            </span>
            
            {isNewest && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 font-bold">
                NEWEST
              </span>
            )}
          </button>
          
          <div className="flex items-center gap-2 ml-2">
            <DeleteNoteButton 
              noteId={note.id}
              noteTitle={`NOTE #${note.id}`}
            />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <span className={cn(
                "transition-transform duration-200 text-gray-500 text-sm",
                isOpen ? "rotate-90" : "rotate-0"
              )}>
                ▶
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Note Content - Collapsible */}
      {isOpen && (
        <div className="px-4 pb-4 animate-in slide-in-from-top duration-200">
          {/* Audio Player */}
          <div className="mb-4">
            <audio 
              controls 
              className="w-full max-w-md"
              preload="none"
            >
              <source src={note.blob_url} type="audio/wav" />
              Your browser does not support audio.
            </audio>
          </div>

          {/* Always visible sections */}
          <div className="space-y-4">
            {/* Transkrypcja - always open */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                📝 Transkrypcja:
              </h4>
              <div className="text-sm text-gray-700 leading-relaxed">
                {isProcessing && note.transcription === 'Przetwarzanie...' ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="italic">Przetwarzanie audio...</span>
                  </div>
                ) : (
                  <p>{note.transcription}</p>
                )}
              </div>
            </div>

            {/* Podsumowanie - always open */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                📋 Podsumowanie:
              </h4>
              <div className="text-sm text-gray-700 leading-relaxed">
                {isProcessing && note.summary === 'Analizuję zawartość...' ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                    <span className="italic">Analizuję zawartość...</span>
                  </div>
                ) : (
                  <p>{note.summary}</p>
                )}
              </div>
            </div>
          </div>

          {/* Collapsible sections */}
          <div className="mt-4 space-y-2">
            {/* Tematy */}
            {note.topics && note.topics.length > 0 && (
              <CollapsibleSection title="🏷️ Tematy:" defaultOpen={false}>
                <div className="flex flex-wrap gap-2">
                  {note.topics.map((topic, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Zadania */}
            {note.action_items && note.action_items.length > 0 && (
              <CollapsibleSection title="✅ Zadania:" defaultOpen={false}>
                <ul className="space-y-1">
                  {note.action_items.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            )}

            {/* Pytania uzupełniające */}
            {note.follow_up_questions && note.follow_up_questions.length > 0 && (
              <CollapsibleSection title="❓ Pytania uzupełniające:" defaultOpen={false}>
                <ul className="space-y-1">
                  {note.follow_up_questions.map((question, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            )}

            {/* Kluczowe wnioski */}
            {note.insights && note.insights.length > 0 && (
              <CollapsibleSection title="💡 Kluczowe wnioski:" defaultOpen={false}>
                <ul className="space-y-1">
                  {note.insights.map((insight, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
