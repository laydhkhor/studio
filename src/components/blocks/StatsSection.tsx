import { doctorDetails } from '@/lib/placeholder-data';
import { Award, Users } from 'lucide-react';

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
  ];

  return (
    <section className="bg-card">
      <div className="container px-4 py-12 md:px-6">
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:divide-x divide-border">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-6 justify-center">
              <stat.icon className="h-12 w-12 text-primary" />
              <div>
                <p className="font-headline text-4xl font-bold">{stat.value}</p>
                <p className="text-muted-foreground font-ui">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
