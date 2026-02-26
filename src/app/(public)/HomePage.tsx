import dynamic from 'next/dynamic';
import HeroSection from '@/components/blocks/HeroSection';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton = () => (
  <div className="w-full py-20 md:py-28">
    <div className="container">
      <Skeleton className="h-48 w-full" />
    </div>
  </div>
);

const AboutSection = dynamic(
  () => import('@/components/blocks/AboutSection'),
  { loading: () => <LoadingSkeleton /> }
);
const BookingSection = dynamic(
  () => import('@/components/blocks/BookingSection'),
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
const TestimonialsSection = dynamic(
  () => import('@/components/blocks/TestimonialsSection'),
  { loading: () => <LoadingSkeleton /> }
);
const FeaturedBlogsSection = dynamic(
  () => import('@/components/blocks/FeaturedBlogsSection'),
  { loading: () => <LoadingSkeleton /> }
);
const FaqSection = dynamic(() => import('@/components/blocks/FaqSection'), {
  loading: () => <LoadingSkeleton />,
});

export default function HomePage({
    home,
    about,
    booking,
    pricing,
    testimonials,
    clinic,
    faq
}: {
    home: any,
    about: any,
    booking: any,
    pricing: any,
    testimonials: any,
    clinic: any,
    faq: any
}) {
    return (
      <>
        {/* 1. Hero */}
        <HeroSection 
            home={home}
            about={about}
        />

        {/* 2. About Doctor / Trust Section */}
        <AboutSection about={about} />

        {/* 3. Booking Form */}
        <BookingSection bookingData={booking} />

        {/* 4. Services + Pricing */}
        <PricingSection pricingOptions={pricing?.pricingOptions} />

        {/* 5. Clinic Location & Timings */}
        <ClinicDetailsSection clinicLocations={clinic?.clinicLocations} />

        {/* 6. Testimonials */}
        <TestimonialsSection testimonials={testimonials} />

        {/* 7. Health Tips / Blog */}
        <FeaturedBlogsSection featuredBlogs={home?.featuredBlogs} />

        {/* 8. FAQ */}
        <FaqSection faqs={faq?.faqs} />
      </>
    );
}
