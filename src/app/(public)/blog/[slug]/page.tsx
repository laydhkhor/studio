'use client'

import { client } from '@/sanity/client';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { groq } from 'next-sanity';
import { urlForImage } from '@/sanity/image';
import { PortableText } from '@portabletext/react';
import { useLiveQuery } from 'next-sanity/live';
import { draftMode } from 'next/headers';


const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  ...,
  "categoryName": category->title,
  "authorName": author->name
}`;

function PostPageContent({ post: initialPost, params }: { post: any, params: { slug: string }}) {
    const [post] = useLiveQuery(initialPost, postQuery, params);

    if (!post || !post.body) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: urlForImage(post.mainImage).url(),
        datePublished: post.publishedAt,
        author: {
        '@type': 'Person',
        name: post.authorName,
        },
        publisher: {
        '@type': 'Organization',
        name: 'DocAssist',
        logo: {
            '@type': 'ImageObject',
            url: 'https://placehold.co/600x60/EEE/31343C/png?text=DocAssist',
        },
        },
    };

    return (
        <article className="py-20 md:py-28">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="container max-w-4xl mx-auto">
                <div className="mb-8">
                    <Button variant="ghost" asChild className="font-ui">
                        <Link href="/blog">
                            <ArrowLeft className="mr-2" />
                            Back to Blog
                        </Link>
                    </Button>
                </div>
                <header className="mb-12 text-center">
                    <Badge variant="outline" className="mb-4">{post.categoryName}</Badge>
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">{post.title}</h1>
                    <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground font-ui">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-semibold text-primary">{post.authorName}</span>
                        </div>
                        <time dateTime={post.publishedAt}>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</time>
                    </div>
                </header>
                
                <div className="relative w-full h-64 md:h-96 mb-12">
                    <Image
                        src={urlForImage(post.mainImage).url()}
                        alt={post.title}
                        fill
                        className="object-cover rounded-lg shadow-lg"
                        data-ai-hint={post.imageHint}
                        priority
                    />
                </div>
                
                <div className="prose lg:prose-xl mx-auto text-justify text-muted-foreground">
                    <PortableText value={post.body} />
                </div>

            </div>
        </article>
    )
}


export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { isEnabled } = draftMode();
  const post = await client.fetch(postQuery, { slug: params.slug });

  if (isEnabled) {
    return <PostPageContent post={post} params={params} />
  }
  
  if (!post || !post.body) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: urlForImage(post.mainImage).url(),
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.authorName,
    },
     publisher: {
      '@type': 'Organization',
      name: 'DocAssist',
      logo: {
        '@type': 'ImageObject',
        url: 'https://placehold.co/600x60/EEE/31343C/png?text=DocAssist',
      },
    },
  };

  return (
    <article className="py-20 md:py-28">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container max-w-4xl mx-auto">
        <div className="mb-8">
            <Button variant="ghost" asChild className="font-ui">
                <Link href="/blog">
                    <ArrowLeft className="mr-2" />
                    Back to Blog
                </Link>
            </Button>
        </div>
        <header className="mb-12 text-center">
          <Badge variant="outline" className="mb-4">{post.categoryName}</Badge>
          <h1 className="font-headline text-4xl md:text-5xl font-bold">{post.title}</h1>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground font-ui">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-semibold text-primary">{post.authorName}</span>
              </div>
              <time dateTime={post.publishedAt}>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</time>
          </div>
        </header>
        
        <div className="relative w-full h-64 md:h-96 mb-12">
            <Image
                src={urlForImage(post.mainImage).url()}
                alt={post.title}
                fill
                className="object-cover rounded-lg shadow-lg"
                data-ai-hint={post.imageHint}
                priority
            />
        </div>
        
        <div className="prose lg:prose-xl mx-auto text-justify text-muted-foreground">
          <PortableText value={post.body} />
        </div>

      </div>
      </article>
  );
}

export async function generateStaticParams() {
  const posts = await client.fetch(groq`*[_type == "post"]{"slug": slug.current}`);
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = await client.fetch(postQuery, { slug: params.slug });
    if (!post) {
        return {
            title: 'Post Not Found',
        }
    }
    return {
        title: `${post.title} | Blog`,
        description: post.excerpt,
    }
}
