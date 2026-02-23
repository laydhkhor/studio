
import * as React from 'react';
import BlogPosts from './BlogPosts';
import { postsData, categoriesData } from '@/lib/static-data';

export default async function BlogPage() {
  const initialData = { posts: postsData, categories: categoriesData };

  return <BlogPosts initialData={initialData} />;
}
