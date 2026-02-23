
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
        <HeroSection 
            home={home}
            about={about}
        />
        <BookingSection bookingData={booking} />
        <PricingSection pricingOptions={pricing?.pricingOptions} />
        <TestimonialsSection testimonials={testimonials} />
        <FeaturedBlogsSection featuredBlogs={home?.featuredBlogs} />
        <ClinicDetailsSection clinicLocations={clinic?.clinicLocations} />
        <FaqSection faqs={faq?.faqs} />
      </>
    );
}
