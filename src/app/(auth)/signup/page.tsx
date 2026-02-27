'use client';

import * as React from 'react';
import Link from 'next/link';
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
import { Checkbox } from '@/components/ui/checkbox';
import { GoogleIcon } from '@/components/icons';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth, useUser, initiateEmailSignUp } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const { auth } = useAuth() ? { auth: useAuth() } : { auth: null };
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  // React to successful signup
  React.useEffect(() => {
    if (user) {
      router.push('/complete-profile');
    }
  }, [user, router]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Passwords do not match.',
      });
      return;
    }
    setIsLoading(true);
    initiateEmailSignUp(auth, email, password);
  };

  const handleGoogleSignup = async () => {
    if (!auth) return;
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
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
          <CardTitle className="font-headline text-3xl font-bold">Get Started</CardTitle>
          <CardDescription className="font-ui text-base">
            Create your patient account in seconds.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pt-4">
          <Button variant="outline" onClick={handleGoogleSignup} disabled={isLoading} className="h-12 font-ui">
             {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5" />}
            Sign up with Google
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
          <form onSubmit={handleSignup} className="grid gap-4">
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
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11"
                required 
              />
            </div>
            <div className="flex items-center space-x-2 py-2">
                <Checkbox id="terms" required/>
                <Label htmlFor="terms" className="text-xs font-normal text-muted-foreground leading-snug">
                    I agree to the <Link href="/terms" className='underline hover:text-primary'>Terms & Conditions</Link> and Privacy Policy.
                </Label>
            </div>
            <Button type="submit" className="w-full h-12 font-bold text-base" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm font-ui flex justify-center border-t py-4 bg-slate-50/50 rounded-b-lg">
          Already have an account?{' '}
          <Link href="/login" className="underline font-bold text-primary ml-1 hover:text-primary/80 transition-colors">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
