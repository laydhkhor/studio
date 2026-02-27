'use client';

import * as React from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ClipboardList, Clock, Activity, ArrowRight, Download, Pill, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { PrescriptionCard } from '@/components/blocks/PrescriptionCard';

export default function PatientDashboard() {
  const { user } = useUser();
  const db = useFirestore();

  // Queries
  const bookingsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'patients', user.uid, 'bookings'),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
  }, [db, user]);

  const prescriptionsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'patients', user.uid, 'prescriptions'),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
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
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border">
           <AlertCircle className="h-3.5 w-3.5 text-primary" />
           Emergency? Call +91 12345 67890
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Visits</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings?.filter(b => b.status === 'Accepted').length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Confirmed sessions</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Medicines</CardTitle>
            <Pill className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prescriptions?.[0]?.medicineItems?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">From latest prescription</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Verified</div>
            <p className="text-xs text-muted-foreground mt-1">Clinical ID: {user?.uid.substring(0, 8)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Content: Prescriptions & Meds */}
        <div className="lg:col-span-8 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" /> 
                Recent Prescriptions & Guidelines
              </h2>
              {prescriptions && prescriptions.length > 0 && (
                <Button variant="link" className="text-xs h-auto p-0" asChild>
                  <Link href="/patient/prescriptions">View Archive</Link>
                </Button>
              )}
            </div>
            
            <div className="space-y-6">
              {isPrescriptionsLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-32 bg-slate-100 rounded-xl" />
                  <div className="h-32 bg-slate-100 rounded-xl" />
                </div>
              ) : prescriptions && prescriptions.length > 0 ? (
                prescriptions.map((prescription) => (
                  <PrescriptionCard key={prescription.id} prescription={prescription} />
                ))
              ) : (
                <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center bg-slate-50/50">
                  <div className="bg-slate-100 p-4 rounded-full mb-4">
                    <ClipboardList className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="font-bold text-slate-900">No prescriptions found</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mt-1">
                    Your digital prescriptions will appear here after your first consultation with the doctor.
                  </p>
                  <Button variant="outline" size="sm" className="mt-6" asChild>
                    <Link href="/login?redirect=/booking">Book a Consultation</Link>
                  </Button>
                </Card>
              )}
            </div>
          </section>

          {/* Bookings Summary */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> 
                Appointment History
              </h2>
            </div>
            <Card className="shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="divide-y">
                  {isBookingsLoading ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
                  ) : bookings?.length ? (
                    bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/5 p-2.5 rounded-lg border border-primary/10">
                             <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{booking.type} Consultation</p>
                            <p className="text-xs text-muted-foreground">{booking.appointmentDateTime || 'Date Pending'}</p>
                          </div>
                        </div>
                        <Badge variant={booking.status === 'Accepted' ? 'default' : 'secondary'} className="text-[10px] h-5 px-2">
                          {booking.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                      No recent appointment history found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar: Quick Actions & Help */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-lg border-primary/10 bg-slate-900 text-white">
             <CardHeader>
               <CardTitle className="font-headline text-lg">Patient Care Tools</CardTitle>
               <CardDescription className="text-slate-400">Essential actions for your care plan.</CardDescription>
             </CardHeader>
             <CardContent className="grid gap-3">
                <Button asChild className="w-full h-12 justify-start font-bold bg-white/10 hover:bg-white/20 border-none" variant="outline">
                  <Link href="/patient/profile"><Activity className="mr-3 h-5 w-5 text-primary"/> Medical History</Link>
                </Button>
                <Button asChild className="w-full h-12 justify-start font-bold bg-white/10 hover:bg-white/20 border-none" variant="outline">
                  <Link href="/blog"><Pill className="mr-3 h-5 w-5 text-accent"/> Health & Wellness Tips</Link>
                </Button>
                <Button asChild className="w-full h-12 justify-start font-bold bg-primary hover:bg-primary/90 border-none" variant="default">
                  <Link href="/login?redirect=/booking">Schedule Appointment</Link>
                </Button>
             </CardContent>
          </Card>

          <Card className="bg-accent/5 border-accent/20">
             <CardContent className="p-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Need Assistance?</h4>
                    <p className="text-xs text-muted-foreground mt-1">If you have questions about your dosage or instructions, reach out to our medical staff immediately.</p>
                    <Button variant="link" className="p-0 h-auto text-xs font-bold text-accent mt-3" asChild>
                      <Link href="/contact">Contact Support</Link>
                    </Button>
                  </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
