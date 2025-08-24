import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add your API key to .env.local file.' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful mathematics tutor. Provide clear, concise explanations and step-by-step solutions when appropriate. Use a friendly, encouraging tone. If the question is not math-related, politely redirect to math topics.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const assistantResponse = data.choices[0]?.message?.content

    if (!assistantResponse) {
      throw new Error('No response from OpenAI')
    }

    return NextResponse.json({ response: assistantResponse })
  } catch (error) {
    console.error('Math assistant error:', error)
    return NextResponse.json(
      { error: 'Failed to get response from AI assistant' },
      { status: 500 }
    )
  }
}
