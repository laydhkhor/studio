'use client';

import * as React from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, User, Phone, Mail, Calendar as CalendarIcon, HeartPulse } from 'lucide-react';
import Link from 'next/link';

export default function PatientProfilePage() {
  const { user } = useUser();
  const db = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData, isLoading } = useDoc(userDocRef);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-slate-900">Your Medical Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your clinical identity and health records.</p>
      </header>

      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-8 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-xl font-headline flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Personal Information
              </CardTitle>
              <CardDescription>Essential details for your doctor's record.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 grid gap-6">
              <div className="grid gap-2">
                <Label className="text-slate-500 text-xs uppercase tracking-wider font-bold">Full Name</Label>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 font-medium text-slate-900 flex items-center gap-3">
                   <User className="h-4 w-4 text-slate-400" /> {userData?.fullName || 'Not set'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-slate-500 text-xs uppercase tracking-wider font-bold">Email Address</Label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-900 flex items-center gap-3">
                     <Mail className="h-4 w-4 text-slate-400" /> {userData?.email || 'Not set'}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-slate-500 text-xs uppercase tracking-wider font-bold">Phone Number</Label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-900 flex items-center gap-3">
                     <Phone className="h-4 w-4 text-slate-400" /> {userData?.phoneNumber || 'Not set'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-slate-500 text-xs uppercase tracking-wider font-bold">Date of Birth</Label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-900 flex items-center gap-3">
                     <CalendarIcon className="h-4 w-4 text-slate-400" /> {userData?.dateOfBirth || 'Not set'}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-slate-500 text-xs uppercase tracking-wider font-bold">Gender</Label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-900 flex items-center gap-3 capitalize">
                     <HeartPulse className="h-4 w-4 text-slate-400" /> {userData?.gender || 'Not set'}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button asChild variant="outline">
                   <Link href="/complete-profile">Edit Profile Information</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card className="shadow-sm border-primary/10">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-sm font-headline text-primary uppercase tracking-widest">Medical ID</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary font-bold text-3xl">
                {userData?.fullName?.charAt(0) || 'P'}
              </div>
              <p className="font-bold text-lg">{userData?.fullName}</p>
              <p className="text-xs text-muted-foreground font-mono mt-1">ID: {user?.uid.substring(0, 12)}...</p>
              
              <div className="mt-6 pt-6 border-t space-y-2 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Account Status</span>
                  <span className="font-bold text-accent">Active</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-bold uppercase">Patient</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900 text-white overflow-hidden">
             <CardContent className="p-6">
                <h3 className="font-headline font-bold text-lg mb-2">Need Support?</h3>
                <p className="text-slate-400 text-sm mb-4">If you need to change restricted profile information, please contact our help desk.</p>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href="/contact">Get Assistance</Link>
                </Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
