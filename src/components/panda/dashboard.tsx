'use client'

import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend,
} from 'recharts'
import {
  Users, Activity, MapPin, AlarmClock, MousePointerClick,
  Building2, GraduationCap, type LucideIcon,
} from 'lucide-react'
import {
  type Stats, type Nakes, styleForKategori, WARNA_STATUS, WARNA_JK, formatTanggal,
} from '@/lib/panda'
import { DetailDialog, Kolom, PageHeader, StatCard } from './ui-bits'

const WARNA_PIE_STATUS: Record<string, string> = {
  PNS: '#10b981', PPPK: '#14b8a6', Kontrak: '#f59e0b', Honorer: '#f43f5e',
}
const WARNA_BATANG = ['#10b981', '#14b8a6', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4', '#f97316', '#d946ef', '#65a30d', '#ec4899', '#0ea5e9', '#a855f7']

function angka(n: number) {
  return n.toLocaleString('id-ID')
}

// ------------------- Kartu kategori berwarna -------------------

function KartuKategori({
  jenis, index, total, persenDariTotal, onClick,
}: {
  jenis: string; index: number; total: number; persenDariTotal: number
  onClick: () => void
}) {
  const st = styleForKategori(jenis, index)
  return (
    <button
      onClick={onClick}
      aria-label={`Lihat detail ${jenis}`}
      className={`
        group relative overflow-hidden rounded-2xl bg-gradient-to-br ${st.grad}
        p-4 text-left text-white shadow-md ring-1 ${st.ring}
        transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:brightness-[1.03]
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2
        min-h-[132px] w-full
      `}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 transition-transform duration-300 group-hover:scale-125" aria-hidden />
      <div className="pointer-events-none absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-black/5" aria-hidden />

      <div className="relative flex h-full flex-col justify-between gap-3">
        <div className="flex items-start justify-between">
          <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
            <st.icon className="h-5 w-5" aria-hidden />
          </div>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm">
            {persenDariTotal.toFixed(0)}%
          </span>
        </div>
        <div>
          <p className="text-[13px] font-semibold leading-tight line-clamp-2 min-h-[2.2em]">{jenis}</p>
          <div className="mt-1.5 flex items-end justify-between">
            <p className="text-3xl font-extrabold leading-none tracking-tight">{angka(total)}</p>
            <p className="text-[10px] text-white/85 font-medium">orang</p>
          </div>
        </div>
      </div>
    </button>
  )
}

// ------------------- Dashboard SDMK -------------------

export default function DashboardSdmk({ onBukaAdmin }: { onBukaAdmin: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [nakes, setNakes] = useState<Nakes[]>([])
  const [loading, setLoading] = useState(true)
  const [pilihan, setPilihan] = useState<string | null>(null)

  useEffect(() => {
    let batal = false
    ;(async () => {
      try {
        const [r1, r2] = await Promise.all([fetch('/api/stats'), fetch('/api/nakes')])
        const j1 = await r1.json()
        const j2 = await r2.json()
        if (batal) return
        if (j1.total !== undefined) setStats(j1 as Stats)
        if (Array.isArray(j2.data)) setNakes(j2.data as Nakes[])
      } finally {
        if (!batal) setLoading(false)
      }
    })()
    return () => {
      batal = true
    }
  }, [])

  const idxPilihan = stats?.perJenis.findIndex((j) => j.jenisNakes === pilihan) ?? -1

  // data popup kategori terpilih
  const dataPilihan = useMemo(
    () => (pilihan ? nakes.filter((n) => n.jenisNakes === pilihan) : []),
    [nakes, pilihan]
  )
  const lakiPilihan = dataPilihan.filter((d) => d.jenisKelamin === 'L').length
  const barKecPilihan = useMemo(() => {
    const m = new Map<string, number>()
    for (const d of dataPilihan) m.set(d.kecamatan, (m.get(d.kecamatan) || 0) + 1)
    return Array.from(m, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [dataPilihan])

  const colsSdmk: Kolom[] = [
    { key: 'nama', label: 'Nama', render: (r) => <span className="font-medium">{String(r.nama)}</span> },
    { key: 'jenisKelamin', label: 'JK', render: (r) => (
      <Badge variant="outline" className={`${WARNA_JK[String(r.jenisKelamin)] || ''} text-[10px]`}>{String(r.jenisKelamin)}</Badge>
    ) },
    { key: 'tempatTugas', label: 'Tempat Tugas' },
    { key: 'status', label: 'Status', render: (r) => (
      <Badge variant="outline" className={`${WARNA_STATUS[String(r.status)] || ''} text-[10px]`}>{String(r.status)}</Badge>
    ) },
    { key: 'strBerlaku', label: 'STR s.d.', render: (r) => formatTanggal(r.strBerlaku ? String(r.strBerlaku) : null) },
  ]

  if (loading || !stats) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-14 w-80 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full space-y-8">
      <PageHeader
        icon={Users}
        judul="Dashboard SDMK"
        deskripsi="Pangkalan data induk seluruh tenaga kesehatan se-Kabupaten Kutai Kartanegara."
        aksen="from-emerald-400 to-teal-600"
      />

      {/* ===== Statistik utama ===== */}
      <section aria-label="Statistik utama" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total SDMK" value={angka(stats.total)} sub={`${angka(stats.perempuan)} perempuan • ${angka(stats.laki)} laki-laki`} icon={Users} cls="bg-emerald-50 text-emerald-700 border-emerald-200" />
        <StatCard label="Rasio per 1.000 Penduduk" value={stats.rasio.toFixed(2)} sub="Basis proyeksi penduduk Kukar" icon={Activity} cls="bg-teal-50 text-teal-700 border-teal-200" />
        <StatCard label="Kecamatan Terlayani" value={`${stats.jumlahKecamatan} / 18`} sub="Sebaran fasilitas di seluruh Kukar" icon={MapPin} cls="bg-amber-50 text-amber-700 border-amber-200" />
        <StatCard label="STR Kedaluwarsa ≤ 6 Bulan" value={angka(stats.strKedaluwarsa)} sub="Perlu tindak lanjut perpanjangan" icon={AlarmClock} cls="bg-rose-50 text-rose-700 border-rose-200" />
      </section>

      {/* ===== Barisan kartu kategori ===== */}
      <section aria-label="Distribusi jenis tenaga kesehatan">
        <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">Jenis Tenaga Kesehatan</h2>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <MousePointerClick className="h-4 w-4" aria-hidden />
              Klik kartu untuk melihat detail data dalam popup
            </p>
          </div>
          <Badge variant="outline" className="bg-white">{stats.perJenis.length} kategori</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {stats.perJenis.map((j, i) => (
            <KartuKategori
              key={j.jenisNakes}
              jenis={j.jenisNakes}
              index={i}
              total={j.total}
              persenDariTotal={stats.total ? (j.total / stats.total) * 100 : 0}
              onClick={() => setPilihan(j.jenisNakes)}
            />
          ))}
        </div>
      </section>

      {/* ===== Grafik ===== */}
      <section aria-label="Grafik sebaran" className="grid lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3">
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden />
              Sebaran SDMK per Kecamatan
              <span className="text-xs font-normal text-muted-foreground">(12 teratas)</span>
            </h3>
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={Math.max(260, Math.min(stats.perKecamatan.length, 12) * 32 + 20)}>
                <BarChart data={stats.perKecamatan.slice(0, 12)} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="kecamatan" width={130} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => [`${angka(Number(value))} orang`, 'Jumlah']} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="total" radius={[0, 8, 8, 0]} barSize={16}>
                    {stats.perKecamatan.slice(0, 12).map((_, i) => (
                      <Cell key={i} fill={WARNA_BATANG[i % WARNA_BATANG.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden /> Status Kepegawaian
              </h3>
              <div className="mt-2">
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie data={stats.perStatus} dataKey="total" nameKey="status" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0}>
                      {stats.perStatus.map((s) => (
                        <Cell key={s.status} fill={WARNA_PIE_STATUS[s.status] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${angka(Number(value))} orang`, String(name)]} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                    <Legend verticalAlign="bottom" height={28} formatter={(value) => <span className="text-xs">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" aria-hidden /> Fasilitas Tugas Terbanyak
              </h3>
              <div className="mt-3 space-y-2.5">
                {stats.perFasilitas.slice(0, 5).map((f) => {
                  const pct = stats.total ? (f.total / stats.total) * 100 : 0
                  return (
                    <div key={f.tempatTugas}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="truncate font-medium">{f.tempatTugas}</span>
                        <span className="shrink-0 ml-2 text-muted-foreground tabular-nums">{f.total}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-600" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ===== Pengantar Panel Admin ===== */}
      <section className="rounded-2xl border bg-gradient-to-r from-teal-50 to-emerald-50 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold">Kelola Data PANDA SDMK</h3>
          <p className="text-sm text-muted-foreground mt-0.5 max-w-xl">
            Tambah, ubah, atau hapus data tenaga kesehatan melalui Panel Admin. Perubahan langsung tampil pada dasbor.
          </p>
        </div>
        <button
          onClick={onBukaAdmin}
          className="shrink-0 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
        >
          Buka Panel Admin
        </button>
      </section>

      {/* ===== Popup detail kategori ===== */}
      {pilihan && (
        <DetailDialog
          open
          onOpenChange={(v) => !v && setPilihan(null)}
          judul={pilihan}
          deskripsi={styleForKategori(pilihan, Math.max(0, idxPilihan)).deskripsi}
          grad={styleForKategori(pilihan, Math.max(0, idxPilihan)).grad}
          icon={styleForKategori(pilihan, Math.max(0, idxPilihan)).icon}
          statistik={[
            { label: 'Total', value: angka(dataPilihan.length) },
            { label: 'Laki-laki', value: angka(lakiPilihan) },
            { label: 'Perempuan', value: angka(dataPilihan.length - lakiPilihan) },
            { label: 'Porsi Total SDMK', value: stats.total ? `${((dataPilihan.length / stats.total) * 100).toFixed(1)}%` : '0%' },
          ]}
          bar={barKecPilihan}
          barJudul="Sebaran per Kecamatan"
          barGrad={styleForKategori(pilihan, Math.max(0, idxPilihan)).grad}
          rows={dataPilihan as unknown as Record<string, unknown>[]}
          cols={colsSdmk}
        />
      )}
    </div>
  )
}
