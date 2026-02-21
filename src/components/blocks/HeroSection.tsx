import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { doctorDetails } from '@/lib/placeholder-data';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const heroImage = PlaceHolderImages.find(
    (img) => img.id === 'hero-background'
  );

  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          priority
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
      
      <div className="relative z-10 container text-center px-4 md:px-6">
        <h2 className="text-lg md:text-xl font-ui font-medium tracking-widest uppercase text-white/90">
          HEALTHCARE FOR {doctorDetails.targetSeoLocations.toUpperCase()}
        </h2>
        <h1 className="mt-4 font-headline text-4xl md:text-6xl font-bold tracking-tight">
          Compassionate &amp; Expert Medical Care
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-white/90">
          With Dr. Pritam Pattyanayek, receive personalized healthcare solutions tailored to your needs.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 font-ui">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href="/login?redirect=/booking">
              Book an Appointment <ArrowRight className="ml-2" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-primary">
            <Link href="/about">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
