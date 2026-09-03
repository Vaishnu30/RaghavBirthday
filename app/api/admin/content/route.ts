import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const writableTables = new Set(['baby_profile', 'chapters', 'photos', 'milestones', 'letters', 'family_members', 'videos', 'birthday', 'funny_memories'])

export async function PUT(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: admin } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const table = typeof body.table === 'string' ? body.table : ''
  const operation = body.operation === 'update' ? 'update' : 'insert'
  const payload = body.payload && typeof body.payload === 'object' ? body.payload : null
  if (!writableTables.has(table) || !payload) return NextResponse.json({ error: 'Invalid content request' }, { status: 400 })

  let query = supabase.from(table).insert(payload)
  if (operation === 'update' && typeof body.id === 'string') query = supabase.from(table).update(payload).eq('id', body.id)
  const { error } = await query
  if (error) return NextResponse.json({ error: 'Unable to save content' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
