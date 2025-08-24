'use client'

import { useState } from 'react'
import Calculator from '@/components/Calculator'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-400 mb-2 led-text">
          VINTAGE CALCULATOR
        </h1>
        <p className="text-gray-400 text-sm">
          Retro 8-Bit Computing Experience
        </p>
      </div>
      <Calculator />
    </main>
  )
}
