'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { doc } from 'firebase/firestore';

const ADMIN_NAV_ITEMS = [
  { href: '/admin-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin-dashboard/calendar', icon: Calendar, label: 'Manage Slots' },
  { href: '/admin-dashboard/patients', icon: Users, label: 'Patients' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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

  // Protection logic
  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    } else if (!isUserLoading && user && !isDocLoading && userData) {
      if (userData.role !== 'doctor' && userData.role !== 'dev' && user.email !== 'devilcry160@gmail.com') {
        router.push('/patient-dashboard');
      }
    }
  }, [user, isUserLoading, userData, isDocLoading, router]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  if (isUserLoading || isDocLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const NavItem = ({ item, isMobile = false }: { item: typeof ADMIN_NAV_ITEMS[0], isMobile?: boolean }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 group relative",
          isActive 
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold" 
            : "text-slate-500 hover:bg-white hover:text-primary hover:shadow-sm"
        )}
      >
        <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-primary")} />
        {item.label}
        {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-70" />}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-50 bg-slate-50/50 backdrop-blur-xl border-r p-6">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
            <Logo className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-headline text-xl font-black text-slate-900 leading-none">DocAssist</span>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">Clinical Pro</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
             <div className="bg-emerald-50 p-2 rounded-lg"><ShieldCheck className="h-4 w-4 text-emerald-600" /></div>
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                <p className="text-xs font-bold text-slate-800">Verified MD</p>
             </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 rounded-xl text-slate-500 hover:text-destructive hover:bg-destructive/5"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-bold">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 h-16 bg-slate-50/50 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 border-b">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-6 flex flex-col">
                <SheetHeader className="mb-8">
                  <SheetTitle className="flex items-center gap-2">
                    <Logo className="h-6 w-6 text-primary" />
                    <span className="font-headline text-xl font-black">DocAssist</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex-1 space-y-2">
                  {ADMIN_NAV_ITEMS.map((item) => (
                    <NavItem key={item.href} item={item} isMobile />
                  ))}
                </nav>
                <Button 
                  variant="ghost" 
                  className="mt-auto justify-start gap-3 rounded-xl text-slate-500"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" /> Logout
                </Button>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{userData?.fullName || 'Clinical Lead'}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Practitioner</p>
             </div>
             <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-white shadow-sm flex items-center justify-center text-primary font-black">
                {userData?.fullName?.charAt(0) || 'D'}
             </div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
