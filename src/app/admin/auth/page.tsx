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
import { Loader2, ShieldCheck, Stethoscope, UserPlus } from 'lucide-react';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase, initiateEmailSignUp, initiateEmailSignIn, setDocumentNonBlocking } from '@/firebase';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChanged } from 'firebase/auth';

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

  // Handle successful login/signup logic for existing doctors
  React.useEffect(() => {
    if (user && userData?.role === 'doctor') {
      router.push('/admin/dashboard');
    }
  }, [user, userData, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);

    const handleAuthError = (error: any) => {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message || 'An error occurred during sign in.',
      });
    };

    if (isAdminExists) {
      initiateEmailSignIn(auth, email, password).catch(handleAuthError);
    } else {
      initiateEmailSignUp(auth, email, password).catch(handleAuthError);
    }
  };

  // Logic to handle new doctor creation after signup
  React.useEffect(() => {
    if (!auth || !db) return;
    const unsubscribe = onAuthStateChanged(auth, async (newUser) => {
      if (newUser && !isAdminExists && fullName) {
        const doctorId = newUser.uid;
        try {
          // 1. Create role marker
          await setDoc(doc(db, 'roles_doctor', doctorId), { active: true });
          // 2. Create user profile
          await setDoc(doc(db, 'users', doctorId), {
            id: doctorId,
            fullName,
            email: newUser.email,
            role: 'doctor',
            isActive: true,
            createdAt: serverTimestamp(),
          });
          // 3. Create initial doctor profile
          await setDoc(doc(db, 'doctor_profile', doctorId), {
            userId: doctorId,
            education: 'Medical Degree Required',
            practiceLocation: 'Main Clinic',
            yearsOfExperience: 0,
            patientsServed: 0,
          });
          router.push('/admin/dashboard');
        } catch (e) {
          console.error("Setup failed", e);
        }
      }
    });
    return () => unsubscribe();
  }, [auth, db, isAdminExists, fullName, router]);

  const handleClaimDoctorRole = async () => {
    if (!user || !db) return;
    setIsLoading(true);
    const doctorId = user.uid;
    
    try {
      // Grant doctor role to existing user (Developer Bypass)
      await setDoc(doc(db, 'roles_doctor', doctorId), { active: true });
      
      setDocumentNonBlocking(doc(db, 'users', doctorId), {
        role: 'doctor',
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Create initial doctor profile if missing
      await setDoc(doc(db, 'doctor_profile', doctorId), {
        userId: doctorId,
        education: 'Developer Provisioned',
        practiceLocation: 'Dev Environment',
        yearsOfExperience: 10,
        patientsServed: 100,
      }, { merge: true });

      toast({
        title: "Access Granted",
        description: "You have been promoted to Doctor status.",
      });
      
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Claim Failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing || isAuthLoading || isRoleLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is already logged in but is NOT a doctor, show the "Claim" button
  if (user && userData?.role !== 'doctor') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md shadow-2xl border-t-4 border-amber-500">
          <CardHeader className="text-center">
            <div className="mx-auto bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle className="font-headline text-2xl">Developer Access</CardTitle>
            <CardDescription>
              You are logged in as <strong>{user.email}</strong> but do not have administrative privileges.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Since you are the developer, you can grant yourself the Doctor role to inspect the Admin Dashboard.
            </p>
            <Button onClick={handleClaimDoctorRole} className="w-full h-12 text-lg font-bold bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Claim Doctor Role'}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
             <Button variant="ghost" onClick={() => auth?.signOut()} size="sm">Sign Out and Use Different Account</Button>
          </CardFooter>
        </Card>
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
