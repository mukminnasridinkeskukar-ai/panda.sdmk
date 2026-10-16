// Audit kebersihan data PANDA SDMK di SQLite (db/custom.db)
// - nilai text di luar daftar opsi
// - angka tidak wajar (0 / di luar rentang)
// - string kosong (harusnya null)
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

const OPSI = {
  nakes: { status: ['PNS', 'PPPK', 'Kontrak', 'Honorer'], pendidikan: ['S2 Kedokteran', 'Profesi Kedokteran', 'Profesi Kedokteran Gigi', 'Profesi Ners', 'Profesi Kebidanan', 'Profesi Apoteker', 'S1 Keperawatan', 'S1 Kebidanan', 'S1 Gizi', 'S1 Kesehatan Masyarakat', 'D4 Farmasi', 'D4 Analis Kesehatan', 'D4 Radiologi', 'D3 Keperawatan', 'D3 Kebidanan', 'D3 Farmasi', 'D3 Analis Kesehatan', 'D3 Radiologi', 'D3 Gizi'], jenisKelamin: ['L', 'P'] },
  izinPraktik: { jenisIzin: ['Baru', 'Perpanjangan', 'Penyesuaian'], statusIzin: ['Aktif', 'Dalam Proses', 'Kedaluwarsa', 'Ditolak'] },
  beasiswa: { program: ['Spesialis', 'Subspesialis', 'Magister', 'Doktor', 'Diploma'], tujuan: ['Dalam Negeri', 'Luar Negeri'], sumberDana: ['APBD', 'APBN', 'Mandiri', 'Mitra'], status: ['Aktif', 'Lulus', 'Cuti', 'Putus'] },
  monev: { jenisFasilitas: ['Puskesmas', 'RS', 'Klinik', 'Laboratorium'], periode: ['S1 2025', 'S2 2025', 'S1 2026'] },
  kredensial: { jenisKredensial: ['Primary', 'Ongoing', 'Privilegium'], tingkat: ['Basic', 'Advanced'], status: ['Disetujui', 'Dalam Proses', 'Perlu Revisi', 'Ditolak'] },
  kompetensi: { jenisKegiatan: ['Pelatihan', 'Workshop', 'Bimtek', 'Sertifikasi', 'Simposium'], sertifikat: ['Ya', 'Tidak'] },
}
const NUM = {
  nakes: [], izinPraktik: [],
  beasiswa: [['angkatan', 2021, 2030]],
  monev: [['skor', 0, 100]],
  kredensial: [],
  kompetensi: [['jamPelatihan', 1, 200], ['tahun', 2020, 2026]],
}

let masalah = 0
for (const [model, fields] of Object.entries(OPSI)) {
  const rows = await db[model].findMany()
  for (const [f, valid] of Object.entries(fields)) {
    for (const r of rows) {
      const v = r[f]
      if (v !== null && v !== undefined && !valid.includes(v)) {
        console.log(`[OPSI] ${model}.${f} = "${v}" (id ${r.id}, ${r.nama ?? r.fasilitas})`)
        masalah++
      }
      if (v === '') {
        console.log(`[KOSONG] ${model}.${f} = "" (id ${r.id}, ${r.nama ?? r.fasilitas})`)
        masalah++
      }
    }
  }
}
for (const [model, fields] of Object.entries(NUM)) {
  const rows = await db[model].findMany()
  for (const [f, min, max] of fields) {
    for (const r of rows) {
      const v = r[f]
      if (v === null || v === undefined || v < min || v > max) {
        console.log(`[ANGKA] ${model}.${f} = ${v} (harus ${min}-${max}) (id ${r.id}, ${r.nama ?? r.fasilitas})`)
        masalah++
      }
    }
  }
}
// Ringkasan nilai unik utk sanity
for (const model of ['nakes', 'izinPraktik', 'beasiswa', 'monev', 'kredensial', 'kompetensi']) {
  const rows = await db[model].findMany()
  console.log(`${model}: ${rows.length} baris`)
}
console.log(masalah === 0 ? '✓ SEMUA DATA RAPI' : `✗ ${masalah} masalah ditemukan`)
await db.$disconnect()
