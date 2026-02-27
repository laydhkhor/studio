'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AboutSection({ about }: { about: any }) {
  if (!about) return null;

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container">
        {/* Section Title */}
        <div className="mx-auto max-w-3xl text-center mb-20 space-y-4">
          <span className="font-ui font-bold text-primary tracking-widest uppercase text-sm">Professional Profile</span>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-foreground">
            Meet Your <span className="text-primary">Physician</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A legacy of compassionate care and clinical excellence in Purba Medinipur.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Container */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src={about.image}
                  alt={about.doctorName}
                  width={450}
                  height={450}
                  className="rounded-3xl object-cover aspect-square shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-4 border-white"
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
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="font-headline text-3xl md:text-4xl font-bold">
                <span className="text-primary">{about.doctorName}</span>
              </h3>
              <div 
                className="text-lg text-muted-foreground leading-relaxed text-justify space-y-4" 
                dangerouslySetInnerHTML={{ __html: about.missionStatement }} 
              />
              <p className="text-lg text-muted-foreground leading-relaxed text-justify italic font-medium border-l-4 border-primary pl-6">
                "{about.bio}"
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-headline font-bold">Background</h4>
                  </div>
                  <p className="text-sm text-muted-foreground font-ui pl-11">{about.education}</p>
               </div>
               <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent/10 p-2 rounded-lg">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <h4 className="font-headline font-bold">Track Record</h4>
                  </div>
                  <p className="text-sm text-muted-foreground font-ui pl-11">{about.patientsServed}+ patients served across Mahishadal and Nandakumar.</p>
               </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-lg font-ui rounded-xl shadow-lg shadow-primary/20">
                <Link href="/about">
                  Full Medical Profile <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
               <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-ui rounded-xl border-2 hover:bg-secondary/50">
                <Link href="/contact">Contact Info</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
