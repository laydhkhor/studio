'use client';

import { doctorDetails } from '@/lib/placeholder-data';
import { Award, Users, Star, Stethoscope } from 'lucide-react';
import AnimatedCounter from '@/components/ui/animated-counter';

export default function StatsSection() {
  const stats = [
    {
      icon: Award,
      value: doctorDetails.experience,
      label: 'Years Experience',
    },
    {
      icon: Users,
      value: doctorDetails.patientsServed,
      label: 'Happy Patients',
    },
    {
      icon: Star,
      value: doctorDetails.positiveReviews,
      label: 'Positive Reviews',
    },
    {
      icon: Stethoscope,
      value: doctorDetails.consultationsDone,
      label: 'Consultations',
    },
  ];

  return (
    <section className="bg-card py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-y-10 text-center sm:grid-cols-2 sm:gap-x-6 md:gap-x-8 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const numericValue = parseInt(stat.value, 10);
            const suffix = stat.value.replace(String(numericValue), '');

            return (
              <div
                key={index}
                className="flex items-center justify-center gap-4"
              >
                <stat.icon className="h-12 w-12 text-primary" />
                <div className="text-left">
                  <p className="font-headline text-4xl font-bold">
                    <AnimatedCounter value={numericValue} />
                    {suffix}
                  </p>
                  <p className="text-muted-foreground font-ui">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
