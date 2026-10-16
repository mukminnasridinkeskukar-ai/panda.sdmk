'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import {
  Search, Plus, Pencil, Trash2, Download, ChevronLeft, ChevronRight,
} from 'lucide-react'
import type { CrudField, CrudTab } from './admin-config'
import { JK_MAP } from './admin-config'

const UKURAN_HALAMAN = 8
type Row = Record<string, unknown>

// sentinel untuk opsi "kosongkan" pada select opsional (Radix tak menerima value="")
const KOSONG = '__kosong__'

export default function AdminCrud({
  tab, rows, kategoriList, onChanged,
}: {
  tab: CrudTab
  rows: Row[]
  kategoriList: string[]
  onChanged: () => void
}) {
  const { toast } = useToast()
  const [q, setQ] = useState('')
  const [filterVal, setFilterVal] = useState('semua')
  const [halaman, setHalaman] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [hapusRow, setHapusRow] = useState<Row | null>(null)

  const fieldKeys = useMemo(() => tab.fields.map((f) => f.key), [tab])

  useEffect(() => {
    setHalaman(1)
  }, [q, filterVal])

  const terfilter = useMemo(() => {
    let d = rows
    if (q.trim()) {
      const s = q.trim().toLowerCase()
      d = d.filter((r) =>
        fieldKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(s))
      )
    }
    if (tab.filterField && filterVal !== 'semua') {
      d = d.filter((r) => String(r[tab.filterField!.key]) === filterVal)
    }
    return d
  }, [rows, q, filterVal, fieldKeys, tab.filterField])

  const totalHalaman = Math.max(1, Math.ceil(terfilter.length / UKURAN_HALAMAN))
  const halAman = Math.min(halaman, totalHalaman)
  const dataHalaman = terfilter.slice((halAman - 1) * UKURAN_HALAMAN, halAman * UKURAN_HALAMAN)

  function formKosong(): Record<string, string> {
    const f: Record<string, string> = {}
    for (const fd of tab.fields) f[fd.key] = ''
    return f
  }

  function bukaTambah() {
    setEditId(null)
    setForm(formKosong())
    setFormOpen(true)
  }

  function bukaEdit(r: Row) {
    setEditId(String(r.id))
    const f: Record<string, string> = {}
    for (const fd of tab.fields) {
      const v = r[fd.key]
      if (fd.type === 'date') f[fd.key] = v ? String(v).slice(0, 10) : ''
      else if (fd.type === 'number') f[fd.key] = v === null || v === undefined ? '' : String(v)
      else f[fd.key] = v === null || v === undefined ? '' : String(v)
    }
    setForm(f)
    setFormOpen(true)
  }

  async function simpan() {
    const kurang = tab.fields
      .filter((f) => f.required && !String(form[f.key] ?? '').trim())
      .map((f) => f.label)
    if (kurang.length > 0) {
      toast({ title: 'Data belum lengkap', description: `Kolom wajib: ${kurang.join(', ')}`, variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const url = editId ? `/api/${tab.key}/${editId}` : `/api/${tab.key}`
      const res = await fetch(url, {
        method: editId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Gagal menyimpan')
      }
      toast({ title: editId ? 'Data berhasil diperbarui' : 'Data berhasil ditambahkan', description: String(form[tab.fields[0].key]) })
      setFormOpen(false)
      onChanged()
    } catch (e) {
      toast({ title: 'Gagal menyimpan', description: e instanceof Error ? e.message : undefined, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  async function hapus() {
    if (!hapusRow) return
    try {
      const res = await fetch(`/api/${tab.key}/${String(hapusRow.id)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast({ title: 'Data dihapus', description: String(hapusRow[tab.fields[0].key] ?? '') })
      setHapusRow(null)
      onChanged()
    } catch {
      toast({ title: 'Gagal menghapus data', variant: 'destructive' })
    }
  }

  function eksporCsv() {
    const head = tab.fields.map((f) => f.label)
    const body = terfilter.map((r) =>
      tab.fields.map((f) => {
        const v = r[f.key]
        if (f.type === 'date') return v ? new Date(String(v)).toLocaleDateString('id-ID') : ''
        if (f.key === 'jenisKelamin') return JK_MAP[String(v)] ?? String(v ?? '')
        return String(v ?? '')
      })
    )
    const csv = [head, ...body]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';'))
      .join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `panda-sdmk-${tab.key}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
    toast({ title: 'Ekspor berhasil', description: `${terfilter.length} baris diunduh.` })
  }

  function opsiField(f: CrudField): string[] {
    if (f.dinamis === 'kategori') return kategoriList
    return f.options || []
  }

  const labelUtama = tab.fields[0]?.key || 'id'

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              className="pl-9"
              placeholder={`Cari data ${tab.judul.toLowerCase()}…`}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          {tab.filterField && (
            <Select value={filterVal} onValueChange={setFilterVal}>
              <SelectTrigger className="w-full lg:w-52">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">{tab.filterField.label}</SelectItem>
                {tab.filterField.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={eksporCsv} className="flex-1 lg:flex-none">
              <Download className="h-4 w-4" aria-hidden /> CSV
            </Button>
            <Button onClick={bukaTambah} className="flex-1 lg:flex-none bg-teal-700 hover:bg-teal-800">
              <Plus className="h-4 w-4" aria-hidden /> Tambah
            </Button>
          </div>
        </div>

        <div className="mt-4 rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60">
                  {tab.columns.map((c) => (
                    <TableHead key={c.key} className="whitespace-nowrap">{c.label}</TableHead>
                  ))}
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataHalaman.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={tab.columns.length + 1} className="text-center py-10 text-muted-foreground">
                      Tidak ada data yang cocok dengan filter.
                    </TableCell>
                  </TableRow>
                )}
                {dataHalaman.map((r) => (
                  <TableRow key={String(r.id)}>
                    {tab.columns.map((c) => (
                      <TableCell key={c.key} className="text-sm">
                        {c.render ? c.render(r) : String(r[c.key] ?? '-')}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => bukaEdit(r)} aria-label={`Ubah data ${String(r[labelUtama])}`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setHapusRow(r)} aria-label={`Hapus data ${String(r[labelUtama])}`}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Menampilkan {terfilter.length === 0 ? 0 : (halAman - 1) * UKURAN_HALAMAN + 1}–{Math.min(halAman * UKURAN_HALAMAN, terfilter.length)} dari {terfilter.length} data
          </p>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={halAman <= 1} onClick={() => setHalaman(halAman - 1)} aria-label="Halaman sebelumnya">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs px-2 tabular-nums">{halAman} / {totalHalaman}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={halAman >= totalHalaman} onClick={() => setHalaman(halAman + 1)} aria-label="Halaman berikutnya">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Dialog Form */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? `Ubah Data — ${tab.judul}` : `Tambah Data — ${tab.judul}`}</DialogTitle>
            <DialogDescription>
            Kolom bertanda * wajib diisi. Kolom lain boleh dikosongkan — pilih <span className="whitespace-nowrap">— Kosongkan —</span> untuk menghapus pilihan sebelumnya.
          </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tab.fields.map((f) => (
              <div key={f.key} className={`space-y-1.5 ${f.penuh ? 'sm:col-span-2' : ''}`}>
                <Label>{f.label} {f.required && '*'}</Label>
                {f.type === 'select' ? (
                  <Select value={form[f.key] || undefined} onValueChange={(v) => setForm({ ...form, [f.key]: v === KOSONG ? '' : v })}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Pilih" /></SelectTrigger>
                    <SelectContent className="max-h-64">
                      {!f.required && (
                        <SelectItem value={KOSONG} className="text-muted-foreground">— Kosongkan —</SelectItem>
                      )}
                      {opsiField(f).map((o) => (
                        <SelectItem key={o} value={o}>{f.key === 'jenisKelamin' ? (o === 'L' ? 'Laki-laki' : 'Perempuan') : o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                    value={form[f.key] || ''}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    min={f.type === 'number' ? f.min : undefined}
                    max={f.type === 'number' ? f.max : undefined}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Batal</Button>
            <Button onClick={simpan} disabled={saving} className="bg-teal-700 hover:bg-teal-800">
              {saving ? 'Menyimpan…' : editId ? 'Simpan Perubahan' : 'Tambah Data'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Konfirmasi Hapus */}
      <AlertDialog open={!!hapusRow} onOpenChange={(v) => !v && setHapusRow(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus data ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Data <strong>{hapusRow ? String(hapusRow[labelUtama]) : ''}</strong> pada {tab.judul} akan dihapus permanen dan tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={hapus} className="bg-destructive text-white hover:bg-destructive/90">Ya, Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
