import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const [profile, chapters, photos, milestones, letters, family, videos, birthday, funny] = await Promise.all([
    supabase.from('baby_profile').select('id,name,birth_date,birthday_label,location,parents,hero_image').limit(1).maybeSingle(),
    supabase.from('chapters').select('id,age,year,title,description,status,cover_image').neq('status', 'locked').order('age'),
    supabase.from('photos').select('id,chapter_id,title,caption,category,public_url,sort_order,taken_at').eq('published', true).order('sort_order'),
    supabase.from('milestones').select('id,chapter_id,title,event_date,description,icon,photo_id,sort_order,featured').order('sort_order'),
    supabase.from('letters').select('id,chapter_id,author,relationship,title,message,unlock_age,sort_order').eq('published', true).order('sort_order'),
    supabase.from('family_members').select('id,name,relationship,short_message,long_message,portrait_url,sort_order').eq('published', true).order('sort_order'),
    supabase.from('videos').select('id,chapter_id,title,person_name,relationship,caption,public_url,thumbnail_url,sort_order').eq('published', true).order('sort_order'),
    supabase.from('birthday').select('id,chapter_id,birthday_date,location,theme,message,cake_image').limit(1).maybeSingle(),
    supabase.from('funny_memories').select('id,chapter_id,caption,event_date,photo_id,sort_order').eq('published', true).order('sort_order'),
  ])
  const error = [profile, chapters, photos, milestones, letters, family, videos, birthday, funny].find((result) => result.error)?.error
  if (error) return NextResponse.json({ error: 'Unable to load the memory book' }, { status: 500 })
  return NextResponse.json({ profile: profile.data, chapters: chapters.data ?? [], photos: photos.data ?? [], milestones: milestones.data ?? [], letters: letters.data ?? [], family: family.data ?? [], videos: videos.data ?? [], birthday: birthday.data, funnyMemories: funny.data ?? [] }, { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } })
}

export const dynamic = 'force-dynamic'
