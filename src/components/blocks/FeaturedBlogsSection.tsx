import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FeaturedBlogsSection({ featuredBlogs }: any) {
  if (!featuredBlogs) {
    return null;
  }
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container">
        {/* Standardized Section Header with Side Button on Desktop */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="font-ui font-bold text-primary tracking-widest uppercase text-sm">Health Insights</span>
            <h2 className="font-headline text-3xl md:text-5xl font-bold text-foreground">
              Medical <span className="text-primary">Articles</span> & Tips
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Stay informed with the latest research and wellness advice from Dr. Pattyanayek.
            </p>
          </div>
          <Button variant="outline" asChild className="h-12 px-6 font-ui border-primary/20 text-primary hover:bg-primary/5">
            <Link href="/blog" className="flex items-center">
              Explore All Articles <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredBlogs.map((post: any) => (
            <Card key={post._id} className="overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-none bg-secondary/5">
              <Link href={`/blog/${post.slug}`} className="block relative h-52">
                <Image
                  src={post.mainImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  data-ai-hint={post.imageHint}
                />
              </Link>
              <CardHeader className="p-6 pb-2">
                <CardTitle className="font-headline text-xl font-bold leading-tight line-clamp-2 min-h-[3rem]">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </CardContent>
              <CardFooter className="p-6 pt-2">
                 <Button variant="link" asChild className="p-0 font-bold text-primary h-auto">
                    <Link href={`/blog/${post.slug}`} className="flex items-center">
                      Read Article <ArrowRight className="ml-2 h-4 w-4"/>
                    </Link>
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
