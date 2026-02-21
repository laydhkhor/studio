'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { Logo } from '@/components/icons';
import { navLinks } from '@/lib/placeholder-data';
import { cn } from '@/lib/utils';

export default function PublicHeader() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300 font-ui bg-card',
        isScrolled && 'shadow-lg'
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold text-primary">
            DocAssist
          </span>
        </Link>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-sm flex flex-col p-0"
            >
              <SheetHeader className="p-6 pb-4 border-b">
                <SheetTitle>
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                  >
                    <Logo className="h-6 w-6 text-primary" />
                    <span className="font-headline text-xl font-bold text-primary">
                      DocAssist
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col justify-between">
                <nav className="mt-8 flex flex-col gap-4 px-6">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="text-lg font-medium text-foreground hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="space-y-2 border-t p-6">
                   <SheetClose asChild>
                      <Button asChild className="w-full" size="lg">
                        <Link href="/login">Login</Link>
                      </Button>
                   </SheetClose>
                   <SheetClose asChild>
                      <Button
                        asChild
                        className="w-full"
                        size="lg"
                        variant="default"
                      >
                        <Link href="/login?redirect=/booking">
                          Book Now
                        </Link>
                      </Button>
                   </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/login?redirect=/booking">Book Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
