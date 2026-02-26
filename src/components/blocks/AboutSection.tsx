'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Award, GraduationCap, Users, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AboutSection({ about }: { about: any }) {
  if (!about) return null;

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Container */}
          <div className="relative flex justify-center">
            <div className="relative">
              <Image
                src={about.image}
                alt={about.doctorName}
                width={400}
                height={400}
                className="rounded-2xl object-cover aspect-square shadow-2xl border-8 border-card z-10 relative"
                data-ai-hint={about.imageHint}
              />
              {/* Trust Badge overlay */}
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-4 rounded-xl shadow-lg z-20 flex items-center gap-3 hidden md:flex border-4 border-background">
                 <ShieldCheck className="h-8 w-8" />
                 <div>
                    <p className="font-headline font-bold leading-tight">Verified</p>
                    <p className="text-xs font-ui opacity-90 text-justify">Medical Practitioner</p>
                 </div>
              </div>
              {/* Experience overlay */}
              <div className="absolute -top-6 -right-6 bg-primary text-primary-foreground p-5 rounded-xl shadow-lg z-20 hidden md:block border-4 border-background">
                 <p className="text-2xl font-bold font-headline leading-tight">{about.experience}</p>
                 <p className="text-xs font-ui opacity-90 text-justify uppercase tracking-wider">Experience</p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold font-ui uppercase tracking-wider">
               <Award className="h-4 w-4" />
               Expert Healthcare
            </div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Meet <span className="text-primary">{about.doctorName}</span>
            </h2>
            <p 
              className="text-lg text-muted-foreground text-justify leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: about.missionStatement }} 
            />
            <p className="text-muted-foreground text-justify leading-relaxed italic border-l-4 border-primary/20 pl-4">
              {about.bio}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
               <div className="flex items-start gap-4">
                  <div className="bg-secondary p-3 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-headline font-semibold text-sm">Top Education</h4>
                    <p className="text-xs text-muted-foreground font-ui">{about.education}</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="bg-secondary p-3 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                   <div>
                    <h4 className="font-headline font-semibold text-sm">Trust Factor</h4>
                    <p className="text-xs text-muted-foreground font-ui">{about.patientsServed} Happy Patients</p>
                  </div>
               </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild className="font-ui">
                <Link href="/about">
                  View Full Profile <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
               <Button asChild variant="outline" className="font-ui">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
