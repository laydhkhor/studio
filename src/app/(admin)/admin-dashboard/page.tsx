'use client';

import * as React from 'react';
import { 
  Users, 
  CalendarCheck, 
  Activity, 
  ArrowUpRight, 
  TrendingUp,
  Clock,
  User,
  ExternalLink
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
  const db = useFirestore();

  // 1. Fetch upcoming bookings (limit 5)
  const bookingsQuery = useMemoFirebase(() => {
    if (!db) return null;
    // Real app would fetch all bookings across all patients
    // For MVP, we'll fetch from a global 'all_bookings' or just show stats
    // Let's fetch from notifications as a proxy for recent activity if global bookings aren't ready
    return query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(5));
  }, [db]);

  const { data: recentActivity, isLoading: isBookingsLoading } = useCollection(bookingsQuery);

  // 2. Fetch total patients count
  const patientsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('role', '==', 'patient'));
  }, [db]);
  const { data: patients } = useCollection(patientsQuery);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold text-slate-900">Clinical Overview</h1>
        <p className="text-muted-foreground font-ui">Welcome back, Doctor. Here's your practice summary for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-none bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients?.length || 0}</div>
            <p className="text-xs opacity-70">+4 new this week</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Slots</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">8 booked, 4 available</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">Patient satisfaction index</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground">Lifetime digital visits</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Recent Activity */}
        <Card className="md:col-span-4 border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline text-lg">Recent Appointments</CardTitle>
                <CardDescription>Latest booking activities across the practice.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin-dashboard/patients" className="gap-2">
                  View All <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((notif: any) => (
                  <div key={notif.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{notif.message}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                          {notif.createdAt ? format(new Date(notif.createdAt.seconds * 1000), 'MMM dd, HH:mm') : 'Just now'}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">Verified</Badge>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No recent activities found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Quick Clinical Actions</CardTitle>
            <CardDescription>Shortcut to common tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button variant="outline" className="justify-start h-14 rounded-xl gap-4" asChild>
              <Link href="/admin-dashboard/calendar">
                <CalendarCheck className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-bold leading-none">Manage Slots</p>
                  <p className="text-xs text-muted-foreground">Update your availability</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-14 rounded-xl gap-4" asChild>
              <Link href="/admin-dashboard/patients">
                <Users className="h-5 w-5 text-accent" />
                <div className="text-left">
                  <p className="text-sm font-bold leading-none">Issue Prescription</p>
                  <p className="text-xs text-muted-foreground">Create new digital RX</p>
                </div>
              </Link>
            </Button>
             <Button variant="outline" className="justify-start h-14 rounded-xl gap-4" asChild>
              <Link href="/pricing">
                <ExternalLink className="h-5 w-5 text-slate-400" />
                <div className="text-left">
                  <p className="text-sm font-bold leading-none">Review Pricing</p>
                  <p className="text-xs text-muted-foreground">View service rates</p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
