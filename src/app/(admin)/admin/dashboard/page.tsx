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
  ExternalLink,
  MessageSquare,
  AlertCircle
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

  // 1. Fetch recent notifications/events
  const eventsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(6));
  }, [db]);

  const { data: recentEvents, isLoading: isEventsLoading } = useCollection(eventsQuery);

  // 2. Fetch stats
  const patientsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('role', '==', 'patient'));
  }, [db]);
  const { data: patients } = useCollection(patientsQuery);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold text-slate-900">Clinical Overview</h1>
        <p className="text-muted-foreground font-ui text-sm">Real-time analytics and patient engagement monitoring.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-none bg-primary text-primary-foreground relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-80">Total Patients</CardTitle>
            <Users className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-headline">{patients?.length || 0}</div>
            <p className="text-[10px] font-bold opacity-70 mt-1 uppercase tracking-tighter">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-none bg-white relative overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Consultations</CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-headline text-slate-900">1,204</div>
            <p className="text-[10px] font-bold text-accent mt-1 uppercase tracking-tighter">98% Satisfaction</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Today's Load</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-headline text-slate-900">12</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">8 Booked • 4 Available</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Response Time</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-headline text-slate-900">14m</div>
            <p className="text-[10px] font-bold text-primary mt-1 uppercase tracking-tighter">Excellent Performance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Recent Events & Notifications */}
        <Card className="md:col-span-4 border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline text-lg font-bold">Clinical Events</CardTitle>
                <CardDescription className="text-xs">Latest patient activities across the practice.</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/20 bg-primary/5">Real-time Feed</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {recentEvents && recentEvents.length > 0 ? (
                recentEvents.map((event: any) => (
                  <div key={event.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-default group">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-100 p-2.5 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all">
                        <AlertCircle className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{event.message}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">
                          {event.createdAt ? format(new Date(event.createdAt.seconds * 1000), 'MMM dd, HH:mm') : 'Just now'}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                       <ChevronRight className="h-4 w-4 text-slate-300" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center flex flex-col items-center gap-2">
                  <div className="bg-slate-50 p-4 rounded-full"><Clock className="h-8 w-8 text-slate-200" /></div>
                  <p className="text-sm font-bold text-slate-400">No recent events detected.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights / Analytics */}
        <div className="md:col-span-3 space-y-6">
           <Card className="border-none shadow-sm bg-slate-900 text-white rounded-2xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="font-headline text-lg font-bold flex items-center gap-2">
                   <TrendingUp className="h-5 w-5 text-primary" /> Practice Growth
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60">
                       <span>Patient Retention</span>
                       <span>92%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-primary w-[92%] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60">
                       <span>Appointment Filling</span>
                       <span>85%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-accent w-[85%] shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    </div>
                 </div>
              </CardContent>
              <div className="bg-white/5 p-4 text-center">
                 <p className="text-[10px] text-slate-400 italic">"Practice efficiency is 12% higher than state average."</p>
              </div>
           </Card>

           <Card className="border-none shadow-sm bg-white rounded-2xl">
              <CardHeader>
                <CardTitle className="font-headline text-sm font-bold uppercase tracking-widest text-slate-400">Quick Clinical Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 pt-0">
                 <Button variant="outline" className="justify-start h-12 rounded-xl gap-3 border-slate-100 hover:bg-slate-50 group" asChild>
                    <Link href="/admin/calendar">
                       <CalendarCheck className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                       <span className="text-sm font-bold">Adjust Availability</span>
                    </Link>
                 </Button>
                 <Button variant="outline" className="justify-start h-12 rounded-xl gap-3 border-slate-100 hover:bg-slate-50 group" asChild>
                    <Link href="/admin/prescriptions">
                       <ClipboardPlus className="h-4 w-4 text-accent group-hover:scale-110 transition-transform" />
                       <span className="text-sm font-bold">Issue New RX</span>
                    </Link>
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
