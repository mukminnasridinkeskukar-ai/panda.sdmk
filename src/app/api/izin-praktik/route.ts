import { NextRequest, NextResponse } from 'next/server'
import { handleCrudGet, handleCrudPost } from '@/lib/crud-server'

export async function GET(req: NextRequest) {
  return handleCrudGet(req, 'izin-praktik')
}

export async function POST(req: NextRequest) {
  return handleCrudPost(req, 'izin-praktik')
}
