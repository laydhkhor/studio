import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function PricingSection({ pricingOptions }: any) {
  if (!pricingOptions) {
    return null;
  }
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-20">
          <span className="font-ui font-bold text-primary tracking-widest uppercase text-sm">Services</span>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-foreground">
            Consultation <span className="text-primary">Packages</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Professional medical care delivered through your preferred medium. 
          </p>
           <div className="pt-4">
            <Button asChild variant="ghost" className="font-ui transition-all">
              <Link href="/pricing" className="flex items-center">
                Compare Plan Features <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {pricingOptions.map((option: any, index: number) => (
            <Card
              key={index}
              className={cn(
                "group flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-3xl overflow-hidden relative",
                option.tag === 'Most Popular' ? 'ring-2 ring-primary scale-[1.02] z-10' : 'bg-slate-50/50'
              )}
            >
              {option.tag === 'Most Popular' && (
                <div className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest py-1 px-4 absolute top-4 right-4 rounded-full flex items-center gap-1">
                   <Sparkles className="h-3 w-3" />
                   Popular
                </div>
              )}

              <CardHeader className="p-8 pb-4">
                <CardTitle className="font-headline text-3xl font-bold">{option.type}</CardTitle>
                <CardDescription className="font-ui text-primary font-semibold">{option.platform}</CardDescription>
              </CardHeader>

              <CardContent className="p-8 pt-0 flex flex-col flex-grow">
                 <div className='flex-grow space-y-6'>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline text-5xl font-bold">{option.price}</span>
                    <span className="text-muted-foreground font-ui text-sm">/ session</span>
                  </div>
                  
                  <p className="text-muted-foreground font-ui text-base leading-relaxed">{option.description}</p>
                
                  <ul className="space-y-4 pt-6 border-t border-dashed">
                    {option.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span className="text-sm font-ui text-foreground/80 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                 </div>
              </CardContent>

              <CardFooter className="p-8 bg-card">
                <Button asChild variant={option.tag === 'Most Popular' ? 'default' : 'outline'} className="w-full h-14 text-base font-bold font-ui rounded-xl shadow-md transition-all group-hover:scale-[1.02]">
                  <Link href="/login?redirect=/booking">{option.cta} <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
