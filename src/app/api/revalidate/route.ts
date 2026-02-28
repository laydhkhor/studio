import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET!

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{ _type: string, slug?: { current?: string } }>(
      req,
      revalidateSecret,
    )

    if (!isValidSignature) {
      const message = 'Invalid signature'
      return new Response(JSON.stringify({ message, body }), { status: 401 })
    }

    if (!body?._type) {
      return new Response('Bad Request: Missing _type in body', { status: 400 })
    }

    // Revalidate the document type tag
    const typeTag = body._type;
    revalidateTag(typeTag);

    // If the document is a post, revalidate its specific slug tag and the general 'post' tag for list pages
    if (body._type === 'post' && body.slug?.current) {
      revalidateTag(`post:${body.slug.current}`);
    }

    // Revalidate a general 'home' tag if any of these singletons change
    const homePageTags = ['home', 'about', 'pricing', 'testimonial', 'clinicPage', 'faqPage', 'settings'];
    if (homePageTags.includes(body._type)) {
      revalidateTag('home');
      revalidateTag('about');
      revalidateTag('pricing');
      revalidateTag('testimonial');
      revalidateTag('clinicPage');
      revalidateTag('faqPage');
      revalidateTag('settings');
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
