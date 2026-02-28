'use client';

import { Award, Clock, ShieldCheck, HeartPulse } from 'lucide-react';

export default function WhyChooseUsSection() {
  const features = [
    {
      icon: Award,
      title: 'Expert Diagnosis',
      description: 'Benefit from over 15 years of specialized medical experience and precise clinical diagnosis.',
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Clock,
      title: 'Time Efficiency',
      description: 'Skip the long queues with scheduled appointments and prompt video consultations.',
      iconColor: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: ShieldCheck,
      title: 'Secured Data',
      description: 'Your medical records and prescriptions are stored with enterprise-grade encryption.',
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: HeartPulse,
      title: 'Holistic Care',
      description: 'We don’t just treat symptoms; we focus on your overall wellness and long-term health.',
      iconColor: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-white border-y">
      <div className="container">
        {/* Header Section - Centered at Top */}
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-6">
          <span className="font-ui font-bold text-primary tracking-widest uppercase text-sm">Commitment to Care</span>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-foreground leading-tight">
            Why Patients <span className="text-primary">Choose DocAssist</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We understand that choosing a healthcare provider is a significant decision. Dr. Pattyanayek combines traditional medical wisdom with modern digital convenience.
          </p>
          <div className="pt-4 max-w-xl mx-auto">
             <div className="p-6 bg-secondary/30 rounded-2xl border border-secondary">
                <p className="text-sm font-ui font-medium text-slate-700 italic">
                  "Our goal is to make healthcare seamless, transparent, and patient-focused at every touchpoint."
                </p>
                <p className="mt-2 text-xs font-bold text-primary uppercase tracking-wider">— Clinical Philosophy</p>
             </div>
          </div>
        </div>

        {/* Feature Grid - Full Width Below */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
              <div className={`${feature.bgColor} ${feature.iconColor} w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-headline text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground font-ui text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
