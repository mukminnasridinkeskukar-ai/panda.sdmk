'use client'

import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  DAFTAR_KECAMATAN, WARNA_STATUS, WARNA_JK,
  JENIS_IZIN, STATUS_IZIN, WARNA_STATUS_IZIN, WARNA_JENIS_IZIN,
  PROGRAM_BEASISWA, TUJUAN_BEASISWA, SUMBER_DANA, STATUS_BEASISWA,
  WARNA_STATUS_BEASISWA, WARNA_TUJUAN, WARNA_SUMBER_DANA,
  JENIS_FASILITAS_MONEV, INDIKATOR_MONEV, PERIODE_MONEV,
  kategoriHasilMonev, warnaSkorMonev,
  JENIS_KREDENSIAL, TINGKAT_PRIVILEGIUM, STATUS_KREDENSIAL,
  WARNA_STATUS_KREDENSIAL, WARNA_JENIS_KREDENSIAL,
  JENIS_KEGIATAN_KOMPETENSI, WARNA_SERTIFIKAT,
  DAFTAR_PENDIDIKAN, DAFTAR_STATUS, formatTanggal,
} from '@/lib/panda'

// ==================== Definisi Field & Kolom CRUD ====================

export interface CrudField {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'select'
  options?: string[]
  dinamis?: 'kategori' // opsi diambil dari /api/kategori
  required?: boolean
  placeholder?: string
  penuh?: boolean // span 2 kolom
  min?: number // untuk type number
  max?: number // untuk type number
}

export interface CrudColumn {
  key: string
  label: string
  render?: (row: Record<string, unknown>) => ReactNode
}

export interface CrudTab {
  key: string
  judul: string
  fields: CrudField[]
  columns: CrudColumn[]
  filterField?: { key: string; label: string; options: string[] }
}

// helper badge
function B({ v, map }: { v: string; map?: Record<string, string> }) {
  if (!map) return <span>{v}</span>
  return (
    <Badge variant="outline" className={`${map[v] || ''} text-[10px] max-w-[140px]`}>
      <span className="truncate">{v}</span>
    </Badge>
  )
}

const JK_MAP: Record<string, string> = { L: 'Laki-laki', P: 'Perempuan' }

function badgeJenisNakes(r: Record<string, unknown>) {
  const jenis = String(r.jenisNakes ?? '')
  const st = styleForKategoriSafe(jenis)
  return <B v={jenis} map={st} />
}

function styleForKategoriSafe(jenis: string): Record<string, string> {
  // fallback ringan agar tidak import styleForKategori (butuh index)
  const SOFT: Record<string, string> = {
    Dokter: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Dokter Gigi': 'bg-rose-50 text-rose-700 border-rose-200',
    Perawat: 'bg-amber-50 text-amber-700 border-amber-200',
    Bidan: 'bg-violet-50 text-violet-700 border-violet-200',
    Apoteker: 'bg-teal-50 text-teal-700 border-teal-200',
    'Tenaga Teknis Farmasi': 'bg-orange-50 text-orange-700 border-orange-200',
    'Tenaga Teknis Laboratorium': 'bg-lime-50 text-lime-700 border-lime-200',
    'Tenaga Teknis Radiologi': 'bg-pink-50 text-pink-700 border-pink-200',
    'Ahli Gizi': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    Sanitarian: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  }
  return SOFT[jenis] || 'bg-slate-50 text-slate-700 border-slate-200'
}

// ==================== KONFIGURASI TIAP TAB ====================

export const TAB_NAKES: CrudTab = {
  key: 'nakes',
  judul: 'Data Nakes',
  fields: [
    { key: 'nama', label: 'Nama Lengkap', type: 'text', required: true, placeholder: 'Contoh: Siti Rahmawati, S.Kep', penuh: true },
    { key: 'jenisNakes', label: 'Jenis Nakes', type: 'select', dinamis: 'kategori', required: true },
    { key: 'jenisKelamin', label: 'Jenis Kelamin', type: 'select', options: ['L', 'P'], required: true },
    { key: 'tempatTugas', label: 'Tempat Tugas', type: 'text', placeholder: 'Contoh: Puskesmas Tenggarong' },
    { key: 'kecamatan', label: 'Kecamatan', type: 'select', options: DAFTAR_KECAMATAN, required: true },
    { key: 'status', label: 'Status Kepegawaian', type: 'select', options: DAFTAR_STATUS },
    { key: 'pendidikan', label: 'Pendidikan', type: 'select', options: DAFTAR_PENDIDIKAN },
    { key: 'noStr', label: 'No. STR', type: 'text', placeholder: 'STR/123456789' },
    { key: 'strBerlaku', label: 'STR Berlaku Sampai', type: 'date' },
    { key: 'noSip', label: 'No. SIP', type: 'text', placeholder: 'SIP/445/1234' },
    { key: 'telepon', label: 'No. Telepon', type: 'text', placeholder: '08xxxxxxxxxx' },
  ],
  columns: [
    { key: 'nama', label: 'Nama', render: (r) => <span className="font-medium">{String(r.nama)}</span> },
    { key: 'jenisNakes', label: 'Jenis', render: badgeJenisNakes },
    { key: 'jenisKelamin', label: 'JK', render: (r) => <B v={String(r.jenisKelamin)} map={WARNA_JK} /> },
    { key: 'tempatTugas', label: 'Tempat Tugas' },
    { key: 'kecamatan', label: 'Kecamatan' },
    { key: 'status', label: 'Status', render: (r) => (r.status ? <B v={String(r.status)} map={WARNA_STATUS} /> : <span className="text-muted-foreground">-</span>) },
    { key: 'strBerlaku', label: 'STR s.d.', render: (r) => formatTanggal(r.strBerlaku ? String(r.strBerlaku) : null) },
  ],
}

export const TAB_IZIN: CrudTab = {
  key: 'izin-praktik',
  judul: 'Izin Praktik',
  fields: [
    { key: 'nama', label: 'Nama Lengkap', type: 'text', required: true, penuh: true },
    { key: 'jenisNakes', label: 'Jenis Nakes', type: 'select', dinamis: 'kategori', required: true },
    { key: 'noSip', label: 'No. SIP', type: 'text', placeholder: 'SIP/445/1234' },
    { key: 'jenisIzin', label: 'Jenis Pengajuan', type: 'select', options: JENIS_IZIN, required: true },
    { key: 'fasilitas', label: 'Fasilitas', type: 'text', placeholder: 'Puskesmas / RS / Klinik' },
    { key: 'kecamatan', label: 'Kecamatan', type: 'select', options: DAFTAR_KECAMATAN, required: true },
    { key: 'statusIzin', label: 'Status Izin', type: 'select', options: STATUS_IZIN, required: true },
    { key: 'tanggalTerbit', label: 'Tanggal Terbit', type: 'date' },
    { key: 'tanggalBerlaku', label: 'Berlaku Sampai', type: 'date' },
  ],
  columns: [
    { key: 'nama', label: 'Nama', render: (r) => <span className="font-medium">{String(r.nama)}</span> },
    { key: 'jenisNakes', label: 'Jenis', render: badgeJenisNakes },
    { key: 'noSip', label: 'No. SIP', render: (r) => String(r.noSip ?? '-') },
    { key: 'jenisIzin', label: 'Jenis', render: (r) => <B v={String(r.jenisIzin)} map={WARNA_JENIS_IZIN} /> },
    { key: 'fasilitas', label: 'Fasilitas' },
    { key: 'kecamatan', label: 'Kecamatan' },
    { key: 'statusIzin', label: 'Status', render: (r) => <B v={String(r.statusIzin)} map={WARNA_STATUS_IZIN} /> },
    { key: 'tanggalBerlaku', label: 'Berlaku s.d.', render: (r) => formatTanggal(r.tanggalBerlaku ? String(r.tanggalBerlaku) : null) },
  ],
  filterField: { key: 'statusIzin', label: 'Semua Status', options: STATUS_IZIN },
}

export const TAB_BEASISWA: CrudTab = {
  key: 'beasiswa',
  judul: 'Beasiswa',
  fields: [
    { key: 'nama', label: 'Nama Lengkap', type: 'text', required: true, penuh: true },
    { key: 'jenisNakes', label: 'Jenis Nakes', type: 'select', dinamis: 'kategori', required: true },
    { key: 'program', label: 'Program Studi', type: 'select', options: PROGRAM_BEASISWA, required: true },
    { key: 'tujuan', label: 'Tujuan Studi', type: 'select', options: TUJUAN_BEASISWA, required: true },
    { key: 'institusi', label: 'Institusi', type: 'text', placeholder: 'Nama perguruan tinggi' },
    { key: 'sumberDana', label: 'Sumber Dana', type: 'select', options: SUMBER_DANA, required: true },
    { key: 'angkatan', label: 'Angkatan (Tahun)', type: 'number', required: true, placeholder: '2026', min: 2000, max: 2100 },
    { key: 'status', label: 'Status', type: 'select', options: STATUS_BEASISWA, required: true },
  ],
  columns: [
    { key: 'nama', label: 'Nama', render: (r) => <span className="font-medium">{String(r.nama)}</span> },
    { key: 'jenisNakes', label: 'Jenis', render: badgeJenisNakes },
    { key: 'program', label: 'Program', render: (r) => <B v={String(r.program)} /> },
    { key: 'institusi', label: 'Institusi' },
    { key: 'tujuan', label: 'Tujuan', render: (r) => <B v={String(r.tujuan)} map={WARNA_TUJUAN} /> },
    { key: 'sumberDana', label: 'Dana', render: (r) => <B v={String(r.sumberDana)} map={WARNA_SUMBER_DANA} /> },
    { key: 'angkatan', label: 'Angkatan', render: (r) => <span className="tabular-nums">{Number(r.angkatan)}</span> },
    { key: 'status', label: 'Status', render: (r) => <B v={String(r.status)} map={WARNA_STATUS_BEASISWA} /> },
  ],
  filterField: { key: 'status', label: 'Semua Status', options: STATUS_BEASISWA },
}

export const TAB_MONEV: CrudTab = {
  key: 'monev',
  judul: 'Monev',
  fields: [
    { key: 'fasilitas', label: 'Nama Fasilitas', type: 'text', required: true, placeholder: 'Puskesmas Tenggarong' },
    { key: 'jenisFasilitas', label: 'Jenis Fasilitas', type: 'select', options: JENIS_FASILITAS_MONEV, required: true },
    { key: 'kecamatan', label: 'Kecamatan', type: 'select', options: DAFTAR_KECAMATAN, required: true },
    { key: 'indikator', label: 'Indikator', type: 'select', options: INDIKATOR_MONEV, required: true },
    { key: 'skor', label: 'Skor (0-100)', type: 'number', required: true, placeholder: '85', min: 0, max: 100 },
    { key: 'periode', label: 'Periode', type: 'select', options: PERIODE_MONEV, required: true },
    { key: 'tanggalMonev', label: 'Tanggal Monev', type: 'date' },
    { key: 'rekomendasi', label: 'Rekomendasi / Tindak Lanjut', type: 'text', penuh: true, placeholder: 'Catatan hasil monev' },
  ],
  columns: [
    { key: 'fasilitas', label: 'Fasilitas', render: (r) => <span className="font-medium">{String(r.fasilitas)}</span> },
    { key: 'kecamatan', label: 'Kecamatan' },
    { key: 'indikator', label: 'Indikator' },
    { key: 'skor', label: 'Skor', render: (r) => {
      const skor = Number(r.skor)
      return (
        <div className="flex items-center gap-2 min-w-[110px]">
          <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${skor}%`, backgroundColor: warnaSkorMonev(skor) }} />
          </div>
          <span className="text-xs font-bold tabular-nums">{skor}</span>
        </div>
      )
    } },
    { key: 'hasil', label: 'Hasil', render: (r) => <B v={kategoriHasilMonev(Number(r.skor))} map={WARNA_HASIL_MONEV_K} /> },
    { key: 'periode', label: 'Periode' },
  ],
  filterField: { key: 'indikator', label: 'Semua Indikator', options: INDIKATOR_MONEV },
}

const WARNA_HASIL_MONEV_K: Record<string, string> = {
  Baik: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Cukup: 'bg-amber-100 text-amber-800 border-amber-200',
  Kurang: 'bg-rose-100 text-rose-800 border-rose-200',
}

export const TAB_KREDENSIAL: CrudTab = {
  key: 'kredensial',
  judul: 'Kredensial',
  fields: [
    { key: 'nama', label: 'Nama Lengkap', type: 'text', required: true, penuh: true },
    { key: 'jenisNakes', label: 'Jenis Nakes', type: 'select', dinamis: 'kategori', required: true },
    { key: 'jenisKredensial', label: 'Jenis Kredensial', type: 'select', options: JENIS_KREDENSIAL, required: true },
    { key: 'tingkat', label: 'Tingkat Privilegium (opsional)', type: 'select', options: TINGKAT_PRIVILEGIUM },
    { key: 'fasilitas', label: 'Fasilitas', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: STATUS_KREDENSIAL, required: true },
    { key: 'tanggalPengajuan', label: 'Tanggal Pengajuan', type: 'date' },
    { key: 'berlakuSampai', label: 'Berlaku Sampai', type: 'date' },
  ],
  columns: [
    { key: 'nama', label: 'Nama', render: (r) => <span className="font-medium">{String(r.nama)}</span> },
    { key: 'jenisNakes', label: 'Jenis', render: badgeJenisNakes },
    { key: 'jenisKredensial', label: 'Jenis', render: (r) => <B v={`${String(r.jenisKredensial)}${r.tingkat ? ` (${String(r.tingkat)})` : ''}`} map={WARNA_JENIS_KREDENSIAL} /> },
    { key: 'fasilitas', label: 'Fasilitas' },
    { key: 'status', label: 'Status', render: (r) => <B v={String(r.status)} map={WARNA_STATUS_KREDENSIAL} /> },
    { key: 'tanggalPengajuan', label: 'Pengajuan', render: (r) => formatTanggal(r.tanggalPengajuan ? String(r.tanggalPengajuan) : null) },
    { key: 'berlakuSampai', label: 'Berlaku s.d.', render: (r) => formatTanggal(r.berlakuSampai ? String(r.berlakuSampai) : null) },
  ],
  filterField: { key: 'status', label: 'Semua Status', options: STATUS_KREDENSIAL },
}

export const TAB_KOMPETENSI: CrudTab = {
  key: 'kompetensi',
  judul: 'Kompetensi',
  fields: [
    { key: 'nama', label: 'Nama Lengkap', type: 'text', required: true, penuh: true },
    { key: 'jenisNakes', label: 'Jenis Nakes', type: 'select', dinamis: 'kategori', required: true },
    { key: 'namaPelatihan', label: 'Nama Pelatihan', type: 'text', required: true, penuh: true, placeholder: 'Contoh: ATLS' },
    { key: 'jenisKegiatan', label: 'Jenis Kegiatan', type: 'select', options: JENIS_KEGIATAN_KOMPETENSI, required: true },
    { key: 'penyelenggara', label: 'Penyelenggara', type: 'text' },
    { key: 'jamPelatihan', label: 'Jam Pelatihan', type: 'number', required: true, placeholder: '16', min: 1, max: 999 },
    { key: 'tahun', label: 'Tahun', type: 'number', required: true, placeholder: '2026', min: 1990, max: 2100 },
    { key: 'sertifikat', label: 'Sertifikat', type: 'select', options: ['Ya', 'Tidak'], required: true },
  ],
  columns: [
    { key: 'nama', label: 'Nama', render: (r) => <span className="font-medium">{String(r.nama)}</span> },
    { key: 'jenisNakes', label: 'Jenis', render: badgeJenisNakes },
    { key: 'namaPelatihan', label: 'Pelatihan' },
    { key: 'jenisKegiatan', label: 'Jenis', render: (r) => <B v={String(r.jenisKegiatan)} /> },
    { key: 'penyelenggara', label: 'Penyelenggara' },
    { key: 'jamPelatihan', label: 'Jam', render: (r) => <span className="tabular-nums">{Number(r.jamPelatihan)}</span> },
    { key: 'tahun', label: 'Tahun', render: (r) => <span className="tabular-nums">{Number(r.tahun)}</span> },
    { key: 'sertifikat', label: 'Sertifikat', render: (r) => <B v={String(r.sertifikat)} map={WARNA_SERTIFIKAT} /> },
  ],
  filterField: { key: 'jenisKegiatan', label: 'Semua Jenis', options: JENIS_KEGIATAN_KOMPETENSI },
}

export const SEMUA_TAB: CrudTab[] = [TAB_NAKES, TAB_IZIN, TAB_BEASISWA, TAB_MONEV, TAB_KREDENSIAL, TAB_KOMPETENSI]

// dipakai untuk label JK pada CSV
export { JK_MAP }
