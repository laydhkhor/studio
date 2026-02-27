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
  const { user } = useUser();
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

  const { data: userData } = useDoc(userDocRef);

  // React to successful login
  React.useEffect(() => {
    if (user && userData) {
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push(userData.role === 'doctor' ? '/admin/dashboard' : '/patient/dashboard');
      }
    }
  }, [user, userData, router, searchParams]);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);
    initiateEmailSignIn(auth, email, password).catch((error: any) => {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Check your credentials and try again.',
      });
    });
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      <Card className="shadow-2xl border-none">
        <CardHeader className="text-center pb-2">
          <CardTitle className="font-headline text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="font-ui text-base">
            Sign in to manage your health record.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pt-4">
          <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading} className="h-12 font-ui">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5" />}
            Continue with Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or use email
              </span>
            </div>
          </div>
          <form onSubmit={handleEmailLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required 
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-xs underline font-ui hover:text-primary transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required 
              />
            </div>
            <Button type="submit" className="w-full h-12 font-bold text-base" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm font-ui flex justify-center border-t py-4 bg-slate-50/50 rounded-b-lg">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="underline font-bold text-primary ml-1 hover:text-primary/80 transition-colors">
            Sign up for free
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
