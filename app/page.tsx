import PublicHome from '@/components/public-home'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

export default async function Page() {
  const supabase = await createClient()
  const [{ data: profile }, { data: chapter }, { data: photos }] = await Promise.all([
    supabase.from('baby_profile').select('name,birthday_label,location,parents').limit(1).maybeSingle(),
    supabase.from('chapters').select('age,year,title,status').eq('age', 1).maybeSingle(),
    supabase.from('photos').select('title,category,public_url').eq('published', true).order('sort_order'),
  ])

  return <PublicHome initialProfile={profile} initialChapter={chapter} initialPhotos={photos ?? []} />
}
