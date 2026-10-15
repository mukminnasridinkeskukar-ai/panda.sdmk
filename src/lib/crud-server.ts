import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ============================================================
// Factory CRUD generik untuk model-model dashboard PANDA SDMK.
// Setiap model didaftarkan lewat "spec" berisi field yang diizinkan,
// sehingga route hanya tinggal memanggil handler dengan kunci model.
// ============================================================

interface CrudSpec {
  prisma: string // nama delegate di PrismaClient
  label: string // label manusiawi untuk log audit
  textFields: string[] // field string yang diizinkan (opsional boleh kosong)
  numberFields?: string[]
  dateFields?: string[]
  required?: string[]
}

export const CRUD_SPECS: Record<string, CrudSpec> = {
  'nakes': {
    prisma: 'nakes',
    label: 'Nakes',
    textFields: ['nama', 'jenisNakes', 'jenisKelamin', 'tempatTugas', 'kecamatan', 'status', 'pendidikan', 'noStr', 'noSip', 'telepon'],
    dateFields: ['strBerlaku'],
    required: ['nama', 'jenisNakes', 'kecamatan', 'jenisKelamin'],
  },
  'izin-praktik': {
    prisma: 'izinPraktik',
    label: 'Izin Praktik',
    textFields: ['nama', 'jenisNakes', 'noSip', 'jenisIzin', 'fasilitas', 'kecamatan', 'statusIzin'],
    dateFields: ['tanggalTerbit', 'tanggalBerlaku'],
    required: ['nama', 'jenisNakes', 'kecamatan'],
  },
  'beasiswa': {
    prisma: 'beasiswa',
    label: 'Beasiswa',
    textFields: ['nama', 'jenisNakes', 'program', 'tujuan', 'institusi', 'sumberDana', 'status'],
    numberFields: ['angkatan'],
    required: ['nama', 'jenisNakes', 'program'],
  },
  'monev': {
    prisma: 'monev',
    label: 'Monev',
    textFields: ['fasilitas', 'jenisFasilitas', 'kecamatan', 'indikator', 'periode', 'rekomendasi'],
    numberFields: ['skor'],
    dateFields: ['tanggalMonev'],
    required: ['fasilitas', 'kecamatan', 'indikator'],
  },
  'kredensial': {
    prisma: 'kredensial',
    label: 'Kredensial',
    textFields: ['nama', 'jenisNakes', 'jenisKredensial', 'tingkat', 'fasilitas', 'status'],
    dateFields: ['tanggalPengajuan', 'berlakuSampai'],
    required: ['nama', 'jenisKredensial', 'status'],
  },
  'kompetensi': {
    prisma: 'kompetensi',
    label: 'Kompetensi',
    textFields: ['nama', 'jenisNakes', 'namaPelatihan', 'jenisKegiatan', 'penyelenggara', 'sertifikat'],
    numberFields: ['jamPelatihan', 'tahun'],
    required: ['nama', 'namaPelatihan'],
  },
}

// Whitelist delegate Prisma agar tidak ada akses dinamis liar
interface Delegate {
  findMany: (args?: Record<string, unknown>) => Promise<unknown[]>
  findUnique: (args: { where: { id: string } }) => Promise<Record<string, unknown> | null>
  create: (args: { data: Record<string, unknown> }) => Promise<Record<string, unknown>>
  update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<Record<string, unknown>>
  delete: (args: { where: { id: string } }) => Promise<Record<string, unknown>>
}

function delegateOf(spec: CrudSpec): Delegate {
  const map = db as unknown as Record<string, Delegate>
  const del = map[spec.prisma]
  if (!del) throw new Error(`Model tidak dikenal: ${spec.prisma}`)
  return del
}

function coerce(spec: CrudSpec, body: Record<string, unknown>, isCreate: boolean): Record<string, unknown> {
  const data: Record<string, unknown> = {}
  for (const key of spec.textFields) {
    if (body[key] === undefined) continue
    const v = body[key]
    data[key] = v === null || v === '' ? null : String(v).trim()
  }
  for (const key of spec.numberFields || []) {
    if (body[key] === undefined || body[key] === null || body[key] === '') {
      if (isCreate) data[key] = 0
      continue
    }
    data[key] = Number(body[key])
    if (Number.isNaN(data[key])) data[key] = 0
  }
  for (const key of spec.dateFields || []) {
    if (body[key] === undefined) continue
    const v = body[key]
    data[key] = v ? new Date(String(v)) : null
  }
  if (isCreate) {
    for (const key of spec.required || []) {
      if (data[key] === null || data[key] === undefined || data[key] === '') {
        // biarkan handler memvalidasi
      }
    }
  }
  return data
}

export async function handleCrudGet(_req: NextRequest, key: string) {
  try {
    const spec = CRUD_SPECS[key]
    if (!spec) return NextResponse.json({ error: 'Model tidak dikenal' }, { status: 404 })
    const delegate = delegateOf(spec)
    const data = await delegate.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ data, total: data.length })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function handleCrudPost(req: NextRequest, key: string) {
  try {
    const spec = CRUD_SPECS[key]
    if (!spec) return NextResponse.json({ error: 'Model tidak dikenal' }, { status: 404 })
    const body = (await req.json()) as Record<string, unknown>
    const missing = (spec.required || []).filter(
      (f) => !body[f] || (typeof body[f] === 'string' && !(body[f] as string).trim())
    )
    if (missing.length > 0) {
      return NextResponse.json({ error: `Kolom wajib diisi: ${missing.join(', ')}` }, { status: 400 })
    }
    const delegate = delegateOf(spec)
    const created = await delegate.create({ data: coerce(spec, body, true) })
    await db.logAktivitas.create({
      data: { aksi: 'TAMBAH', entitas: spec.label, detail: String(created['nama'] ?? created['fasilitas'] ?? '-') },
    })
    return NextResponse.json({ data: created }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal menambah data' }, { status: 500 })
  }
}

export async function handleCrudPatch(req: NextRequest, key: string, id: string) {
  try {
    const spec = CRUD_SPECS[key]
    if (!spec) return NextResponse.json({ error: 'Model tidak dikenal' }, { status: 404 })
    const delegate = delegateOf(spec)
    const existing = await delegate.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 })
    const body = (await req.json()) as Record<string, unknown>
    const updated = await delegate.update({ where: { id }, data: coerce(spec, body, false) })
    await db.logAktivitas.create({
      data: { aksi: 'UBAH', entitas: spec.label, detail: String(updated['nama'] ?? updated['fasilitas'] ?? '-') },
    })
    return NextResponse.json({ data: updated })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal mengubah data' }, { status: 500 })
  }
}

export async function handleCrudDelete(_req: NextRequest, key: string, id: string) {
  try {
    const spec = CRUD_SPECS[key]
    if (!spec) return NextResponse.json({ error: 'Model tidak dikenal' }, { status: 404 })
    const delegate = delegateOf(spec)
    const existing = await delegate.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 })
    await delegate.delete({ where: { id } })
    await db.logAktivitas.create({
      data: { aksi: 'HAPUS', entitas: spec.label, detail: String(existing['nama'] ?? existing['fasilitas'] ?? '-') },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 })
  }
}
