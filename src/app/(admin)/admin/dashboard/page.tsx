'use client';

import * as React from 'react';
import { 
  Users, 
  CalendarCheck, 
  Activity, 
  TrendingUp,
  Clock,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  CalendarDays,
  PlusCircle,
  ClipboardPlus,
  ArrowRight,
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
    return query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(8));
  }, [db]);

  const { data: recentEvents } = useCollection(eventsQuery);

  // 2. Fetch stats
  const patientsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('role', '==', 'patient'));
  }, [db]);
  const { data: patients } = useCollection(patientsQuery);

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl font-black text-slate-900 tracking-tight">Clinical Hub</h1>
          <p className="text-slate-500 font-medium mt-1">Practice analytics and patient engagement monitoring portal.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button size="lg" className="rounded-2xl h-14 px-8 font-black text-sm shadow-xl shadow-primary/20 gap-2" asChild>
              <Link href="/admin/calendar">
                <PlusCircle className="h-4 w-4" /> Open New Slot
              </Link>
           </Button>
        </div>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-2xl shadow-primary/5 border-none bg-primary text-primary-foreground relative overflow-hidden group rounded-[2rem]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Registered Patients</CardTitle>
            <div className="bg-white/20 p-2 rounded-xl"><Users className="h-4 w-4" /></div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-5xl font-black font-headline tracking-tighter">{patients?.length || 0}</div>
            <div className="flex items-center gap-2 mt-4">
               <Badge className="bg-white/20 hover:bg-white/30 text-white border-none rounded-lg text-[10px] font-black">+12%</Badge>
               <span className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">Vs last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-xl border-slate-200/60 bg-white relative overflow-hidden group rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Consultations</CardTitle>
            <div className="bg-accent/10 p-2 rounded-xl"><Activity className="h-4 w-4 text-accent" /></div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-5xl font-black font-headline text-slate-900 tracking-tighter">1,204</div>
            <p className="text-[10px] font-black text-accent mt-4 uppercase tracking-tighter flex items-center gap-1">
               <ShieldCheck className="h-3 w-3" /> 98% Satisfaction Score
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-slate-200/60 bg-white rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Today's clinical Load</CardTitle>
            <div className="bg-primary/10 p-2 rounded-xl"><Clock className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-5xl font-black font-headline text-slate-900 tracking-tighter">12</div>
            <div className="mt-4 flex items-center gap-2">
               <div className="flex -space-x-2">
                  {[1,2,3].map(i => <div key={i} className="h-5 w-5 rounded-full border-2 border-white bg-slate-100 shadow-sm" />)}
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">8 Booked • 4 Open</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-slate-200/60 bg-white rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Avg. Response Time</CardTitle>
            <div className="bg-primary/10 p-2 rounded-xl"><MessageSquare className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-5xl font-black font-headline text-slate-900 tracking-tighter">14m</div>
            <p className="text-[10px] font-black text-primary mt-4 uppercase tracking-tighter">High Efficiency Tier</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Recent Events & Notifications */}
        <Card className="md:col-span-7 border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white rounded-[2.5rem]">
          <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline text-xl font-black text-slate-900 tracking-tight">Clinical Event Log</CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400 mt-1">Real-time sync from global patient wellness portal.</CardDescription>
              </div>
              <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">Active Feed</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {recentEvents && recentEvents.length > 0 ? (
                recentEvents.map((event: any) => (
                  <div key={event.id} className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-all cursor-default group">
                    <div className="flex items-center gap-5">
                      <div className="bg-slate-100 p-3 rounded-2xl group-hover:bg-white group-hover:shadow-xl group-hover:scale-110 transition-all border border-transparent group-hover:border-slate-100">
                        {event.type === 'booking_accepted' ? <CalendarCheck className="h-5 w-5 text-primary" /> : <AlertCircle className="h-5 w-5 text-slate-400" />}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-800 leading-snug">{event.message}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.1em] mt-1">
                          {event.createdAt ? format(new Date(event.createdAt.seconds * 1000), 'MMM dd • HH:mm') : 'Syncing...'}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 bg-white shadow-sm border border-slate-100 transition-all">
                       <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="p-24 text-center flex flex-col items-center gap-4">
                  <div className="bg-slate-50 p-6 rounded-full border-2 border-dashed border-slate-200">
                    <Clock className="h-10 w-10 text-slate-200" />
                  </div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Recent Activity Detected</p>
                </div>
              )}
            </div>
          </CardContent>
          <div className="bg-slate-50/50 p-6 text-center border-t border-slate-100">
             <Button variant="link" className="text-xs font-black text-primary uppercase tracking-widest hover:no-underline group">
                Review Complete Audit Trail <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
             </Button>
          </div>
        </Card>

        {/* Quick Insights / Analytics */}
        <div className="md:col-span-5 space-y-8">
           <Card className="border-none shadow-2xl shadow-slate-900/20 bg-slate-900 text-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="font-headline text-xl font-black flex items-center gap-3 tracking-tight">
                   <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20"><TrendingUp className="h-5 w-5 text-white" /></div>
                   Practice Growth
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-8">
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
                       <span>Patient Retention</span>
                       <span className="text-primary font-black">92%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-primary w-[92%] shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
                       <span>Booking Efficiency</span>
                       <span className="text-accent font-black">85%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-accent w-[85%] shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                    </div>
                 </div>
                 <div className="pt-4 border-t border-white/5">
                    <p className="text-[11px] text-slate-400 italic leading-relaxed">
                      "Practice efficiency is consistently tracking 14% higher than the regional clinical average for digital consults."
                    </p>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-xl border-slate-200/60 bg-white rounded-[2.5rem] p-4">
              <CardHeader className="pb-4">
                <CardTitle className="font-headline text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clinical Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 pt-0">
                 <Button variant="outline" className="justify-start h-16 rounded-2xl gap-4 border-slate-100 hover:bg-slate-50 hover:border-primary/20 transition-all group" asChild>
                    <Link href="/admin/calendar">
                       <div className="bg-primary/5 p-3 rounded-xl group-hover:bg-primary/10 transition-colors">
                          <CalendarDays className="h-5 w-5 text-primary" />
                       </div>
                       <div className="text-left">
                          <p className="text-sm font-black text-slate-800">Adjust clinical Availability</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Sync your weekly schedule</p>
                       </div>
                    </Link>
                 </Button>
                 <Button variant="outline" className="justify-start h-16 rounded-2xl gap-4 border-slate-100 hover:bg-slate-50 hover:border-accent/20 transition-all group" asChild>
                    <Link href="/admin/prescriptions">
                       <div className="bg-accent/5 p-3 rounded-xl group-hover:bg-accent/10 transition-colors">
                          <ClipboardPlus className="h-5 w-5 text-accent" />
                       </div>
                       <div className="text-left">
                          <p className="text-sm font-black text-slate-800">Issue Virtual Prescription</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Create & dispatch new RX</p>
                       </div>
                    </Link>
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
