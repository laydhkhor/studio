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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { testimonials } from '@/lib/placeholder-data';
import { formatDistanceToNow } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

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

function TimeAgo({ date }: { date: string }) {
  const [timeAgo, setTimeAgo] = React.useState<string>('\u00A0'); // non-breaking space

  React.useEffect(() => {
    // This will only run on the client, after initial hydration
    setTimeAgo(formatDistanceToNow(new Date(date), { addSuffix: true }));
  }, [date]);

  // We give it a fixed width to prevent layout shift when the time loads
  return (
    <p className="text-xs text-muted-foreground w-24 text-right">
      {timeAgo}
    </p>
  );
}

export default function TestimonialsSection() {
  const [locationFilter, setLocationFilter] = React.useState('All');
  const [ratingFilter, setRatingFilter] = React.useState<number>(0);
  const [sortBy, setSortBy] = React.useState('newest');
  const [imgErrors, setImgErrors] = React.useState<Record<number, boolean>>({});

  const locations = ['All', ...Array.from(new Set(testimonials.map((t) => t.location)))];
  const ratings = [0, 5, 4, 3, 2, 1]; // 0 for All

  const filteredTestimonials = React.useMemo(() => {
    let items = [...testimonials];

    // Filter by location
    if (locationFilter !== 'All') {
      items = items.filter((t) => t.location === locationFilter);
    }

    // Filter by rating
    if (ratingFilter !== 0) {
      items = items.filter((t) => t.rating === ratingFilter);
    }

    // Filter by time (for 'lastMonth')
    if (sortBy === 'lastMonth') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      items = items.filter((t) => new Date(t.date) >= oneMonthAgo);
    }

    // Sort
    if (sortBy === 'oldest') {
      items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      // 'newest' and 'lastMonth' are sorted with newest first
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    return items;
  }, [locationFilter, ratingFilter, sortBy]);

  return (
    <section className="bg-secondary py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            Words from Our Patients
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what people are saying about their experience with DocAssist.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full max-w-xs md:w-[200px]">
                <SelectValue placeholder="Filter by Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={String(ratingFilter)} onValueChange={(v) => setRatingFilter(Number(v))}>
              <SelectTrigger className="w-full max-w-xs md:w-[200px]">
                <SelectValue placeholder="Filter by Rating" />
              </SelectTrigger>
              <SelectContent>
                {ratings.map((rating) => (
                  <SelectItem key={rating} value={String(rating)}>
                    {rating === 0 ? 'All Ratings' : `${rating} Star${rating > 1 ? 's' : ''}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full max-w-xs md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="lastMonth">From Last Month</SelectItem>
              </SelectContent>
            </Select>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: filteredTestimonials.length > 2,
          }}
          className="w-full max-w-5xl mx-auto mt-12"
          key={`${locationFilter}-${ratingFilter}-${sortBy}`}
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
                          <TimeAgo date={testimonial.date} />
                        </div>
                        <p className="text-base text-muted-foreground flex-grow text-justify">
                          "{testimonial.comment}"
                        </p>
                        <div className="flex items-center gap-4 pt-4 border-t w-full">
                          <Avatar>
                            {!imgErrors[testimonial.id] ? (
                              <Image
                                src={testimonial.avatarUrl}
                                alt={testimonial.name}
                                width={40}
                                height={40}
                                className="aspect-square h-full w-full"
                                data-ai-hint={testimonial.avatarHint}
                                onError={() => {
                                  setImgErrors((prev) => ({...prev, [testimonial.id]: true}));
                                }}
                              />
                            ) : (
                              <AvatarFallback>
                                {testimonial.name.charAt(0)}
                              </AvatarFallback>
                            )}
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
