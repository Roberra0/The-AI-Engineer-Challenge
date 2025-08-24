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
        throw new Error('Failed to get response')
      }

      const data = await res.json()
      setResponse(data.response)
    } catch (error) {
      console.error('Error:', error)
      setResponse('Sorry, I encountered an error. Please check that your OpenAI API key is configured in .env.local file.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto">
      <div className="pixel-border bg-gray-800 p-6 rounded-lg">
        <h2 className="text-green-400 mb-4 led-text text-center">
          ASK A MATHEMATICIAN
        </h2>
        
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask me anything about math..."
              className="flex-1 math-input text-white px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="pixel-button bg-green-600 text-white px-6 py-3 text-sm font-bold hover:bg-green-500 active:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
            >
              {isLoading ? 'ASKING...' : 'ASK'}
            </button>
          </div>
        </form>

        {response && (
          <div className="led-display p-4 rounded">
            <div className="led-text-small text-left whitespace-pre-wrap">
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
