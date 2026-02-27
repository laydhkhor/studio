import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, Users, Stethoscope, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/card';

export default function HeroSection({ home, about }: { home: any, about: any }) {
  return (
    <section className="relative bg-gradient-to-b from-secondary/50 to-background overflow-hidden py-20 lg:py-32">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-3xl animate-blob [animation-delay:2s]"></div>
      </div>

      <div className="container z-10 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold font-ui uppercase tracking-widest">
               <ShieldCheck className="h-4 w-4" />
               {home?.heroKicker}
            </div>
            
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-foreground"
              dangerouslySetInnerHTML={{ __html: home?.heroHeading?.replace(/Health/g, '<span class="text-primary">Health</span>').replace(/Priority/g, '<span class="text-primary">Priority</span>').replace(/\n/g, '<br />') ?? '' }}
            />
            
            <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-muted-foreground leading-relaxed"
             dangerouslySetInnerHTML={{ __html: home?.heroSubheading?.replace(/Dr. Pritam Pattyanayek/g, '<span class="font-bold text-primary">Dr. Pritam Pattyanayek</span>') ?? '' }}
            />
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 font-ui pt-4">
              <Button size="lg" asChild className="w-full sm:w-auto h-14 px-8 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                <Link href="/login?redirect=/booking">
                  Book an Appointment <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto h-14 px-8 text-lg bg-background/50 backdrop-blur-sm"
              >
                <Link href="/clinic">View Clinics</Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Image and Cards */}
          <div className="relative flex justify-center items-center">
            <div className="relative group">
                {/* Main Doctor Image */}
                {home?.heroImage && (
                  <div className="relative z-10 p-4 bg-background rounded-full shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                    <Image
                      src={home.heroImage}
                      alt="Dr. Pritam Pattyanayek"
                      width={500}
                      height={500}
                      className="rounded-full object-cover aspect-square z-10 relative"
                      data-ai-hint={home.heroImageHint}
                      priority
                    />
                  </div>
                )}
                
                {/* Decorative Shapes */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full animate-blob [animation-duration:10s]"></div>
                <div className="absolute -inset-8 border-2 border-dashed border-primary/10 rounded-full animate-spin [animation-duration:30s]"></div>

                {/* Floating Stats Card */}
                <Card className="absolute -bottom-6 -left-12 lg:-left-20 z-20 p-6 shadow-2xl bg-card/90 backdrop-blur-xl w-72 border-primary/10 animate-float">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <Award className="text-primary size-6" />
                            </div>
                            <div>
                              <p className="text-sm font-ui text-muted-foreground">Experience</p>
                              <p className="font-headline font-bold text-lg">{about?.experience}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-accent/10 p-2 rounded-lg">
                              <Users className="text-accent size-6" />
                            </div>
                            <div>
                              <p className="text-sm font-ui text-muted-foreground">Happy Patients</p>
                              <p className="font-headline font-bold text-lg">{about?.patientsServed}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <Stethoscope className="text-primary size-6" />
                            </div>
                            <div>
                              <p className="text-sm font-ui text-muted-foreground">Consultations</p>
                              <p className="font-headline font-bold text-lg">{about?.consultationsDone}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Top Badge */}
                <div className="absolute -top-4 -right-4 z-20 bg-accent text-accent-foreground px-4 py-2 rounded-full font-bold shadow-lg text-sm font-ui uppercase tracking-tighter flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                   Online Now
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}