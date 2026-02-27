
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { postsData } from '@/lib/static-data';

const getPost = (slug: string) => {
    return postsData.find(p => p.slug === slug);
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);

    if (!post || !post.body) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: post.mainImage,
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
                  <Badge variant="outline" className="mb-4">{post.category}</Badge>
                  <h1 className="font-headline text-4xl md:text-5xl font-bold">{post.title}</h1>
                  <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground font-ui">
                      <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-semibold text-primary">{post.authorName}</span>
                      </div>
                      <time dateTime={post.publishedAt}>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</time>
                  </div>
              </header>
              
              {post.mainImage && <div className="relative w-full h-64 md:h-96 mb-12">
                  <Image
                      src={post.mainImage}
                      alt={post.title}
                      fill
                      className="object-cover rounded-lg shadow-lg"
                      data-ai-hint={post.imageHint}
                      priority
                  />
              </div>}
              
              <div className="prose lg:prose-xl mx-auto text-slate-700">
                  {post.body.map((block: any) => {
                    const text = block.children.map((span: any) => span.text).join('');
                    
                    if (block.style === 'h2') {
                        return (
                            <h2 key={block._key} className="font-headline text-2xl font-bold mt-10 mb-4 text-slate-900 border-l-4 border-primary pl-4">
                                {text}
                            </h2>
                        );
                    }
                    
                    if (block.listItem === 'bullet') {
                        return (
                            <div key={block._key} className="flex gap-3 mb-3 ml-2">
                                <div className="h-2 w-2 rounded-full bg-primary mt-2.5 shrink-0" />
                                <p className="text-lg leading-relaxed">{text}</p>
                            </div>
                        );
                    }
                    
                    return (
                        <p key={block._key} className="text-lg leading-relaxed mb-6 font-ui">
                            {text}
                        </p>
                    );
                  })}
              </div>

          </div>
      </article>
    )
}


export async function generateStaticParams() {
  const posts = postsData;
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = getPost(params.slug);
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
