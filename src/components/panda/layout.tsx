'use client'

import { useState, type ReactNode } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  Users, FileCheck, GraduationCap, ClipboardCheck, BadgeCheck, Award,
  Settings2, Database, Menu, MapPinned,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type ViewKey = 'sdmk' | 'izin' | 'beasiswa' | 'monev' | 'kredensial' | 'kompetensi' | 'admin'

export interface MenuDef {
  key: ViewKey
  label: string
  pendek: string
  icon: LucideIcon
  titik: string // warna titik indikator
  desc: string
}

export const MENU_DASBOR: MenuDef[] = [
  { key: 'sdmk', label: 'Dashboard SDMK', pendek: 'SDMK', icon: Users, titik: 'bg-emerald-400', desc: 'Pangkalan data tenaga kesehatan se-Kabupaten Kutai Kartanegara' },
  { key: 'izin', label: 'Dashboard Izin Praktik', pendek: 'Izin Praktik', icon: FileCheck, titik: 'bg-amber-400', desc: 'Monitoring Surat Izin Praktik (SIP) tenaga kesehatan' },
  { key: 'beasiswa', label: 'Dashboard Beasiswa', pendek: 'Beasiswa', icon: GraduationCap, titik: 'bg-violet-400', desc: 'Penerima dan progres program beasiswa SDMK' },
  { key: 'monev', label: 'Dashboard Monev', pendek: 'Monev', icon: ClipboardCheck, titik: 'bg-rose-400', desc: 'Monitoring & evaluasi kinerja fasilitas kesehatan' },
  { key: 'kredensial', label: 'Dashboard Kredensial', pendek: 'Kredensial', icon: BadgeCheck, titik: 'bg-cyan-400', desc: 'Kredensial dan privilegium tenaga medis' },
  { key: 'kompetensi', label: 'Dashboard Kompetensi', pendek: 'Kompetensi', icon: Award, titik: 'bg-orange-400', desc: 'Pelatihan, workshop, dan sertifikasi kompetensi' },
]

function isiTanggal() {
  try {
    return new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-5 py-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
        <Database className="h-5 w-5 text-white" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-extrabold text-white tracking-tight leading-none">PANDA SDMK</p>
        <p className="text-[10px] text-white/60 leading-tight mt-1">Dinas Kesehatan Kutai Kartanegara</p>
      </div>
    </div>
  )
}

function DaftarMenu({
  view, pilih, onNavigasi,
}: {
  view: ViewKey
  pilih: (v: ViewKey) => void
  onNavigasi?: () => void
}) {
  const klik = (v: ViewKey) => {
    pilih(v)
    onNavigasi?.()
  }
  return (
    <nav aria-label="Menu dasbor" className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
      <p className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-widest text-white/40">MENU DASBOR</p>
      {MENU_DASBOR.map((m) => {
        const aktif = view === m.key
        return (
          <button
            key={m.key}
            onClick={() => klik(m.key)}
            aria-current={aktif ? 'page' : undefined}
            className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
              aktif
                ? 'bg-white text-teal-950 font-semibold shadow-md'
                : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className={`h-2 w-2 shrink-0 rounded-full ${m.titik} ${aktif ? '' : 'opacity-70'}`} aria-hidden />
            <m.icon className="h-4 w-4 shrink-0" aria-hidden />
            <span className="truncate">{m.pendek}</span>
          </button>
        )
      })}
      <div className="!mt-5 pt-3 border-t border-white/10">
        <p className="px-3 pb-1 text-[10px] font-bold tracking-widest text-white/40">ADMINISTRASI</p>
        <button
          onClick={() => klik('admin')}
          aria-current={view === 'admin' ? 'page' : undefined}
          className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
            view === 'admin'
              ? 'bg-white text-teal-950 font-semibold shadow-md'
              : 'text-white/75 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Settings2 className="h-4 w-4 shrink-0" aria-hidden />
          <span className="truncate">Panel Admin</span>
        </button>
      </div>
    </nav>
  )
}

export function AppLayout({
  view, onView, children,
}: {
  view: ViewKey
  onView: (v: ViewKey) => void
  children: ReactNode
}) {
  const [drawer, setDrawer] = useState(false)
  const aktif = MENU_DASBOR.find((m) => m.key === view)
  const tanggal = isiTanggal()

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/70 via-white to-emerald-50/40">
      {/* ===== Sidebar desktop ===== */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-teal-950 via-emerald-950 to-teal-900 shadow-xl">
        <Brand />
        <DaftarMenu view={view} pilih={onView} />
        <div className="px-5 py-4 border-t border-white/10">
          <p className="flex items-center gap-1.5 text-[10px] text-white/50">
            <MapPinned className="h-3 w-3" aria-hidden /> Tenggarong, Kaltim
          </p>
        </div>
      </aside>

      {/* ===== Kolom konten ===== */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Header mobile */}
        <header className="lg:hidden sticky top-0 z-40 bg-gradient-to-r from-teal-950 via-emerald-950 to-teal-900 text-white shadow-lg">
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <Sheet open={drawer} onOpenChange={setDrawer}>
                <SheetTrigger asChild>
                  <button
                    aria-label="Buka menu"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <Menu className="h-5 w-5" aria-hidden />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 bg-gradient-to-b from-teal-950 via-emerald-950 to-teal-900 border-white/10">
                  <SheetHeader className="p-0">
                    <SheetTitle asChild>
                      <div>
                        <Brand />
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <DaftarMenu view={view} pilih={onView} onNavigasi={() => setDrawer(false)} />
                </SheetContent>
              </Sheet>
              <div className="min-w-0">
                <p className="text-sm font-extrabold leading-none truncate">PANDA SDMK</p>
                <p className="text-[10px] text-white/60 leading-tight mt-0.5 truncate">
                  {aktif ? aktif.label : 'Panel Admin'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Header desktop */}
        <div className="hidden lg:flex items-center justify-between gap-4 border-b bg-white/70 backdrop-blur px-8 py-3.5 sticky top-0 z-30">
          <div className="min-w-0">
            <h1 className="text-sm font-bold tracking-tight truncate">
              {aktif ? aktif.label : 'Panel Admin'}
            </h1>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
              {aktif ? aktif.desc : 'Kelola seluruh data PANDA SDMK'}
            </p>
          </div>
          <p className="shrink-0 text-[11px] text-muted-foreground">{tanggal}</p>
        </div>

        <main className="flex-1">{children}</main>

        <footer className="border-t bg-white">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5" aria-hidden />
              PANDA SDMK © {new Date().getFullYear()} Dinas Kesehatan Kabupaten Kutai Kartanegara
            </p>
            <p className="flex items-center gap-1.5">
              <MapPinned className="h-3.5 w-3.5" aria-hidden /> Tenggarong, Kalimantan Timur
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
