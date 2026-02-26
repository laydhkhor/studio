
'use client';

import * as React from 'react';
import { testimonialsData } from '@/lib/static-data';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Search, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

export default function ReviewPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [locationFilter, setLocationFilter] = React.useState('All');
  const [ratingFilter, setRatingFilter] = React.useState('0');
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const locations = ['All', ...Array.from(new Set(testimonialsData.map((t) => t.location)))];

  const filteredReviews = React.useMemo(() => {
    return testimonialsData.filter((review) => {
      const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          review.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === 'All' || review.location === locationFilter;
      const matchesRating = ratingFilter === '0' || review.rating === Number(ratingFilter);
      return matchesSearch && matchesLocation && matchesRating;
    });
  }, [searchTerm, locationFilter, ratingFilter]);

  return (
    <div className="py-20 md:py-28 bg-background">
      <div className="container">
        <header className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Patient <span className="text-primary">Reviews</span></h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Read honest feedback from patients who have consulted with <span className="text-primary">Dr. Pritam Pattyanayek</span>.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-12 justify-center items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search reviews..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((testimonial) => (
              <Card key={testimonial._id} className="h-full shadow-md flex flex-col hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-start gap-4 p-6 flex-grow">
                  <div className="flex justify-between w-full items-center">
                    <Rating value={testimonial.rating} />
                    {isMounted && (
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(testimonial.date), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                  <p className="text-base text-muted-foreground flex-grow text-justify italic">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t w-full">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
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
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-muted-foreground text-lg">No reviews found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
