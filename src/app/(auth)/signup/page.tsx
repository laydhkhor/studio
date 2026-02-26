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
import { Facebook, Loader2 } from 'lucide-react';
import { useAuth, initiateEmailSignUp } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const { auth } = useAuth() ? { auth: useAuth() } : { auth: null };
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

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
    // Redirect is handled by onAuthStateChanged in most setups, 
    // but we can also push to profile completion.
  };

  const handleGoogleSignup = async () => {
    if (!auth) return;
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/complete-profile');
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
    <Card className="w-full max-w-sm shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
        <CardDescription className="font-ui">
          Choose your preferred sign-up method.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline" onClick={handleGoogleSignup} disabled={isLoading}>
             {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
            Google
          </Button>
          <Button variant="outline" disabled={isLoading}>
            <Facebook className="mr-2 h-4 w-4 fill-current" />
            Facebook
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
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
              required 
            />
          </div>
          <div className="flex items-center space-x-2">
              <Checkbox id="terms" required/>
              <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                  I agree to the <Link href="/terms" className='underline'>Terms & Conditions</Link>
              </Label>
          </div>
          <Button type="submit" className="w-full font-ui" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm font-ui flex justify-center">
        Already have an account?{' '}
        <Link href="/login" className="underline ml-1">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
