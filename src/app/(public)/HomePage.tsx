'use client'

import dynamic from 'next/dynamic';
import HeroSection from '@/components/blocks/HeroSection';
import { Skeleton } from '@/components/ui/skeleton';
import { useLiveQuery, LiveQueryProvider } from 'next-sanity';
import {
    homePageQuery,
    aboutPageQuery,
    pricingPageQuery,
    testimonialsQuery,
    clinicPageQuery,
    faqPageQuery,
  } from '@/sanity/queries';
import { previewClient } from '@/sanity/client';

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

function HomePageContent({
    home: initialHome,
    about: initialAbout,
    pricing: initialPricing,
    testimonials: initialTestimonials,
    clinic: initialClinic,
    faq: initialFaq,
    isPreview
}: {
    home: any,
    about: any,
    pricing: any,
    testimonials: any,
    clinic: any,
    faq: any,
    isPreview: boolean
}) {
    const [home] = useLiveQuery(initialHome, homePageQuery, {}, { enabled: isPreview });
    const [about] = useLiveQuery(initialAbout, aboutPageQuery, {}, { enabled: isPreview });
    const [pricing] = useLiveQuery(initialPricing, pricingPageQuery, {}, { enabled: isPreview });
    const [testimonials] = useLiveQuery(initialTestimonials, testimonialsQuery, {}, { enabled: isPreview });
    const [clinic] = useLiveQuery(initialClinic, clinicPageQuery, {}, { enabled: isPreview });
    const [faq] = useLiveQuery(initialFaq, faqPageQuery, {}, { enabled: isPreview });

    const content = (
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

    if (isPreview) {
        return (
            <LiveQueryProvider client={previewClient}>
                {content}
            </LiveQueryProvider>
        )
    }

    return content;
}


export default function HomePage({
    home,
    about,
    pricing,
    testimonials,
    clinic,
    faq,
    isPreview
}: {
    home: any,
    about: any,
    pricing: any,
    testimonials: any,
    clinic: any,
    faq: any,
    isPreview: boolean
}) {

    return (
        <HomePageContent
            home={home}
            about={about}
            pricing={pricing}
            testimonials={testimonials}
            clinic={clinic}
            faq={faq}
            isPreview={isPreview}
        />
    )
}
