
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User as UserIcon, 
  LayoutDashboard, 
  LogOut, 
  ShieldCheck,
  FileText,
  Calendar
} from 'lucide-react';
import { 
  useUser, 
  useAuth, 
  useDoc,
  useMemoFirebase,
  useFirestore
} from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UserAccountNav() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData } = useDoc(userDocRef);
  const isAuthorizedAdmin = userData?.role === 'doctor' || userData?.role === 'dev' || user?.email === 'devilcry160@gmail.com';

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-slate-200 p-0 hover:bg-slate-50">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {userData?.fullName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none">{userData?.fullName || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            {isAuthorizedAdmin && (
              <div className="flex items-center gap-1 mt-1">
                <ShieldCheck className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Verified Practitioner</span>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={isAuthorizedAdmin ? "/admin/dashboard" : "/patients-dashboard"} className="cursor-pointer">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          {!isAuthorizedAdmin && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/patients-dashboard/prescriptions" className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Prescriptions</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/patients-dashboard/profile" className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Medical Profile</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
          {isAuthorizedAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin/calendar" className="cursor-pointer">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Manage Slots</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
