
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, Users, Stethoscope, Star } from 'lucide-react';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function HeroSection({ home, about }: { home: any, about: any }) {

  return (
    <section className="relative bg-secondary/30 overflow-hidden py-20 md:py-28">
      <div className="container z-10 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <span className="font-ui font-semibold text-primary tracking-widest uppercase">
              {home?.heroKicker}
            </span>
            <h1 className="mt-4 font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
              dangerouslySetInnerHTML={{ __html: home?.heroHeading?.replace(/Health/g, '<span class="text-primary">Health</span>').replace(/Priority/g, '<span class="text-primary">Priority</span>').replace(/\n/g, '<br />') ?? '' }}
            />
            <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground text-justify"
             dangerouslySetInnerHTML={{ __html: home?.heroSubheading?.replace(/Dr. Pritam Pattyanayek/g, '<span class="font-semibold text-primary">Dr. Pritam Pattyanayek</span>') ?? '' }}
            />
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 font-ui">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/login?redirect=/booking">
                  Book an Appointment <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href="/clinic">View Clinics</Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Image and Cards */}
          <div className="relative mt-12 lg:mt-0 flex justify-center items-center">
            <div className="relative">
                {/* Doctor Image */}
                {home?.heroImage && (
                    <Image
                      src={home.heroImage}
                      alt="Dr. Pritam Pattyanayek"
                      width={400}
                      height={400}
                      className="rounded-full object-cover aspect-square shadow-2xl z-10 relative border-8 border-background"
                      data-ai-hint={home.heroImageHint}
                      priority
                    />
                )}
                {/* Decorative Background Shape */}
                <div className="absolute -inset-6 bg-primary/10 rounded-full animate-blob [animation-duration:15s]"></div>
                 <div className="absolute -inset-2 border-2 border-dashed border-primary/20 rounded-full animate-spin [animation-duration:20s]"></div>

                {/* Stats Card */}
                <Card className="absolute -bottom-8 -left-16 z-20 p-4 shadow-lg bg-card/80 backdrop-blur-md w-64 hidden md:block">
                    <h4 className="font-headline text-base font-semibold mb-3">Dr. Pritam Pattyanayek</h4>
                    <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <Award className="text-primary size-5" />
                            <span>{about?.experience} Experience</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="text-primary size-5" />
                            <span>{about?.patientsServed} Happy Patients</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Stethoscope className="text-primary size-5" />
                            <span>{about?.consultationsDone} Consultations</span>
                        </div>
                    </div>
                </Card>

                {/* Review Card */}
                <Card className="absolute -top-10 -right-12 z-20 p-4 shadow-lg bg-card/80 backdrop-blur-md max-w-[250px] hidden md:block">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src="https://picsum.photos/seed/user1/40/40" alt="Patient Anjali S." data-ai-hint="person smiling" />
                            <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold font-ui text-sm">Anjali S.</p>
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">"Incredibly patient and thorough. The best doctor in Mahishadal!"</p>
                </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
