import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH /api/nakes/[id] — ubah data nakes
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const body = await req.json()
    const existing = await db.nakes.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 })
    }
    const nakes = await db.nakes.update({
      where: { id },
      data: {
        nama: body.nama !== undefined ? String(body.nama).trim() : undefined,
        jenisNakes: body.jenisNakes !== undefined ? body.jenisNakes : undefined,
        jenisKelamin: body.jenisKelamin !== undefined ? body.jenisKelamin : undefined,
        tempatTugas: body.tempatTugas !== undefined ? body.tempatTugas : undefined,
        kecamatan: body.kecamatan !== undefined ? body.kecamatan : undefined,
        status: body.status !== undefined ? body.status : undefined,
        pendidikan: body.pendidikan !== undefined ? body.pendidikan : undefined,
        noStr: body.noStr !== undefined ? body.noStr || null : undefined,
        strBerlaku: body.strBerlaku !== undefined ? (body.strBerlaku ? new Date(body.strBerlaku) : null) : undefined,
        noSip: body.noSip !== undefined ? body.noSip || null : undefined,
        telepon: body.telepon !== undefined ? body.telepon || null : undefined,
      },
    })
    await db.logAktivitas.create({
      data: { aksi: 'UBAH', entitas: 'Nakes', detail: `${nakes.nama} (${nakes.jenisNakes})` },
    })
    return NextResponse.json({ data: nakes })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal mengubah data nakes' }, { status: 500 })
  }
}

// DELETE /api/nakes/[id] — hapus data nakes
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const existing = await db.nakes.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 })
    }
    await db.nakes.delete({ where: { id } })
    await db.logAktivitas.create({
      data: { aksi: 'HAPUS', entitas: 'Nakes', detail: `${existing.nama} (${existing.jenisNakes})` },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal menghapus data nakes' }, { status: 500 })
  }
}
