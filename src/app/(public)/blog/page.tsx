import * as React from 'react';
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import { draftMode } from 'next/headers';
import BlogPosts from './BlogPosts';

const blogPageQuery = groq`{
  "posts": *[_type == "post"]{
    _id,
    title,
    "slug": slug.current,
    mainImage,
    imageHint,
    excerpt,
    "category": category->title,
    "date": publishedAt
  } | order(date desc),
  "categories": *[_type == "category"].title
}`;

export default async function BlogPage() {
  const { isEnabled } = draftMode();
  const initialData = await client.fetch(blogPageQuery);
  
  return <BlogPosts initialData={initialData} isEnabled={isEnabled} query={blogPageQuery} />;
}
