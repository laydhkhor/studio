
import HomePage from './HomePage';
import {
  homeData,
  aboutData,
  pricingData,
  testimonialsData,
  clinicData,
  faqData,
} from '@/lib/static-data';

export default async function Page() {
  return (
    <HomePage
      home={homeData}
      about={aboutData}
      pricing={pricingData}
      testimonials={testimonialsData}
      clinic={clinicData}
      faq={faqData}
    />
  );
}
