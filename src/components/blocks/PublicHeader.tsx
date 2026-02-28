'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Loader2 } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import UserAccountNav from '@/components/UserAccountNav';

export default function PublicHeader({ navLinks }: any) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!navLinks) {
    return null;
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300 font-ui',
        'bg-white/95 backdrop-blur-md border-b',
        isScrolled ? 'shadow-md py-1' : 'py-2'
      )}
    >
      <div className="container px-4 md:px-8 flex h-14 md:h-16 items-center justify-between max-w-full">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg md:text-xl font-bold text-primary">
            DocAssist
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 text-sm font-medium">
            {navLinks.map((link: any) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-primary",
                    isActive ? "text-primary font-bold" : "text-foreground/80"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Auth State Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {isUserLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : user ? (
              <>
                <Button asChild size="sm" className="font-ui h-9 px-4">
                   <Link href="/login?redirect=/booking">Book Now</Link>
                </Button>
                <UserAccountNav />
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="transition-all h-9">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="transition-all h-9 px-4">
                  <Link href="/login?redirect=/booking">Book Now</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            {!isUserLoading && user && <UserAccountNav />}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full max-w-xs flex flex-col p-0 border-l-0"
              >
                <SheetHeader className="p-6 pb-4 border-b text-left">
                  <SheetTitle asChild>
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
                <div className="flex flex-1 flex-col justify-between overflow-y-auto">
                  <nav className="mt-4 flex flex-col gap-1 px-4">
                    {navLinks.map((link: any) => {
                      const isActive = pathname === link.href;
                      return (
                        <SheetClose asChild key={link.href}>
                          <Link
                            href={link.href}
                            className={cn(
                              "flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all",
                              isActive 
                                ? "bg-primary/10 text-primary font-bold" 
                                : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                            )}
                          >
                            {link.label}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </nav>
                  <div className="mt-auto p-6 bg-slate-50 border-t">
                     {user ? (
                        <div className="flex flex-col gap-4">
                           <SheetClose asChild>
                              <Button asChild className="w-full h-12 font-bold shadow-lg shadow-primary/20" size="lg">
                                <Link href="/login?redirect=/booking">New Appointment</Link>
                              </Button>
                           </SheetClose>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 gap-3">
                          <SheetClose asChild>
                            <Button asChild variant="outline" className="w-full h-11 font-bold bg-white" size="lg">
                              <Link href="/login">Login</Link>
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button
                              asChild
                              className="w-full h-11 font-bold shadow-lg shadow-primary/20"
                              size="lg"
                            >
                              <Link href="/login?redirect=/booking">
                                Book Now
                              </Link>
                            </Button>
                          </SheetClose>
                        </div>
                     )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
