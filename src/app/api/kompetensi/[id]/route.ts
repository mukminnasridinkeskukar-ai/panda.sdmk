import { NextRequest, NextResponse } from 'next/server'
import { handleCrudPatch, handleCrudDelete } from '@/lib/crud-server'

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  return handleCrudPatch(req, 'kompetensi', id)
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  return handleCrudDelete(req, 'kompetensi', id)
}
