
'use client';

import * as React from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ClipboardList, Activity, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PrescriptionCard } from '@/components/blocks/PrescriptionCard';

export default function PatientsDashboardPage() {
  const { user } = useUser();
  const db = useFirestore();

  const bookingsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'patients', user.uid, 'bookings'), orderBy('createdAt', 'desc'), limit(3));
  }, [db, user]);

  const prescriptionsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'patients', user.uid, 'prescriptions'), orderBy('createdAt', 'desc'), limit(3));
  }, [db, user]);

  const { data: bookings, isLoading: isBookingsLoading } = useCollection(bookingsQuery);
  const { data: prescriptions, isLoading: isPrescriptionsLoading } = useCollection(prescriptionsQuery);

  return (
    <div className="container py-10 space-y-8 max-w-6xl">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Welcome, {user?.displayName || 'Patient'}</h1>
          <p className="text-muted-foreground">Your centralized clinical record and care plan.</p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm">Upcoming Visits</CardTitle><Calendar className="h-4 w-4 text-primary" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{bookings?.filter(b => b.status === 'Accepted').length || 0}</div></CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm">Active Meds</CardTitle><Pill className="h-4 w-4 text-accent" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{prescriptions?.[0]?.medicineItems?.length || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm">Status</CardTitle><Activity className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">Verified</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2"><ClipboardList className="h-5 w-5 text-primary" /> Recent Prescriptions</h2>
            </div>
            <div className="space-y-6">
              {isPrescriptionsLoading ? <div className="animate-pulse h-32 bg-slate-100 rounded-xl" /> : prescriptions?.length ? prescriptions.map(p => <PrescriptionCard key={p.id} prescription={p} />) : <p className="text-center py-10 text-slate-400">No prescriptions yet.</p>}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-slate-900 text-white"><CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader><CardContent className="grid gap-3"><Button asChild className="w-full bg-primary"><Link href="/booking">Book Appointment</Link></Button></CardContent></Card>
        </div>
      </div>
    </div>
  );
}
