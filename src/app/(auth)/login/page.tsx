'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { GoogleIcon } from '@/components/icons';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth, useUser, initiateEmailSignIn, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { doc } from 'firebase/firestore';

export default function LoginPage() {
  const { auth } = useAuth() ? { auth: useAuth() } : { auth: null };
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData, isLoading: isDocLoading } = useDoc(userDocRef);

  React.useEffect(() => {
    // Only proceed if we aren't loading the auth state or the user profile
    if (!isUserLoading && !isDocLoading && user) {
      if (userData) {
        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          const isSuperAdmin = user.email === 'devilcry160@gmail.com';
          const isAdmin = userData.role === 'doctor' || userData.role === 'dev' || isSuperAdmin;
          router.push(isAdmin ? '/admin/dashboard' : '/patients-dashboard');
        }
      } else {
        // Logged in but no profile record found? Send to complete profile
        router.push('/complete-profile');
      }
    }
  }, [user, userData, isUserLoading, isDocLoading, router, searchParams]);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);
    initiateEmailSignIn(auth, email, password).catch((error: any) => {
      setIsLoading(false);
      toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
    });
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>
      <Card className="shadow-2xl border-none">
        <CardHeader className="text-center pb-2">
          <CardTitle className="font-headline text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="font-ui">Sign in to manage your health record.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pt-4">
          <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading} className="h-12">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5" />} Continue with Google
          </Button>
          <form onSubmit={handleEmailLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full h-12 font-bold" disabled={isLoading}>{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4 text-sm">
          Don't have an account? <Link href="/signup" className="font-bold text-primary ml-1">Sign up</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
