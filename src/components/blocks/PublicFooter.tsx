'use client';

import * as React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { navLinks, clinicInfo } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PublicFooter() {
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);

  return (
    <footer className="bg-card font-ui text-card-foreground border-t">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo className="h-8 w-8 text-primary" />
              <span className="font-headline text-2xl font-bold text-primary">
                DocAssist
              </span>
            </Link>
            <p className="text-muted-foreground text-sm text-justify">
              Your trusted partner in <span className="text-primary">healthcare</span>. Providing quality consultations with <span className="font-semibold text-primary">Dr. Pritam Pattyanayek</span>.
            </p>
          </div>
          <div className="md:col-span-3">
            <h3 className="font-semibold tracking-wider text-sm uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2 columns-2">
              {navLinks.map((link) => (
                <li key={link.href} className="break-inside-avoid">
                  <Link href={link.href} className="text-muted-foreground hover:text-primary text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <h3 className="font-semibold tracking-wider text-sm uppercase">Contact</h3>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>{clinicInfo.address}</p>
              <p>{clinicInfo.email}</p>
              <p>{clinicInfo.phone}</p>
            </div>
          </div>
          <div className="md:col-span-3">
             <h3 className="font-semibold tracking-wider text-sm uppercase">Write a Review</h3>
             <form className="mt-4 space-y-2">
              <div className="flex justify-center md:justify-start space-x-1 mb-2">
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-auto p-0 hover:bg-transparent"
                      key={starValue}
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHover(starValue)}
                      onMouseLeave={() => setHover(0)}
                      aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={cn(
                          "h-6 w-6 cursor-pointer transition-colors",
                          starValue <= (hover || rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    </Button>
                  );
                })}
              </div>
              <Textarea placeholder="Share your experience..." />
              <Button type="submit" className="w-full font-ui">Submit Review</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DocAssist. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
