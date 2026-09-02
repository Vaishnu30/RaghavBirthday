import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { secret } = await request.json().catch(() => ({ secret: '' }))
  if (!secret || secret !== process.env.CAPSULE_ADMIN_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const response = NextResponse.json({ ok: true })
  response.cookies.set('capsule_admin', secret, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 60 * 60 * 8 })
  return response
}
