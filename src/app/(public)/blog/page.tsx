'use client';
import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { allBlogs } from '@/lib/placeholder-data';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('All');
  const [sortOrder, setSortOrder] = React.useState('newest');

  const categories = [
    'All',
    ...Array.from(new Set(allBlogs.map((post) => post.category))),
  ];

  const filteredAndSortedBlogs = React.useMemo(() => {
    let blogs = allBlogs.filter((post) => {
      const searchTermMatch =
        searchTerm === '' ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch =
        categoryFilter === 'All' || post.category === categoryFilter;
      return searchTermMatch && categoryMatch;
    });

    if (sortOrder === 'oldest') {
      blogs.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } else if (sortOrder === 'lastMonth') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      blogs = blogs
        .filter((post) => new Date(post.date) >= oneMonthAgo)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    } else {
      // 'newest' is the default
      blogs.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    return blogs;
  }, [searchTerm, categoryFilter, sortOrder]);

  return (
    <div className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <header className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">
            Health & Wellness Blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Stay informed with the latest articles, health tips, and advice from
            our doctor.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
          <div className="relative w-full md:w-auto md:min-w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedBlogs.length > 0 ? (
            filteredAndSortedBlogs.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
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
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <time dateTime={post.date}>
                      {format(new Date(post.date), 'MMMM d, yyyy')}
                    </time>
                  </div>
                  <CardTitle className="font-headline h-14">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-justify">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" asChild className="p-0 font-ui">
                    <Link href={`/blog/${post.slug}`}>
                      Read More <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground md:col-span-3">
              No articles found. Try adjusting your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
