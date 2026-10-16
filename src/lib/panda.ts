import {
  Stethoscope, Smile, HeartPulse, Baby, Pill, FlaskConical,
  Microscope, Radiation, Apple, Droplets, HelpCircle,
  type LucideIcon,
} from 'lucide-react'

export interface Nakes {
  id: string
  nama: string
  jenisNakes: string
  jenisKelamin: string
  tempatTugas: string
  kecamatan: string
  status: string
  pendidikan: string
  noStr: string | null
  strBerlaku: string | null
  noSip: string | null
  telepon: string | null
  createdAt: string
  updatedAt: string
}

export interface JenisAgg {
  jenisNakes: string
  total: number
  laki: number
  perempuan: number
}
export interface KecamatanAgg { kecamatan: string; total: number }
export interface StatusAgg { status: string; total: number }
export interface PendidikanAgg { pendidikan: string; total: number }
export interface FasilitasAgg { tempatTugas: string; total: number }

export interface Stats {
  total: number
  laki: number
  perempuan: number
  rasio: number
  strKedaluwarsa: number
  jumlahKecamatan: number
  perJenis: JenisAgg[]
  perKecamatan: KecamatanAgg[]
  perStatus: StatusAgg[]
  perPendidikan: PendidikanAgg[]
  perFasilitas: FasilitasAgg[]
}

// 18 kecamatan di Kabupaten Kutai Kartanegara
export const DAFTAR_KECAMATAN = [
  'Anggana', 'Barong Tongkok', 'Bukit Batu', 'Kota Bangun', 'Loa Janan Ilir',
  'Long Iram', 'Marang Kayu', 'Melak', 'Muara Jawa', 'Muara Kaman',
  'Muara Muntai', 'Muara Wis', 'Samboja', 'Sanga-Sanga', 'Sandaran',
  'Tabang', 'Tenggarong', 'Tenggarong Seberang',
]

export const DAFTAR_STATUS = ['PNS', 'PPPK', 'Kontrak', 'Honorer']
export const DAFTAR_PENDIDIKAN = [
  'S2 Kedokteran', 'Profesi Kedokteran', 'Profesi Kedokteran Gigi', 'Profesi Ners',
  'Profesi Kebidanan', 'Profesi Apoteker', 'S1 Keperawatan', 'S1 Kebidanan',
  'S1 Gizi', 'S1 Kesehatan Masyarakat', 'D4 Farmasi', 'D4 Analis Kesehatan',
  'D4 Radiologi', 'D3 Keperawatan', 'D3 Kebidanan', 'D3 Farmasi',
  'D3 Analis Kesehatan', 'D3 Radiologi', 'D3 Gizi',
]

export interface KategoriStyle {
  grad: string
  ring: string
  soft: string
  hex: string
  icon: LucideIcon
  deskripsi: string
}

// Warna-warni terang untuk tiap kartu kategori (bright / lightbox style)
export const KATEGORI_STYLE: Record<string, KategoriStyle> = {
  Dokter: {
    grad: 'from-emerald-400 to-emerald-600', ring: 'ring-emerald-300', soft: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    hex: '#10b981', icon: Stethoscope,
    deskripsi: 'Dokter umum & spesialis yang bertugas di fasilitas kesehatan se-Kabupaten Kutai Kartanegara.',
  },
  'Dokter Gigi': {
    grad: 'from-rose-400 to-rose-600', ring: 'ring-rose-300', soft: 'bg-rose-50 text-rose-700 border-rose-200',
    hex: '#f43f5e', icon: Smile,
    deskripsi: 'Dokter gigi yang memberikan layanan kesehatan gigi dan mulut di puskesmas maupun klinik.',
  },
  Perawat: {
    grad: 'from-amber-400 to-amber-600', ring: 'ring-amber-300', soft: 'bg-amber-50 text-amber-700 border-amber-200',
    hex: '#f59e0b', icon: HeartPulse,
    deskripsi: 'Perawat profesional (Ners) yang memberikan asuhan keperawatan komprehensif.',
  },
  Bidan: {
    grad: 'from-violet-400 to-violet-600', ring: 'ring-violet-300', soft: 'bg-violet-50 text-violet-700 border-violet-200',
    hex: '#8b5cf6', icon: Baby,
    deskripsi: 'Bidan yang memberikan layanan kesehatan reproduksi, maternal, dan neonatal.',
  },
  Apoteker: {
    grad: 'from-teal-400 to-teal-600', ring: 'ring-teal-300', soft: 'bg-teal-50 text-teal-700 border-teal-200',
    hex: '#14b8a6', icon: Pill,
    deskripsi: 'Apoteker pengelola farmasi di puskesmas, rumah sakit, dan apotek.',
  },
  'Tenaga Teknis Farmasi': {
    grad: 'from-orange-400 to-orange-600', ring: 'ring-orange-300', soft: 'bg-orange-50 text-orange-700 border-orange-200',
    hex: '#f97316', icon: FlaskConical,
    deskripsi: 'Tenaga teknis kefarmasian yang membantu pelayanan obat dan perbekalan farmasi.',
  },
  'Tenaga Teknis Laboratorium': {
    grad: 'from-lime-500 to-lime-700', ring: 'ring-lime-300', soft: 'bg-lime-50 text-lime-700 border-lime-200',
    hex: '#65a30d', icon: Microscope,
    deskripsi: 'Analis kesehatan yang menjalankan pemeriksaan laboratorium.',
  },
  'Tenaga Teknis Radiologi': {
    grad: 'from-pink-400 to-pink-600', ring: 'ring-pink-300', soft: 'bg-pink-50 text-pink-700 border-pink-200',
    hex: '#ec4899', icon: Radiation,
    deskripsi: 'Penradi yang menjalankan pemeriksaan radiologi di fasilitas kesehatan.',
  },
  'Ahli Gizi': {
    grad: 'from-fuchsia-400 to-fuchsia-600', ring: 'ring-fuchsia-300', soft: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    hex: '#d946ef', icon: Apple,
    deskripsi: 'Ahli gizi yang menyusun program gizi masyarakat dan layanan dietetik.',
  },
  Sanitarian: {
    grad: 'from-cyan-400 to-cyan-600', ring: 'ring-cyan-300', soft: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    hex: '#06b6d4', icon: Droplets,
    deskripsi: 'Sanitarian pengawas kesehatan lingkungan, kerja, serta mutu air dan makanan.',
  },
}

// Daftar kategori bawaan — dipakai sebagai fallback opsi dropdown "Jenis Nakes"
// bila /api/kategori gagal/belum termuat, agar form tetap selalu bisa diisi.
export const KATEGORI_DEFAULT = Object.keys(KATEGORI_STYLE)

// Palet fallback untuk kategori baru yang belum punya warna khusus
const FALLBACK_GRADS = [
  { grad: 'from-sky-400 to-sky-600', ring: 'ring-sky-300', soft: 'bg-sky-50 text-sky-700 border-sky-200', hex: '#0ea5e9' },
  { grad: 'from-purple-400 to-purple-600', ring: 'ring-purple-300', soft: 'bg-purple-50 text-purple-700 border-purple-200', hex: '#a855f7' },
  { grad: 'from-red-400 to-red-600', ring: 'ring-red-300', soft: 'bg-red-50 text-red-700 border-red-200', hex: '#ef4444' },
  { grad: 'from-yellow-400 to-yellow-600', ring: 'ring-yellow-300', soft: 'bg-yellow-50 text-yellow-700 border-yellow-200', hex: '#eab308' },
]

export function styleForKategori(jenis: string, index = 0): KategoriStyle {
  const known = KATEGORI_STYLE[jenis]
  if (known) return known
  const fb = FALLBACK_GRADS[index % FALLBACK_GRADS.length]
  return { ...fb, icon: HelpCircle, deskripsi: `Kategori tenaga kesehatan: ${jenis}.` }
}

export const WARNA_STATUS: Record<string, string> = {
  PNS: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  PPPK: 'bg-teal-100 text-teal-800 border-teal-200',
  Kontrak: 'bg-amber-100 text-amber-800 border-amber-200',
  Honorer: 'bg-rose-100 text-rose-800 border-rose-200',
}

export const WARNA_JK: Record<string, string> = {
  L: 'bg-sky-100 text-sky-800 border-sky-200',
  P: 'bg-pink-100 text-pink-800 border-pink-200',
}

export function formatTanggal(iso: string | null): string {
  if (!iso) return '-'
  try {
    return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return '-'
  }
}

// ==================== TIPE DASHBOARD LAIN ====================

export interface IzinPraktik {
  id: string
  nama: string
  jenisNakes: string
  noSip: string | null
  jenisIzin: string
  fasilitas: string
  kecamatan: string
  statusIzin: string
  tanggalTerbit: string | null
  tanggalBerlaku: string | null
  createdAt: string
  updatedAt: string
}

export interface Beasiswa {
  id: string
  nama: string
  jenisNakes: string
  program: string
  tujuan: string
  institusi: string
  sumberDana: string
  angkatan: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface Monev {
  id: string
  fasilitas: string
  jenisFasilitas: string
  kecamatan: string
  indikator: string
  skor: number
  periode: string
  rekomendasi: string | null
  tanggalMonev: string | null
  createdAt: string
  updatedAt: string
}

export interface Kredensial {
  id: string
  nama: string
  jenisNakes: string
  jenisKredensial: string
  tingkat: string | null
  fasilitas: string
  status: string
  tanggalPengajuan: string | null
  berlakuSampai: string | null
  createdAt: string
  updatedAt: string
}

export interface Kompetensi {
  id: string
  nama: string
  jenisNakes: string
  namaPelatihan: string
  jenisKegiatan: string
  penyelenggara: string
  jamPelatihan: number
  tahun: number
  sertifikat: string
  createdAt: string
  updatedAt: string
}

// ==================== DAFTAR OPSI & WARNA STATUS ====================

export const JENIS_IZIN = ['Baru', 'Perpanjangan', 'Penyesuaian']
export const STATUS_IZIN = ['Aktif', 'Dalam Proses', 'Kedaluwarsa', 'Ditolak']
export const WARNA_STATUS_IZIN: Record<string, string> = {
  Aktif: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Dalam Proses': 'bg-amber-100 text-amber-800 border-amber-200',
  Kedaluwarsa: 'bg-rose-100 text-rose-800 border-rose-200',
  Ditolak: 'bg-slate-100 text-slate-700 border-slate-300',
}
export const WARNA_JENIS_IZIN: Record<string, string> = {
  Baru: 'bg-teal-100 text-teal-800 border-teal-200',
  Perpanjangan: 'bg-violet-100 text-violet-800 border-violet-200',
  Penyesuaian: 'bg-orange-100 text-orange-800 border-orange-200',
}

export const PROGRAM_BEASISWA = ['Spesialis', 'Subspesialis', 'Magister', 'Doktor', 'Diploma']
export const TUJUAN_BEASISWA = ['Dalam Negeri', 'Luar Negeri']
export const SUMBER_DANA = ['APBD', 'APBN', 'Mandiri', 'Mitra']
export const STATUS_BEASISWA = ['Aktif', 'Lulus', 'Cuti', 'Putus']
export const WARNA_STATUS_BEASISWA: Record<string, string> = {
  Aktif: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Lulus: 'bg-teal-100 text-teal-800 border-teal-200',
  Cuti: 'bg-amber-100 text-amber-800 border-amber-200',
  Putus: 'bg-rose-100 text-rose-800 border-rose-200',
}
export const WARNA_TUJUAN: Record<string, string> = {
  'Dalam Negeri': 'bg-teal-100 text-teal-800 border-teal-200',
  'Luar Negeri': 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
}
export const WARNA_SUMBER_DANA: Record<string, string> = {
  APBD: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  APBN: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  Mandiri: 'bg-amber-100 text-amber-800 border-amber-200',
  Mitra: 'bg-violet-100 text-violet-800 border-violet-200',
}

export const JENIS_FASILITAS_MONEV = ['Puskesmas', 'RS', 'Klinik', 'Laboratorium']
export const INDIKATOR_MONEV = ['Mutu Pelayanan', 'Ketersediaan Nakes', 'Sarana Prasarana', 'Kepatuhan Pelaporan', 'Keselamatan Pasien']
export const PERIODE_MONEV = ['S1 2025', 'S2 2025', 'S1 2026']

export function kategoriHasilMonev(skor: number): string {
  if (skor >= 80) return 'Baik'
  if (skor >= 60) return 'Cukup'
  return 'Kurang'
}
export const WARNA_HASIL_MONEV: Record<string, string> = {
  Baik: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Cukup: 'bg-amber-100 text-amber-800 border-amber-200',
  Kurang: 'bg-rose-100 text-rose-800 border-rose-200',
}
export function warnaSkorMonev(skor: number): string {
  if (skor >= 80) return '#10b981'
  if (skor >= 60) return '#f59e0b'
  return '#f43f5e'
}

export const JENIS_KREDENSIAL = ['Primary', 'Ongoing', 'Privilegium']
export const TINGKAT_PRIVILEGIUM = ['Basic', 'Advanced']
export const STATUS_KREDENSIAL = ['Disetujui', 'Dalam Proses', 'Perlu Revisi', 'Ditolak']
export const WARNA_STATUS_KREDENSIAL: Record<string, string> = {
  Disetujui: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Dalam Proses': 'bg-amber-100 text-amber-800 border-amber-200',
  'Perlu Revisi': 'bg-orange-100 text-orange-800 border-orange-200',
  Ditolak: 'bg-rose-100 text-rose-800 border-rose-200',
}
export const WARNA_JENIS_KREDENSIAL: Record<string, string> = {
  Primary: 'bg-teal-100 text-teal-800 border-teal-200',
  Ongoing: 'bg-violet-100 text-violet-800 border-violet-200',
  Privilegium: 'bg-pink-100 text-pink-800 border-pink-200',
}

export const JENIS_KEGIATAN_KOMPETENSI = ['Pelatihan', 'Workshop', 'Bimtek', 'Sertifikasi', 'Simposium']
export const WARNA_SERTIFIKAT: Record<string, string> = {
  Ya: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Tidak: 'bg-rose-100 text-rose-800 border-rose-200',
}

// Palet donut serbaguna
export const PALET_DONUT = ['#10b981', '#14b8a6', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4', '#f97316', '#d946ef']

// Helper agregasi sederhana
export function countBy<T>(rows: T[], keyFn: (r: T) => string): { name: string; value: number }[] {
  const m = new Map<string, number>()
  for (const r of rows) {
    const k = keyFn(r)
    m.set(k, (m.get(k) || 0) + 1)
  }
  return Array.from(m, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
}

export function sumBy<T>(rows: T[], f: (r: T) => number): number {
  return rows.reduce((acc, r) => acc + f(r), 0)
}
