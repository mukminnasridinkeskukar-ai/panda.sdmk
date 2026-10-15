'use client'

import { useState } from 'react'
import { AppLayout, type ViewKey } from '@/components/panda/layout'
import DashboardSdmk from '@/components/panda/dashboard'
import DashboardIzin from '@/components/panda/dash-izin'
import DashboardBeasiswa from '@/components/panda/dash-beasiswa'
import DashboardMonev from '@/components/panda/dash-monev'
import DashboardKredensial from '@/components/panda/dash-kredensial'
import DashboardKompetensi from '@/components/panda/dash-kompetensi'
import AdminPanel from '@/components/panda/admin'

export default function Page() {
  const [view, setView] = useState<ViewKey>('sdmk')

  return (
    <AppLayout view={view} onView={setView}>
      {view === 'sdmk' && <DashboardSdmk onBukaAdmin={() => setView('admin')} />}
      {view === 'izin' && <DashboardIzin />}
      {view === 'beasiswa' && <DashboardBeasiswa />}
      {view === 'monev' && <DashboardMonev />}
      {view === 'kredensial' && <DashboardKredensial />}
      {view === 'kompetensi' && <DashboardKompetensi />}
      {view === 'admin' && <AdminPanel />}
    </AppLayout>
  )
}
