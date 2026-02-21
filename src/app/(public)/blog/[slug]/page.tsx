import { allBlogs, doctorDetails } from '@/lib/placeholder-data';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function generateStaticParams() {
  return allBlogs.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = allBlogs.find((p) => p.slug === params.slug);
    if (!post) {
        return {
            title: 'Post Not Found',
        }
    }
    return {
        title: `${post.title} | Dr. Pritam Pattyanayek's Blog`,
        description: post.excerpt,
    }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = allBlogs.find((p) => p.slug === params.slug);

  if (!post || !post.content) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.imageUrl,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: doctorDetails.name,
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
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
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
                <span>{doctorDetails.name}</span>
              </div>
              <time dateTime={post.date}>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
          </div>
        </header>
        
        <div className="relative w-full h-64 md:h-96 mb-12">
            <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover rounded-lg shadow-lg"
                data-ai-hint={post.imageHint}
                priority
            />
        </div>
        
        <div className="space-y-6 text-lg text-muted-foreground text-justify">
          {post.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
          ))}
        </div>

      </div>
    </article>
  );
}
