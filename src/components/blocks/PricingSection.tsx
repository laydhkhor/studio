import Link from 'next/link';
import { pricingOptions } from '@/lib/placeholder-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function PricingSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            Flexible Consultation Options
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the most convenient way to connect with the doctor. Each option is tailored to provide you with the best care possible.
          </p>
           <div className="mt-6">
            <Button asChild variant="outline" className="font-ui">
              <Link href="/pricing">
                View Detailed Comparison <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {pricingOptions.map((option, index) => (
            <Card
              key={index}
              className={cn(
                "flex flex-col shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300",
                option.tag === 'Most Popular' && 'border-primary border-2'
              )}
            >
              <CardHeader>
                 {option.tag && (
                  <Badge 
                    className={cn(
                      "w-fit mb-2 font-ui",
                       option.tag === 'Most Popular' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {option.tag}
                  </Badge>
                )}
                <CardTitle className="font-headline text-2xl">{option.type} Consultation</CardTitle>
                <CardDescription className="font-ui">{option.platform}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                 <div className='flex-grow'>
                  <p className="font-headline text-4xl font-bold mb-2">{option.price}</p>
                  <p className="text-muted-foreground text-sm min-h-[40px] text-justify">{option.description}</p>
                
                  <ul className="space-y-3 text-sm text-muted-foreground pt-6 mt-6 border-t">
                    {option.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                 </div>
              </CardContent>
              <CardFooter className="mt-auto">
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
