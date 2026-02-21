import ClinicDetailsSection from '@/components/blocks/ClinicDetailsSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Clinics in Mahishadal & Nandakumar | DocAssist',
  description: "Find clinic locations, timings, and contact information for Dr. Pritam Pattyanayek's practices in Mahishadal and Nandakumar.",
};

export default function ClinicPage() {
  return <ClinicDetailsSection />;
}
