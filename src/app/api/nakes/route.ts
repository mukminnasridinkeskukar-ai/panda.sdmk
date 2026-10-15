import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/nakes — daftar nakes dengan filter & pencarian
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const jenis = sp.get('jenis') || undefined
    const kecamatan = sp.get('kecamatan') || undefined
    const status = sp.get('status') || undefined
    const q = sp.get('q') || undefined

    const where: Record<string, unknown> = {}
    if (jenis) where.jenisNakes = jenis
    if (kecamatan) where.kecamatan = kecamatan
    if (status) where.status = status
    if (q) {
      where.OR = [
        { nama: { contains: q } },
        { tempatTugas: { contains: q } },
        { noStr: { contains: q } },
      ]
    }

    const data = await db.nakes.findMany({
      where,
      orderBy: [{ jenisNakes: 'asc' }, { nama: 'asc' }],
    })
    return NextResponse.json({ data, total: data.length })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal mengambil data nakes' }, { status: 500 })
  }
}

// POST /api/nakes — tambah nakes baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.nama || !body.jenisNakes || !body.kecamatan || !body.jenisKelamin) {
      return NextResponse.json(
        { error: 'Nama, jenis nakes, kecamatan, dan jenis kelamin wajib diisi' },
        { status: 400 }
      )
    }
    const nakes = await db.nakes.create({
      data: {
        nama: String(body.nama).trim(),
        jenisNakes: body.jenisNakes,
        jenisKelamin: body.jenisKelamin,
        tempatTugas: body.tempatTugas || '-',
        kecamatan: body.kecamatan,
        status: body.status || 'Honorer',
        pendidikan: body.pendidikan || '-',
        noStr: body.noStr || null,
        strBerlaku: body.strBerlaku ? new Date(body.strBerlaku) : null,
        noSip: body.noSip || null,
        telepon: body.telepon || null,
      },
    })
    await db.logAktivitas.create({
      data: { aksi: 'TAMBAH', entitas: 'Nakes', detail: `${nakes.nama} (${nakes.jenisNakes})` },
    })
    return NextResponse.json({ data: nakes }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal menambah data nakes' }, { status: 500 })
  }
}
