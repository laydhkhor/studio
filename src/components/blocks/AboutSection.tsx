'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, ArrowRight, ShieldCheck, CheckCircle2, Activity } from 'lucide-react';

export default function AboutSection({ about }: { about: any }) {
  if (!about) return null;

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container">
        {/* Section Title */}
        <div className="mx-auto max-w-3xl text-center mb-20 space-y-4 px-4">
          <span className="font-ui font-bold text-primary tracking-widest uppercase text-sm">Professional Profile</span>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-slate-900">
            Meet Your <span className="text-primary">Physician</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-justify">
            A legacy of compassionate care and clinical excellence in Purba Medinipur.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Container */}
          <div className="relative flex justify-center lg:justify-start lg:sticky lg:top-32">
            <div className="relative w-full max-w-[320px] sm:max-w-[450px]">
              <div className="relative z-10">
                <Image
                  src={about.image}
                  alt={about.doctorName}
                  width={450}
                  height={450}
                  className="w-full h-auto rounded-3xl object-cover aspect-square shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] border-4 border-white mx-auto"
                  data-ai-hint={about.imageHint}
                />
              </div>
              
              {/* Trust Badge overlay */}
              <div className="absolute -bottom-8 -right-8 bg-accent text-accent-foreground p-6 rounded-2xl shadow-xl z-20 hidden md:flex items-center gap-4 border-4 border-white">
                 <div className="bg-white/20 p-2 rounded-lg">
                    <ShieldCheck className="h-10 w-10" />
                 </div>
                 <div>
                    <p className="font-headline font-bold text-xl leading-tight">WBMC Registered</p>
                    <p className="text-sm font-ui opacity-90">Medical Specialist</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h3 className="font-headline text-3xl md:text-4xl font-bold text-left">
                <span className="text-primary">{about.doctorName}</span>
              </h3>
              
              <div className="space-y-4">
                <p className="text-lg font-bold text-slate-800 text-left">Key Highlights:</p>
                <ul className="space-y-3">
                  {about.highlights?.map((highlight: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-1" />
                      <span className="text-muted-foreground leading-relaxed text-justify">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="space-y-6">
               <p className="text-lg font-bold text-slate-800 text-left">Clinical Expertise:</p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {about.services?.slice(0, 4).map((service: any, i: number) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 group hover:bg-white hover:shadow-md transition-all">
                      <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{service.title}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-lg font-ui rounded-xl shadow-lg shadow-primary/20 transition-all">
                <Link href="/about">
                  Full Medical Profile <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
               <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-ui rounded-xl transition-all">
                <Link href="/contact">Contact Info</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
