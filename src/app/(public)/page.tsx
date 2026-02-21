import { draftMode } from 'next/headers';
import HomePage from './HomePage';
import {
  homePageQuery,
  aboutPageQuery,
  pricingPageQuery,
  testimonialsQuery,
  clinicPageQuery,
  faqPageQuery,
} from '@/sanity/queries';
import { getClient } from '@/sanity/client';

export default async function Page() {
  const { isEnabled } = draftMode();
  const client = getClient(isEnabled);

  const [home, about, pricing, testimonials, clinic, faq] = await Promise.all([
    client.fetch(homePageQuery),
    client.fetch(aboutPageQuery),
    client.fetch(pricingPageQuery),
    client.fetch(testimonialsQuery),
    client.fetch(clinicPageQuery),
    client.fetch(faqPageQuery),
  ]);

  return (
    <HomePage
      home={home}
      about={about}
      pricing={pricing}
      testimonials={testimonials}
      clinic={clinic}
      faq={faq}
      isPreview={isEnabled}
    />
  );
}
