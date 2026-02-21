import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { featuredBlogs } from '@/lib/placeholder-data';

export default function FeaturedBlogsSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Health & Wellness Tips
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Stay informed with the latest articles and advice from our doctor.
            </p>
          </div>
          <Button variant="outline" asChild className="mt-4 md:mt-0 font-ui">
            <Link href="/blog">View All Posts <ArrowRight className="ml-2" /></Link>
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBlogs.map((post) => (
            <Card key={post.id} className="overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <Link href={`/blog/${post.slug}`} className="block">
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
                <CardTitle className="font-headline h-14">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground h-16 text-justify">{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                 <Button variant="link" asChild className="p-0 font-ui">
                    <Link href={`/blog/${post.slug}`}>Read More <ArrowRight className="ml-2"/></Link>
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
