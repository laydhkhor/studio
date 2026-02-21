import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { allBlogs } from '@/lib/placeholder-data';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function BlogPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <header className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Health & Wellness Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Stay informed with the latest articles, health tips, and advice from our doctor.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allBlogs.map((post) => (
            <Card key={post.id} className="overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
              <Link href={post.slug} className="block">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                  data-ai-hint={post.imageHint}
                />
              </Link>
              <CardHeader>
                <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                   <Badge variant="outline">{post.category}</Badge>
                   <time dateTime={post.date}>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
                </div>
                <CardTitle className="font-headline h-14">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-justify">{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                 <Button variant="link" asChild className="p-0 font-ui">
                    <Link href={post.slug}>Read More <ArrowRight className="ml-2"/></Link>
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
