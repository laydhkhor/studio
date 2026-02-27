'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  LayoutDashboard,
  Calendar,
  ClipboardPlus,
  Sparkles,
  Settings,
  Loader2,
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
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 font-semibold p-2"
        >
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg group-data-[collapsible=icon]:hidden">
            DocAssist Admin
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {adminNavItems.map((item) => {
            const Icon = getLucideIcon(item.icon);
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  tooltip={{ children: item.label, side: 'right' }}
                >
                  <Link href={item.href}>
                    {Icon && <Icon />}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {adminSettingsNav.map((item) => {
            const Icon = getLucideIcon(item.icon);
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  tooltip={{ children: item.label, side: 'right' }}
                >
                  <Link href={item.href}>
                    {Icon && <Icon />}
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

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData, isLoading: isRoleLoading } = useDoc(userDocRef);

  // Check for doctor role and redirect if unauthorized
  React.useEffect(() => {
    if (!isUserLoading && !isRoleLoading) {
      if (!user) {
        router.push('/admin/auth');
      } else if (userData?.role !== 'doctor') {
        router.push('/patient/dashboard');
      }
    }
  }, [user, isUserLoading, userData, isRoleLoading, router]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/admin/auth');
    }
  };

  if (isUserLoading || isRoleLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
      <div className="flex flex-col w-full min-h-screen bg-slate-50/50">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
          <SidebarTrigger className="sm:hidden" />
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/dashboard" className="font-bold text-slate-900">Clinical Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients..."
              className="w-full rounded-lg bg-white pl-8 md:w-[200px] lg:w-[320px] h-9"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full border-2 border-primary/20"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.photoURL || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {userData.fullName?.charAt(0) || 'D'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="font-bold">{userData.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/settings" className="cursor-pointer">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
