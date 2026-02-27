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
import { Loader2, ShieldCheck, Stethoscope } from 'lucide-react';
import { useAuth, useFirestore, initiateEmailSignUp, initiateEmailSignIn } from '@/firebase';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChanged } from 'firebase/auth';

export default function AdminAuthPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const [isInitializing, setIsInitializing] = React.useState(true);
  const [isAdminExists, setIsAdminExists] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  // Check if any doctor exists in the database
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

  // Handle successful login/signup
  React.useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // If we just signed up a new doctor, create their records
        if (!isAdminExists && fullName) {
           const doctorId = user.uid;
           // 1. Create role marker
           await setDoc(doc(db, 'roles_doctor', doctorId), { active: true });
           // 2. Create user profile
           await setDoc(doc(db, 'users', doctorId), {
             id: doctorId,
             fullName,
             email: user.email,
             role: 'doctor',
             isActive: true,
             createdAt: serverTimestamp(),
           });
           // 3. Create initial doctor profile
           await setDoc(doc(db, 'doctor_profile', doctorId), {
             userId: doctorId,
             education: 'Required',
             practiceLocation: 'Required',
             yearsOfExperience: 0,
             patientsServed: 0,
           });
        }
        router.push('/admin/dashboard');
      }
    });
    return () => unsubscribe();
  }, [auth, isAdminExists, fullName, db, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);

    if (isAdminExists) {
      initiateEmailSignIn(auth, email, password);
    } else {
      initiateEmailSignUp(auth, email, password);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-primary">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
            <Stethoscope className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">
            {isAdminExists ? 'Doctor Login' : 'Doctor Setup'}
          </CardTitle>
          <CardDescription>
            {isAdminExists 
              ? 'Access your clinical practice dashboard.' 
              : 'No doctor account found. Create the primary administrator account.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {!isAdminExists && (
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  placeholder="Dr. Pritam Pattyanayek" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Work Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="doctor@docassist.com" 
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
            <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isAdminExists ? 'Sign In' : 'Create Admin Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-xs text-muted-foreground border-t pt-4">
           <ShieldCheck className="mr-2 h-3 w-3" />
           Secured Professional Access Only
        </CardFooter>
      </Card>
    </div>
  );
}
