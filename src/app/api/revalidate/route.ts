import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { isValidSignature } from '@sanity/webhook'

const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET!

type WebhookBody = {
  _type: string
  slug?: {
    current?: string
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Read raw body (required for signature validation)
    const rawBody = await req.text()

    // 2️⃣ Get Sanity signature header
    const signature = req.headers.get('sanity-signature')

    // 3️⃣ Validate webhook authenticity
    if (!signature || !isValidSignature(rawBody, signature, revalidateSecret)) {
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 }
      )
    }

    // 4️⃣ Parse JSON safely AFTER validation
    const body: WebhookBody = JSON.parse(rawBody)

    if (!body?._type) {
      return new Response('Bad Request: Missing _type in body', {
        status: 400,
      })
    }

    // ✅ Revalidate document type tag
    revalidateTag(body._type)

    // ✅ Revalidate individual post page
    if (body._type === 'post' && body.slug?.current) {
      revalidateTag(`post:${body.slug.current}`)
    }

    // ✅ Revalidate singleton pages
    const homePageTags = [
      'home',
      'about',
      'pricing',
      'testimonial',
      'clinicPage',
      'faqPage',
      'settings',
    ]

    if (homePageTags.includes(body._type)) {
      homePageTags.forEach(tag => revalidateTag(tag))
    }

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      body,
    })
  } catch (err: any) {
    console.error(err)
    return new Response(err.message, { status: 500 })
  }
}