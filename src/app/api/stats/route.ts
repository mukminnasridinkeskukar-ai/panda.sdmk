import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Populasi Kukar (BPS, proyeksi) untuk perhitungan rasio per 1.000 penduduk
const POPULASI_KUKAR = 772_000

export async function GET() {
  try {
    const [semua, kategoriList] = await Promise.all([
      db.nakes.findMany(),
      db.kategori.findMany({ orderBy: { urutan: 'asc' } }),
    ])

    const total = semua.length

    // agregat per jenis nakes
    const perJenisMap = new Map<string, { jenisNakes: string; total: number; laki: number; perempuan: number }>()
    for (const n of semua) {
      const cur = perJenisMap.get(n.jenisNakes) || { jenisNakes: n.jenisNakes, total: 0, laki: 0, perempuan: 0 }
      cur.total++
      if (n.jenisKelamin === 'L') cur.laki++
      else cur.perempuan++
      perJenisMap.set(n.jenisNakes, cur)
    }
    const urutanJenis = new Map(kategoriList.map((k, i) => [k.nama, i]))
    const perJenis = Array.from(perJenisMap.values()).sort(
      (a, b) => (urutanJenis.get(a.jenisNakes) ?? 99) - (urutanJenis.get(b.jenisNakes) ?? 99)
    )

    // agregat per kecamatan
    const perKecamatanMap = new Map<string, number>()
    for (const n of semua) {
      perKecamatanMap.set(n.kecamatan, (perKecamatanMap.get(n.kecamatan) || 0) + 1)
    }
    const perKecamatan = Array.from(perKecamatanMap.entries())
      .map(([kecamatan, total]) => ({ kecamatan, total }))
      .sort((a, b) => b.total - a.total)

    // agregat per status kepegawaian
    const perStatusMap = new Map<string, number>()
    for (const n of semua) {
      perStatusMap.set(n.status, (perStatusMap.get(n.status) || 0) + 1)
    }
    const perStatus = Array.from(perStatusMap.entries())
      .map(([status, total]) => ({ status, total }))

    // agregat per pendidikan
    const perPendidikanMap = new Map<string, number>()
    for (const n of semua) {
      perPendidikanMap.set(n.pendidikan, (perPendidikanMap.get(n.pendidikan) || 0) + 1)
    }
    const perPendidikan = Array.from(perPendidikanMap.entries())
      .map(([pendidikan, total]) => ({ pendidikan, total }))
      .sort((a, b) => b.total - a.total)

    // per fasilitas
    const perFasilitasMap = new Map<string, number>()
    for (const n of semua) {
      perFasilitasMap.set(n.tempatTugas, (perFasilitasMap.get(n.tempatTugas) || 0) + 1)
    }
    const perFasilitas = Array.from(perFasilitasMap.entries())
      .map(([tempatTugas, total]) => ({ tempatTugas, total }))
      .sort((a, b) => b.total - a.total)

    // STR yang akan kedaluwarsa dalam 6 bulan
    const batas = new Date()
    batas.setMonth(batas.getMonth() + 6)
    const strKedaluwarsa = semua.filter(
      (n) => n.strBerlaku && new Date(n.strBerlaku) <= batas
    ).length

    const laki = semua.filter((n) => n.jenisKelamin === 'L').length
    const perempuan = total - laki
    const jumlahKecamatan = perKecamatan.length

    return NextResponse.json({
      total,
      laki,
      perempuan,
      rasio: Number(((total / POPULASI_KUKAR) * 1000).toFixed(2)),
      populasI: POPULASI_KUKAR,
      strKedaluwarsa,
      jumlahKecamatan,
      perJenis,
      perKecamatan,
      perStatus,
      perPendidikan,
      perFasilitas,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Gagal mengambil statistik' }, { status: 500 })
  }
}
