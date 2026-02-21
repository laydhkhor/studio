'use client'

import dynamic from 'next/dynamic';
import HeroSection from '@/components/blocks/HeroSection';
import { Skeleton } from '@/components/ui/skeleton';
import { useLiveQuery } from 'next-sanity/live';
import {
    homePageQuery,
    aboutPageQuery,
    pricingPageQuery,
    testimonialsQuery,
    clinicPageQuery,
    faqPageQuery,
  } from '@/sanity/queries';

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

export default function HomePage({
    home: initialHome,
    about: initialAbout,
    pricing: initialPricing,
    testimonials: initialTestimonials,
    clinic: initialClinic,
    faq: initialFaq
}) {

    const [home] = useLiveQuery(initialHome, homePageQuery);
    const [about] = useLiveQuery(initialAbout, aboutPageQuery);
    const [pricing] = useLiveQuery(initialPricing, pricingPageQuery);
    const [testimonials] = useLiveQuery(initialTestimonials, testimonialsQuery);
    const [clinic] = useLiveQuery(initialClinic, clinicPageQuery);
    const [faq] = useLiveQuery(initialFaq, faqPageQuery);

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
    )
}