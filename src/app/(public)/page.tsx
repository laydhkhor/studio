import HeroSection from '@/components/blocks/HeroSection';
import StatsSection from '@/components/blocks/StatsSection';
import PricingSection from '@/components/blocks/PricingSection';
import ClinicDetailsSection from '@/components/blocks/ClinicDetailsSection';
import FeaturedBlogsSection from '@/components/blocks/FeaturedBlogsSection';
import TestimonialsSection from '@/components/blocks/TestimonialsSection';
import FaqSection from '@/components/blocks/FaqSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <PricingSection />
      <TestimonialsSection />
      <FeaturedBlogsSection />
      <ClinicDetailsSection />
      <FaqSection />
    </>
  );
}
