import Image from 'next/image';
import { Award, GraduationCap, Users, CheckCircle2, Activity, HeartPulse, Stethoscope, ClipboardCheck } from 'lucide-react';
import type { Metadata } from 'next';
import { aboutData } from '@/lib/static-data';

export async function generateMetadata(): Promise<Metadata> {
  const data = aboutData;
  return {
    title: `About ${data?.doctorName || 'Us'} | DocAssist`,
    description: `Learn more about ${data?.doctorName || 'our doctor'}, his clinical expertise, education, and years of experience.`,
  };
}

export default async function AboutPage() {
  const data = aboutData;

  return (
    <div className="py-20 md:py-32 overflow-hidden">
      <div className="container">
        {/* Header Section */}
        <header className="text-center mb-20 px-4">
          <span className="font-ui font-bold text-primary tracking-widest uppercase text-sm">Medical Profile</span>
          <h1 className="font-headline text-4xl md:text-6xl font-bold mt-4">About <span className="text-primary">{data?.doctorName}</span></h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Dedicated to providing evidence-based healthcare with a focus on <span className="text-primary font-semibold">patient wellness</span> and long-term health management.
          </p>
        </header>

        {/* Doctor Identity Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-32 px-4">
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[320px] sm:max-w-[500px]">
              <Image
                src={data.image}
                alt={data.doctorName || 'Doctor'}
                width={500}
                height={500}
                className="w-full h-auto rounded-3xl object-cover aspect-square shadow-2xl border-4 sm:border-8 border-white mx-auto"
                data-ai-hint={data.imageHint}
                priority
              />
              <div className="absolute -bottom-4 left-4 sm:-bottom-6 sm:-left-6 bg-white p-4 sm:p-6 rounded-2xl shadow-xl flex items-center gap-3 sm:gap-4 border border-slate-100">
                 <div className="bg-primary/10 p-2 sm:p-3 rounded-xl text-primary">
                    <Award className="h-6 w-6 sm:h-8 sm:w-8" />
                 </div>
                 <div>
                    <p className="font-headline font-bold text-xl sm:text-2xl leading-tight">{data.experience}</p>
                    <p className="text-[10px] sm:text-xs font-ui uppercase tracking-wider text-muted-foreground">Expertise</p>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-6">
              <h2 className="font-headline text-3xl font-bold text-slate-900 border-l-4 border-primary pl-6">Clinical Philosophy</h2>
              <p className="text-lg text-muted-foreground leading-relaxed italic">
                "{data.bio}"
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-headline text-2xl font-bold text-slate-900">Why Consult Dr. Pattyanayek?</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.highlights?.map((highlight: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-slate-100">
              <div className="flex flex-col items-center sm:items-start gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Education</h3>
                <p className="text-sm font-semibold text-slate-700">{data?.education}</p>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <Users className="h-8 w-8 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Trust</h3>
                <p className="text-sm font-semibold text-slate-700">{data?.patientsServed}+ Patients Served</p>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <Activity className="h-8 w-8 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Rating</h3>
                <p className="text-sm font-semibold text-slate-700">{data?.positiveReviews} Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <section className="bg-slate-900 text-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 overflow-hidden relative mx-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="max-w-3xl mb-16">
              <span className="font-ui font-bold text-primary tracking-widest uppercase text-sm">Our Specialties</span>
              <h2 className="font-headline text-3xl md:text-5xl font-bold mt-4">Core Medical <span className="text-primary">Services</span></h2>
              <p className="mt-6 text-lg text-slate-400 leading-relaxed">
                Comprehensive healthcare services designed to address both acute illnesses and chronic health management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.services?.map((service: any, i: number) => (
                <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                   <div className="bg-primary/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                      {i === 0 && <Stethoscope className="h-6 w-6" />}
                      {i === 1 && <HeartPulse className="h-6 w-6" />}
                      {i === 2 && <Activity className="h-6 w-6" />}
                      {i === 3 && <ClipboardCheck className="h-6 w-6" />}
                      {i === 4 && <Activity className="h-6 w-6" />}
                      {i === 5 && <Users className="h-6 w-6" />}
                   </div>
                   <h3 className="font-headline text-xl font-bold mb-3">{service.title}</h3>
                   <p className="text-slate-400 text-sm leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
