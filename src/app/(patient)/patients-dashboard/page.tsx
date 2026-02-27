
'use client';

import * as React from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  Pill, 
  FileText, 
  ArrowRight, 
  ShieldCheck,
  User,
  HeartPulse,
  Activity,
  History
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { PrescriptionCard } from '@/components/blocks/PrescriptionCard';

export default function PatientDashboardPage() {
  const { user } = useUser();
  const db = useFirestore();

  // 1. Fetch upcoming appointments from top-level collection
  const bookingsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'appointments'), 
      where('patientId', '==', user.uid),
      where('status', '==', 'Accepted'),
      orderBy('appointmentDateTime', 'asc'), 
      limit(2)
    );
  }, [db, user]);

  const { data: bookings } = useCollection(bookingsQuery);

  // 2. Fetch recent prescriptions from top-level collection
  const prescriptionsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'prescriptions'), 
      where('patientId', '==', user.uid),
      orderBy('issuedDate', 'desc'), 
      limit(1)
    );
  }, [db, user]);

  const { data: recentPrescriptions } = useCollection(prescriptionsQuery);

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border">
        <div className="flex items-center gap-6">
          <div className="bg-primary/10 p-4 rounded-3xl">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="font-headline text-2xl md:text-3xl font-bold text-slate-900">Health Hub</h1>
            <p className="text-muted-foreground font-ui">Manage your clinical records and consults securely.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant="outline" className="h-10 px-4 bg-emerald-50 text-emerald-600 border-emerald-100 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
             <ShieldCheck className="h-4 w-4" /> Secure Profile
           </Badge>
           <Button size="lg" className="rounded-2xl h-12 shadow-lg shadow-primary/20" asChild>
             <Link href="/login?redirect=/booking">Book Consultation</Link>
           </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Appointments Column */}
        <div className="lg:col-span-8 space-y-8">
           <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-xl font-bold flex items-center gap-2">
                   <Calendar className="h-5 w-5 text-primary" /> Upcoming Sessions
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/patients-dashboard/profile" className="text-primary font-bold">Manage Profile <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
              </div>

              <div className="grid gap-4">
                {bookings && bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <Card key={booking.id} className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                      <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
                         <div className="bg-slate-50 p-6 flex flex-col items-center justify-center text-center min-w-[140px] border-r border-dashed">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{format(new Date(booking.appointmentDateTime), 'EEE')}</span>
                            <span className="text-3xl font-headline font-black text-slate-900 leading-none">{format(new Date(booking.appointmentDateTime), 'dd')}</span>
                            <span className="text-xs font-bold text-primary mt-1">{format(new Date(booking.appointmentDateTime), 'MMM yyyy')}</span>
                         </div>
                         <div className="p-6 flex-grow space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                               <div className="space-y-1">
                                  <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">{booking.type || 'Clinical Consult'}</Badge>
                                  <h3 className="text-lg font-bold">Diagnostic Session</h3>
                               </div>
                               <div className="flex items-center gap-3">
                                  <div className="flex flex-col items-end">
                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Time Slot</span>
                                     <span className="font-mono font-bold text-slate-700">{format(new Date(booking.appointmentDateTime), 'HH:mm')}</span>
                                  </div>
                                  <div className="bg-slate-100 p-2 rounded-lg"><Clock className="h-4 w-4 text-slate-400" /></div>
                               </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-dashed">
                               <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ready for Connection</span>
                               </div>
                               {booking.meetingLink && (
                                 <Button size="sm" asChild className="rounded-xl font-bold bg-slate-900 hover:bg-primary transition-colors">
                                    <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer">
                                       <Video className="mr-2 h-4 w-4" /> Join Session
                                    </a>
                                 </Button>
                               )}
                            </div>
                         </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="py-16 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-6">
                    <Calendar className="h-12 w-12 text-slate-200 mb-4" />
                    <p className="font-bold text-slate-400">No scheduled sessions</p>
                    <p className="text-xs text-slate-300 mt-1 max-w-xs">Your health journey starts with your first consultation. Book a slot to begin.</p>
                    <Button variant="outline" className="mt-6 rounded-xl" asChild>
                      <Link href="/login?redirect=/booking">Schedule Now</Link>
                    </Button>
                  </div>
                )}
              </div>
           </section>

           <section className="space-y-4">
              <h2 className="font-headline text-xl font-bold flex items-center gap-2">
                 <FileText className="h-5 w-5 text-primary" /> Latest Medical Report
              </h2>
              {recentPrescriptions && recentPrescriptions.length > 0 ? (
                <PrescriptionCard prescription={recentPrescriptions[0]} />
              ) : (
                <Card className="border-none shadow-sm bg-slate-50/50 p-8 text-center">
                   <p className="text-sm text-muted-foreground italic">"Prescriptions will appear here after your clinical consultation."</p>
                </Card>
              )}
              <div className="pt-2 text-center">
                 <Button variant="link" asChild className="text-primary font-bold">
                    <Link href="/patients-dashboard/prescriptions">Browse All Past Reports <History className="ml-2 h-4 w-4"/></Link>
                 </Button>
              </div>
           </section>
        </div>

        {/* Health Stats Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="border-none shadow-sm bg-slate-900 text-white rounded-[2rem] overflow-hidden">
              <CardHeader>
                <CardTitle className="font-headline text-lg">Pharmacy Overview</CardTitle>
                <CardDescription className="text-slate-400">Active medication tracking.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                       <span className="flex items-center gap-2"><Pill className="h-3 w-3 text-primary" /> Morning Dose</span>
                       <span className="font-bold uppercase tracking-widest text-[10px]">Completed</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-primary h-full w-[85%]" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                       <span className="flex items-center gap-2"><Activity className="h-3 w-3 text-accent" /> Blood Pressure</span>
                       <span className="font-bold uppercase tracking-widest text-[10px]">Normal</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-accent h-full w-[100%]" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                       <span className="flex items-center gap-2"><HeartPulse className="h-3 w-3 text-primary" /> Heart Health</span>
                       <span className="font-bold uppercase tracking-widest text-[10px]">Optimal</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-primary h-full w-[92%]" />
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="bg-white/5 py-4 border-t border-white/10">
                 <p className="text-[10px] text-slate-400 text-center w-full leading-relaxed">
                   Sync with your digital health tracker for more accurate metrics.
                 </p>
              </CardFooter>
           </Card>

           <Card className="border-none shadow-sm rounded-[2rem]">
              <CardHeader>
                <CardTitle className="font-headline text-lg">Clinical Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="p-4 bg-slate-50 rounded-2xl flex items-start gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm"><ShieldCheck className="h-4 w-4 text-emerald-500" /></div>
                    <div>
                       <p className="text-xs font-bold text-slate-800">Verified Professional</p>
                       <p className="text-[10px] text-muted-foreground">Dr. Pritam Pattyanayek (MBBS)</p>
                    </div>
                 </div>
                 <p className="text-[11px] text-muted-foreground leading-relaxed italic px-2">
                   "If you experience any adverse reactions to prescribed medications, please visit the nearest clinic immediately."
                 </p>
              </CardContent>
              <CardFooter>
                 <Button variant="outline" className="w-full rounded-xl border-slate-200" asChild>
                    <Link href="/contact">Contact Clinic</Link>
                 </Button>
              </CardFooter>
           </Card>
        </div>
      </div>
    </div>
  );
}
