'use client';

import * as React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { testimonials } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

function Rating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [locationFilter, setLocationFilter] = React.useState('All');
  const [ratingFilter, setRatingFilter] = React.useState<number>(0); // 0 for all ratings

  const locations = ['All', ...Array.from(new Set(testimonials.map((t) => t.location)))];
  const ratings = [0, 5, 4, 3, 2, 1]; // 0 for All

  const filteredTestimonials = React.useMemo(() => {
    return testimonials
      .filter((t) => {
        const locationMatch = locationFilter === 'All' || t.location === locationFilter;
        const ratingMatch = ratingFilter === 0 || t.rating === ratingFilter;
        return locationMatch && ratingMatch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [locationFilter, ratingFilter]);

  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            Words from Our Patients
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what people are saying about their experience with DocAssist.
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-2 flex-wrap items-center">
          <p className="font-ui font-semibold self-center mr-2">Filter by Location:</p>
          {locations.map((location) => (
            <Button
              key={location}
              variant={locationFilter === location ? 'default' : 'outline'}
              onClick={() => setLocationFilter(location)}
              className="font-ui"
            >
              {location}
            </Button>
          ))}
        </div>
        
        <div className="mt-4 flex justify-center gap-2 flex-wrap items-center">
           <p className="font-ui font-semibold self-center mr-2">Filter by Rating:</p>
          {ratings.map((rating) => (
            <Button
              key={rating}
              variant={ratingFilter === rating ? 'default' : 'outline'}
              onClick={() => setRatingFilter(rating)}
              className="font-ui flex items-center gap-1"
            >
              {rating === 0 ? 'All' : <>{rating} <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /></>}
            </Button>
          ))}
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: filteredTestimonials.length > 2,
          }}
          className="w-full max-w-5xl mx-auto mt-12"
          key={`${locationFilter}-${ratingFilter}`}
        >
          <CarouselContent>
            {filteredTestimonials.length > 0 ? (
              filteredTestimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="h-full shadow-md flex flex-col">
                      <CardContent className="flex flex-col items-start gap-4 p-6 flex-grow">
                        <div className="flex justify-between w-full items-center">
                          <Rating value={testimonial.rating} />
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(testimonial.date), { addSuffix: true })}
                          </p>
                        </div>
                        <p className="text-base text-muted-foreground flex-grow">
                          "{testimonial.comment}"
                        </p>
                        <div className="flex items-center gap-4 pt-4 border-t w-full">
                          <Avatar>
                            <AvatarImage
                              src={testimonial.avatarUrl}
                              alt={testimonial.name}
                              data-ai-hint={testimonial.avatarHint}
                            />
                            <AvatarFallback>
                              {testimonial.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold font-ui">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground font-ui">
                              {testimonial.location}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            ) : (
              <div className="w-full text-center text-muted-foreground py-16">
                  No testimonials found for the selected filters.
              </div>
            )}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex"/>
          <CarouselNext className="hidden md:flex"/>
        </Carousel>
      </div>
    </section>
  );
}