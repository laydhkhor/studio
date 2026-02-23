
import HomePage from './HomePage';
import {
  homeData,
  aboutData,
  pricingData,
  testimonialsData,
  clinicData,
  faqData,
} from '@/lib/static-data';

// Note: Sanity fetching is commented out to use static data.
// You can re-enable this when you are ready to connect to your CMS.
// import { draftMode } from 'next/headers';
// import { getClient } from '@/sanity/client';
// import {
//   homePageQuery,
//   aboutPageQuery,
//   pricingPageQuery,
//   testimonialsQuery,
//   clinicPageQuery,
//   faqPageQuery,
// } from '@/sanity/queries';

export default async function Page() {
  // const { isEnabled } = draftMode();
  // const client = getClient(isEnabled);

  // const [home, about, pricing, testimonials, clinic, faq] = await Promise.all([
  //   client.fetch(homePageQuery, {}, { next: { tags: ['home'] } }),
  //   client.fetch(aboutPageQuery, {}, { next: { tags: ['about'] } }),
  //   client.fetch(pricingPageQuery, {}, { next: { tags: ['pricing'] } }),
  //   client.fetch(testimonialsQuery, {}, { next: { tags: ['testimonial'] } }),
  //   client.fetch(clinicPageQuery, {}, { next: { tags: ['clinicPage'] } }),
  //   client.fetch(faqPageQuery, {}, { next: { tags: ['faqPage'] } }),
  // ]);

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
