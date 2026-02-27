'use client';

import * as React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PublicFooter({ navLinks, clinicInfo }: any) {
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!navLinks || !clinicInfo) {
    return null;
  }

  return (
    <footer className="bg-slate-900 text-slate-300 font-ui border-t">
      <div className="container py-20">
        <div className="grid gap-12 lg:gap-16 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-3 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-10 w-10 text-primary" />
              <span className="font-headline text-3xl font-bold text-white">
                DocAssist
              </span>
            </Link>
            <p className="text-slate-400 text-base leading-relaxed">
              Providing modern, compassionate healthcare solutions for the community of Purba Medinipur. Expert consultations by <strong>Dr. Pritam Pattyanayek</strong>.
            </p>
            <div className="flex gap-4">
               <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
                  <Facebook className="h-5 w-5" />
               </Button>
               <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
                  <Instagram className="h-5 w-5" />
               </Button>
               <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
                  <Twitter className="h-5 w-5" />
               </Button>
            </div>
          </div>

          {/* Links Column - Two columns for links */}
          <div className="md:col-span-3 space-y-6">
            <h3 className="font-headline text-white font-bold tracking-wider text-sm uppercase">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-4">
              {navLinks.map((link: any) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors block text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="col-span-2">
                <Link href="/review" className="hover:text-primary transition-colors block font-bold text-primary text-sm">
                  Patient Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3 space-y-6">
            <h3 className="font-headline text-white font-bold tracking-wider text-sm uppercase">Get In Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm leading-relaxed">{clinicInfo.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm">{clinicInfo.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm">{clinicInfo.phone}</span>
              </div>
            </div>
          </div>

          {/* Review Form Column */}
          <div className="md:col-span-3 space-y-6">
             <h3 className="font-headline text-white font-bold tracking-wider text-sm uppercase">Share Feedback</h3>
             <form className="space-y-4">
              <div className="flex space-x-1 h-9">
                {isClient && [...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <button
                      type="button"
                      key={starValue}
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHover(starValue)}
                      onMouseLeave={() => setHover(0)}
                      className="focus:outline-none transition-transform active:scale-90"
                      aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={cn(
                          "h-6 w-6 transition-colors",
                          starValue <= (hover || rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-slate-700"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
              <Textarea 
                placeholder="Briefly tell us about your visit..." 
                className="bg-slate-800 border-slate-700 focus:ring-primary text-white resize-none h-24"
              />
              <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20">Submit Feedback</Button>
            </form>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p suppressHydrationWarning>&copy; {new Date().getFullYear()} DocAssist Health Systems. All rights reserved.</p>
          <div className="flex gap-6">
             <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
             <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
