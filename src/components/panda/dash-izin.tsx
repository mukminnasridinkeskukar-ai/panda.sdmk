'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
} from 'recharts'
import { FileCheck, type LucideIcon } from 'lucide-react'
import {
  type IzinPraktik, WARNA_STATUS_IZIN, WARNA_JENIS_IZIN, formatTanggal, countBy, PALET_DONUT,
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

const AKSEN = 'from-amber-400 to-orange-600'

export default function DashboardIzin() {
  const { data, loading } = useData<IzinPraktik>('/api/izin-praktik')
  const [popup, setPopup] = useState<PopupState | null>(null)

  const tahunIni = new Date().getFullYear()

  const agg = useMemo(() => {
    const total = data.length
    const aktif = data.filter((d) => d.statusIzin === 'Aktif')
    const proses = data.filter((d) => d.statusIzin === 'Dalam Proses')
    const kedaluwarsa = data.filter((d) => d.statusIzin === 'Kedaluwarsa')
    const baru = data.filter((d) => d.jenisIzin === 'Baru' && d.tanggalTerbit && new Date(d.tanggalTerbit).getFullYear() === tahunIni)
    return { total, aktif, proses, kedaluwarsa, baru }
  }, [data, tahunIni])

  const donutStatus = useMemo(() => countBy(data, (d) => d.statusIzin), [data])
  const donutJenis = useMemo(() => countBy(data, (d) => d.jenisIzin), [data])
  const barKec = useMemo(() => countBy(data, (d) => d.kecamatan), [data])

  const cols: Kolom[] = [
    { key: 'nama', label: 'Nama', render: (r) => <span className="font-medium">{String(r.nama)}</span> },
    { key: 'noSip', label: 'No. SIP', render: (r) => String(r.noSip ?? '-') },
    { key: 'jenisIzin', label: 'Jenis', render: (r) => (
      <Badge variant="outline" className={`${WARNA_JENIS_IZIN[String(r.jenisIzin)] || ''} text-[10px]`}>{String(r.jenisIzin)}</Badge>
    ) },
    { key: 'fasilitas', label: 'Fasilitas' },
    { key: 'statusIzin', label: 'Status', render: (r) => (
      <Badge variant="outline" className={`${WARNA_STATUS_IZIN[String(r.statusIzin)] || ''} text-[10px]`}>{String(r.statusIzin)}</Badge>
    ) },
    { key: 'tanggalBerlaku', label: 'Berlaku s.d.', render: (r) => formatTanggal(r.tanggalBerlaku ? String(r.tanggalBerlaku) : null) },
  ]

  if (loading) return <div className="p-4 sm:p-6 lg:p-8"><LoadingDashboard jumlahKartu={4} /></div>

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full space-y-8">
      <PageHeader
        icon={FileCheck}
        judul="Dashboard Izin Praktik"
        deskripsi="Pemantauan Surat Izin Praktik (SIP) tenaga kesehatan di seluruh fasilitas Kabupaten Kutai Kartanegara."
        aksen={AKSEN}
      />

      {/* Statistik utama — klik kartu untuk detail */}
      <section aria-label="Statistik izin praktik" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Izin Terdata" value={agg.total.toLocaleString('id-ID')} sub="Seluruh riwayat SIP" icon={FileCheck} cls="bg-amber-50 text-amber-700 border-amber-200"
          onClick={() => setPopup({ judul: 'Semua Data Izin Praktik', deskripsi: 'Seluruh riwayat izin praktik terdata', grad: AKSEN, icon: FileCheck, rows: data as unknown as Record<string, unknown>[] })} />
        <StatCard label="SIP Aktif" value={agg.aktif.length.toLocaleString('id-ID')} sub="Masih dalam masa berlaku" icon={FileCheck} cls="bg-emerald-50 text-emerald-700 border-emerald-200"
          onClick={() => setPopup({ judul: 'SIP Aktif', deskripsi: 'Tenaga kesehatan dengan izin aktif', grad: 'from-emerald-400 to-teal-600', icon: FileCheck, rows: agg.aktif as unknown as Record<string, unknown>[] })} />
        <StatCard label="Dalam Proses" value={agg.proses.length.toLocaleString('id-ID')} sub="Menunggu persetujuan" icon={FileCheck} cls="bg-orange-50 text-orange-700 border-orange-200"
          onClick={() => setPopup({ judul: 'Pengajuan Dalam Proses', deskripsi: 'Sedang menunggu penerbitan / perpanjangan', grad: 'from-orange-400 to-amber-600', icon: FileCheck, rows: agg.proses as unknown as Record<string, unknown>[] })} />
        <StatCard label="SIP Kedaluwarsa" value={agg.kedaluwarsa.length.toLocaleString('id-ID')} sub="Perlu tindak lanjut" icon={FileCheck} cls="bg-rose-50 text-rose-700 border-rose-200"
          onClick={() => setPopup({ judul: 'SIP Kedaluwarsa', deskripsi: 'Perlu perpanjangan atau tindak lanjut administrasi', grad: 'from-rose-400 to-red-600', icon: FileCheck, rows: agg.kedaluwarsa as unknown as Record<string, unknown>[] })} />
      </section>

      {/* Grafik */}
      <section className="grid lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <h3 className="font-semibold text-sm">Status Izin</h3>
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
            <h3 className="font-semibold text-sm">Jenis Pengajuan</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={donutJenis} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3} strokeWidth={0}>
                  {donutJenis.map((d, i) => <Cell key={d.name} fill={PALET_DONUT[(i + 2) % PALET_DONUT.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend verticalAlign="bottom" height={24} formatter={(v) => <span className="text-xs">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <h3 className="font-semibold text-sm mb-3">Sebaran per Kecamatan</h3>
            <BarList data={barKec} grad={AKSEN} batasTampil={7} />
          </CardContent>
        </Card>
      </section>

      {/* Tabel lengkap */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Daftar Izin Praktik ({agg.total.toLocaleString('id-ID')})</h3>
            <Badge variant="outline" className="bg-white">{agg.baru.length} izin baru tahun {tahunIni}</Badge>
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
