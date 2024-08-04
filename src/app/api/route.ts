'use server'
import { NextRequest, NextResponse } from 'next/server'
let requestCount = 0
let lastResetTime = Date.now()

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const index = searchParams.get('index')

  try {
    if (Date.now() - lastResetTime >= 1000) {
      requestCount = 0
      lastResetTime = Date.now()
    }

    if (requestCount >= 50) {
      return NextResponse.json({ message: 'Too many requests' }, { status: 429 })
    }

    requestCount++

    const delay = Math.floor(Math.random() * 1000) + 1
    await new Promise((resolve) => setTimeout(resolve, delay))

    return NextResponse.json({ index: parseInt(index ?? '-1') })
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 })
  }
}
