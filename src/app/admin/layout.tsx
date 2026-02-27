'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Settings,
  Loader2,
  Bell,
  ChevronDown,
  LogOut,
  Stethoscope,
} from 'lucide-react';

import {
  adminNavItems,
  adminSettingsNav,
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
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
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
  SidebarInset,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200">
      <SidebarHeader className="h-16 flex items-center px-4 shrink-0">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 font-bold"
        >
          <div className="bg-primary p-1.5 rounded-lg">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <span className="font-headline text-lg tracking-tight group-data-[collapsible=icon]:hidden">
            DocAssist <span className="text-primary">Pro</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="px-2 pt-4">
        <SidebarMenu className="gap-1">
          {adminNavItems.map((item) => {
            const Icon = getLucideIcon(item.icon);
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className={`h-11 px-3 transition-all rounded-lg ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-bold' 
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <Link href={item.href}>
                    {Icon && <Icon className={isActive ? 'text-primary' : 'text-slate-400'} />}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t shrink-0">
        <SidebarMenu>
          {adminSettingsNav.map((item) => {
            const Icon = getLucideIcon(item.icon);
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className="h-11 px-3 hover:bg-slate-100 transition-colors rounded-lg text-slate-600"
                >
                  <Link href={item.href}>
                    {Icon && <Icon className="text-slate-400" />}
                    <span>{item.label}</span>
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

  if (pathname === '/admin/auth') {
    return <div className="min-h-screen w-full bg-slate-50">{children}</div>;
  }

  if (isUserLoading || isRoleLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-sm font-medium text-slate-400">Authenticating Provider...</p>
        </div>
      </div>
    );
  }

  if (!user || userData?.role !== 'doctor') {
    return null;
  }

  // Determine current page for breadcrumbs
  const currentPath = adminNavItems.find(item => item.href === pathname)?.label || 'Overview';

  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <AdminSidebar />
      <SidebarInset className="flex flex-col h-full overflow-hidden">
        <header className="h-16 flex items-center gap-4 border-b bg-white px-6 shrink-0 z-20">
          <SidebarTrigger />
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/dashboard" className="text-slate-400">Practice</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold text-slate-900">{currentPath}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="relative ml-auto flex-1 md:grow-0 max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Quick search clinical records..."
              className="w-full rounded-xl bg-slate-50 pl-10 h-10 border-transparent focus:bg-white focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-100 rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-10 px-1 rounded-full hover:bg-slate-100 transition-all"
                >
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarImage src={user.photoURL || ''} />
                    <AvatarFallback className="bg-primary text-white font-bold text-xs">
                      {userData?.fullName?.charAt(0) || 'D'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 shadow-2xl rounded-xl border-slate-200 p-2">
                <DropdownMenuLabel className="px-3 py-3">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-bold text-slate-900">{userData?.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-1" />
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2 px-3">
                  <Link href="/admin/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-slate-400" /> Clinic Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="mx-1" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg text-red-600 cursor-pointer py-2 px-3 focus:bg-red-50 focus:text-red-600 font-medium">
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
