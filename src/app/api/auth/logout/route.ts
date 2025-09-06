import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Usuń cookie sesji
    const cookieStore = await cookies()
    cookieStore.delete('ntkr-session')

    return NextResponse.json({
      success: true,
      message: 'Wylogowano pomyślnie'
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({
      error: 'Błąd wylogowania'
    }, { status: 500 })
  }
}
