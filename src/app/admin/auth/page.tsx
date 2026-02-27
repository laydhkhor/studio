
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldCheck, Stethoscope, Terminal } from 'lucide-react';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase, initiateEmailSignUp, initiateEmailSignIn, setDocumentNonBlocking } from '@/firebase';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChanged } from 'firebase/auth';

const DEV_EMAIL = 'devilcry160@gmail.com';

export default function AdminAuthPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [isInitializing, setIsInitializing] = React.useState(true);
  const [isAdminExists, setIsAdminExists] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData, isLoading: isRoleLoading } = useDoc(userDocRef);

  React.useEffect(() => {
    async function checkDoctor() {
      if (!db) return;
      try {
        const querySnapshot = await getDocs(collection(db, 'roles_doctor'));
        setIsAdminExists(!querySnapshot.empty);
      } catch (error) {
        console.error("Error checking doctor role:", error);
      } finally {
        setIsInitializing(false);
      }
    }
    checkDoctor();
  }, [db]);

  React.useEffect(() => {
    if (user && db) {
      if (user.email === DEV_EMAIL) {
        const userId = user.uid;
        setDoc(doc(db, 'roles_dev', userId), { active: true }, { merge: true });
        setDocumentNonBlocking(doc(db, 'users', userId), { role: 'dev', updatedAt: serverTimestamp() }, { merge: true });
        router.push('/dashboard');
        return;
      }
      if (userData?.role === 'doctor' || userData?.role === 'dev') {
        router.push('/dashboard');
      }
    }
  }, [user, userData, router, db]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);
    if (isAdminExists) {
      initiateEmailSignIn(auth, email, password).catch(() => setIsLoading(false));
    } else {
      initiateEmailSignUp(auth, email, password).catch(() => setIsLoading(false));
    }
  };

  if (isInitializing || isAuthLoading || isRoleLoading) {
    return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-primary">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
            <Stethoscope className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">{isAdminExists ? 'Doctor Login' : 'Doctor Setup'}</CardTitle>
          <CardDescription>{isAdminExists ? 'Access your clinical dashboard.' : 'Create the primary admin account.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {!isAdminExists && (
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isLoading}>{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isAdminExists ? 'Sign In' : 'Create Account'}</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-xs text-muted-foreground border-t pt-4">
           <ShieldCheck className="mr-2 h-3 w-3" /> Secured Access
        </CardFooter>
      </Card>
    </div>
  );
}
