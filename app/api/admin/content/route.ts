import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const writableTables = new Set(['baby_profile', 'chapters', 'photos', 'milestones', 'letters', 'family_members', 'videos', 'birthday', 'funny_memories'])

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const { data: admin } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle()
  if (!admin) return { supabase, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  return { supabase, response: null }
}

async function mutate(request: Request, method: 'insert' | 'update' | 'delete') {
  const { supabase, response } = await requireAdmin()
  if (response) return response
  const body = await request.json()
  const table = typeof body.table === 'string' ? body.table : ''
  const payload = body.payload && typeof body.payload === 'object' ? body.payload : null
  if (!writableTables.has(table) || (method !== 'delete' && !payload)) return NextResponse.json({ error: 'Invalid content request' }, { status: 400 })
  let query: any
  if (method === 'insert') query = supabase.from(table).insert(payload)
  if (method === 'update' && typeof body.id === 'string') query = supabase.from(table).update({ ...payload, updated_at: new Date().toISOString() }).eq('id', body.id)
  if (method === 'delete' && typeof body.id === 'string') query = supabase.from(table).delete().eq('id', body.id)
  if (!query) return NextResponse.json({ error: 'Missing item id' }, { status: 400 })
  const { error } = await query
  if (error) return NextResponse.json({ error: 'Unable to save content' }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function POST(request: Request) { return mutate(request, 'insert') }
export async function PATCH(request: Request) { return mutate(request, 'update') }
export async function DELETE(request: Request) { return mutate(request, 'delete') }
export async function PUT(request: Request) { return mutate(request, 'update') }
