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
  Search,
  Bell,
  CalendarDays,
  ClipboardPlus
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarSeparator
} from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from '@/components/ui/input';
import UserAccountNav from '@/components/UserAccountNav';
import { doc } from 'firebase/firestore';

const ADMIN_NAV_ITEMS = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/admin/patients', icon: Users, label: 'Patients' },
  { href: '/admin/appointments', icon: CalendarDays, label: 'Appointments' },
  { href: '/admin/prescriptions', icon: ClipboardPlus, label: 'Prescriptions' },
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
      const isSuperAdmin = user.email === 'devilcry160@gmail.com';
      if (userData.role !== 'doctor' && userData.role !== 'dev' && !isSuperAdmin) {
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

  const activeItem = ADMIN_NAV_ITEMS.find(item => pathname === item.href);

  if (isUserLoading || isDocLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Logo className="h-10 w-10 text-primary animate-pulse" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Clinical Pro</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        {/* Modern ShadCN Sidebar */}
        <Sidebar collapsible="icon">
          <SidebarHeader className="h-16 flex items-center px-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-1.5 rounded-lg shadow-sm">
                <Logo className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-headline text-sm font-black text-slate-900 leading-none">DocAssist Pro</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-tighter mt-0.5">Clinical Lead</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {ADMIN_NAV_ITEMS.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.href}
                        tooltip={item.label}
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4">
             <div className="flex flex-col gap-2 group-data-[collapsible=icon]:hidden">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                   <div className="bg-emerald-50 p-1.5 rounded-lg"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /></div>
                   <div className="overflow-hidden">
                      <p className="text-[10px] font-bold text-slate-400 uppercase truncate">ID: {user?.uid.substring(0,8)}</p>
                      <p className="text-xs font-bold text-slate-800 truncate">Verified</p>
                   </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 rounded-xl text-slate-500 hover:text-destructive hover:bg-destructive/5"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-bold">Logout</span>
                </Button>
             </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset>
          <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 border-b shrink-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <SidebarSeparator orientation="vertical" className="h-4 mr-2" />
              <Breadcrumb className="hidden md:block">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin/dashboard" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">DocAssist</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-[10px] uppercase font-bold text-primary tracking-wider">{activeItem?.label || 'Dashboard'}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex-1 max-w-xl px-8 hidden lg:block">
               <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Search clinical records, patients or RX..." 
                    className="pl-10 h-10 bg-slate-50 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20"
                  />
               </div>
            </div>

            <div className="flex items-center gap-3">
               <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 relative bg-slate-50 text-slate-400 hover:text-primary">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-accent border-2 border-white rounded-full" />
               </Button>
               <UserAccountNav />
            </div>
          </header>
          
          <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
