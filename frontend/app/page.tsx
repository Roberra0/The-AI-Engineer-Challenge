'use client'

import { useState } from 'react'
import Calculator from '@/components/Calculator'
import MathAssistant from '@/components/MathAssistant'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Calculator />
      <MathAssistant />
    </main>
  )
}
