import PublicHome from '@/components/public-home'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

export default async function Page() {
  const supabase = await createClient()
  const [{ data: profile }, { data: chapter }] = await Promise.all([
    supabase.from('baby_profile').select('name,birthday_label,location,parents').limit(1).maybeSingle(),
    supabase.from('chapters').select('age,year,title,status').eq('age', 1).maybeSingle(),
  ])

  return <PublicHome initialProfile={profile} initialChapter={chapter} />
}
