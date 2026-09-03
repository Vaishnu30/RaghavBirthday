import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MAX_FILE_SIZE = 25 * 1024 * 1024
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'])

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: admin } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const form = await request.formData()
  const file = form.get('file')
  const section = String(form.get('section') ?? 'photos')
  if (!(file instanceof File) || file.size > MAX_FILE_SIZE || !allowedTypes.has(file.type)) {
    return NextResponse.json({ error: 'Unsupported or oversized file' }, { status: 400 })
  }

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-').slice(-120)
  const path = `${section}/${new Date().getFullYear()}/${crypto.randomUUID()}-${safeName}`
  const upload = await supabase.storage.from(section === 'videos' ? 'videos' : 'photos').upload(path, file, { contentType: file.type, upsert: false })
  if (upload.error) return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  return NextResponse.json({ ok: true, path })
}
