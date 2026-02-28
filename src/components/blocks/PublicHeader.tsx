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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!navLinks) {
    return null;
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300 font-ui',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b' : 'bg-white'
      )}
    >
      <div className="container px-4 md:px-8 relative flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold text-primary">
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
                <Button asChild size="sm" className="font-ui">
                   <Link href="/login?redirect=/booking">Book Now</Link>
                </Button>
                <UserAccountNav />
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="transition-all">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="transition-all">
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
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-primary/10 hover:text-primary transition-colors">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full max-w-sm flex flex-col p-0 border-l-0"
              >
                <SheetHeader className="p-6 pb-4 border-b">
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
                  <nav className="mt-8 flex flex-col gap-2 px-4">
                    {navLinks.map((link: any) => {
                      const isActive = pathname === link.href;
                      return (
                        <SheetClose asChild key={link.href}>
                          <Link
                            href={link.href}
                            className={cn(
                              "flex items-center px-4 py-3 rounded-xl text-lg font-medium transition-all",
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
                           <div className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm">
                              <UserAccountNav />
                              <div className="flex flex-col overflow-hidden">
                                <span className="font-bold text-sm text-slate-900 truncate">Account Active</span>
                                <span className="text-xs text-slate-500 truncate">{user.email}</span>
                              </div>
                           </div>
                           <SheetClose asChild>
                              <Button asChild className="w-full h-12 font-bold shadow-lg shadow-primary/20" size="lg">
                                <Link href="/login?redirect=/booking">Book New Appointment</Link>
                              </Button>
                           </SheetClose>
                        </div>
                     ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <SheetClose asChild>
                            <Button asChild variant="outline" className="w-full h-12 font-bold bg-white" size="lg">
                              <Link href="/login">Login</Link>
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button
                              asChild
                              className="w-full h-12 font-bold shadow-lg shadow-primary/20"
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
