#!/bin/bash
# Verifikasi semua dropdown di 6 tab Panel Admin PANDA SDMK

AB="agent-browser"

$AB open http://localhost:3000/ >/dev/null
$AB wait --load networkidle >/dev/null
$AB find text "Panel Admin" click >/dev/null
sleep 0.7
$AB find role button click --name "Masuk sebagai Admin" >/dev/null
sleep 0.6
REF=$($AB snapshot -i -c | grep -oE 'textbox "Password" \[ref=[^]]+\]' | grep -oE '@e[0-9]+')
$AB fill "$REF" "kukar123" >/dev/null
$AB press Enter >/dev/null
sleep 1.5

CEK_TAB () {
  local nama_tab="$1"; local jumlah_cb="$2"
  $AB find role tab click --name "$nama_tab" >/dev/null
  sleep 0.9
  $AB find role button click --name "Tambah" >/dev/null
  sleep 0.7
  for ((i=0; i<jumlah_cb; i++)); do
    $AB eval "
(() => {
const list = document.querySelectorAll('[role=dialog] [role=combobox]')
const el = list[$i]
if (!el) return 'CB $i TIDAK ADA'
for (const t of ['pointerdown','pointerup','click']) el.dispatchEvent(new PointerEvent(t, {bubbles:true, pointerId:1}))
return 'ok'
})()" >/dev/null
    sleep 0.4
    $AB eval "
(() => {
const opts = document.querySelectorAll('[role=option]')
const list = document.querySelectorAll('[role=dialog] [role=combobox]')
const label = list[$i] ? list[$i].textContent.trim() : '?'
if (opts.length === 0) return '❌ $nama_tab CB$i (' + label + '): KOSONG!'
return '✓ $nama_tab CB$i [' + label + ']: ' + opts.length + ' opsi → ' + Array.from(opts).slice(0,2).map(o=>o.textContent.trim()).join(' / ')
})()"
    $AB press Escape >/dev/null
    sleep 0.3
  done
  $AB press Escape >/dev/null
  sleep 0.4
}

CEK_TAB "Data Nakes" 5
CEK_TAB "Izin Praktik" 4
CEK_TAB "Beasiswa" 5
CEK_TAB "Monev" 4
CEK_TAB "Kredensial" 4
CEK_TAB "Kompetensi" 3
echo "=== SELESAI ==="
$AB close
