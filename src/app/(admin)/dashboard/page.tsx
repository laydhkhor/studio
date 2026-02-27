
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

/**
 * Single redirector for the /dashboard route to prevent parallel page conflicts.
 */
export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData, isLoading: isRoleLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !isRoleLoading) {
      if (!user) {
        router.push('/admin/auth');
      } else if (userData?.role === 'doctor' || userData?.role === 'dev') {
        router.push('/admin-dashboard');
      } else {
        router.push('/patients-dashboard');
      }
    }
  }, [user, userData, isUserLoading, isRoleLoading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
