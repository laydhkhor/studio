import Link from 'next/link';
import { pricingOptions } from '@/lib/placeholder-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function PricingSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            Flexible Consultation Options
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the most convenient way to connect with the doctor.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingOptions.map((option, index) => (
            <Card key={index} className="flex flex-col shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{option.type} Consultation</CardTitle>
                <CardDescription className="font-ui">{option.platform}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="font-headline text-4xl font-bold mb-4">{option.price}</p>
                <p className="text-muted-foreground">{option.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full font-ui">
                  <Link href="/login?redirect=/booking">{option.cta} <ArrowRight className="ml-2"/></Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
