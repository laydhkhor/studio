import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Phone, Star, Video } from 'lucide-react';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { urlForImage } from '@/sanity/image';

export default function HeroSection({ kicker, heading, subheading, image, imageHint, patientsServed }: any) {
  const patientAvatar = {
    imageUrl: 'https://picsum.photos/seed/user1/100/100',
    imageHint: 'person smiling'
  };

  return (
    <section className="relative bg-background overflow-hidden py-20 md:py-28">
      <div className="container z-10 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center md:text-left">
            <span className="font-ui font-semibold text-primary tracking-widest uppercase">
              {kicker}
            </span>
            <h1 className="mt-4 font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
              dangerouslySetInnerHTML={{ __html: heading?.replace(/Health/g, '<span class="text-primary">Health</span>').replace(/Priority/g, '<span class="text-primary">Priority</span>').replace(/\n/g, '<br />') }}
            />
            <p className="mt-6 max-w-xl mx-auto md:mx-0 text-lg text-muted-foreground text-justify"
             dangerouslySetInnerHTML={{ __html: subheading?.replace(/Dr. Pritam Pattyanayek/g, '<span class="font-semibold text-primary">Dr. Pritam Pattyanayek</span>') }}
            />
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 font-ui">
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

          {/* Right Column - Image and Floating Elements */}
          <div className="relative mt-12 md:mt-0 flex justify-center items-center h-auto md:h-[500px]">
            <div className="relative flex flex-col items-center">
                {/* Background Blobs */}
                <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob [animation-delay:2s]"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob [animation-delay:4s]"></div>

                {/* Doctor Image */}
                <div className="relative z-10">
                  {image && (
                    <Image
                      src={urlForImage(image).width(400).height(400).url()}
                      alt="Dr. Pritam Pattyanayek"
                      width={400}
                      height={400}
                      className="rounded-full object-cover aspect-square shadow-2xl"
                      data-ai-hint={imageHint}
                      priority
                    />
                  )}
                </div>

                {/* Floating UI Elements for Mobile */}
                <div className="md:hidden mt-8 w-full max-w-xs space-y-4">
                     <Card className="p-3 flex items-center gap-3 shadow-lg">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <Phone className="text-primary" />
                        </div>
                        <div>
                            <p className='font-semibold font-ui text-sm'>Phone Support</p>
                            <p className='text-xs text-muted-foreground'>24/7 Active</p>
                        </div>
                    </Card>
                     <Card className="p-3 flex items-center gap-3 shadow-lg">
                        <div className="p-2 bg-green-100 rounded-full">
                            <Video className="text-accent" />
                        </div>
                         <div>
                            <p className='font-semibold font-ui text-sm'>Video Call</p>
                            <p className='text-xs text-muted-foreground'>Available Now</p>
                        </div>
                    </Card>
                </div>
            </div>


            {/* Floating UI Elements for Desktop */}
            <Card className="absolute z-20 top-12 left-0 p-3 hidden md:flex items-center gap-3 shadow-lg animate-float">
                <div className="p-2 bg-blue-100 rounded-full">
                    <Phone className="text-primary" />
                </div>
                <div>
                    <p className='font-semibold font-ui text-sm'>Phone Support</p>
                    <p className='text-xs text-muted-foreground'>24/7 Active</p>
                </div>
            </Card>
            
             <Card className="absolute z-20 top-1/3 right-10 p-3 hidden md:flex items-center gap-3 shadow-lg animate-float [animation-delay:1s]">
                <div className="p-2 bg-green-100 rounded-full">
                    <Video className="text-accent" />
                </div>
                 <div>
                    <p className='font-semibold font-ui text-sm'>Video Call</p>
                    <p className='text-xs text-muted-foreground'>Available Now</p>
                </div>
            </Card>

            <Card className="absolute z-20 bottom-16 -left-8 p-4 hidden md:block shadow-lg animate-float [animation-delay:2s]">
              <div className="flex items-center gap-3">
                {patientAvatar && <Avatar>
                  <AvatarImage src={patientAvatar.imageUrl} alt="Patient" data-ai-hint={patientAvatar.imageHint}/>
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>}
                <div>
                  <p className="font-semibold font-ui">Anjali S.</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
              </div>
            </Card>

             <Card className="absolute z-20 bottom-4 right-0 p-3 hidden md:flex items-center gap-2 shadow-lg animate-float [animation-delay:3s]">
                <Heart className="h-6 w-6 text-red-500 fill-red-500"/>
                <div>
                    <p className="font-bold text-lg font-headline">{patientsServed}</p>
                    <p className="text-xs text-muted-foreground">Happy Patients</p>
                </div>
             </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
