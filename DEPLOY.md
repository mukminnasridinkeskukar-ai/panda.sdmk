# Panduan Deploy: Netlify (Frontend) + Neon PostgreSQL (Backend)

PANDA SDMK dibangun dengan Next.js 16 (App Router). Arsitektur produksi:

```
Browser
  │
  ▼
Netlify (frontend + API Routes sebagai Netlify Function)
  │  @netlify/plugin-nextjs  →  SSR pages  +  /api/* functions
  ▼
Neon PostgreSQL (serverless Postgres, Prisma ORM)
```

Tidak ada server yang perlu disewa: hosting dan API berjalan di Netlify, data tersimpan di Neon.

---

## Langkah 1 — Buat Database di Neon

1. Daftar/masuk di https://neon.tech (free tier tersedia).
2. Buat project baru, misal `panda-sdmk`. Pilih region terdekat: **Singapore**.
3. Buka **Dashboard → Connection Details**, lalu salin **dua** string:
   - **Pooled connection** (mengandung `-pooler-` dan `pgbouncer=true`) → untuk `DATABASE_URL`.
   - **Direct connection** (tanpa `-pooler-`) → untuk `DIRECT_URL` (dipakai `prisma db push/migrate`).

## Langkah 2 — Siapkan Skema di Neon

Skema produksi tersedia di `prisma/schema.postgres.prisma`. Dari komputer lokal:

```bash
# 1. Set environment sementara (ganti dengan string Anda)
export DATABASE_URL="postgresql://USER:PASS@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
export DIRECT_URL="postgresql://USER:PASS@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# 2. Push skema ke Neon
npx prisma db push --schema prisma/schema.postgres.prisma

# 3. Generate client versi postgres (di mesin CI Netlify ini diulang otomatis)
npx prisma generate --schema prisma/schema.postgres.prisma

# 4. (Opsional) Isi data contoh — jalankan seed
#    Karena client sudah di-generate dari skema postgres, seed akan menulis ke Neon.
node scripts/seed.mjs
```

> Catatan: setelah langkah di atas, `prisma/schema.prisma` lokal masih versi SQLite untuk
> development sandbox. Saat bekerja lokal dengan Neon, cukup selalu menambahkan
> `--schema prisma/schema.postgres.prisma` pada perintah prisma.

## Langkah 3 — Push Repo ke GitHub

```bash
git init
git add .
git commit -m "PANDA SDMK: Netlify + Neon ready"
git remote add origin https://github.com/<username>/panda-sdmk.git
git push -u origin main
```

## Langkah 4 — Deploy ke Netlify

1. Masuk https://app.netlify.com → **Add new site → Import an existing project** → pilih repo GitHub.
2. Biarkan Netlify membaca `netlify.toml` (build command dan plugin sudah teratur di sana):
   - Build command: `npx prisma generate && npx next build`
   - Plugin: `@netlify/plugin-nextjs` (SSR + API routes otomatis menjadi Netlify Function)
3. Buka **Site configuration → Environment variables**, tambahkan:

   | Key             | Value                                              |
   | --------------- | -------------------------------------------------- |
   | `DATABASE_URL`  | string **pooled** Neon (`…-pooler…?sslmode=require`) |
   | `DIRECT_URL`    | string **direct** Neon                              |
   | `ADMIN_PASSWORD`| password kuat pilihan Anda (default demo: `kukar123`) |

4. Klik **Deploy**. Tunggu build selesai → situs live di `https://<nama-site>.netlify.app`.

## Langkah 5 — Verifikasi Pasca-Deploy

- Buka `https://<site>.netlify.app` → 6 submenu dashboard tampil dengan data.
- Panel Admin → masuk dengan `ADMIN_PASSWORD` → tambah/edit/hapus data.
- Data tersimpan di Neon: cek tabel di **Neon Console → Tables**.

---

## Perintah Berguna

| Kebutuhan                              | Perintah |
| -------------------------------------- | -------- |
| Push skema ke Neon                     | `npx prisma db push --schema prisma/schema.postgres.prisma` |
| Generate client Neon                   | `npx prisma generate --schema prisma/schema.postgres.prisma` |
| Reset database Neon (hapus semua data) | `npx prisma db push --schema prisma/schema.postgres.prisma --accept-data-loss` |
| Isi data contoh ke database aktif      | `node scripts/seed.mjs` |
| Development lokal (SQLite)             | `bun run dev` |

## Troubleshooting

- **`Error: Query engine library for current platform could not be found`** — pastikan build command memuat `npx prisma generate` (sudah diatur di `netlify.toml`).
- **`Timed out fetching a new connection from the connection pool`** — pastikan memakai string **pooled** (`-pooler-`) untuk `DATABASE_URL` di Netlify.
- **`db push` gagal karena koneksi** — `db push` membutuhkan `DIRECT_URL` (koneksi langsung, bukan pooled).
- **Data tidak muncul** — periksa env var di Netlify (Full rebuild setelah mengubah env) dan pastikan tabel sudah di-push ke Neon.
