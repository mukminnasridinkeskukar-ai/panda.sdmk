import { NextRequest, NextResponse } from 'next/server'

// Verifikasi password admin sederhana (server-side)
// Password diambil dari env ADMIN_PASSWORD, default "kukar123"
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const password = process.env.ADMIN_PASSWORD || 'kukar123'
    if (body.password === password) {
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ ok: false, error: 'Password salah' }, { status: 401 })
  } catch {
    return NextResponse.json({ ok: false, error: 'Permintaan tidak valid' }, { status: 400 })
  }
}
