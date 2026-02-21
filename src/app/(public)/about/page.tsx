import Image from 'next/image';
import { doctorDetails } from '@/lib/placeholder-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Award, GraduationCap, Users } from 'lucide-react';

export default function AboutPage() {
  const doctorImage = PlaceHolderImages.find(img => img.id === 'doctor-pritam');

  return (
    <div className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <header className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">About Dr. Pritam Pattyanayek</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            A dedicated and compassionate healthcare professional committed to your well-being.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1 flex justify-center">
            {doctorImage && (
              <Image
                src={doctorImage.imageUrl}
                alt={doctorImage.description}
                width={350}
                height={350}
                className="rounded-full object-cover aspect-square shadow-lg"
                data-ai-hint={doctorImage.imageHint}
              />
            )}
          </div>
          <div className="lg:col-span-2 space-y-6 text-justify">
            <h2 className="font-headline text-3xl font-semibold">Our Mission</h2>
            <p className="text-muted-foreground text-lg">
              Our mission is to provide accessible, high-quality healthcare to the communities of Mahishadal, Nandakumar, and beyond. We believe in a patient-centric approach, where your health and comfort are our top priorities. Dr. Pattyanayek combines modern medical practices with a personal touch to ensure you receive the best possible care.
            </p>
            <p className="text-muted-foreground text-lg">
              Whether you're seeking a routine check-up, managing a chronic condition, or need expert medical advice, we are here to support you on your journey to better health.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t">
              <div className="flex items-center gap-4">
                <GraduationCap className="h-10 w-10 text-primary" />
                <div>
                  <h3 className="font-semibold font-ui">Education</h3>
                  <p className="text-sm text-muted-foreground">{doctorDetails.education}</p>
                </div>
              </div>
               <div className="flex items-center gap-4">
                <Award className="h-10 w-10 text-primary" />
                <div>
                  <h3 className="font-semibold font-ui">Experience</h3>
                  <p className="text-sm text-muted-foreground">{doctorDetails.experience}</p>
                </div>
              </div>
               <div className="flex items-center gap-4">
                <Users className="h-10 w-10 text-primary" />
                <div>
                  <h3 className="font-semibold font-ui">Patients Served</h3>
                  <p className="text-sm text-muted-foreground">{doctorDetails.patientsServed}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
