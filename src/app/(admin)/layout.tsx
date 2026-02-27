'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Search,
  Bell,
  CalendarDays,
  ClipboardPlus,
  Activity,
  HelpCircle
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
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/admin/calendar', icon: Calendar, label: 'Clinical Scheduler' },
  { href: '/admin/patients', icon: Users, label: 'Patient Directory' },
  { href: '/admin/appointments', icon: CalendarDays, label: 'Appointments' },
  { href: '/admin/prescriptions', icon: ClipboardPlus, label: 'Prescription Builder' },
];

const SECONDARY_NAV = [
  { href: '/admin/settings', icon: Settings, label: 'Practice Settings' },
  { href: '/support', icon: HelpCircle, label: 'Help & Documentation' },
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
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-xl bg-primary/10 animate-pulse border border-primary/20 flex items-center justify-center">
              <Logo className="h-6 w-6 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinical OS Loading</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
        <Sidebar collapsible="icon" className="border-r border-slate-200 shadow-sm shrink-0">
          <SidebarHeader className="h-20 flex items-center justify-center px-4 shrink-0">
            <div className="flex items-center justify-center gap-3">
              <div className="bg-slate-900 p-2 rounded-xl shadow-lg ring-1 ring-white/10 shrink-0">
                <Logo className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden overflow-hidden">
                <span className="font-headline text-[13px] font-black text-slate-900 leading-none tracking-tight whitespace-nowrap text-center">DocAssist <span className="text-primary">Pro</span></span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 whitespace-nowrap text-center">Clinical Workspace</span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-3 overflow-y-auto">
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 mb-2 text-[10px] uppercase font-black tracking-widest text-slate-400 opacity-70">Main Console</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {ADMIN_NAV_ITEMS.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.href}
                        tooltip={item.label}
                        className={cn(
                          "h-11 px-3 rounded-xl transition-all duration-200",
                          pathname === item.href 
                            ? "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/90" 
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon className={cn("size-4", pathname === item.href ? "text-white" : "text-slate-400")} />
                          <span className="font-bold text-sm">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator className="my-4 opacity-50" />

            <SidebarGroup>
              <SidebarGroupLabel className="px-3 mb-2 text-[10px] uppercase font-black tracking-widest text-slate-400 opacity-70">Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {SECONDARY_NAV.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.href}
                        tooltip={item.label}
                        className="h-10 px-3 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4 opacity-60" />
                          <span className="font-bold text-sm">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 bg-slate-50/50 mt-auto shrink-0">
             <div className="flex flex-col gap-3 group-data-[collapsible=icon]:hidden">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200/60 flex items-center gap-3">
                   <div className="relative">
                      <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100/50">
                        <Activity className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                   </div>
                   <div className="overflow-hidden">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Verified Practitioner</p>
                      <p className="text-xs font-black text-slate-800 truncate">Dr. P. Pattyanayek</p>
                   </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-11 gap-3 rounded-xl text-slate-500 hover:text-destructive hover:bg-destructive/5 transition-all group"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 opacity-60 group-hover:opacity-100" />
                  <span className="font-bold text-sm text-slate-600 group-hover:text-destructive">Sign Out</span>
                </Button>
             </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="bg-[#f8fafc] flex flex-col min-w-0 h-full overflow-hidden">
          <header className="h-20 bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 border-b border-slate-200/60 shrink-0 z-40">
            <div className="flex items-center gap-6">
              <SidebarTrigger className="h-10 w-10 rounded-xl hover:bg-slate-100 text-slate-500" />
              <div className="h-6 w-px bg-slate-200 hidden md:block" />
              <Breadcrumb className="hidden md:block">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin/dashboard" className="text-[10px] uppercase font-black text-slate-400 tracking-[0.1em] hover:text-primary transition-colors">Clinical OS</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-slate-300" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-[10px] uppercase font-black text-slate-900 tracking-[0.1em]">{activeItem?.label || 'Dashboard'}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex-1 max-w-xl px-12 hidden lg:block">
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-all duration-300" />
                  <Input 
                    placeholder="Search clinical records, patient UIDs or prescriptions..." 
                    className="pl-11 h-12 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/10 focus-visible:bg-white transition-all text-sm font-medium"
                  />
               </div>
            </div>

            <div className="flex items-center gap-4">
               <Button variant="ghost" size="icon" className="rounded-2xl h-11 w-11 relative bg-slate-50 text-slate-400 hover:text-primary hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-3 right-3 h-2 w-2 bg-rose-500 border-2 border-white rounded-full" />
               </Button>
               <div className="h-8 w-px bg-slate-200 mx-1" />
               <UserAccountNav />
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#f8fafc]">
            <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}