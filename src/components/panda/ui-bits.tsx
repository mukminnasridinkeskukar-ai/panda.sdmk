'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'

// ------------------- Hook pengambil data -------------------

export function useData<T>(url: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [gagal, setGagal] = useState(false)

  const reload = useCallback(async () => {
    try {
      setGagal(false)
      const r = await fetch(url)
      const j = await r.json()
      setData(Array.isArray(j.data) ? (j.data as T[]) : [])
    } catch {
      setGagal(true)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    reload()
  }, [reload])

  return { data, loading, gagal, reload }
}

// ------------------- Kartu statistik (bisa diklik → popup) -------------------

export function StatCard({
  label, value, sub, icon: Icon, cls, onClick,
}: {
  label: string
  value: string | number
  sub?: string
  icon: LucideIcon
  cls: string
  onClick?: () => void
}) {
  const interaktif = !!onClick
  return (
    <Card
      role={interaktif ? 'button' : undefined}
      tabIndex={interaktif ? 0 : undefined}
      onKeyDown={interaktif ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick?.() : undefined}
      onClick={onClick}
      className={`border shadow-sm ${cls} ${interaktif ? 'cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-1' : ''}`}
      aria-label={interaktif ? `Lihat detail: ${label}` : label}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium opacity-80">{label}</p>
          {interaktif ? <ChevronRight className="h-4 w-4 opacity-60" aria-hidden /> : <Icon className="h-4 w-4 opacity-70" aria-hidden />}
        </div>
        <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight">{value}</p>
        {sub && <p className="mt-1 text-[11px] opacity-70 leading-snug">{sub}</p>}
      </CardContent>
    </Card>
  )
}

// ------------------- Loading skeleton -------------------

export function LoadingDashboard({ jumlahKartu = 4 }: { jumlahKartu?: number }) {
  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-2 lg:grid-cols-${jumlahKartu} gap-3 sm:gap-4`}>
        {Array.from({ length: jumlahKartu }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  )
}

// ------------------- Header halaman dashboard -------------------

export function PageHeader({
  icon: Icon, judul, deskripsi, aksen,
}: {
  icon: LucideIcon
  judul: string
  deskripsi: string
  aksen: string
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${aksen} text-white shadow-md`}>
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <div>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight">{judul}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{deskripsi}</p>
      </div>
    </div>
  )
}

// ------------------- Bar list horizontal -------------------

export function BarList({
  data, grad, max, batasTampil = 8,
}: {
  data: { name: string; value: number }[]
  grad: string
  max?: number
  batasTampil?: number
}) {
  if (data.length === 0) return <p className="text-sm text-muted-foreground">Belum ada data.</p>
  const maxVal = max ?? Math.max(1, ...data.map((d) => d.value))
  const tampil = data.slice(0, batasTampil)
  return (
    <div className="space-y-1.5">
      {tampil.map((d) => (
        <div key={d.name} className="flex items-center gap-3">
          <span className="w-40 shrink-0 truncate text-xs text-muted-foreground" title={d.name}>
            {d.name}
          </span>
          <div className="h-2.5 flex-1 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${grad}`}
              style={{ width: `${(d.value / maxVal) * 100}%` }}
            />
          </div>
          <span className="w-8 text-right text-xs font-semibold tabular-nums">{d.value}</span>
        </div>
      ))}
      {data.length > batasTampil && (
        <p className="text-[11px] text-muted-foreground pt-1">+{data.length - batasTampil} lainnya</p>
      )}
    </div>
  )
}

// ------------------- Tabel generik (di popup & halaman) -------------------

export interface Kolom {
  key: string
  label: string
  render?: (row: Record<string, unknown>) => ReactNode
  className?: string
}

export function TabelData({
  rows, cols, tinggiMaks = 'h-72',
}: {
  rows: Record<string, unknown>[]
  cols: Kolom[]
  tinggiMaks?: string
}) {
  return (
    <ScrollArea className={`${tinggiMaks} rounded-xl border`}>
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-muted/95 backdrop-blur z-10">
          <tr>
            {cols.map((c) => (
              <th key={c.key} className={`px-3 py-2 text-left font-semibold text-xs text-muted-foreground ${c.className || ''}`}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.length === 0 && (
            <tr>
              <td colSpan={cols.length} className="px-4 py-8 text-center text-muted-foreground">
                Tidak ada data.
              </td>
            </tr>
          )}
          {rows.map((row, i) => (
            <tr key={String(row['id'] ?? i)} className="hover:bg-muted/40">
              {cols.map((c) => (
                <td key={c.key} className={`px-3 py-2 align-middle ${c.className || ''}`}>
                  {c.render ? c.render(row) : String(row[c.key] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  )
}

// ------------------- Popup detail (dipakai semua dashboard) -------------------

export function DetailDialog({
  open, onOpenChange, judul, deskripsi, grad, icon: Icon, statistik, bar, barJudul, barGrad, rows, cols,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  judul: string
  deskripsi?: string
  grad: string
  icon: LucideIcon
  statistik?: { label: string; value: string | number }[]
  bar?: { name: string; value: number }[]
  barJudul?: string
  barGrad?: string
  rows: Record<string, unknown>[]
  cols: Kolom[]
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl max-h-[88vh] overflow-y-auto p-0 gap-0">
        <div className={`bg-gradient-to-br ${grad} text-white px-6 pt-6 pb-5`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-white">{judul}</DialogTitle>
                <DialogDescription className="text-white/85 text-sm">
                  {deskripsi || 'Detail data'}
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-extrabold leading-none">{rows.length.toLocaleString('id-ID')}</p>
              <p className="text-xs text-white/85 mt-1">data</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {statistik && statistik.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {statistik.map((s) => (
                <div key={s.label} className="rounded-xl border bg-white p-3">
                  <p className="text-[11px] text-muted-foreground font-medium truncate">{s.label}</p>
                  <p className="mt-1 text-lg font-bold">{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {bar && bar.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">{barJudul || 'Sebaran'}</h4>
              <BarList data={bar} grad={barGrad || grad} />
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold mb-2">Daftar Data ({rows.length.toLocaleString('id-ID')})</h4>
            <TabelData rows={rows} cols={cols} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
