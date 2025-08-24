'use client'

import { useState } from 'react'

export default function MathAssistant() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setResponse('') // Clear previous response

    try {
      const res = await fetch('/api/math-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to get response')
      }

      const data = await res.json()
      setResponse(data.response)
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setResponse(`Error: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto">
      <div className="pixel-border bg-gray-800 p-6 rounded-lg">

        
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask me anything about math..."
              className="flex-1 math-input text-white px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-white bg-gray-600"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="pixel-button bg-yellow-600 text-black px-6 py-3 text-sm font-bold hover:bg-yellow-500 active:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
            >
              {isLoading ? 'ASKING...' : 'ASK A MATHEMATICIAN'}
            </button>
          </div>
        </form>

        {response && (
          <div className="led-display p-4 rounded">
            <div className="led-text-small text-left whitespace-pre-wrap leading-relaxed">
              {response}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="led-display p-4 rounded">
            <div className="led-text-small text-center">
              THINKING...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
