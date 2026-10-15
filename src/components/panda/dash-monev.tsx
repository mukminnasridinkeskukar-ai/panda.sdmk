'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from 'recharts'
import { ClipboardCheck, type LucideIcon } from 'lucide-react'
import {
  type Monev, kategoriHasilMonev, warnaSkorMonev, WARNA_HASIL_MONEV, formatTanggal, countBy, PALET_DONUT,
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

const AKSEN = 'from-rose-400 to-pink-600'

export default function DashboardMonev() {
  const { data, loading } = useData<Monev>('/api/monev')
  const [popup, setPopup] = useState<PopupState | null>(null)

  const agg = useMemo(() => {
    const total = data.length
    const rataSkor = total ? Math.round(data.reduce((a, d) => a + d.skor, 0) / total) : 0
    const kurang = data.filter((d) => kategoriHasilMonev(d.skor) === 'Kurang')
    const baik = data.filter((d) => kategoriHasilMonev(d.skor) === 'Baik')
    const fasilitasUnik = new Set(data.map((d) => d.fasilitas))
    return { total, rataSkor, kurang, baik, jmlFasilitas: fasilitasUnik.size }
  }, [data])

  const donutHasil = useMemo(
    () => countBy(data, (d) => kategoriHasilMonev(d.skor)),
    [data]
  )
  const rataIndikator = useMemo(() => {
    const m = new Map<string, { total: number; n: number }>()
    for (const d of data) {
      const cur = m.get(d.indikator) || { total: 0, n: 0 }
      cur.total += d.skor
      cur.n++
      m.set(d.indikator, cur)
    }
    return Array.from(m, ([name, v]) => ({ name, value: Math.round(v.total / v.n) }))
  }, [data])
  const rataKecamatan = useMemo(() => {
    const m = new Map<string, { total: number; n: number }>()
    for (const d of data) {
      const cur = m.get(d.kecamatan) || { total: 0, n: 0 }
      cur.total += d.skor
      cur.n++
      m.set(d.kecamatan, cur)
    }
    return Array.from(m, ([name, v]) => ({ name, value: Math.round(v.total / v.n) })).sort((a, b) => b.value - a.value)
  }, [data])

  const cols: Kolom[] = [
    { key: 'fasilitas', label: 'Fasilitas', render: (r) => <span className="font-medium">{String(r.fasilitas)}</span> },
    { key: 'kecamatan', label: 'Kecamatan' },
    { key: 'indikator', label: 'Indikator' },
    { key: 'skor', label: 'Skor', render: (r) => {
      const skor = Number(r.skor)
      return (
        <div className="flex items-center gap-2 min-w-[120px]">
          <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${skor}%`, backgroundColor: warnaSkorMonev(skor) }} />
          </div>
          <span className="text-xs font-bold tabular-nums">{skor}</span>
        </div>
      )
    } },
    { key: 'hasil', label: 'Hasil', render: (r) => {
      const hasil = kategoriHasilMonev(Number(r.skor))
      return <Badge variant="outline" className={`${WARNA_HASIL_MONEV[hasil]} text-[10px]`}>{hasil}</Badge>
    } },
    { key: 'periode', label: 'Periode' },
  ]

  if (loading) return <div className="p-4 sm:p-6 lg:p-8"><LoadingDashboard jumlahKartu={4} /></div>

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full space-y-8">
      <PageHeader
        icon={ClipboardCheck}
        judul="Dashboard Monev"
        deskripsi="Monitoring dan evaluasi kinerja fasilitas kesehatan berbasis indikator mutu."
        aksen={AKSEN}
      />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Penilaian" value={agg.total.toLocaleString('id-ID')} sub={`${agg.jmlFasilitas} fasilitas dinilai`} icon={ClipboardCheck} cls="bg-rose-50 text-rose-700 border-rose-200"
          onClick={() => setPopup({ judul: 'Seluruh Hasil Monev', deskripsi: 'Semua penilaian monitoring & evaluasi', grad: AKSEN, icon: ClipboardCheck, rows: data as unknown as Record<string, unknown>[] })} />
        <StatCard label="Rata-rata Skor" value={agg.rataSkor} sub="Skala 0–100" icon={ClipboardCheck} cls="bg-teal-50 text-teal-700 border-teal-200" />
        <StatCard label="Kategori Baik" value={agg.baik.length.toLocaleString('id-ID')} sub="Skor ≥ 80" icon={ClipboardCheck} cls="bg-emerald-50 text-emerald-700 border-emerald-200"
          onClick={() => setPopup({ judul: 'Fasilitas Kategori Baik', deskripsi: 'Penilaian dengan skor ≥ 80', grad: 'from-emerald-400 to-teal-600', icon: ClipboardCheck, rows: agg.baik as unknown as Record<string, unknown>[] })} />
        <StatCard label="Perlu Perhatian" value={agg.kurang.length.toLocaleString('id-ID')} sub="Skor < 60, prioritas pembinaan" icon={ClipboardCheck} cls="bg-rose-50 text-rose-700 border-rose-200"
          onClick={() => setPopup({ judul: 'Fasilitas Kategori Kurang', deskripsi: 'Skor di bawah 60 — perlu pembinaan', grad: 'from-rose-400 to-red-600', icon: ClipboardCheck, rows: agg.kurang as unknown as Record<string, unknown>[] })} />
      </section>

      <section className="grid lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3">
          <CardContent className="p-4 sm:p-5">
            <h3 className="font-semibold text-sm mb-3">Rata-rata Skor per Kecamatan (10 Teratas)</h3>
            <ResponsiveContainer width="100%" height={Math.max(240, Math.min(rataKecamatan.length, 10) * 34)}>
              <BarChart data={rataKecamatan.slice(0, 10)} layout="vertical" margin={{ left: 8, right: 24 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => [`Skor ${v}`, 'Rata-rata']} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={16}>
                  {rataKecamatan.slice(0, 10).map((d, i) => (
                    <Cell key={i} fill={warnaSkorMonev(d.value)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-4 sm:p-5">
            <h3 className="font-semibold text-sm">Distribusi Hasil Penilaian</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={donutHasil} dataKey="value" nameKey="name" innerRadius={50} outerRadius={82} paddingAngle={3} strokeWidth={0}>
                  {donutHasil.map((d) => <Cell key={d.name} fill={warnaSkorMonev(d.name === 'Baik' ? 90 : d.name === 'Cukup' ? 70 : 50)} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend verticalAlign="bottom" height={24} formatter={(v) => <span className="text-xs">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold mb-3">Rata-rata Skor per Indikator Monev</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {rataIndikator.map((ind) => (
                <div key={ind.name} className="rounded-xl border p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: warnaSkorMonev(ind.value) }} aria-hidden />
                    <span className="text-lg font-extrabold tabular-nums">{ind.value}</span>
                  </div>
                  <p className="mt-2 text-xs font-medium leading-snug">{ind.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Daftar Penilaian Monev ({agg.total.toLocaleString('id-ID')})</h3>
            <Badge variant="outline" className="bg-white">Periode terbaru: S1 2026</Badge>
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
