import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Sprawdź credentials z environment variables
    const AUTH_USERNAME = process.env.AUTH_USERNAME
    const AUTH_PASSWORD = process.env.AUTH_PASSWORD

    if (!AUTH_USERNAME || !AUTH_PASSWORD) {
      return NextResponse.json({
        error: 'Authentication not configured'
      }, { status: 500 })
    }

    // Sprawdź dane logowania
    if (username !== AUTH_USERNAME || password !== AUTH_PASSWORD) {
      return NextResponse.json({
        error: 'Nieprawidłowe dane logowania'
      }, { status: 401 })
    }

    // Utwórz sesję (prosty token)
    const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString('base64')
    
    // Ustaw cookie na 24 godziny
    const cookieStore = await cookies()
    cookieStore.set('ntkr-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 godziny
      path: '/'
    })

    return NextResponse.json({
      success: true,
      message: 'Zalogowano pomyślnie'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      error: 'Błąd serwera'
    }, { status: 500 })
  }
}
