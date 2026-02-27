
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Users,
  Search,
  LayoutDashboard,
  Calendar,
  ClipboardPlus,
  Sparkles,
  Settings,
  Loader2,
  Bell,
  ChevronDown,
} from 'lucide-react';

import {
  adminNavItems,
  adminSettingsNav,
  doctorDetails,
} from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getLucideIcon } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';

function AdminSidebar() {
  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-slate-100">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 font-bold"
        >
          <Logo className="h-7 w-7 text-primary" />
          <span className="font-headline text-lg tracking-tight">
            DocAssist Admin
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu className="space-y-1">
          {adminNavItems.map((item) => {
            const Icon = getLucideIcon(item.icon);
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  tooltip={{ children: item.label, side: 'right' }}
                  className="h-10 px-3 hover:bg-primary/5 hover:text-primary transition-colors rounded-lg"
                >
                  <Link href={item.href}>
                    {Icon && <Icon className="h-5 w-5" />}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-slate-100">
        <SidebarMenu>
          {adminSettingsNav.map((item) => {
            const Icon = getLucideIcon(item.icon);
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  tooltip={{ children: item.label, side: 'right' }}
                  className="h-10 px-3 hover:bg-primary/5 hover:text-primary transition-colors rounded-lg"
                >
                  <Link href={item.href}>
                    {Icon && <Icon className="h-5 w-5" />}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData, isLoading: isRoleLoading } = useDoc(userDocRef);

  // Check for doctor role and redirect if unauthorized
  // Skip this check for the auth page itself
  React.useEffect(() => {
    if (pathname === '/admin/auth') return;

    if (!isUserLoading && !isRoleLoading) {
      if (!user) {
        router.push('/admin/auth');
      } else if (userData?.role !== 'doctor') {
        router.push('/patient/dashboard');
      }
    }
  }, [user, isUserLoading, userData, isRoleLoading, router, pathname]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/admin/auth');
    }
  };

  // If we are on the auth page, just render the children
  if (pathname === '/admin/auth') {
    return <div className="min-h-screen w-full">{children}</div>;
  }

  if (isUserLoading || isRoleLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Final check to prevent layout flash for non-doctors
  if (!user || userData?.role !== 'doctor') {
    return null;
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex flex-col w-full min-h-screen bg-slate-50/30">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6">
          <SidebarTrigger className="sm:hidden" />
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/dashboard" className="font-bold text-slate-900 tracking-tight">Practice Overview</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients..."
              className="w-full rounded-full bg-white pl-10 md:w-[200px] lg:w-[320px] h-10 border-slate-200 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-4 border-l pl-4 ml-2 border-slate-200">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-100 rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full border-2 border-white" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 h-10 px-2 rounded-full hover:bg-slate-100 transition-all"
                >
                  <Avatar className="h-8 w-8 border border-slate-200">
                    <AvatarImage src={user.photoURL || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {userData?.fullName?.charAt(0) || 'D'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col items-start text-left">
                    <p className="text-xs font-bold leading-none">{userData?.fullName}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-tighter font-bold">Specialist</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 shadow-xl border-slate-200 p-2">
                <DropdownMenuLabel className="px-3 py-2">
                  <p className="font-bold">{userData?.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-1" />
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                  <Link href="/admin/settings">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer">Help & Support</DropdownMenuItem>
                <DropdownMenuSeparator className="mx-1" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
