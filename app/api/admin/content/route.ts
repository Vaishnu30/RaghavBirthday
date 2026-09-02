import { NextResponse } from 'next/server'

function authorized(request: Request) { return request.headers.get('cookie')?.includes(`capsule_admin=${encodeURIComponent(process.env.CAPSULE_ADMIN_SECRET ?? '')}`) }
async function supabase(path: string, init: RequestInit = {}) { return fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, { ...init, headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates', ...init.headers } }) }
export async function PUT(request: Request) { if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); const body = await request.json(); const response = await supabase('capsule_content', { method: 'POST', body: JSON.stringify(body) }); return NextResponse.json({ ok: response.ok }, { status: response.ok ? 200 : 500 }) }
