import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/kategori — daftar kategori jenis nakes
export async function GET() {
  try {
    const data = await db.kategori.findMany({ orderBy: { urutan: 'asc' } })
    return NextResponse.json({ data })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal mengambil kategori' }, { status: 500 })
  }
}

// POST /api/kategori — tambah kategori baru
export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body.nama) {
      return NextResponse.json({ error: 'Nama kategori wajib diisi' }, { status: 400 })
    }
    const exists = await db.kategori.findUnique({ where: { nama: body.nama } })
    if (exists) {
      return NextResponse.json({ error: 'Kategori sudah ada' }, { status: 409 })
    }
    const count = await db.kategori.count()
    const kategori = await db.kategori.create({
      data: { nama: String(body.nama).trim(), urutan: count + 1 },
    })
    return NextResponse.json({ data: kategori }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal menambah kategori' }, { status: 500 })
  }
}
