'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { BadgeCheck, type LucideIcon } from 'lucide-react'
import {
  type Kredensial, WARNA_STATUS_KREDENSIAL, WARNA_JENIS_KREDENSIAL, formatTanggal, countBy, PALET_DONUT,
} from '@/lib/panda'
import { DetailDialog, Kolom, PageHeader, StatCard, TabelData, useData, LoadingDashboard, BarList } from './ui-bits'

interface PopupState {
  judul: string
  deskripsi: string
  grad: string
  icon: LucideIcon
  statistik?: { label: string; value: string | number }[]
  bar?: { name: string; value: number }[]
  rows: Record<string, unknown>[]
}

const AKSEN = 'from-cyan-400 to-teal-600'

export default function DashboardKredensial() {
  const { data, loading } = useData<Kredensial>('/api/kredensial')
  const [popup, setPopup] = useState<PopupState | null>(null)

  const agg = useMemo(() => {
    const total = data.length
    const disetujui = data.filter((d) => d.status === 'Disetujui')
    const proses = data.filter((d) => d.status === 'Dalam Proses')
    const revisi = data.filter((d) => d.status === 'Perlu Revisi')
    const priv = data.filter((d) => d.jenisKredensial === 'Privilegium')
    return { total, disetujui, proses, revisi, priv }
  }, [data])

  const donutStatus = useMemo(() => countBy(data, (d) => d.status), [data])
  const donutJenis = useMemo(() => countBy(data, (d) => d.jenisKredensial), [data])
  const barFasilitas = useMemo(() => countBy(data, (d) => d.fasilitas), [data])

  const cols: Kolom[] = [
    { key: 'nama', label: 'Nama', render: (r) => <span className="font-medium">{String(r.nama)}</span> },
    { key: 'jenisKredensial', label: 'Jenis', render: (r) => (
      <Badge variant="outline" className={`${WARNA_JENIS_KREDENSIAL[String(r.jenisKredensial)] || ''} text-[10px]`}>
        {String(r.jenisKredensial)}{r.tingkat ? ` (${String(r.tingkat)})` : ''}
      </Badge>
    ) },
    { key: 'fasilitas', label: 'Fasilitas' },
    { key: 'status', label: 'Status', render: (r) => (
      <Badge variant="outline" className={`${WARNA_STATUS_KREDENSIAL[String(r.status)] || ''} text-[10px]`}>{String(r.status)}</Badge>
    ) },
    { key: 'tanggalPengajuan', label: 'Pengajuan', render: (r) => formatTanggal(r.tanggalPengajuan ? String(r.tanggalPengajuan) : null) },
    { key: 'berlakuSampai', label: 'Berlaku s.d.', render: (r) => formatTanggal(r.berlakuSampai ? String(r.berlakuSampai) : null) },
  ]

  if (loading) return <div className="p-4 sm:p-6 lg:p-8"><LoadingDashboard jumlahKartu={4} /></div>

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full space-y-8">
      <PageHeader
        icon={BadgeCheck}
        judul="Dashboard Kredensial"
        deskripsi="Verifikasi kredensial dan privilegium tenaga medis sesuai kompetensi dan kewenangan."
        aksen={AKSEN}
      />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Pengajuan" value={agg.total.toLocaleString('id-ID')} sub="Primary, ongoing & privilegium" icon={BadgeCheck} cls="bg-cyan-50 text-cyan-700 border-cyan-200"
          onClick={() => setPopup({ judul: 'Seluruh Pengajuan Kredensial', deskripsi: 'Semua pengajuan kredensial terdata', grad: AKSEN, icon: BadgeCheck, rows: data as unknown as Record<string, unknown>[] })} />
        <StatCard label="Disetujui" value={agg.disetujui.length.toLocaleString('id-ID')} sub="Memenuhi standar profil keprofesian" icon={BadgeCheck} cls="bg-emerald-50 text-emerald-700 border-emerald-200"
          onClick={() => setPopup({ judul: 'Kredensial Disetujui', deskripsi: 'Pengajuan yang telah disetujui komite', grad: 'from-emerald-400 to-teal-600', icon: BadgeCheck, rows: agg.disetujui as unknown as Record<string, unknown>[] })} />
        <StatCard label="Dalam Proses" value={agg.proses.length.toLocaleString('id-ID')} sub="Menunggu verifikasi komite" icon={BadgeCheck} cls="bg-amber-50 text-amber-700 border-amber-200"
          onClick={() => setPopup({ judul: 'Kredensial Dalam Proses', deskripsi: 'Menunggu verifikasi & penilaian', grad: 'from-amber-400 to-orange-600', icon: BadgeCheck, rows: agg.proses as unknown as Record<string, unknown>[] })} />
        <StatCard label="Perlu Revisi" value={agg.revisi.length.toLocaleString('id-ID')} sub="Berkas belum lengkap / revisi" icon={BadgeCheck} cls="bg-orange-50 text-orange-700 border-orange-200"
          onClick={() => setPopup({ judul: 'Kredensial Perlu Revisi', deskripsi: 'Perlu perbaikan berkas oleh pemohon', grad: 'from-orange-400 to-red-600', icon: BadgeCheck, rows: agg.revisi as unknown as Record<string, unknown>[] })} />
      </section>

      <section className="grid lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <h3 className="font-semibold text-sm">Status Kredensial</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={donutStatus} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3} strokeWidth={0}>
                  {donutStatus.map((d, i) => <Cell key={d.name} fill={PALET_DONUT[i % PALET_DONUT.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend verticalAlign="bottom" height={24} formatter={(v) => <span className="text-xs">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <h3 className="font-semibold text-sm">Jenis Kredensial</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={donutJenis} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3} strokeWidth={0}>
                  {donutJenis.map((d, i) => <Cell key={d.name} fill={PALET_DONUT[(i + 3) % PALET_DONUT.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend verticalAlign="bottom" height={24} formatter={(v) => <span className="text-xs">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <h3 className="font-semibold text-sm mb-3">Fasilitas Terbanyak</h3>
            <BarList data={barFasilitas} grad={AKSEN} batasTampil={7} />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Daftar Kredensial ({agg.total.toLocaleString('id-ID')})</h3>
            <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
              Privilegium: {agg.priv.length}
            </Badge>
          </div>
          <TabelData rows={data as unknown as Record<string, unknown>[]} cols={cols} tinggiMaks="h-96" />
        </CardContent>
      </Card>

      {popup && (
        <DetailDialog
          open
          onOpenChange={(v) => !v && setPopup(null)}
          judul={popup.judul}
          deskripsi={popup.deskripsi}
          grad={popup.grad}
          icon={popup.icon}
          statistik={popup.statistik}
          bar={popup.bar}
          rows={popup.rows}
          cols={cols}
        />
      )}
    </div>
  )
}
