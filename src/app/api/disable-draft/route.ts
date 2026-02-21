import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
 
export function GET(request: Request) {
  draftMode().disable()
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  redirect(slug || '/')
}
