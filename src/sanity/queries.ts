import { groq } from 'next-sanity';

export const homePageQuery = groq`*[_type == "home"][0]{
  ...,
  "heroImage": hero.image,
  "heroImageHint": hero.imageHint,
  "heroHeading": hero.heading,
  "heroSubheading": hero.subheading,
  "heroKicker": hero.kicker,
  "featuredBlogsData": featuredBlogs.blogs[]->{
    "id": _id,
    title,
    "slug": slug.current,
    mainImage,
    imageHint,
    excerpt
  }
}`;
export const aboutPageQuery = groq`*[_type == "about"][0]`;
export const pricingPageQuery = groq`*[_type == "pricing"][0]`;
export const testimonialsQuery = groq`*[_type == "testimonial"] | order(date desc)`;
export const clinicPageQuery = groq`*[_type == "clinicPage"][0]`;
export const faqPageQuery = groq`*[_type == "faqPage"][0]`;
