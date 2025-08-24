import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Usage tracking
let totalRequests = 0
let totalTokens = 0

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 10 // Max 10 requests per minute per IP

  const userData = rateLimitMap.get(ip)
  
  if (!userData || now > userData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (userData.count >= maxRequests) {
    return false
  }

  userData.count++
  return true
}

function logUsage(prompt: string, response: any) {
  totalRequests++
  if (response.usage?.total_tokens) {
    totalTokens += response.usage.total_tokens
  }
  
  console.log(`API Usage - Requests: ${totalRequests}, Total Tokens: ${totalTokens}`)
  console.log(`Prompt: "${prompt.substring(0, 100)}..."`)
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Validate prompt length
    if (prompt.length > 500) {
      return NextResponse.json(
        { error: 'Prompt too long. Maximum 500 characters.' },
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
            content: 'You are a helpful mathematics tutor. Provide clear, concise explanations and step-by-step solutions when appropriate. Use a friendly, encouraging tone. If the question is not math-related, politely redirect to math topics. Keep responses under 300 words.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300, // Reduced from 500 to limit costs
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

    // Log usage for monitoring
    logUsage(prompt, data)

    return NextResponse.json({ response: assistantResponse })
  } catch (error) {
    console.error('Math assistant error:', error)
    return NextResponse.json(
      { error: 'Failed to get response from AI assistant' },
      { status: 500 }
    )
  }
}
