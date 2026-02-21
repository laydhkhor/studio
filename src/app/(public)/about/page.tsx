import Image from 'next/image';
import { Award, GraduationCap, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import { urlForImage } from '@/sanity/image';

const aboutPageQuery = groq`*[_type == "about"][0]`;

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch(aboutPageQuery, {}, {
    next: {
      tags: ['about']
    }
  });
  return {
    title: `About ${data?.doctorName || 'Us'} | DocAssist`,
    description: `Learn more about ${data?.doctorName || 'our doctor'}, his mission, education, and experience in providing quality healthcare.`,
  };
}

export default async function AboutPage() {
  const data = await client.fetch(aboutPageQuery, {}, {
    next: {
      tags: ['about']
    }
  });

  return (
    <div className="py-20 md:py-28">
      <div className="container">
        <header className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">About <span className="text-primary">{data?.doctorName}</span></h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            A dedicated and compassionate <span className="text-primary">healthcare</span> professional committed to your well-being.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1 flex justify-center">
            {data?.image && (
              <Image
                src={urlForImage(data.image).width(350).height(350).url()}
                alt={data.doctorName || 'Doctor'}
                width={350}
                height={350}
                className="rounded-full object-cover aspect-square shadow-lg"
                data-ai-hint={data.imageHint}
              />
            )}
          </div>
          <div className="lg:col-span-2 space-y-6 text-justify">
            <h2 className="font-headline text-3xl font-semibold">Our Mission</h2>
            <p className="text-muted-foreground text-lg" dangerouslySetInnerHTML={{ __html: data?.missionStatement?.replace(/healthcare/g, '<span class="text-primary">healthcare</span>').replace(/health/g, '<span class="text-primary">health</span>').replace(/priorities/g, '<span class="text-primary">priorities</span>').replace(/Dr. Pattyanayek/g, '<span class="font-semibold text-primary">Dr. Pattyanayek</span>') ?? '' }}/>

            <p className="text-muted-foreground text-lg">{data?.bio}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t">
              <div className="flex items-center gap-4">
                <GraduationCap className="h-10 w-10 text-primary" />
                <div>
                  <h3 className="font-semibold font-ui">Education</h3>
                  <p className="text-sm text-muted-foreground">{data?.education}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Award className="h-10 w-10 text-primary" />
                <div>
                  <h3 className="font-semibold font-ui">Experience</h3>
                  <p className="text-sm text-muted-foreground">{data?.experience}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Users className="h-10 w-10 text-primary" />
                <div>
                  <h3 className="font-semibold font-ui">Patients Served</h3>
                  <p className="text-sm text-muted-foreground">{data?.patientsServed}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
