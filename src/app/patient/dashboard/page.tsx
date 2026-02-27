
'use client';

import * as React from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ClipboardList, Clock, Activity, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function PatientDashboard() {
  const { user } = useUser();
  const db = useFirestore();

  const bookingsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'patients', user.uid, 'bookings'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
  }, [db, user]);

  const { data: bookings, isLoading } = useCollection(bookingsQuery);

  return (
    <div className="container py-10 space-y-8 max-w-6xl">
      <header>
        <h1 className="text-3xl font-headline font-bold">Welcome back, {user?.displayName || 'Patient'}</h1>
        <p className="text-muted-foreground">Here is your health summary and upcoming appointments.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Visits</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings?.filter(b => b.status === 'Accepted').length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Confirmed appointments</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
            <ClipboardList className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for pickup or refill</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground mt-1">Account verified</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Recent Appointments</CardTitle>
              <CardDescription>Your latest booking history.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login?redirect=/booking">New Booking <ArrowRight className="ml-2 h-4 w-4"/></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading appointments...</p>
              ) : bookings?.length ? (
                bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded-full border">
                         <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{booking.type} Consultation</p>
                        <p className="text-xs text-muted-foreground">{booking.appointmentDateTime || 'Date Pending'}</p>
                      </div>
                    </div>
                    <Badge variant={booking.status === 'Accepted' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No bookings found.</p>
                  <Button variant="link" asChild><Link href="/login?redirect=/booking">Book your first session</Link></Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-primary/10">
           <CardHeader>
             <CardTitle className="font-headline">Quick Actions</CardTitle>
             <CardDescription>Direct access to your health tools.</CardDescription>
           </CardHeader>
           <CardContent className="grid gap-4">
              <Button asChild className="w-full h-12 justify-start font-bold" variant="outline">
                <Link href="/patient/profile"><Activity className="mr-3 h-5 w-5 text-primary"/> Update Medical History</Link>
              </Button>
              <Button asChild className="w-full h-12 justify-start font-bold" variant="outline">
                <Link href="/blog"><ClipboardList className="mr-3 h-5 w-5 text-accent"/> Read Latest Health Tips</Link>
              </Button>
              <Button asChild className="w-full h-12 justify-start font-bold" variant="outline">
                <Link href="/contact"><Activity className="mr-3 h-5 w-5 text-primary"/> Contact Support</Link>
              </Button>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
