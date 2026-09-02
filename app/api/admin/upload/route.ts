import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookie = request.headers.get('cookie') ?? ''
  if (!cookie.includes(`capsule_admin=${encodeURIComponent(process.env.CAPSULE_ADMIN_SECRET ?? '')}`)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const form = await request.formData(); const file = form.get('file'); const label = String(form.get('label') ?? 'Memory'); const section = String(form.get('section') ?? 'Gallery')
  if (!(file instanceof File) || file.size > 25 * 1024 * 1024) return NextResponse.json({ error: 'Invalid file' }, { status: 400 })
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-'); const path = `uploads/${Date.now()}-${safeName}`
  const upload = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/capsule-media/${path}`, { method: 'POST', body: await file.arrayBuffer(), headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'false' } })
  if (!upload.ok) return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  await fetch(`${process.env.SUPABASE_URL}/rest/v1/capsule_media`, { method: 'POST', body: JSON.stringify({ path, label, section }), headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' } })
  return NextResponse.json({ ok: true, path })
}
