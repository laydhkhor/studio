import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { client, token, previewSecret } from '@/sanity/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== previewSecret) {
    return new Response('Invalid secret', { status: 401 })
  }

  const slug = searchParams.get('slug')
  const type = searchParams.get('type')

  if (!slug) {
    return new Response('Missing slug', { status: 400 })
  }

  let redirectUrl = `/${slug}`
  if(type === 'post') {
      redirectUrl = `/blog/${slug}`
  }

  // Enable Draft Mode by setting the cookie
  draftMode().enable()

  // Redirect to the path from the fetched post
  // We don't redirect to searchParams.slug as that might lead to open redirect vulnerabilities
  redirect(redirectUrl)
}
