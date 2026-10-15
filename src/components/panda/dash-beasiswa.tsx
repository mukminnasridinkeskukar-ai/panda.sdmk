'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend,
} from 'recharts'
import { GraduationCap, Globe2, Home, type LucideIcon } from 'lucide-react'
import {
  type Beasiswa, WARNA_STATUS_BEASISWA, WARNA_TUJUAN, WARNA_SUMBER_DANA, countBy, PALET_DONUT,
} from '@/lib/panda'
import { DetailDialog, Kolom, PageHeader, StatCard, TabelData, useData, LoadingDashboard } from './ui-bits'

interface PopupState {
  judul: string
  deskripsi: string
  grad: string
  icon: LucideIcon
  statistik?: { label: string; value: string | number }[]
  bar?: { name: string; value: number }[]
  rows: Record<string, unknown>[]
}

const AKSEN = 'from-violet-400 to-purple-600'

export default function DashboardBeasiswa() {
  const { data, loading } = useData<Beasiswa>('/api/beasiswa')
  const [popup, setPopup] = useState<PopupState | null>(null)

  const agg = useMemo(() => {
    const total = data.length
    const aktif = data.filter((d) => d.status === 'Aktif')
    const lulus = data.filter((d) => d.status === 'Lulus')
    const ln = data.filter((d) => d.tujuan === 'Luar Negeri')
    return { total, aktif, lulus, ln }
  }, [data])

  const perProgram = useMemo(() => countBy(data, (d) => d.program), [data])
  const perAngkatan = useMemo(() => {
    const arr = countBy(data, (d) => String(d.angkatan))
    return arr.sort((a, b) => a.name.localeCompare(b.name))
  }, [data])
  const donutDana = useMemo(() => countBy(data, (d) => d.sumberDana), [data])

  const cols: Kolom[] = [
    { key: 'nama', label: 'Nama', render: (r) => <span className="font-medium">{String(r.nama)}</span> },
    { key: 'program', label: 'Program', render: (r) => <Badge variant="outline" className="bg-violet-50 text-violet-800 border-violet-200 text-[10px]">{String(r.program)}</Badge> },
    { key: 'institusi', label: 'Institusi' },
    { key: 'tujuan', label: 'Tujuan', render: (r) => (
      <Badge variant="outline" className={`${WARNA_TUJUAN[String(r.tujuan)] || ''} text-[10px]`}>{String(r.tujuan)}</Badge>
    ) },
    { key: 'sumberDana', label: 'Dana', render: (r) => (
      <Badge variant="outline" className={`${WARNA_SUMBER_DANA[String(r.sumberDana)] || ''} text-[10px]`}>{String(r.sumberDana)}</Badge>
    ) },
    { key: 'angkatan', label: 'Angkatan' },
    { key: 'status', label: 'Status', render: (r) => (
      <Badge variant="outline" className={`${WARNA_STATUS_BEASISWA[String(r.status)] || ''} text-[10px]`}>{String(r.status)}</Badge>
    ) },
  ]

  if (loading) return <div className="p-4 sm:p-6 lg:p-8"><LoadingDashboard jumlahKartu={4} /></div>

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full space-y-8">
      <PageHeader
        icon={GraduationCap}
        judul="Dashboard Beasiswa"
        deskripsi="Program pengembangan SDMK melalui beasiswa studi lanjut dalam dan luar negeri."
        aksen={AKSEN}
      />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Penerima" value={agg.total.toLocaleString('id-ID')} sub="Sejak angkatan 2021" icon={GraduationCap} cls="bg-violet-50 text-violet-700 border-violet-200"
          onClick={() => setPopup({ judul: 'Seluruh Penerima Beasiswa', deskripsi: 'Total penerima beasiswa sejak 2021', grad: AKSEN, icon: GraduationCap, rows: data as unknown as Record<string, unknown>[] })} />
        <StatCard label="Aktif Studi" value={agg.aktif.length.toLocaleString('id-ID')} sub="Sedang menempuh studi" icon={GraduationCap} cls="bg-emerald-50 text-emerald-700 border-emerald-200"
          onClick={() => setPopup({ judul: 'Penerima Aktif Studi', deskripsi: 'Sedang menjalani studi', grad: 'from-emerald-400 to-teal-600', icon: GraduationCap, rows: agg.aktif as unknown as Record<string, unknown>[] })} />
        <StatCard label="Sudah Lulus" value={agg.lulus.length.toLocaleString('id-ID')} sub="Menyelesaikan studi" icon={GraduationCap} cls="bg-teal-50 text-teal-700 border-teal-200"
          onClick={() => setPopup({ judul: 'Penerima Lulus', deskripsi: 'Telah menyelesaikan studi', grad: 'from-teal-400 to-cyan-600', icon: GraduationCap, rows: agg.lulus as unknown as Record<string, unknown>[] })} />
        <StatCard label="Luar Negeri" value={agg.ln.length.toLocaleString('id-ID')} sub="Studi ke luar negeri" icon={Globe2} cls="bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200"
          onClick={() => setPopup({ judul: 'Beasiswa Luar Negeri', deskripsi: 'Penerima beasiswa studi di luar negeri', grad: 'from-fuchsia-400 to-pink-600', icon: Globe2, rows: agg.ln as unknown as Record<string, unknown>[] })} />
      </section>

      <section className="grid lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3">
          <CardContent className="p-4 sm:p-5">
            <h3 className="font-semibold text-sm mb-3">Penerima per Angkatan</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={perAngkatan} margin={{ top: 8, right: 16 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => [`${v} penerima`, 'Jumlah']} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={38}>
                  {perAngkatan.map((_, i) => <Cell key={i} fill={PALET_DONUT[i % PALET_DONUT.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-4 sm:p-5">
            <h3 className="font-semibold text-sm">Sumber Pembiayaan</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={donutDana} dataKey="value" nameKey="name" innerRadius={50} outerRadius={82} paddingAngle={3} strokeWidth={0}>
                  {donutDana.map((d, i) => <Cell key={d.name} fill={PALET_DONUT[i % PALET_DONUT.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend verticalAlign="bottom" height={24} formatter={(v) => <span className="text-xs">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Daftar Penerima Beasiswa ({agg.total.toLocaleString('id-ID')})</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                <Home className="h-3 w-3 mr-1" aria-hidden /> DN {agg.total - agg.ln.length}
              </Badge>
              <Badge variant="outline" className="bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200">
                <Globe2 className="h-3 w-3 mr-1" aria-hidden /> LN {agg.ln.length}
              </Badge>
            </div>
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
