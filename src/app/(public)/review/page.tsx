
'use client';

import * as React from 'react';
import { testimonialsData } from '@/lib/static-data';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

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

const ITEMS_PER_PAGE = 6;

export default function ReviewPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [locationFilter, setLocationFilter] = React.useState('All');
  const [ratingFilter, setRatingFilter] = React.useState('0');
  const [currentPage, setCurrentPage] = React.useState(1);
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

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, locationFilter, ratingFilter]);

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {paginatedReviews.length > 0 ? (
            paginatedReviews.map((testimonial) => (
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1;
                // Basic logic to show limited page numbers if there are too many
                if (
                  totalPages > 7 &&
                  pageNumber !== 1 &&
                  pageNumber !== totalPages &&
                  Math.abs(pageNumber - currentPage) > 1
                ) {
                  if (pageNumber === 2 || pageNumber === totalPages - 1) {
                    return <span key={pageNumber} className="px-2">...</span>;
                  }
                  return null;
                }
                
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    className="w-10 h-10"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
