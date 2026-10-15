'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from 'recharts'
import { Award, Clock, FileBadge, Users, type LucideIcon } from 'lucide-react'
import { type Kompetensi, WARNA_SERTIFIKAT, countBy, sumBy, PALET_DONUT } from '@/lib/panda'
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

const AKSEN = 'from-orange-400 to-red-500'

export default function DashboardKompetensi() {
  const { data, loading } = useData<Kompetensi>('/api/kompetensi')
  const [popup, setPopup] = useState<PopupState | null>(null)

  const agg = useMemo(() => {
    const total = data.length
    const nakesUnik = new Set(data.map((d) => d.nama)).size
    const totalJam = sumBy(data, (d) => d.jamPelatihan)
    const bersertifikat = data.filter((d) => d.sertifikat === 'Ya')
    return { total, nakesUnik, totalJam, bersertifikat }
  }, [data])

  const topPelatihan = useMemo(() => countBy(data, (d) => d.namaPelatihan), [data])
  const perTahun = useMemo(() => {
    const arr = countBy(data, (d) => String(d.tahun))
    return arr.sort((a, b) => a.name.localeCompare(b.name))
  }, [data])
  const donutSertifikat = useMemo(() => countBy(data, (d) => d.sertifikat), [data])
  const donutKegiatan = useMemo(() => countBy(data, (d) => d.jenisKegiatan), [data])

  const cols: Kolom[] = [
    { key: 'nama', label: 'Nama', render: (r) => <span className="font-medium">{String(r.nama)}</span> },
    { key: 'namaPelatihan', label: 'Pelatihan' },
    { key: 'jenisKegiatan', label: 'Jenis', render: (r) => <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200 text-[10px]">{String(r.jenisKegiatan)}</Badge> },
    { key: 'penyelenggara', label: 'Penyelenggara' },
    { key: 'jamPelatihan', label: 'Jam', render: (r) => <span className="tabular-nums">{Number(r.jamPelatihan)}</span> },
    { key: 'tahun', label: 'Tahun', render: (r) => <span className="tabular-nums">{Number(r.tahun)}</span> },
    { key: 'sertifikat', label: 'Sertifikat', render: (r) => (
      <Badge variant="outline" className={`${WARNA_SERTIFIKAT[String(r.sertifikat)] || ''} text-[10px]`}>{String(r.sertifikat)}</Badge>
    ) },
  ]

  if (loading) return <div className="p-4 sm:p-6 lg:p-8"><LoadingDashboard jumlahKartu={4} /></div>

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full space-y-8">
      <PageHeader
        icon={Award}
        judul="Dashboard Kompetensi"
        deskripsi="Pembinaan kompetensi melalui pelatihan, workshop, bimtek, dan sertifikasi nakes."
        aksen={AKSEN}
      />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Partisipasi" value={agg.total.toLocaleString('id-ID')} sub="Seluruh kegiatan terdata" icon={Award} cls="bg-orange-50 text-orange-700 border-orange-200"
          onClick={() => setPopup({ judul: 'Seluruh Kegiatan Kompetensi', deskripsi: 'Total partisipasi kegiatan peningkatan kompetensi', grad: AKSEN, icon: Award, rows: data as unknown as Record<string, unknown>[] })} />
        <StatCard label="Nakes Terlatih" value={agg.nakesUnik.toLocaleString('id-ID')} sub="Partisipan unik (orang)" icon={Users} cls="bg-teal-50 text-teal-700 border-teal-200" />
        <StatCard label="Akumulasi Jam" value={agg.totalJam.toLocaleString('id-ID')} sub="Total jam pelatihan" icon={Clock} cls="bg-amber-50 text-amber-700 border-amber-200" />
        <StatCard label="Sertifikat Terbit" value={agg.bersertifikat.length.toLocaleString('id-ID')} sub={`${agg.total ? Math.round((agg.bersertifikat.length / agg.total) * 100) : 0}% dari total kegiatan`} icon={FileBadge} cls="bg-emerald-50 text-emerald-700 border-emerald-200"
          onClick={() => setPopup({ judul: 'Partisipan Bersertifikat', deskripsi: 'Kegiatan dengan sertifikat terbit', grad: 'from-emerald-400 to-teal-600', icon: FileBadge, rows: agg.bersertifikat as unknown as Record<string, unknown>[] })} />
      </section>

      <section className="grid lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3">
          <CardContent className="p-4 sm:p-5">
            <h3 className="font-semibold text-sm mb-3">Pelatihan Terpopuler (8 Teratas)</h3>
            <ResponsiveContainer width="100%" height={Math.max(250, Math.min(topPelatihan.length, 8) * 34)}>
              <BarChart data={topPelatihan.slice(0, 8)} layout="vertical" margin={{ left: 8, right: 24 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => [`${v} partisipan`, 'Jumlah']} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={16}>
                  {topPelatihan.slice(0, 8).map((_, i) => <Cell key={i} fill={PALET_DONUT[i % PALET_DONUT.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4 sm:p-5">
              <h3 className="font-semibold text-sm">Sertifikat Terbit</h3>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={donutSertifikat} dataKey="value" nameKey="name" innerRadius={42} outerRadius={68} paddingAngle={3} strokeWidth={0}>
                    {donutSertifikat.map((d) => <Cell key={d.name} fill={d.name === 'Ya' ? '#10b981' : '#f43f5e'} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Legend verticalAlign="bottom" height={20} formatter={(v) => <span className="text-xs">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <h3 className="font-semibold text-sm mb-2">Partisipasi per Tahun</h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={perTahun} margin={{ top: 4, right: 8 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} hide />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => [`${v} kegiatan`, 'Jumlah']} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={26}>
                    {perTahun.map((_, i) => <Cell key={i} fill={PALET_DONUT[i % PALET_DONUT.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Daftar Kegiatan Kompetensi ({agg.total.toLocaleString('id-ID')})</h3>
            <Badge variant="outline" className="bg-white">{donutKegiatan.length} jenis kegiatan</Badge>
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
