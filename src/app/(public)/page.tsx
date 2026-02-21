import dynamic from 'next/dynamic';
import HeroSection from '@/components/blocks/HeroSection';
import { Skeleton } from '@/components/ui/skeleton';
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import { draftMode } from 'next/headers';

const LoadingSkeleton = () => (
  <div className="w-full py-20 md:py-28">
    <div className="container">
      <Skeleton className="h-48 w-full" />
    </div>
  </div>
);

const StatsSection = dynamic(
  () => import('@/components/blocks/StatsSection'),
  { loading: () => <LoadingSkeleton /> }
);
const PricingSection = dynamic(
  () => import('@/components/blocks/PricingSection'),
  { loading: () => <LoadingSkeleton /> }
);
const ClinicDetailsSection = dynamic(
  () => import('@/components/blocks/ClinicDetailsSection'),
  { loading: () => <LoadingSkeleton /> }
);
const FeaturedBlogsSection = dynamic(
  () => import('@/components/blocks/FeaturedBlogsSection'),
  { loading: () => <LoadingSkeleton /> }
);
const TestimonialsSection = dynamic(
  () => import('@/components/blocks/TestimonialsSection'),
  { loading: () => <LoadingSkeleton /> }
);
const FaqSection = dynamic(() => import('@/components/blocks/FaqSection'), {
  loading: () => <LoadingSkeleton />,
});

const homePageQuery = groq`*[_type == "home"][0]{
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
const aboutPageQuery = groq`*[_type == "about"][0]`;
const pricingPageQuery = groq`*[_type == "pricing"][0]`;
const testimonialsQuery = groq`*[_type == "testimonial"] | order(date desc)`;
const clinicPageQuery = groq`*[_type == "clinicPage"][0]`;
const faqPageQuery = groq`*[_type == "faqPage"][0]`;

export default async function HomePage() {
  const [home, about, pricing, testimonials, clinic, faq] = await Promise.all([
    client.fetch(homePageQuery),
    client.fetch(aboutPageQuery),
    client.fetch(pricingPageQuery),
    client.fetch(testimonialsQuery),
    client.fetch(clinicPageQuery),
    client.fetch(faqPageQuery),
  ]);

  return (
    <>
      <HeroSection 
        kicker={home?.heroKicker}
        heading={home?.heroHeading}
        subheading={home?.heroSubheading}
        image={home?.heroImage}
        imageHint={home?.heroImageHint}
        patientsServed={about?.patientsServed}
      />
      <StatsSection 
        experience={about?.experience}
        patientsServed={about?.patientsServed}
        positiveReviews={about?.positiveReviews}
        consultationsDone={about?.consultationsDone}
      />
      <PricingSection pricingOptions={pricing?.pricingOptions} />
      <TestimonialsSection testimonials={testimonials} />
      <FeaturedBlogsSection featuredBlogs={home?.featuredBlogsData} />
      <ClinicDetailsSection clinicLocations={clinic?.clinicLocations} />
      <FaqSection faqs={faq?.faqs} />
    </>
  );
}
