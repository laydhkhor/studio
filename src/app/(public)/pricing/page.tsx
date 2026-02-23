
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { pricingData } from '@/lib/static-data';

// Note: Sanity fetching is commented out to use static data.
// import { client } from '@/sanity/client';
// import { groq } from 'next-sanity';

export const metadata: Metadata = {
  title: 'Pricing & Plans | DocAssist',
  description:
    'Compare our flexible consultation options: Chat, Video, and In-Clinic visits. Choose the plan that best suits your healthcare needs.',
};

// const query = groq`*[_type == "pricing"][0]`;

export default async function PricingPage() {
  // const data = await client.fetch(query, {}, {
  //   next: {
  //     tags: ['pricing']
  //   }
  // });
  const data = pricingData;
  const { pricingOptions, consultationFeatures } = data || {};

  const plans = ['chat', 'video', 'clinic'] as const;

  const categoryStartIndices = consultationFeatures?.reduce(
    (acc: any, category: any, index: number) => {
      if (index === 0) {
        acc.push(0);
      } else {
        acc.push(acc[index - 1] + consultationFeatures[index - 1].items.length);
      }
      return acc;
    },
    [] as number[]
  ) || [];

  const parseValue = (value: string) => {
    if (value && value.toLowerCase() === 'true') return true;
    if (value && value.toLowerCase() === 'false') return false;
    return value;
  }

  if (!data) {
    return null; // or a loading/error state
  }

  return (
    <div className="py-20 md:py-28">
      <div className="container">
        <header className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">
            {data.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            {data.subtitle}
          </p>
        </header>

        <div className="mx-auto max-w-7xl">
          <div className="hidden lg:grid grid-cols-4 gap-px bg-border rounded-lg overflow-hidden">
            {/* Header Row */}
            <div className="bg-card p-6 flex items-center">
              <h2 className="font-headline text-xl font-semibold">Features</h2>
            </div>
            {pricingOptions?.map((plan: any) => (
              <div
                key={plan.type}
                className="bg-card p-6 text-center flex flex-col justify-center items-center"
              >
                {plan.tag && (
                  <Badge className={cn(
                    "mb-2 w-fit mx-auto font-ui",
                    plan.tag === 'Most Popular' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}>
                    {plan.tag}
                  </Badge>
                )}
                <h3 className="font-headline text-xl font-semibold">
                  {plan.type}
                </h3>
                <p className="text-sm text-muted-foreground">{plan.platform}</p>
              </div>
            ))}

            {/* Feature Rows */}
            {consultationFeatures?.map((category: any, categoryIndex: number) => (
              <React.Fragment key={category.category}>
                {/* Category Header */}
                <div className="col-span-4 bg-muted px-6 py-3">
                  <h4 className="font-ui font-semibold text-muted-foreground">
                    {category.category}
                  </h4>
                </div>
                {/* Items */}
                {category.items.map((item: any, itemIndex: number) => {
                  const globalIndex =
                    categoryStartIndices[categoryIndex] + itemIndex;
                  const rowBgClass =
                    globalIndex % 2 === 0 ? 'bg-card' : 'bg-muted/50';

                  return (
                    <React.Fragment key={item.feature}>
                      <div className={cn('p-6 flex items-center', rowBgClass)}>
                        <p className="font-ui text-sm">{item.feature}</p>
                      </div>
                      {plans.map((plan) => {
                        const value = parseValue(item[plan as keyof typeof item]);
                        return (
                          <div
                            key={plan}
                            className={cn(
                              'p-6 text-center flex justify-center items-center',
                              rowBgClass
                            )}
                          >
                            {typeof value === 'boolean' ? (
                              value ? (
                                <Check className="h-6 w-6 text-green-500" />
                              ) : (
                                <X className="h-6 w-6 text-destructive" />
                              )
                            ) : (
                              <p className="text-sm text-foreground">{value}</p>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))}

            {/* Footer/CTA Row */}
            <div className="bg-card p-6"></div>
            {pricingOptions?.map((plan: any) => (
              <div
                key={plan.type}
                className="bg-card p-6 text-center flex items-center justify-center"
              >
                <Button asChild className="w-full font-ui">
                  <Link href="/login?redirect=/booking">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Mobile View */}
          <div className="lg:hidden grid grid-cols-1 gap-8">
            {pricingOptions?.map((plan: any) => {
              const planKey = plan.type
                .toLowerCase()
                .split(' ')[0] as 'chat' | 'video' | 'clinic';
              return (
                <Card
                  key={plan.type}
                  className={cn(
                    'shadow-lg',
                    plan.tag === 'Most Popular' && 'border-primary border-2'
                  )}
                >
                  <CardHeader className="text-center">
                    {plan.tag && (
                      <Badge className={cn(
                        "w-fit mx-auto mb-2 font-ui",
                        plan.tag === 'Most Popular' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      )}>
                        {plan.tag}
                      </Badge>
                    )}
                    <CardTitle className="font-headline text-2xl">
                      {plan.type}
                    </CardTitle>
                    <CardDescription>{plan.platform}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="font-headline text-4xl font-bold mb-2">
                        {plan.price}
                      </p>
                    </div>
                    <ul className="space-y-3">
                      {consultationFeatures
                        ?.flatMap((cat: any) => cat.items)
                        .map((item: any) => {
                          const value = parseValue(item[planKey as keyof typeof item]);
                          return (
                            <li
                              key={item.feature}
                              className="flex items-start gap-3 text-sm"
                            >
                              {typeof value === 'boolean' ? (
                                value ? (
                                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                ) : (
                                  <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                                )
                              ) : (
                                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              )}
                              <div>
                                <span className="font-semibold">
                                  {item.feature}:{' '}
                                </span>
                                <span className="text-muted-foreground">
                                  {typeof value !== 'boolean'
                                    ? value
                                    : value
                                    ? 'Included'
                                    : 'Not Included'}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full font-ui">
                      <Link href="/login?redirect=/booking">{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
