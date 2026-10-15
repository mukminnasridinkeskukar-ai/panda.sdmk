// Seed data PANDA SDMK - Kabupaten Kutai Kartanegara
// Jalankan: node scripts/seed.mjs
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const KECAMATAN = [
  'Tenggarong', 'Tenggarong Seberang', 'Loa Janan Ilir', 'Sanga-Sanga',
  'Samboja', 'Muara Jawa', 'Anggana', 'Kota Bangun', 'Muara Kaman',
  'Muara Muntai', 'Muara Wis', 'Marang Kayu', 'Bukit Batu', 'Barong Tongkok',
  'Melak', 'Long Iram', 'Sandaran', 'Tabang',
]

// bobot distribusi nakes per kecamatan (urban lebih banyak)
const BOBOT = {
  'Tenggarong': 18, 'Tenggarong Seberang': 9, 'Loa Janan Ilir': 11,
  'Sanga-Sanga': 8, 'Samboja': 8, 'Muara Jawa': 7, 'Anggana': 5,
  'Kota Bangun': 6, 'Muara Kaman': 5, 'Muara Muntai': 4, 'Muara Wis': 3,
  'Marang Kayu': 3, 'Bukit Batu': 3, 'Barong Tongkok': 4, 'Melak': 3,
  'Long Iram': 2, 'Sandaran': 2, 'Tabang': 2,
}

const KATEGORI = [
  { nama: 'Dokter', urutan: 1, jumlah: 32 },
  { nama: 'Dokter Gigi', urutan: 2, jumlah: 18 },
  { nama: 'Perawat', urutan: 3, jumlah: 96 },
  { nama: 'Bidan', urutan: 4, jumlah: 84 },
  { nama: 'Apoteker', urutan: 5, jumlah: 14 },
  { nama: 'Tenaga Teknis Farmasi', urutan: 6, jumlah: 26 },
  { nama: 'Tenaga Teknis Laboratorium', urutan: 7, jumlah: 20 },
  { nama: 'Tenaga Teknis Radiologi', urutan: 8, jumlah: 10 },
  { nama: 'Ahli Gizi', urutan: 9, jumlah: 9 },
  { nama: 'Sanitarian', urutan: 10, jumlah: 8 },
]

const DEPAN_L = ['Muhammad', 'Ahmad', 'Andi', 'Herman', 'Joko', 'Budi', 'Rizky', 'Agus', 'Dedi', 'Ilham', 'Fajar', 'Rendi', 'Yusuf', 'Hendra', 'Surya', 'Bayu', 'Taufik', 'Reza', 'Danang', 'Arif']
const DEPAN_P = ['Siti', 'Nur', 'Rina', 'Dewi', 'Ayu', 'Rahma', 'Melati', 'Indah', 'Fitri', 'Lestari', 'Anisa', 'Putri', 'Wulan', 'Yuni', 'Sari', 'Nabila', 'Hesty', 'Vina', 'Mega', 'Citra']
const TENGAH = ['Annisa', 'Kartika', 'Safitri', 'Wijaya', 'Ramadhani', 'Permata', 'Handayani', 'Anggraini', 'Puspita', 'Maulana', 'Setiawan', 'Nugraha', 'Pratama', 'Santoso', 'Hidayat', 'Saputra', 'Wibowo', 'Firmansyah', 'Cahyani', 'Oktaviani']
const BELAKANG = ['Rahman', 'Hasan', 'Saputra', 'Nurdin', 'Siregar', 'Panjaitan', 'Ginting', 'Simanjuntak', 'Hidayatullah', 'Rasyid', 'Yusran', 'Mangkunegara', 'Qadri', 'Salim', 'Mansyur']

const FASILITAS = {
  'Tenggarong': ['RSUD Tenggarong', 'Puskesmas Tenggarong', 'Puskesmas Tenggarong Kota', 'Klinik Sehati'],
  'Tenggarong Seberang': ['Puskesmas Tenggarong Seberang', 'Puskesmas Bukit Biru'],
  'Loa Janan Ilir': ['RSUD Loa Janan Ilir', 'Puskesmas Loa Janan Ilir', 'Klinik Bunda Husada'],
  'Sanga-Sanga': ['Puskesmas Sanga-Sanga', 'Puskesmas Giri Mulya'],
  'Samboja': ['Puskesmas Samboja', 'RS Samboja Medika'],
  'Muara Jawa': ['Puskesmas Muara Jawa', 'Puskesmas Jawa Mandala'],
  'Anggana': ['Puskesmas Anggana', 'Puskesmas Sidomulyo'],
  'Kota Bangun': ['Puskesmas Kota Bangun', 'Puskesmas Sei Segah'],
  'Muara Kaman': ['Puskesmas Muara Kaman', 'Puskesmas Rantau Hempang'],
  'Muara Muntai': ['Puskesmas Muara Muntai', 'Puskesmas Muara Komanil'],
  'Muara Wis': ['Puskesmas Muara Wis', 'Puskesmas Muara Pahu Baru'],
  'Marang Kayu': ['Puskesmas Marang Kayu', 'Puskesmas Salo Celia'],
  'Bukit Batu': ['Puskesmas Bukit Batu', 'Puskesmas Benanga Baru'],
  'Barong Tongkok': ['Puskesmas Barong Tongkok', 'Puskesmas Segah'],
  'Melak': ['Puskesmas Melak', 'Puskesmas Lok Besar'],
  'Long Iram': ['Puskesmas Long Iram', 'Puskesmas Tering Baru'],
  'Sandaran': ['Puskesmas Sandaran', 'Puskesmas Kumala Island'],
  'Tabang': ['Puskesmas Tabang', 'Puskesmas Kasongan Baru'],
}

const STATUS = ['PNS', 'PPPK', 'Kontrak', 'Honorer']
const PENDIDIKAN = {
  'Dokter': ['S2 Kedokteran', 'Profesi Kedokteran'],
  'Dokter Gigi': ['Profesi Kedokteran Gigi'],
  'Perawat': ['Profesi Ners', 'S1 Keperawatan', 'D3 Keperawatan'],
  'Bidan': ['Profesi Kebidanan', 'S1 Kebidanan', 'D3 Kebidanan'],
  'Apoteker': ['Profesi Apoteker'],
  'Tenaga Teknis Farmasi': ['D3 Farmasi', 'D4 Farmasi'],
  'Tenaga Teknis Laboratorium': ['D3 Analis Kesehatan', 'D4 Analis Kesehatan'],
  'Tenaga Teknis Radiologi': ['D3 Radiologi', 'D4 Radiologi'],
  'Ahli Gizi': ['S1 Gizi', 'D3 Gizi'],
  'Sanitarian': ['S1 Kesehatan Masyarakat'],
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function weightedKecamatan() {
  const total = Object.values(BOBOT).reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (const [kec, w] of Object.entries(BOBOT)) {
    r -= w
    if (r <= 0) return kec
  }
  return 'Tenggarong'
}

function namaNakes(jk) {
  const depan = jk === 'L' ? pick(DEPAN_L) : pick(DEPAN_P)
  const t = pick(TENGAH)
  const b = pick(BELAKANG)
  return Math.random() > 0.5 ? `${depan} ${t} ${b}` : `${depan} ${b}`
}

function acakTahun(start, end) {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return d
}

// ==================== POOL DATA DASHBOARD LAIN ====================

const JENIS_IZIN = ['Baru', 'Perpanjangan', 'Penyesuaian']
const STATUS_IZIN_POOL = ['Aktif', 'Aktif', 'Aktif', 'Aktif', 'Dalam Proses', 'Dalam Proses', 'Kedaluwarsa', 'Kedaluwarsa', 'Ditolak']

const PROGRAM_BEASISWA = ['Spesialis', 'Spesialis', 'Spesialis', 'Magister', 'Magister', 'Subspesialis', 'Diploma', 'Doktor']
const TUJUAN_POOL = ['Dalam Negeri', 'Dalam Negeri', 'Dalam Negeri', 'Luar Negeri']
const INSTITUSI_DN = ['Univ. Hasanuddin', 'Univ. Gadjah Mada', 'Univ. Indonesia', 'Univ. Airlangga', 'Univ. Sriwijaya', 'Univ. Diponegoro', 'Univ. Lambung Mangkurat', 'Univ. Udayana', 'Poltekkes Kemenkes Kupang', 'Univ. Mulawarman']
const INSTITUSI_LN = ['Universiti Malaya (Malaysia)', 'Monash Univ. (Australia)', 'National Univ. of Singapore', 'Univ. Hasselt (Belgia)', 'Univ. Queensland (Australia)', 'Univ. Kebangsaan Malaysia']
const SUMBER_DANA_POOL = ['APBD', 'APBD', 'APBD', 'APBN', 'APBN', 'Mandiri', 'Mitra']
const STATUS_BEASISWA_POOL = ['Aktif', 'Aktif', 'Aktif', 'Aktif', 'Lulus', 'Lulus', 'Cuti', 'Putus']

const JENIS_FASILITAS_POOL = ['Puskesmas', 'Puskesmas', 'Puskesmas', 'RS', 'Klinik', 'Laboratorium']
const INDIKATOR_MONEV = ['Mutu Pelayanan', 'Ketersediaan Nakes', 'Sarana Prasarana', 'Kepatuhan Pelaporan', 'Keselamatan Pasien']
const PERIODE_MONEV = ['S1 2025', 'S2 2025', 'S1 2026']
const REKOMENDASI_POOL = [
  'Tambah tenaga teknis pada unit pelayanan',
  'Melengkapi sarana penunjang dan alat ukur',
  'Meningkatkan kepatuhan pencatatan & pelaporan',
  'Percepat penerapan standar keselamatan pasien',
  'Perbaiki tata kelola arsip & mutu rekam medis',
  'Pertahankan kinerja dan dokumentasi',
]

const JENIS_KREDENSIAL_POOL = ['Primary', 'Primary', 'Ongoing', 'Ongoing', 'Privilegium']
const STATUS_KREDENSIAL_POOL = ['Disetujui', 'Disetujui', 'Disetujui', 'Dalam Proses', 'Dalam Proses', 'Perlu Revisi', 'Ditolak']
const TINGKAT_PRIV = ['Basic', 'Basic', 'Advanced']

const PELATIHAN_POOL = [
  'PPGD (Penanggulangan Gawat Darurat)', 'ATLS', 'ACLS', 'BHD', 'KIA/KB Kontrasepsi',
  'P2P Penyakit Menular', 'Pencegahan & Pengendalian Infeksi', 'Resusitasi Neonatus',
  'Manajemen Mutu Pelayanan Kesehatan', 'Kredensial & Privilegium', 'Etik Profesi & Komunikasi Efektif',
  'Deteksi Dini & Respons Cepat Kejadian Luar Biasa', 'Manajemen Kepegawaian Nakes',
]
const JENIS_KEGIATAN_POOL = ['Pelatihan', 'Pelatihan', 'Pelatihan', 'Workshop', 'Workshop', 'Bimtek', 'Sertifikasi', 'Simposium']
const PENYELENGGARA_POOL = ['Dinas Kesehatan Kukar', 'PPSDM Kemenkes', 'PPNI / IDI / IPI', 'RSUD Tenggarong', 'Pusdiklat Mitra', 'Kolaborasi Akademik']

function poolPick(pool, kec) {
  const fas = FASILITAS[kec] || FASILITAS['Tenggarong']
  return pick(fas)
}

function buatIzin(jumlah) {
  const rows = []
  for (let i = 0; i < jumlah; i++) {
    const jk = Math.random() > 0.35 ? 'P' : 'L'
    const kec = weightedKecamatan()
    const terbit = acakTahun(new Date('2023-01-01'), new Date('2026-10-01'))
    const status = pick(STATUS_IZIN_POOL)
    rows.push({
      nama: namaNakes(jk),
      jenisNakes: pick(KATEGORI).nama,
      noSip: `SIP/${Math.floor(100 + Math.random() * 899)}/${Math.floor(1000 + Math.random() * 8999)}`,
      jenisIzin: pick(JENIS_IZIN),
      fasilitas: poolPick(FASILITAS, kec),
      kecamatan: kec,
      statusIzin: status,
      tanggalTerbit: terbit,
      tanggalBerlaku: new Date(terbit.getFullYear() + 2 + Math.floor(Math.random() * 3), terbit.getMonth(), terbit.getDate()),
    })
  }
  return rows
}

function buatBeasiswa(jumlah) {
  const rows = []
  for (let i = 0; i < jumlah; i++) {
    const jk = Math.random() > 0.4 ? 'P' : 'L'
    const tujuan = pick(TUJUAN_POOL)
    rows.push({
      nama: namaNakes(jk),
      jenisNakes: pick(KATEGORI).nama,
      program: pick(PROGRAM_BEASISWA),
      tujuan,
      institusi: tujuan === 'Luar Negeri' ? pick(INSTITUSI_LN) : pick(INSTITUSI_DN),
      sumberDana: pick(SUMBER_DANA_POOL),
      angkatan: 2021 + Math.floor(Math.random() * 6),
      status: pick(STATUS_BEASISWA_POOL),
    })
  }
  return rows
}

function buatMonev(jumlah) {
  const rows = []
  const fasilitasTerpakai = new Set()
  for (let i = 0; i < jumlah; i++) {
    const kec = weightedKecamatan()
    const fas = poolPick(FASILITAS, kec)
    fasilitasTerpakai.add(fas)
    rows.push({
      fasilitas: fas,
      jenisFasilitas: fas.startsWith('Puskesmas') ? 'Puskesmas' : fas.startsWith('RS') ? 'RS' : fas.startsWith('Klinik') ? 'Klinik' : 'Laboratorium',
      kecamatan: kec,
      indikator: pick(INDIKATOR_MONEV),
      skor: 48 + Math.floor(Math.random() * 50),
      periode: pick(PERIODE_MONEV),
      rekomendasi: pick(REKOMENDASI_POOL),
      tanggalMonev: acakTahun(new Date('2025-01-01'), new Date('2026-10-01')),
    })
  }
  return rows
}

function buatKredensial(jumlah) {
  const rows = []
  for (let i = 0; i < jumlah; i++) {
    const jk = Math.random() > 0.35 ? 'P' : 'L'
    const kec = weightedKecamatan()
    const jenis = pick(JENIS_KREDENSIAL_POOL)
    const status = pick(STATUS_KREDENSIAL_POOL)
    const pengajuan = acakTahun(new Date('2025-01-01'), new Date('2026-10-01'))
    rows.push({
      nama: namaNakes(jk),
      jenisNakes: pick(KATEGORI).nama,
      jenisKredensial: jenis,
      tingkat: jenis === 'Privilegium' ? pick(TINGKAT_PRIV) : null,
      fasilitas: poolPick(FASILITAS, kec),
      status,
      tanggalPengajuan: pengajuan,
      berlakuSampai: status === 'Disetujui' ? new Date(pengajuan.getFullYear() + 1 + Math.floor(Math.random() * 2), pengajuan.getMonth(), pengajuan.getDate()) : null,
    })
  }
  return rows
}

function buatKompetensi(jumlah) {
  const rows = []
  for (let i = 0; i < jumlah; i++) {
    const jk = Math.random() > 0.35 ? 'P' : 'L'
    rows.push({
      nama: namaNakes(jk),
      jenisNakes: pick(KATEGORI).nama,
      namaPelatihan: pick(PELATIHAN_POOL),
      jenisKegiatan: pick(JENIS_KEGIATAN_POOL),
      penyelenggara: pick(PENYELENGGARA_POOL),
      jamPelatihan: pick([8, 12, 16, 24, 32, 40]),
      tahun: 2022 + Math.floor(Math.random() * 5),
      sertifikat: Math.random() > 0.2 ? 'Ya' : 'Tidak',
    })
  }
  return rows
}

async function main() {
  await db.logAktivitas.deleteMany()
  await db.nakes.deleteMany()
  await db.kategori.deleteMany()

  for (const k of KATEGORI) {
    await db.kategori.create({ data: { nama: k.nama, urutan: k.urutan } })
  }
  console.log('✔ Kategori dibuat:', KATEGORI.length)

  let total = 0
  for (const k of KATEGORI) {
    for (let i = 0; i < k.jumlah; i++) {
      const jk = Math.random() > 0.35 ? 'P' : 'L'
      const kec = weightedKecamatan()
      const fasilitas = pick(FASILITAS[kec])
      const status = pick(STATUS)
      const punyaStr = k.nama !== 'Sanitarian' && Math.random() > 0.05
      await db.nakes.create({
        data: {
          nama: namaNakes(jk),
          jenisNakes: k.nama,
          jenisKelamin: jk,
          tempatTugas: fasilitas,
          kecamatan: kec,
          status,
          pendidikan: pick(PENDIDIKAN[k.nama] || ['S1']),
          noStr: punyaStr ? `STR/${k.urutan}${Math.floor(100000 + Math.random() * 899999)}` : null,
          strBerlaku: punyaStr ? acakTahun(new Date('2026-01-01'), new Date('2031-12-31')) : null,
          noSip: Math.random() > 0.2 ? `SIP/${k.urutan}${Math.floor(1000 + Math.random() * 8999)}` : null,
          telepon: `08${Math.floor(10 + Math.random() * 89)}${Math.floor(10000000 + Math.random() * 89999999)}`,
        },
      })
      total++
    }
  }
  console.log('✔ Data nakes dibuat:', total)

  await db.logAktivitas.create({
    data: { aksi: 'SEED', entitas: 'Database', detail: `Inisialisasi ${total} data nakes & ${KATEGORI.length} kategori` },
  })
  console.log('✔ Seed selesai (SDMK)')

  // ===== Dashboard lain =====
  await db.izinPraktik.deleteMany()
  await db.beasiswa.deleteMany()
  await db.monev.deleteMany()
  await db.kredensial.deleteMany()
  await db.kompetensi.deleteMany()

  const izin = buatIzin(120)
  await db.izinPraktik.createMany({ data: izin })
  console.log('✔ Izin Praktik:', izin.length)

  const bea = buatBeasiswa(42)
  await db.beasiswa.createMany({ data: bea })
  console.log('✔ Beasiswa:', bea.length)

  const mon = buatMonev(64)
  await db.monev.createMany({ data: mon })
  console.log('✔ Monev:', mon.length)

  const kre = buatKredensial(92)
  await db.kredensial.createMany({ data: kre })
  console.log('✔ Kredensial:', kre.length)

  const kom = buatKompetensi(150)
  await db.kompetensi.createMany({ data: kom })
  console.log('✔ Kompetensi:', kom.length)

  await db.logAktivitas.create({
    data: { aksi: 'SEED', entitas: 'Database', detail: `Seed: izin ${izin.length}, beasiswa ${bea.length}, monev ${mon.length}, kredensial ${kre.length}, kompetensi ${kom.length}` },
  })
  console.log('✔ Seed selesai')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
