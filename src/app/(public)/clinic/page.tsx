import ClinicDetailsSection from '@/components/blocks/ClinicDetailsSection';
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { LiveQuery } from 'next-sanity/preview/live-query';

export const metadata: Metadata = {
  title: 'Our Clinics in Mahishadal & Nandakumar | DocAssist',
  description: "Find clinic locations, timings, and contact information for Dr. Pritam Pattyanayek's practices in Mahishadal and Nandakumar.",
};

const query = groq`*[_type == "clinicPage"][0]`;

export default async function ClinicPage() {
  const { isEnabled } = draftMode();
  const data = await client.fetch(query);

  return (
    <LiveQuery enabled={isEnabled} query={query} initialData={data} as="div">
      {({ data: liveData }) => <ClinicDetailsSection clinicLocations={liveData.clinicLocations} />}
    </LiveQuery>
  )
}
