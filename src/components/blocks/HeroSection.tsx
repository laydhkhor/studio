import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, Users, Stethoscope, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function HeroSection({ home, about }: { home: any, about: any }) {
  return (
    <section className="relative bg-white overflow-hidden border-b">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container z-10 relative py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8 max-w-2xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold font-ui uppercase tracking-widest border border-primary/20">
               <ShieldCheck className="h-3.5 w-3.5" />
               Registered Medical Practitioner
            </div>
            
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] text-slate-900">
              Trusted <span className="text-primary">Medical Care</span> <br className="hidden md:block" />
              for Your Family's Health
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-body">
              Experience the highest standard of healthcare with <span className="font-semibold text-primary">Dr. Pritam Pattyanayek</span>. Providing compassionate, evidence-based medical consultations in Mahishadal and Nandakumar.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button size="lg" asChild className="w-full sm:w-auto h-14 px-10 text-lg font-ui rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                <Link href="/login?redirect=/booking">
                  Book Appointment <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto h-14 px-10 text-lg font-ui rounded-xl border-2 hover:bg-slate-50"
              >
                <Link href="/clinic">Our Locations</Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-500 font-ui">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <span>Video & Chat Support</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-ui">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <span>Digital Prescriptions</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-ui">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <span>15+ Years Excellence</span>
              </div>
            </div>
          </div>

          {/* Right Column - Professional Image Block */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-[500px]">
                {/* Main Image Container */}
                <div className="relative z-10 p-2 bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] border border-slate-100">
                    <div className="overflow-hidden rounded-2xl bg-slate-50">
                      <Image
                        src={home.heroImage}
                        alt="Dr. Pritam Pattyanayek"
                        width={600}
                        height={600}
                        className="w-full h-auto object-cover aspect-[4/5] md:aspect-square"
                        data-ai-hint={home.heroImageHint}
                        priority
                      />
                    </div>
                </div>

                {/* Vertical Credential Bar */}
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-4 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/50 w-64">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2.5 rounded-xl">
                          <Award className="text-primary size-6" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Experience</p>
                          <p className="font-headline font-bold text-slate-900">{about?.experience}</p>
                        </div>
                    </div>
                    <div className="h-px bg-slate-100 w-full"></div>
                    <div className="flex items-center gap-4">
                        <div className="bg-accent/10 p-2.5 rounded-xl">
                          <Users className="text-accent size-6" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Patient Trust</p>
                          <p className="font-headline font-bold text-slate-900">{about?.patientsServed}+</p>
                        </div>
                    </div>
                    <div className="h-px bg-slate-100 w-full"></div>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2.5 rounded-xl">
                          <Stethoscope className="text-primary size-6" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Consultations</p>
                          <p className="font-headline font-bold text-slate-900">{about?.consultationsDone}+</p>
                        </div>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute -top-4 -right-4 z-20 bg-white border border-slate-100 text-accent px-4 py-2 rounded-2xl font-bold shadow-2xl text-[10px] font-ui uppercase tracking-widest flex items-center gap-2.5">
                   <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                   </span>
                   Available Now
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
