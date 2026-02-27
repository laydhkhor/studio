
'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Calendar, 
  LogOut,
  Bell,
  Loader2
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { doc } from 'firebase/firestore';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { auth } = useAuth() ? { auth: useAuth() } : { auth: null };
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData, isLoading: isDocLoading } = useDoc(userDocRef);

  // Protection
  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  const navLinks = [
    { href: '/patients-dashboard', icon: LayoutDashboard, label: 'Overview' },
    { href: '/patients-dashboard/prescriptions', icon: FileText, label: 'Records' },
    { href: '/patients-dashboard/profile', icon: User, label: 'My Profile' },
  ];

  if (isUserLoading || isDocLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50/30">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 flex flex-col">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
             <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Logo className="h-6 w-6 text-primary" />
             </div>
             <span className="font-headline text-xl font-black text-slate-900 tracking-tight">DocAssist</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl border">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                    isActive 
                      ? "bg-white text-primary shadow-sm" 
                      : "text-slate-500 hover:text-primary hover:bg-white/50"
                  )}
                >
                  <link.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-slate-400")} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="rounded-full h-11 w-11 relative bg-slate-100/50 text-slate-500">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-accent border-2 border-white rounded-full" />
             </Button>
             <div className="h-px w-6 bg-slate-200 rotate-90 hidden sm:block" />
             <Button variant="ghost" className="rounded-2xl h-11 px-4 gap-3 text-slate-600 font-bold" onClick={handleLogout}>
                <LogOut className="h-4 w-4 text-slate-400" />
                <span className="hidden sm:inline">Logout</span>
             </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <div className="container py-10">
          {children}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t bg-white py-12">
         <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Logo className="h-5 w-5 text-slate-300" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2024 DocAssist Health Systems</span>
            </div>
            <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
               <Link href="/terms" className="hover:text-primary transition-colors">Terms of Use</Link>
               <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
               <Link href="/contact" className="hover:text-primary transition-colors">Emergency Support</Link>
            </div>
         </div>
      </footer>

      {/* Mobile Sticky Nav */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
         <nav className="bg-slate-900/90 backdrop-blur-lg border border-white/10 rounded-[2rem] p-2 flex items-center justify-around shadow-2xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300",
                    isActive ? "bg-primary text-white scale-110 shadow-lg" : "text-slate-400"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="text-[8px] font-black uppercase tracking-tighter">{link.label}</span>
                </Link>
              );
            })}
         </nav>
      </div>
    </div>
  );
}
