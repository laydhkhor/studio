
import HomePage from './HomePage';
import {
  homeData,
  aboutData,
  pricingData,
  testimonialsData,
  clinicData,
  faqData,
  bookingData,
} from '@/lib/static-data';

export default async function Page() {
  return (
    <HomePage
      home={homeData}
      about={aboutData}
      booking={bookingData}
      pricing={pricingData}
      testimonials={testimonialsData}
      clinic={clinicData}
      faq={faqData}
    />
  );
}
