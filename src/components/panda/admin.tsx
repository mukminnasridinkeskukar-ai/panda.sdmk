'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Lock, Plus, RefreshCw, LogOut, Database, Tags } from 'lucide-react'
import { SEMUA_TAB } from './admin-config'
import AdminCrud from './admin-crud'
import { useData, LoadingDashboard } from './ui-bits'
import type { Nakes, IzinPraktik, Beasiswa, Monev, Kredensial, Kompetensi } from '@/lib/panda'

export default function AdminPanel() {
  const { toast } = useToast()
  const [authed, setAuthed] = useState(false)
  const [dialogPass, setDialogPass] = useState(false)
  const [pass, setPass] = useState('')
  const [passLoading, setPassLoading] = useState(false)

  const nakes = useData<Nakes>('/api/nakes')
  const izin = useData<IzinPraktik>('/api/izin-praktik')
  const beasiswa = useData<Beasiswa>('/api/beasiswa')
  const monev = useData<Monev>('/api/monev')
  const kredensial = useData<Kredensial>('/api/kredensial')
  const kompetensi = useData<Kompetensi>('/api/kompetensi')

  const [kategoriList, setKategoriList] = useState<string[]>([])
  const [kategoriBaru, setKategoriBaru] = useState('')

  const muatSemua = () => {
    nakes.reload(); izin.reload(); beasiswa.reload(); monev.reload(); kredensial.reload(); kompetensi.reload()
  }

  const muatKategori = async () => {
    try {
      const r = await fetch('/api/kategori')
      const j = await r.json()
      if (Array.isArray(j.data)) setKategoriList(j.data.map((k: { nama: string }) => k.nama))
    } catch {
      // diam
    }
  }

  useEffect(() => {
    muatKategori()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('panda_admin') === '1') {
      setAuthed(true)
    }
  }, [])

  async function verifikasi() {
    setPassLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass }),
      })
      if (res.ok) {
        setAuthed(true)
        sessionStorage.setItem('panda_admin', '1')
        setDialogPass(false)
        setPass('')
        toast({ title: 'Berhasil masuk', description: 'Selamat datang di Panel Admin PANDA SDMK.' })
      } else {
        toast({ title: 'Password salah', description: 'Silakan coba lagi.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Gagal terhubung ke server', variant: 'destructive' })
    } finally {
      setPassLoading(false)
    }
  }

  function keluar() {
    setAuthed(false)
    sessionStorage.removeItem('panda_admin')
    toast({ title: 'Anda telah keluar dari Panel Admin.' })
  }

  async function tambahKategori() {
    if (!kategoriBaru.trim()) return
    try {
      const res = await fetch('/api/kategori', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: kategoriBaru.trim() }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Gagal menambah kategori')
      toast({ title: 'Kategori ditambahkan', description: kategoriBaru.trim() })
      setKategoriBaru('')
      muatKategori()
    } catch (e) {
      toast({ title: 'Gagal menambah kategori', description: e instanceof Error ? e.message : undefined, variant: 'destructive' })
    }
  }

  // ===== Gate password =====
  if (!authed) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto w-full">
        <Card className="max-w-md mx-auto border-dashed">
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
              <Lock className="h-7 w-7" aria-hidden />
            </div>
            <h2 className="mt-4 text-lg font-bold">Panel Admin Terkunci</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Masukkan password admin untuk mengelola seluruh data PANDA SDMK (6 dashboard).
            </p>
            <Button className="mt-5 bg-teal-700 hover:bg-teal-800 w-full" onClick={() => setDialogPass(true)}>
              Masuk sebagai Admin
            </Button>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Default demo: <code className="rounded bg-muted px-1.5 py-0.5">kukar123</code> — ubah lewat env <code>ADMIN_PASSWORD</code>
            </p>
          </CardContent>
        </Card>

        <Dialog open={dialogPass} onOpenChange={setDialogPass}>
          <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Verifikasi Admin</DialogTitle>
              <DialogDescription>Masukkan password untuk membuka panel admin.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="pass">Password</Label>
              <Input
                id="pass"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && verifikasi()}
                placeholder="••••••••"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogPass(false)}>Batal</Button>
              <Button className="bg-teal-700 hover:bg-teal-800" onClick={verifikasi} disabled={passLoading || !pass}>
                {passLoading ? 'Memeriksa…' : 'Masuk'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // ===== Panel aktif =====
  const memuat = nakes.loading || izin.loading || beasiswa.loading || monev.loading || kredensial.loading || kompetensi.loading
  if (memuat && nakes.data.length === 0) {
    return <div className="p-4 sm:p-6 lg:p-8"><LoadingDashboard jumlahKartu={4} /></div>
  }

  const dataTab: Record<string, Record<string, unknown>[]> = {
    nakes: nakes.data as unknown as Record<string, unknown>[],
    'izin-praktik': izin.data as unknown as Record<string, unknown>[],
    beasiswa: beasiswa.data as unknown as Record<string, unknown>[],
    monev: monev.data as unknown as Record<string, unknown>[],
    kredensial: kredensial.data as unknown as Record<string, unknown>[],
    kompetensi: kompetensi.data as unknown as Record<string, unknown>[],
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full">
      <Tabs defaultValue="nakes">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <TabsList className="h-auto flex-wrap">
            <TabsTrigger value="nakes" className="gap-1.5">
              <Database className="h-4 w-4" aria-hidden /> Data Nakes
            </TabsTrigger>
            {SEMUA_TAB.filter((t) => t.key !== 'nakes').map((t) => (
              <TabsTrigger key={t.key} value={t.key}>{t.judul}</TabsTrigger>
            ))}
            <TabsTrigger value="kategori" className="gap-1.5">
              <Tags className="h-4 w-4" aria-hidden /> Kategori
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={muatSemua}>
              <RefreshCw className="h-4 w-4" aria-hidden /> Muat Ulang
            </Button>
            <Button variant="outline" size="sm" onClick={keluar}>
              <LogOut className="h-4 w-4" aria-hidden /> Keluar
            </Button>
          </div>
        </div>

        {SEMUA_TAB.map((t) => (
          <TabsContent key={t.key} value={t.key}>
            <AdminCrud tab={t} rows={dataTab[t.key] || []} kategoriList={kategoriList} onChanged={muatSemua} />
          </TabsContent>
        ))}

        <TabsContent value="kategori">
          <Card>
            <CardContent className="p-4 sm:p-5 space-y-4">
              <div>
                <h3 className="font-semibold">Kelola Kategori Jenis Nakes</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Kategori baru akan otomatis muncul sebagai kartu berwarna pada Dashboard SDMK.
                </p>
              </div>
              <div className="flex gap-2 max-w-md">
                <Input
                  placeholder="Contoh: Nutrisionis"
                  value={kategoriBaru}
                  onChange={(e) => setKategoriBaru(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && tambahKategori()}
                />
                <Button onClick={tambahKategori} className="bg-teal-700 hover:bg-teal-800 shrink-0">
                  <Plus className="h-4 w-4" aria-hidden /> Tambah
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {kategoriList.map((k) => (
                  <Badge key={k} variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 text-xs">{k}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
