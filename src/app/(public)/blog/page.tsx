
import * as React from 'react';
import BlogPosts from './BlogPosts';
import { postsData, categoriesData } from '@/lib/static-data';

// Note: Sanity fetching is commented out to use static data.
// import { getClient } from '@/sanity/client';
// import { groq } from 'next-sanity';
// import { draftMode } from 'next/headers';

// const blogPageQuery = groq`{
//   "posts": *[_type == "post"]{
//     _id,
//     title,
//     "slug": slug.current,
//     mainImage,
//     imageHint,
//     excerpt,
//     "category": category->title,
//     "date": publishedAt
//   } | order(date desc),
//   "categories": *[_type == "category"].title
// }`;

export default async function BlogPage() {
  // const { isEnabled } = draftMode();
  // const client = getClient(isEnabled);
  // const initialData = await client.fetch(blogPageQuery, {}, {
  //   next: {
  //     tags: ['post', 'category']
  //   }
  // });
  
  const initialData = { posts: postsData, categories: categoriesData };

  return <BlogPosts initialData={initialData} />;
}
